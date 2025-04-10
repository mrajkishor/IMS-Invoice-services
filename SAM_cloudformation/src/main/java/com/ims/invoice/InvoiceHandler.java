package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.UpdateItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.NameMap;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
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
            Map<String, Object> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            if (!requestBody.get("userId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403).withBody("{\"message\":\"Forbidden\"}");
            }

            String invoiceId = requestBody.get("invoiceId") != null
                    && !requestBody.get("invoiceId").toString().isEmpty()
                            ? requestBody.get("invoiceId").toString()
                            : UUID.randomUUID().toString();

            @SuppressWarnings("unchecked")
            Item invoiceItem = new Item()
                    .withPrimaryKey("invoiceId", invoiceId)
                    .withString("shopId", requestBody.get("shopId").toString())
                    .withString("userId", requestBody.get("userId").toString())
                    .withMap("billedTo", (Map<String, Object>) requestBody.get("billedTo"))
                    .withMap("invoiceCreator", (Map<String, Object>) requestBody.get("invoiceCreator"))
                    .withMap("paymentMethod", (Map<String, Object>) requestBody.get("paymentMethod"))
                    .withMap("business", (Map<String, Object>) requestBody.get("business"))
                    .withString("invoiceDateTimeStamp", requestBody.get("invoiceDateTimeStamp").toString())
                    .withString("dueDateTimeStamp", requestBody.get("dueDateTimeStamp").toString())
                    .withString("paymentStatus", requestBody.get("paymentStatus").toString())
                    .withString("invoiceTemplateId", requestBody.get("invoiceTemplateId").toString())
                    .withMap("invoiceTable", (Map<String, Object>) requestBody.get("invoiceTable"))
                    .withString("subTotal", requestBody.get("subTotal").toString())
                    .withMap("tax", (Map<String, Object>) requestBody.get("tax"))
                    .withMap("packageDiscount", (Map<String, Object>) requestBody.get("packageDiscount"))
                    .withString("total", requestBody.get("total").toString())
                    .withString("thankYouNote", requestBody.get("thankYouNote").toString())
                    .withMap("termsNServicesMessage", (Map<String, Object>) requestBody.get("termsNServicesMessage"));

            invoicesTable.putItem(invoiceItem);

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

    public APIGatewayProxyResponseEvent handleUpdateInvoiceRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            @SuppressWarnings("unchecked")
            Map<String, Object> requestBody = objectMapper.readValue(request.getBody(), Map.class);

            String invoiceId = request.getPathParameters().get("invoiceId");
            Item existingItem = invoicesTable.getItem("invoiceId", invoiceId);

            if (existingItem == null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }

            if (!existingItem.getString("userId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403).withBody("{\"message\":\"Forbidden\"}");
            }

            // Replace existing item with new data
            @SuppressWarnings("unchecked")
            Item updatedItem = new Item()
                    .withPrimaryKey("invoiceId", invoiceId)
                    .withString("shopId", requestBody.get("shopId").toString())
                    .withString("userId", requestBody.get("userId").toString())
                    .withMap("billedTo", (Map<String, Object>) requestBody.get("billedTo"))
                    .withMap("invoiceCreator", (Map<String, Object>) requestBody.get("invoiceCreator"))
                    .withMap("paymentMethod", (Map<String, Object>) requestBody.get("paymentMethod"))
                    .withMap("business", (Map<String, Object>) requestBody.get("business"))
                    .withString("invoiceDateTimeStamp", requestBody.get("invoiceDateTimeStamp").toString())
                    .withString("dueDateTimeStamp", requestBody.get("dueDateTimeStamp").toString())
                    .withString("paymentStatus", requestBody.get("paymentStatus").toString())
                    .withString("invoiceTemplateId", requestBody.get("invoiceTemplateId").toString())
                    .withMap("invoiceTable", (Map<String, Object>) requestBody.get("invoiceTable"))
                    .withString("subTotal", requestBody.get("subTotal").toString())
                    .withMap("tax", (Map<String, Object>) requestBody.get("tax"))
                    .withMap("packageDiscount", (Map<String, Object>) requestBody.get("packageDiscount"))
                    .withString("total", requestBody.get("total").toString())
                    .withString("thankYouNote", requestBody.get("thankYouNote").toString())
                    .withMap("termsNServicesMessage", (Map<String, Object>) requestBody.get("termsNServicesMessage"));

            invoicesTable.putItem(updatedItem);

            // return new
            // APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Invoice
            // updated\"}");

            // Fetch the updated item from DynamoDB
            Item fetchedUpdatedItem = invoicesTable.getItem("invoiceId", invoiceId);

            // Prepare the response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Invoice updated successfully");
            responseBody.put("updatedInvoice", fetchedUpdatedItem.asMap());

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal server error");
            errorResponse.put("error", e.getMessage());
            return new APIGatewayProxyResponseEvent().withStatusCode(500)
                    .withBody(objectMapper.writeValueAsString(errorResponse));
        }
    }

    public APIGatewayProxyResponseEvent handleMarkAsPaidRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            // Extract Authorization token and verify user
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            // Extract invoice ID from path parameters
            String invoiceId = request.getPathParameters().get("invoiceId");
            Item existingItem = invoicesTable.getItem(new GetItemSpec().withPrimaryKey("invoiceId", invoiceId));

            if (existingItem == null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }

            // Check if user is authorized to update the invoice
            if (!existingItem.getString("userId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403)
                        .withBody("{\"message\":\"Forbidden\"}");
            }

            // Update paymentStatus to "Paid"
            UpdateItemSpec updateSpec = new UpdateItemSpec()
                    .withPrimaryKey("invoiceId", invoiceId)
                    .withUpdateExpression("set paymentStatus = :status")
                    .withValueMap(new ValueMap().withString(":status", "Paid"))
                    .withReturnValues(ReturnValue.UPDATED_NEW);

            UpdateItemOutcome outcome = invoicesTable.updateItem(updateSpec);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Invoice marked as Paid successfully");
            responseBody.put("updatedAttributes", outcome.getItem().asMap());

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
        } catch (Exception e) {
            errorResponse.put("Error Details", e.getMessage());
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

    public APIGatewayProxyResponseEvent handleCancelInvoiceRequest(APIGatewayProxyRequestEvent request, Context context)
            throws JsonProcessingException {
        try {
            String token = request.getHeaders().get("Authorization").replace("Bearer ", "");
            String userIdFromToken = getUserIdFromToken(token);

            String invoiceId = request.getPathParameters().get("invoiceId");
            Item existingItem = invoicesTable.getItem(new GetItemSpec().withPrimaryKey("invoiceId", invoiceId));

            if (existingItem == null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }

            if (!existingItem.getString("userId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403).withBody("{\"message\":\"Forbidden\"}");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            String remarks = requestBody.get("remarks") != null ? requestBody.get("remarks").toString() : "";

            // Update the invoice's paymentStatus to "Cancelled" and add remarks
            UpdateItemSpec updateSpec = new UpdateItemSpec()
                    .withPrimaryKey("invoiceId", invoiceId)
                    .withUpdateExpression("set paymentStatus = :status, remarks = :remarks")
                    .withValueMap(new ValueMap().withString(":status", "Cancelled").withString(":remarks", remarks))
                    .withReturnValues(ReturnValue.UPDATED_NEW);

            UpdateItemOutcome outcome = invoicesTable.updateItem(updateSpec);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Invoice cancelled successfully");
            responseBody.put("updatedAttributes", outcome.getItem().asMap());

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
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

            if (item == null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(404)
                        .withBody("{\"message\":\"Invoice not found\"}");
            }

            if (!item.getString("userId").equals(userIdFromToken)) {
                return new APIGatewayProxyResponseEvent().withStatusCode(403)
                        .withBody("{\"message\":\"Forbidden\"}");
            }

            // Optional: Add remarks for deletion
            @SuppressWarnings("unchecked")
            Map<String, Object> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            String remarks = requestBody.get("remarks") != null ? requestBody.get("remarks").toString() : "";

            // Delete the item
            invoicesTable.deleteItem(new DeleteItemSpec().withPrimaryKey("invoiceId", invoiceId));

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Invoice deleted successfully");
            responseBody.put("remarks", remarks);

            return new APIGatewayProxyResponseEvent().withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(responseBody));
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