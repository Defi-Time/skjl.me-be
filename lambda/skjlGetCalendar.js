const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

// var credentials = new AWS.SharedIniFileCredentials({profile: 'fff'});
// AWS.config.credentials = credentials;

const {responseTemplate} = require("./util/responseTemplate");

const client = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});





exports.handler = async (event, context) => {
  const TableName = process.env.tableName;

  if (!TableName)
    return responseTemplate(500, "<h1>tableName is missing in the env vars!</h1>", "text/html")

  if(!event.queryStringParameters || !event.queryStringParameters.id) return responseTemplate(400, "<h1>Bad request!<br/>a valid id in the query params is required for this endpoint.</h1>", "text/html")
  const qs = event.queryStringParameters;
  const pubKey = qs.id;

  var getParams = {
    TableName,
    // IndexName: 'Index',
    KeyConditionExpression: 'pubKey = :pubKey',
    ExpressionAttributeValues: {
      ':pubKey': pubKey
    }
  }

  const getResponse = await client.query(getParams).promise();

  if(!getResponse.Items.length){
    const calendarId = uuidv4();
    const params = {
      Item: {
        pubKey,
        calendarId,
        bookings: [],
        defaultCalendar: true,
      },
      TableName,
    }
    await client.put(params).promise();
    return responseTemplate(200, [params.Item])
  }
  return responseTemplate(200, getResponse.Items)

}


// const test = async () => {
//
//
//
//   const TableName = 'SkjlMePubs';
//
//   const pubKey = '123456';
//
//   var getParams = {
//     TableName,
//     // IndexName: 'Index',
//     KeyConditionExpression: 'pubKey = :pubKey',
//     ExpressionAttributeValues: {
//       ':pubKey': pubKey,
//     }
//   }
//
//   const getResponse = await client.query(getParams).promise();
//
//
//   if(!getResponse.Items.length){
//     const calendarId = uuidv4();
//     const params = {
//       Item: {
//         pubKey,
//         calendarId,
//         bookings: [],
//         defaultCalendar: true,
//       },
//       TableName,
//     }
//     await client.put(params).promise();
//     return responseTemplate(200, [params.Item])
//   }
//   return responseTemplate(200, getResponse.Items)
//
//   console.log('>>>>>', getResponse)
//
// }
//
// test();