package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class InvoiceHandler {

    private final DynamoDB dynamoDB;
    private final Table invoicesTable;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Algorithm jwtAlgorithm = Algorithm.HMAC256("your-256-bit-secret");
    private final JWTVerifier jwtVerifier = JWT.require(jwtAlgorithm).build();
    private final Map<String, Object> errorResponse = new HashMap<>();

    public InvoiceHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.invoicesTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    private String getUserIdFromToken(String token) {
        DecodedJWT jwt = jwtVerifier.verify(token);
        return jwt.getSubject();
    }

    public APIGatewayProxyResponseEvent handleCreateInvoiceRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            if (!requestBody.get("userId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403).withBody("{\"message\":\"Forbidden\"}");
            }

            String invoiceId = requestBody.get("invoiceId");
            if (invoiceId == null || invoiceId.isEmpty()) {
                invoiceId = UUID.randomUUID().toString();
            }

            invoicesTable.putItem(new PutItemSpec().withItem(new Item()
                    .withPrimaryKey("invoiceId", invoiceId)
                    .withString("shopId", requestBody.get("shopId"))
                    .withString("userId", requestBody.get("userId"))
                    .withString("customerName", requestBody.get("customerName"))
                    .withString("customerAddress", requestBody.get("customerAddress"))
                    .withString("details", requestBody.get("details"))
                    .withString("invoiceDate", requestBody.get("invoiceDate"))
                    .withString("dueDate", requestBody.get("dueDate"))
                    .withString("status", requestBody.get("status"))
                    .withNumber("amount", Integer.parseInt(requestBody.get("amount")))));

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Invoice created");
            responseBody.put("invoiceId", invoiceId);

            return new APIGatewayProxyResponseEvent().withStatusCode(201)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleGetInvoiceRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String invoiceId = request.getPathParameters().get("invoiceId");
            Item item = invoicesTable.getItem(new GetItemSpec().withPrimaryKey("invoiceId", invoiceId));

            if (item != null) {
                if (!item.getString("userId").equals(userIdFromToken)) {
                    return new APIGatewayProxyResponseEvent().withStatusCode(403)
                            .withBody("{\"message\":\"Forbidden\"}");
                }
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(item.toJSON());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleUpdateInvoiceRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String invoiceId = request.getPathParameters().get("invoiceId");
            @SuppressWarnings("unchecked")
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            Item item = invoicesTable.getItem(new GetItemSpec().withPrimaryKey("invoiceId", invoiceId));

            if (item != null) {
                if (!item.getString("userId").equals(userIdFromToken)) {
                    return new APIGatewayProxyResponseEvent().withStatusCode(403)
                            .withBody("{\"message\":\"Forbidden\"}");
                }

                invoicesTable.updateItem(new UpdateItemSpec().withPrimaryKey("invoiceId", invoiceId)
                        .withUpdateExpression("set shopId = :shopId, userId = :userId, customerName = :customerName, " +
                                "customerAddress = :customerAddress, details = :details, invoiceDate = :invoiceDate, " +
                                "dueDate = :dueDate, status = :status, amount = :amount")
                        .withValueMap(new ValueMap()
                                .withString(":shopId", requestBody.get("shopId"))
                                .withString(":userId", requestBody.get("userId"))
                                .withString(":customerName", requestBody.get("customerName"))
                                .withString(":customerAddress", requestBody.get("customerAddress"))
                                .withString(":details", requestBody.get("details"))
                                .withString(":invoiceDate", requestBody.get("invoiceDate"))
                                .withString(":dueDate", requestBody.get("dueDate"))
                                .withString(":status", requestBody.get("status"))
                                .withNumber(":amount", Integer.parseInt(requestBody.get("amount")))));

                return new APIGatewayProxyResponseEvent().withStatusCode(200)
                        .withBody("{\"message\":\"Invoice updated\"}");
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleDeleteInvoiceRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String invoiceId = request.getPathParameters().get("invoiceId");
            Item item = invoicesTable.getItem(new GetItemSpec().withPrimaryKey("invoiceId", invoiceId));

            if (item != null) {
                if (!item.getString("userId").equals(userIdFromToken)) {
                    return new APIGatewayProxyResponseEvent().withStatusCode(403)
                            .withBody("{\"message\":\"Forbidden\"}");
                }

                invoicesTable.deleteItem(new DeleteItemSpec().withPrimaryKey("invoiceId", invoiceId));

                return new APIGatewayProxyResponseEvent().withStatusCode(200)
                        .withBody("{\"message\":\"Invoice deleted\"}");
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleGetInvoicesByShopRequest(APIGatewayProxyRequestEvent request,
            Context context) throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String shopId = request.getPathParameters().get("shopId");

            ScanSpec scanSpec = new ScanSpec()
                    .withFilterExpression("shopId = :shopId and userId = :userId")
                    .withValueMap(new ValueMap().withString(":shopId", shopId).withString(":userId", userIdFromToken));

            ItemCollection<ScanOutcome> items = invoicesTable.scan(scanSpec);
            List<Map<String, Object>> invoices = new ArrayList<>();
            for (Item item : items) {
                invoices.add(item.asMap());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("invoices", invoices);

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            errorResponse.put("Error Details", e);
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

}
