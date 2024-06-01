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

public class InvoiceHandler {

    private final DynamoDB dynamoDB;
    private final Table invoicesTable;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public InvoiceHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.invoicesTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    public APIGatewayProxyResponseEvent handleCreateInvoiceRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            invoicesTable.putItem(new PutItemSpec().withItem(new Item()
                    .withPrimaryKey("invoiceId", requestBody.get("invoiceId"))
                    .withString("shopId", requestBody.get("shopId"))
                    .withString("userId", requestBody.get("userId"))
                    .withString("details", requestBody.get("details"))
                    .withNumber("amount", Integer.parseInt(requestBody.get("amount")))));

            return new APIGatewayProxyResponseEvent().withStatusCode(201).withBody("{\"message\":\"Invoice created\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleGetInvoiceRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String invoiceId = request.getPathParameters().get("invoiceId");
            Item item = invoicesTable.getItem(new GetItemSpec().withPrimaryKey("invoiceId", invoiceId));
            if (item != null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(item.toJSON());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404).withBody("{\"message\":\"Invoice not found\"}");
            }
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleUpdateInvoiceRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String invoiceId = request.getPathParameters().get("invoiceId");
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            invoicesTable.updateItem(new UpdateItemSpec().withPrimaryKey("invoiceId", invoiceId)
                    .withUpdateExpression("set shopId = :shopId, userId = :userId, details = :details, amount = :amount")
                    .withValueMap(new ValueMap()
                            .withString(":shopId", requestBody.get("shopId"))
                            .withString(":userId", requestBody.get("userId"))
                            .withString(":details", requestBody.get("details"))
                            .withNumber(":amount", Integer.parseInt(requestBody.get("amount")))));

            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Invoice updated\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleDeleteInvoiceRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String invoiceId = request.getPathParameters().get("invoiceId");
            invoicesTable.deleteItem(new DeleteItemSpec().withPrimaryKey("invoiceId", invoiceId));
            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Invoice deleted\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }
}
