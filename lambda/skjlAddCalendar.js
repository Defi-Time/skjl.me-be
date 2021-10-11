const {isJson} = require("./util/isJson");
const AWS = require("aws-sdk");
const {responseTemplate} = require("./util/responseTemplate");

const client = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});





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

    const params = {
      Item: {
        pubKey,
        calendarId,
        bookings: [...getResponse.Item.bookings, ...bookings]
      },
      TableName,
    }

    const putResponse = await client.put(params).promise();

    return responseTemplate(200, {msg: "all good!", body, putResponse, getResponse})
  } else {
    return responseTemplate(400, "<h1>Bad request. A JSON body is required</h1>", "text/html")
  }
}