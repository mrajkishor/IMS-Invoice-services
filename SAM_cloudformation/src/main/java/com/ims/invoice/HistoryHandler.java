package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
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

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class HistoryHandler {

    private final DynamoDB dynamoDB;
    private final Table invoicesTable;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Algorithm jwtAlgorithm = Algorithm.HMAC256("your-256-bit-secret");
    private final JWTVerifier jwtVerifier = JWT.require(jwtAlgorithm).build();
    private final Map<String, Object> errorResponse = new HashMap<>();

    public HistoryHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.invoicesTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    private String getUserIdFromToken(String token) {
        DecodedJWT jwt = jwtVerifier.verify(token);
        return jwt.getSubject();
    }

    public APIGatewayProxyResponseEvent handleGetShopHistoryRequest(APIGatewayProxyRequestEvent request,
            Context context) throws JsonProcessingException {
        try {
            // Extract and verify the token from the Authorization header
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String shopId = request.getPathParameters().get("shopId");
            QuerySpec spec = new QuerySpec()
                    .withKeyConditionExpression("shopId = :shopId")
                    .withValueMap(new ValueMap().withString(":shopId", shopId))
                    .withConsistentRead(false);
            ItemCollection<QueryOutcome> items = invoicesTable.getIndex("ShopIdIndex").query(spec);
            Iterator<com.amazonaws.services.dynamodbv2.document.Item> iterator = items.iterator();
            if (iterator.hasNext()) {
                StringBuilder result = new StringBuilder("[");
                while (iterator.hasNext()) {
                    result.append(iterator.next().toJSON());
                    if (iterator.hasNext()) {
                        result.append(",");
                    }
                }
                result.append("]");
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(result.toString());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoices not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }
}
