package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
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

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class ShopHandler {

    private final DynamoDB dynamoDB;
    private final Table shopsTable;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Algorithm jwtAlgorithm = Algorithm.HMAC256("your-256-bit-secret");
    private final JWTVerifier jwtVerifier = JWT.require(jwtAlgorithm).build();
    HashMap<String, Exception> errorResponse = new HashMap<>();

    public ShopHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.shopsTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    private String getUserIdFromToken(String token) {
        DecodedJWT jwt = jwtVerifier.verify(token);
        return jwt.getSubject();
    }

    public APIGatewayProxyResponseEvent handleCreateShopRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            // Ensure the ownerId in the request body matches the userId from the token
            if (!requestBody.get("ownerId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403).withBody("{\"message\":\"Forbidden\"}");
            }

            // Generate a unique shopId if not provided
            String shopId = requestBody.get("shopId");
            if (shopId == null || shopId.isEmpty()) {
                shopId = UUID.randomUUID().toString();
            }

            shopsTable.putItem(new PutItemSpec().withItem(new Item()
                    .withPrimaryKey("shopId", shopId)
                    .withString("shopName", requestBody.get("shopName"))
                    .withString("ownerId", requestBody.get("ownerId"))
                    .withString("address", requestBody.get("address"))));

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Shop created");
            responseBody.put("shopId", shopId);

            return new APIGatewayProxyResponseEvent().withStatusCode(201)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleGetShopRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String shopId = request.getPathParameters().get("shopId");
            Item item = shopsTable.getItem(new GetItemSpec().withPrimaryKey("shopId", shopId));

            if (item != null) {
                // Ensure the ownerId in the shop matches the userId from the token
                if (!item.getString("ownerId").equals(userIdFromToken)) {
                    return new APIGatewayProxyResponseEvent().withStatusCode(403)
                            .withBody("{\"message\":\"Forbidden\"}");
                }
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(item.toJSON());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Shop not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleUpdateShopRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String shopId = request.getPathParameters().get("shopId");
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            Item item = shopsTable.getItem(new GetItemSpec().withPrimaryKey("shopId", shopId));

            if (item != null) {
                // Ensure the ownerId in the shop matches the userId from the token
                if (!item.getString("ownerId").equals(userIdFromToken)) {
                    return new APIGatewayProxyResponseEvent().withStatusCode(403)
                            .withBody("{\"message\":\"Forbidden\"}");
                }

                shopsTable.updateItem(new UpdateItemSpec().withPrimaryKey("shopId", shopId)
                        .withUpdateExpression("set shopName = :shopName, ownerId = :ownerId, address = :address")
                        .withValueMap(new ValueMap()
                                .withString(":shopName", requestBody.get("shopName"))
                                .withString(":ownerId", requestBody.get("ownerId"))
                                .withString(":address", requestBody.get("address"))));

                return new APIGatewayProxyResponseEvent().withStatusCode(200)
                        .withBody("{\"message\":\"Shop updated\"}");
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Shop not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleDeleteShopRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String shopId = request.getPathParameters().get("shopId");
            Item item = shopsTable.getItem(new GetItemSpec().withPrimaryKey("shopId", shopId));

            if (item != null) {
                // Ensure the ownerId in the shop matches the userId from the token
                if (!item.getString("ownerId").equals(userIdFromToken)) {
                    return new APIGatewayProxyResponseEvent().withStatusCode(403)
                            .withBody("{\"message\":\"Forbidden\"}");
                }

                shopsTable.deleteItem(new DeleteItemSpec().withPrimaryKey("shopId", shopId));

                return new APIGatewayProxyResponseEvent().withStatusCode(200)
                        .withBody("{\"message\":\"Shop deleted\"}");
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Shop not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }
}
