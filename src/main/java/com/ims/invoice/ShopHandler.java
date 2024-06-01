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

public class ShopHandler {

    private final DynamoDB dynamoDB;
    private final Table shopsTable;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ShopHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.shopsTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    public APIGatewayProxyResponseEvent handleCreateShopRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            shopsTable.putItem(new PutItemSpec().withItem(new Item()
                    .withPrimaryKey("shopId", requestBody.get("shopId"))
                    .withString("shopName", requestBody.get("shopName"))
                    .withString("ownerId", requestBody.get("ownerId"))
                    .withString("address", requestBody.get("address"))));

            return new APIGatewayProxyResponseEvent().withStatusCode(201).withBody("{\"message\":\"Shop created\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleGetShopRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String shopId = request.getPathParameters().get("shopId");
            Item item = shopsTable.getItem(new GetItemSpec().withPrimaryKey("shopId", shopId));
            if (item != null) {
                return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(item.toJSON());
            } else {
                return new APIGatewayProxyResponseEvent().withStatusCode(404).withBody("{\"message\":\"Shop not found\"}");
            }
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleUpdateShopRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String shopId = request.getPathParameters().get("shopId");
            Map<String, String> requestBody = objectMapper.readValue(request.getBody(), Map.class);
            shopsTable.updateItem(new UpdateItemSpec().withPrimaryKey("shopId", shopId)
                    .withUpdateExpression("set shopName = :shopName, ownerId = :ownerId, address = :address")
                    .withValueMap(new ValueMap()
                            .withString(":shopName", requestBody.get("shopName"))
                            .withString(":ownerId", requestBody.get("ownerId"))
                            .withString(":address", requestBody.get("address"))));

            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Shop updated\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }

    public APIGatewayProxyResponseEvent handleDeleteShopRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String shopId = request.getPathParameters().get("shopId");
            shopsTable.deleteItem(new DeleteItemSpec().withPrimaryKey("shopId", shopId));
            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody("{\"message\":\"Shop deleted\"}");
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }
}

