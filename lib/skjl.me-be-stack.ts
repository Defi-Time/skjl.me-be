import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class SkjlMeBeStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const dynamoDbSkjlPubs = new ddb.Table(this, 'SklMePubsTable', {
            partitionKey: {name: 'pubKey', type: ddb.AttributeType.STRING},
            sortKey: {name: 'calendarId', type: ddb.AttributeType.STRING},
            tableName: 'SkjlMePubs',
            // removalPolicy: cdk.RemovalPolicy.DESTROY, // todo: we need to RETAIN this, but AWS CDK does not support it yet so we need a workaround for that!
            billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        })

        // dynamoDbSkjlPubs.addGlobalSecondaryIndex({
        //     indexName: 'calendarIndex',
        //     partitionKey: {name: 'calendarId', type: ddb.AttributeType.STRING}
        // })

        const skjlPostHandler = new lambda.Function(this, 'skjlPostHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'skjlAddCalendar.handler',
            environment: {
                tableName: dynamoDbSkjlPubs.tableName,
            }
        })

        const skjlGetHandler = new lambda.Function(this, 'skjlGetHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'skjlGetCalendar.handler',
            environment: {
                tableName: dynamoDbSkjlPubs.tableName,
            }
        })

        const api = new apigw.RestApi(this, 'wkjlApis', {
            restApiName: "skjl.me APIs",
            description: "APIs for the SKJL.me application."
        })

        const postCalendarIntegration = new apigw.LambdaIntegration(skjlPostHandler, {
            requestTemplates: { "application/json": '{"statusCode": "200"}'},
        })

        api.root.addMethod("POST", postCalendarIntegration, {
            operationName: "Add Calendar",
        })

        const getCalendarIntegration = new apigw.LambdaIntegration(skjlGetHandler, {
            requestTemplates: { "application/json": '{"statusCode": "200"}'},
        })

        api.root.addMethod("GET", getCalendarIntegration, {
            operationName: "Get Calendars",
        })


        dynamoDbSkjlPubs.grantReadWriteData(skjlPostHandler);
        dynamoDbSkjlPubs.grantReadWriteData(skjlGetHandler);

    }
}
