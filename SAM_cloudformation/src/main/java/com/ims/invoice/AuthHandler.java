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
import org.mindrot.jbcrypt.BCrypt;

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
    private final Index mobileIndex;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Algorithm jwtAlgorithm = Algorithm.HMAC256("your-256-bit-secret");
    private final JWTVerifier jwtVerifier = JWT.require(jwtAlgorithm).build();
    private final Set<String> tokenBlacklist = new HashSet<>();

    public AuthHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.usersTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
        this.emailIndex = usersTable.getIndex("EmailIndex");
        this.mobileIndex = usersTable.getIndex("MobileIndex");
    }

    public APIGatewayProxyResponseEvent handleLoginRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        Map<String, Object> errorResponse = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            String identifier = requestBody.get("identifier"); // Identifier could be email or mobile number
            String password = requestBody.get("password");

            QuerySpec querySpec;

            // Determine if the identifier is an email or a mobile number
            Iterator<Item> iterator;
            if (identifier.contains("@")) {
                // Identifier is an email, query using emailIndex
                querySpec = new QuerySpec()
                        .withKeyConditionExpression("email = :v_identifier")
                        .withValueMap(new ValueMap().withString(":v_identifier", identifier));
                iterator = emailIndex.query(querySpec).iterator();
            } else {
                // Identifier is a mobile number, query using mobileIndex
                querySpec = new QuerySpec()
                        .withKeyConditionExpression("mobile = :v_identifier")
                        .withValueMap(new ValueMap().withString(":v_identifier", identifier));
                iterator = mobileIndex.query(querySpec).iterator();
            }

            if (iterator.hasNext()) {
                // User exists, check password
                Item item = iterator.next();
                if (BCrypt.checkpw(password, item.getString("password"))) { // Check hashed password
                    return generateTokenResponse(item.getString("userId"));
                } else {
                    return new APIGatewayProxyResponseEvent().withStatusCode(401)
                            .withBody("{\"message\":\"Invalid credentials\"}");
                }
            } else {
                // User does not exist, create new user
                String userId = java.util.UUID.randomUUID().toString(); // Generate a unique user ID

                String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt()); // Hash the password

                // Assuming you store both email and mobile number for a user, you'll need to
                // handle this
                Item newUser = new Item()
                        .withPrimaryKey("userId", userId)
                        .withString(identifier.contains("@") ? "email" : "mobile", identifier)
                        .withString("password", hashedPassword) // Store the hashed password
                        .withString("username",
                                identifier.contains("@") ? identifier.substring(0, identifier.indexOf('@'))
                                        : "user_" + userId);

                usersTable.putItem(newUser);

                // Auto-login the newly created user
                return generateTokenResponse(userId);
            }
        } catch (Exception e) {
            errorResponse.put("Error details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    private APIGatewayProxyResponseEvent generateTokenResponse(String userId) throws JsonProcessingException {
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
        responseBody.put("userId", userId);

        return new APIGatewayProxyResponseEvent().withStatusCode(200)
                .withBody(objectMapper.writeValueAsString(responseBody));
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

            // Verify the provided refresh token
            DecodedJWT decodedJWT = JWT.require(jwtAlgorithm).build().verify(refreshToken);
            String userId = decodedJWT.getSubject();

            // Generate a new access token
            String newToken = JWT.create()
                    .withSubject(userId)
                    .withExpiresAt(new Date(System.currentTimeMillis() + 3600000)) // 1 hour expiration
                    .sign(jwtAlgorithm);

            // Generate a new refresh token
            String newRefreshToken = JWT.create()
                    .withSubject(userId)
                    .withExpiresAt(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                    .sign(jwtAlgorithm);

            // Return both tokens
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("token", newToken);
            responseBody.put("refreshToken", newRefreshToken);

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

    public APIGatewayProxyResponseEvent handleValidateTokenRequest(APIGatewayProxyRequestEvent request, Context context)
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
