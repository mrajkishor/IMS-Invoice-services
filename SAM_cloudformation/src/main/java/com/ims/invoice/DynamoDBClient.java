package com.ims.invoice;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;

public class DynamoDBClient {

    private static AmazonDynamoDB dynamoDBClient;

    static {
        String endpoint = System.getenv("DYNAMODB_ENDPOINT");
        if (endpoint != null && !endpoint.isEmpty()) {
            dynamoDBClient = AmazonDynamoDBClientBuilder.standard()
                    .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endpoint, "us-west-2"))
                    .build();
        } else {
            dynamoDBClient = AmazonDynamoDBClientBuilder.standard().build();
        }
    }

    public static AmazonDynamoDB getClient() {
        return dynamoDBClient;
    }
}
