package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.GlobalSecondaryIndex;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.Projection;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import org.mindrot.jbcrypt.BCrypt;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class UserHandler {

    private final DynamoDB dynamoDB;
    private final Table usersTable;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Algorithm jwtAlgorithm = Algorithm.HMAC256("your-256-bit-secret");
    private final JWTVerifier jwtVerifier = JWT.require(jwtAlgorithm).build();

    public UserHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        String tableName = System.getenv("TABLE_NAME");

        if (!tableExists(client, tableName)) {
            createTable(client, tableName);
        }

        this.usersTable = dynamoDB.getTable(tableName);
    }

    private boolean tableExists(AmazonDynamoDB client, String tableName) {
        try {
            client.describeTable(tableName);
            return true;
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }

    private void createTable(AmazonDynamoDB client, String tableName) {
        CreateTableRequest request = new CreateTableRequest()
                .withTableName(tableName)
                .withKeySchema(new KeySchemaElement("userId", KeyType.HASH))
                .withAttributeDefinitions(
                        new AttributeDefinition("userId", ScalarAttributeType.S),
                        new AttributeDefinition("email", ScalarAttributeType.S),
                        new AttributeDefinition("mobile", ScalarAttributeType.S))
                .withProvisionedThroughput(new ProvisionedThroughput(5L, 5L))
                .withGlobalSecondaryIndexes(
                        new GlobalSecondaryIndex()
                                .withIndexName("EmailIndex")
                                .withKeySchema(new KeySchemaElement("email", KeyType.HASH))
                                .withProjection(new Projection().withProjectionType("ALL"))
                                .withProvisionedThroughput(new ProvisionedThroughput(5L, 5L)),
                        new GlobalSecondaryIndex()
                                .withIndexName("MobileIndex")
                                .withKeySchema(new KeySchemaElement("mobile", KeyType.HASH))
                                .withProjection(new Projection().withProjectionType("ALL"))
                                .withProvisionedThroughput(new ProvisionedThroughput(5L, 5L)));

        client.createTable(request);

        // Wait until the table is created
        try {
            dynamoDB.getTable(tableName).waitForActive();
        } catch (InterruptedException e) {
            throw new RuntimeException("Table creation was interrupted", e);
        }
    }

    public APIGatewayProxyResponseEvent handleCreateUserRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        Map<String, Object> responseBody = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            // Generate a unique user ID
            String userId = UUID.randomUUID().toString();

            String email = requestBody.get("email");
            String mobile = requestBody.get("mobile");
            String username = requestBody.get("username");
            String password = requestBody.get("password");

            // Hash the password using BCrypt
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

            // Check which identifier is provided and throw an error if both or none are
            // provided
            if (email == null && mobile == null) {
                throw new IllegalArgumentException("Either email or mobile must be provided");
            } else if (email != null && mobile != null) {
                throw new IllegalArgumentException("Only one of email or mobile can be provided");
            }

            // Create the user item to put into DynamoDB
            Item newUser = new Item()
                    .withPrimaryKey("userId", userId)
                    .withString("username", username)
                    .withString("password", hashedPassword); // Store hashed password

            if (email != null) {
                newUser.withString("email", email);
            } else {
                newUser.withString("mobile", mobile);
            }

            usersTable.putItem(new PutItemSpec().withItem(newUser));

            responseBody.put("message", "User created");
            responseBody.put("userId", userId);
            return new APIGatewayProxyResponseEvent().withStatusCode(201)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            context.getLogger().log("Error occurred: " + e.getMessage());
            responseBody.put("message", "Internal Server Error");
            responseBody.put("error", e.getMessage());
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        }
    }

    private String getUserIdFromToken(String token) {
        DecodedJWT jwt = jwtVerifier.verify(token);
        return jwt.getSubject();
    }

    public APIGatewayProxyResponseEvent handleGetUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String userId = request.getPathParameters().get("userId");
            if (!userId.equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403)
                        .withBody("{\"message\":\"Forbidden\"}");
            }

            Item item = usersTable.getItem(new GetItemSpec().withPrimaryKey("userId", userId));
            if (item != null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(item.toJSON());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"User not found\"}");
            }
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleUpdateUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            // Extract the userId from the path parameters
            String userId = request.getPathParameters().get("userId");

            // Check if the userId from the token matches the userId in the path parameters
            if (!userId.equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403)
                        .withBody("{\"message\":\"Forbidden\"}");
            }

            // Extract the request body
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            // Hash the password if it's being updated
            String hashedPassword = null;
            if (requestBody.containsKey("password")) {
                hashedPassword = BCrypt.hashpw(requestBody.get("password"), BCrypt.gensalt());
            }

            // Check which identifier is provided and ensure only one is being updated
            String email = requestBody.get("email");
            String mobile = requestBody.get("mobile");
            if (email != null && mobile != null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(400)
                        .withBody("{\"message\":\"Only one of email or mobile can be updated\"}");
            }

            // New fields to be updated
            String fullName = requestBody.get("fullName");
            String signaturePhoto = requestBody.get("signaturePhoto");
            String signatureInWords = requestBody.get("signatureInWords");
            String designation = requestBody.get("designation");

            // Build the update expression
            StringBuilder updateExpression = new StringBuilder("set username = :username");
            ValueMap valueMap = new ValueMap().withString(":username", requestBody.get("username"));

            if (hashedPassword != null) {
                updateExpression.append(", password = :password");
                valueMap.withString(":password", hashedPassword);
            }

            if (email != null) {
                updateExpression.append(", email = :email");
                valueMap.withString(":email", email);
            } else if (mobile != null) {
                updateExpression.append(", mobile = :mobile");
                valueMap.withString(":mobile", mobile);
            }

            if (fullName != null) {
                updateExpression.append(", fullName = :fullName");
                valueMap.withString(":fullName", fullName);
            }

            if (signaturePhoto != null) {
                updateExpression.append(", signaturePhoto = :signaturePhoto");
                valueMap.withString(":signaturePhoto", signaturePhoto);
            }

            if (signatureInWords != null) {
                updateExpression.append(", signatureInWords = :signatureInWords");
                valueMap.withString(":signatureInWords", signatureInWords);
            }

            if (designation != null) {
                updateExpression.append(", designation = :designation");
                valueMap.withString(":designation", designation);
            }

            // Create the UpdateItemSpec
            UpdateItemSpec updateItemSpec = new UpdateItemSpec()
                    .withPrimaryKey("userId", userId)
                    .withUpdateExpression(updateExpression.toString())
                    .withValueMap(valueMap);

            // Update the item in DynamoDB
            usersTable.updateItem(updateItemSpec);

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody("{\"message\":\"User updated\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleDeleteUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            // Extract the userId from the path parameters
            String userId = request.getPathParameters().get("userId");

            // Check if the userId from the token matches the userId in the path parameters
            if (!userId.equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403)
                        .withBody("{\"message\":\"Forbidden\"}");
            }

            // Delete the user's information from DynamoDB
            usersTable.deleteItem(new DeleteItemSpec().withPrimaryKey("userId", userId));

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody("{\"message\":\"User deleted\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody("{\"message\":\"Internal Server Error\"}");
        }
    }
}
