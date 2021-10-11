const AWS = require("aws-sdk");
const {responseTemplate} = require("./util/responseTemplate");

const client = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});





exports.handler = async (event, context) => {
  const TableName = process.env.tableName;

  if (!TableName)
    return responseTemplate(500, "<h1>tableName is missing in the env vars!</h1>", "text/html")

  const qs = event.queryStringParameters;
  console.log('>>> QUERY PARAMS', qs);

  //TODO: GET THE ID FROM query params and use it to query with hash key
  // return all the calendars found


  return responseTemplate(200, {msg: "all good!"})

}