


const responseTemplate =
  (statusCode = 200 , body = {msg: "All good!"}, contentType = "application/json", headers = {}) => ({
    statusCode,
    headers: {"content-type": contentType, ...headers},
    body: typeof(body) === 'string' ?  body : JSON.stringify(body)
  })

module.exports = { responseTemplate }