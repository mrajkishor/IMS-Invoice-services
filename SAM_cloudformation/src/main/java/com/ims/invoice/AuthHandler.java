package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

import java.util.HashMap;
import java.util.Map;

public class AuthHandler {

    private final DynamoDB dynamoDB;
    private final Table usersTable;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.usersTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    public APIGatewayProxyResponseEvent handleLoginRequest(APIGatewayProxyRequestEvent request, Context context) throws JsonProcessingException {
        Map<String, Object> responseBody = new HashMap<>();
        try {
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            String email = requestBody.get("email");
            String password = requestBody.get("password");

            GetItemSpec spec = new GetItemSpec().withPrimaryKey("email", email);
            Item result = usersTable.getItem(spec);
            if (result != null && result.getString("password").equals(password)) {
                responseBody.put("message", "Login successful");
                responseBody.put("token", "your-jwt-token");
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(objectMapper.writeValueAsString(responseBody));
            } else {
                responseBody.put("message", "Invalid credentials");
                return new APIGatewayProxyResponseEvent().withStatusCode(401).withBody(objectMapper.writeValueAsString(responseBody));
            }
        } catch (Exception e) {
            responseBody.put("message", "Internal Server Error");
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody(objectMapper.writeValueAsString(responseBody));
        }
    }

    public APIGatewayProxyResponseEvent handleLogoutRequest(APIGatewayProxyRequestEvent request, Context context) {
        // Implement logout logic
        return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Logout successful\"}");
    }

    public APIGatewayProxyResponseEvent handleRefreshRequest(APIGatewayProxyRequestEvent request, Context context) {
        // Implement token refresh logic
        return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Token refreshed\"}");
    }
}

