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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

import java.util.HashMap;
import java.util.Map;

public class UserHandler {

    private final DynamoDB dynamoDB;
    private final Table usersTable;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.usersTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    public APIGatewayProxyResponseEvent handleCreateUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            usersTable.putItem(new PutItemSpec().withItem(new Item()
                    .withPrimaryKey("email", requestBody.get("email"))
                    .withString("username", requestBody.get("username"))
                    .withString("password", requestBody.get("password"))));

            return new APIGatewayProxyResponseEvent().withStatusCode(201).withBody("{\"message\":\"User created\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleGetUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String userId = request.getPathParameters().get("userId");
            Item item = usersTable.getItem(new GetItemSpec().withPrimaryKey("email", userId));
            if (item != null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(item.toJSON());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404).withBody("{\"message\":\"User not found\"}");
            }
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleUpdateUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String userId = request.getPathParameters().get("userId");
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            usersTable.updateItem(new UpdateItemSpec().withPrimaryKey("email", userId)
                    .withUpdateExpression("set username = :username, email = :email, password = :password")
                    .withValueMap(new ValueMap()
                            .withString(":username", requestBody.get("username"))
                            .withString(":email", requestBody.get("email"))
                            .withString(":password", requestBody.get("password"))));

            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"User updated\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleDeleteUserRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String userId = request.getPathParameters().get("userId");
            usersTable.deleteItem(new DeleteItemSpec().withPrimaryKey("email", userId));
            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"User deleted\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }
}
