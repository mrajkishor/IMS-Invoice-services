### SAM local/dev env setup guide

Build SAM in local

    sam build 

Start api gatway / lambda in local (uses docker contrainer during http requests)

    sam local start-api --env-vars env.json


Build lambda in local (only test lambda functions)

    sam local invoke AuthLoginFunction --event events/login.json --debug 



DynamoDB config in local 

    Configure AWS CLI to use DynamoDB Local
    aws configure set aws_access_key_id fakeMyKeyId
    aws configure set aws_secret_access_key fakeSecretAccessKey
    aws configure set region us-west-2


Start DynamoDB in local (uses docker contrainer to setup dynamodb)
    
    java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb


view table in local 
    
    aws dynamodb list-tables --endpoint-url http://localhost:8000


- env.js is created to manage env vars locally. 

- local env vars used in template.yaml

- samconfig.toml has dual configurations, dev (local) and prod. Comment/uncomment them as per the need. 


### Contributor, 
Rajkishor


