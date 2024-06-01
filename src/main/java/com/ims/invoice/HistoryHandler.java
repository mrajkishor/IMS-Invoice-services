package com.ims.invoice;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class HistoryHandler {

    private final DynamoDB dynamoDB;
    private final Table historyTable;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public HistoryHandler() {
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        this.dynamoDB = new DynamoDB(client);
        this.historyTable = dynamoDB.getTable(System.getenv("TABLE_NAME"));
    }

    public APIGatewayProxyResponseEvent handleGetShopHistoryRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            String shopId = request.getPathParameters().get("shopId");
            QuerySpec spec = new QuerySpec().withHashKey("shopId", shopId);
            ItemCollection<QueryOutcome> items = historyTable.query(spec);
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
                return new APIGatewayProxyResponseEvent().withStatusCode(404).withBody("{\"message\":\"History not found\"}");
            }
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody("{\"message\":\"Internal Server Error\"}");
        }
    }
}
