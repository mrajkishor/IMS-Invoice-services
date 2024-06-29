package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.Index;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
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
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class AuthHandler {

    private final DynamoDB dynamoDB;
    private final Table usersTable;
    private final Index emailIndex;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Algorithm jwtAlgorithm = Algorithm.HMAC256("your-256-bit-secret");
    private final JWTVerifier jwtVerifier = JWT.require(jwtAlgorithm).build();
    private final Set<String> tokenBlacklist = new HashSet<>();

    public AuthHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.usersTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
        this.emailIndex = usersTable.getIndex("EmailIndex");
    }

    public APIGatewayProxyResponseEvent handleLoginRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        Map<String, Object> errorResponse = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            String email = requestBody.get("email");
            String password = requestBody.get("password");

            QuerySpec querySpec = new QuerySpec()
                    .withKeyConditionExpression("email = :v_email")
                    .withValueMap(new ValueMap().withString(":v_email", email));

            Iterator<Item> iterator = emailIndex.query(querySpec).iterator();

            if (iterator.hasNext()) {
                Item item = iterator.next();
                if (item.getString("password").equals(password)) {
                    String userId = item.getString("userId");
                    String token = JWT.create()
                            .withSubject(userId)
                            .withExpiresAt(new Date(System.currentTimeMillis() + 3600000)) // 1 hour expiration
                            .sign(jwtAlgorithm);

                    String refreshToken = JWT.create()
                            .withSubject(userId)
                            .withExpiresAt(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                            .sign(jwtAlgorithm);

                    Map<String, String> responseBody = new HashMap<>();
                    responseBody.put("token", token);
                    responseBody.put("refreshToken", refreshToken);

                    return new APIGatewayProxyResponseEvent().withStatusCode(200)
                            .withBody(objectMapper.writeValueAsString(responseBody));
                } else {
                    return new APIGatewayProxyResponseEvent().withStatusCode(401)
                            .withBody("{\"message\":\"Invalid credentials\"}");
                }
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(401)
                        .withBody("{\"message\":\"Invalid credentials\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleLogoutRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        Map<String, Object> errorResponse = new HashMap<>();
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            tokenBlacklist.add(token);

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody("{\"message\":\"Logout successful\"}");
        } catch (Exception e) {
            errorResponse.put("Error details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleRefreshRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        Map<String, Object> errorResponse = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            String refreshToken = requestBody.get("refreshToken");

            DecodedJWT decodedJWT = JWT.require(jwtAlgorithm).build().verify(refreshToken);
            String userId = decodedJWT.getSubject();

            // Create new token
            String newToken = JWT.create()
                    .withSubject(userId)
                    .withExpiresAt(new Date(System.currentTimeMillis() + 3600000)) // 1 hour expiration
                    .sign(jwtAlgorithm);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("token", newToken);

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            errorResponse.put("Error details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public boolean isTokenBlacklisted(String token) {
        // When a user logs out, the access token and/or refresh token is added to a
        // blacklist. Every time an API request is made, the server checks the token
        // against this blacklist to ensure it has not been invalidated.
        return tokenBlacklist.contains(token);
    }

    public APIGatewayProxyResponseEvent validateToken(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        Map<String, Object> errorResponse = new HashMap<>();
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            if (isTokenBlacklisted(token)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(401)
                        .withBody("{\"message\":\"Invalid token\"}");
            }

            DecodedJWT decodedJWT = JWT.require(jwtAlgorithm).build().verify(token);
            String userId = decodedJWT.getSubject();

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("userId", userId);

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            errorResponse.put("Error details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }
}
