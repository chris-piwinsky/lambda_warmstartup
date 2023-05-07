const axios = require("axios");
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getTTL() {
  //calculate ttl time
  //set ttl to 1 day from record insert.
  let ttl = Math.floor(Date.now() / 1000 + 86400);
  return ttl;
}

async function getvalue(local_cache, id) {
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    //console.log(response.data);
    await insertToDynamo(response.data);
    local_cache = {
      id: response.data.id,
      payload: response.data,
      ttl: response.data.ttl,
    };
    return local_cache;
  } catch (error) {
    console.error(error);
  }
}

async function insertToDynamo(payload) {
  try {
    let ttl = await getTTL();
    const params = {
      TableName: "cache-table",
      Item: {
        id: payload.id,
        ttl: ttl,
        payload: payload.payload,
      },
    };
    // write the record to DynamoDB
    return await dynamoDb.put(params).promise();
  } catch (error) {
    console.error(error);
  }
}

async function checkDynamo(id) {
  try {
    const params = {
      TableName: "cache-table",
      Key: {
        id: id,
      },
    };
    let dynamo_value = await dynamoDb.get(params).promise();
    return await dynamo_value.Item;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getvalue,
  insertToDynamo,
  checkDynamo,
};
