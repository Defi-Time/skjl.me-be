const {isJson} = require("./util/isJson");
const AWS = require("aws-sdk");
// var credentials = new AWS.SharedIniFileCredentials({profile: 'fff'});
// AWS.config.credentials = credentials;
const {responseTemplate} = require("./util/responseTemplate");

const client = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});



/*
{
    "id": "12345",
    "calendarId": "12345",
    "bookings": [{
    "date" : ,
      "time" : ,
      "message": ,
      "name": ,
      "email": ,
    }]
}
* */

exports.handler = async (event, context) => {
  const TableName = process.env.tableName;

  if (!TableName)
    return responseTemplate(500, "<h1>tableName is missing in the env vars!</h1>", "text/html")

  if (event.body && isJson(event.body)) {

    const body = JSON.parse(event.body);
    const pubKey = body.id;
    const calendarId = body.calendarId;
    const bookings = body.bookings;

    if (!pubKey) return responseTemplate(400, "<h1>Bad request. pubKey was missing in the body</h1>", "text/html")
    if (!calendarId) return responseTemplate(400, "<h1>Bad request. calendarId was missing in the body</h1>", "text/html")
    if (!bookings) return responseTemplate(400, "<h1>Bad request. bookings array was missing in the body</h1>", "text/html")

    const getParams = {
      TableName,
      Key: {
        pubKey,
        calendarId,
      }
    }
    const getResponse = await client.get(getParams).promise();

    if(!getResponse.Item){
      return responseTemplate(400, "<h1>Bad request. A calendar with provided pubKey does not exist!</h1>", "text/html")
    }

    const params = {
      Item: {
        pubKey,
        calendarId,
        bookings: [...getResponse.Item.bookings, ...bookings]
      },
      TableName,
    }

    await client.put(params).promise();

    const response = {...getResponse.Item, bookings: [...getResponse.Item.bookings, ...bookings]}

    return responseTemplate(200, response)
  } else {
    return responseTemplate(400, "<h1>Bad request. A JSON body is required</h1>", "text/html")
  }
}


// const test = async () => {
//   const TableName = 'SkjlMePubs';
//   const pubKey = '12345';
//   const calendarId = '9f4910e9-79f3-4555-8a54-00c0540f6908';
//   const getParams = {
//     TableName,
//     Key: {
//       pubKey,
//       calendarId,
//     }
//   }
//   const getResponse = await client.get(getParams).promise();
//
//   console.log('getResponse', getResponse);
// }
// test();