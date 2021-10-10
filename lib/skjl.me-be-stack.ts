import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';

export class SkjlMeBeStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const dynamoDbSkjlPubs = new ddb.Table(this, 'SklMePubsTable', {
            partitionKey: {name: 'pubKey', type: ddb.AttributeType.STRING},
            sortKey: {name: 'calendarId', type: ddb.AttributeType.STRING},
            tableName: 'SkjlMePubs',
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        })

        dynamoDbSkjlPubs.addGlobalSecondaryIndex({
            indexName: 'calendarIndex',
            partitionKey: {name: 'calendarId', type: ddb.AttributeType.STRING}
        })


    }
}
