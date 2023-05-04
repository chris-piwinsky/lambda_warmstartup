const axios = require("axios");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

let local_cache;

async function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

async function getFromCache(id) {
  let results = await checkDynamo(id);
  console.log("CHECK DYNAMO RESULTS: " + JSON.stringify(results));
  if (await isEmptyObject(results)) {
    local_cache = await getvalue(id);
    await insertToDynamo(local_cache);
    console.log("NO CACHE, NO DYNAMO");
    console.log(`here you go: ${JSON.stringify(local_cache)}`);
  } else {
    local_cache = results;
    console.log("NO CACHE, IN DYNAMO");
    console.log(`here you go: ${JSON.stringify(results)}`);
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
    return await dynamoDb.get(params).promise();
  } catch (error) {
    console.error(error);
  }
}

async function insertToDynamo(payload) {
  try {
    const params = {
      TableName: "cache-table",
      Item: {
        id: payload.id,
        payload: payload,
      },
    };
    // write the record to DynamoDB
    return await dynamoDb.put(params).promise();
  } catch (error) {
    console.error(error);
  }
}

async function getvalue(id) {
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    //console.log(response.data);
    let insertvalue = await insertToDynamo(response.data);
    local_cache = {
      id: response.data.id,
      payload: response.data,
    };
    return local_cache;
  } catch (error) {
    console.error(error);
  }
}
exports.handler = async (event, context) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("local_cache: " + JSON.stringify(local_cache));
  if (!local_cache) {
    console.log("IN local_cache");
    await getFromCache(event.id);
  } else if (local_cache === event.id) {
    console.log("MY VAR VALUE SAME AS ID PASSED IN");
    console.log(`here you go: ${JSON.stringify(local_cache.body)}`);
  } else {
    await getFromCache(event.id);
  }
};
