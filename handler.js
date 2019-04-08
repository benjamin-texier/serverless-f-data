const uuid = require('uuid')
const AWS = require('aws-sdk');

let dynamoDb = new AWS.DynamoDB.DocumentClient({
  'region': '{{ region }}'
});

module.exports.write = (event, context, callback) => {
  const data = JSON.parse(event.body)
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.text
    }
  }
  dynamoDb.put(params, (error) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create item.'
      })
      return
    }
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}

module.exports.read = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  }
  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch item.'
      })
      return
    }
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.Items)
    }
    callback(null, response)
  })
}