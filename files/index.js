const axios = require("axios");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

let myVar;

async function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
async function getFromCache(id) {

  let results = await checkDynamo(id);
  console.log("RESULTS2: " + JSON.stringify(results));
  if (await isEmptyObject(results)) {
    myVar = await getvalue(id);
    await insertToDynamo(myVar);
    console.log("NO CACHE, NO DYNAMO");
    console.log(`here you go: ${JSON.stringify(myVar)}`);
  } else {
    myVar = results;
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
    let item = await dynamoDb.get(params).promise()
    console.log(item);
    return item;
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
    console.log(response.data);
    let insertvalue = await insertToDynamo(response.data);
    myVar = { 
      id: response.data.id,
      payload: response.data
    }
    return myVar;
  } catch (error) {
    console.error(error);
  }
}
exports.handler = async (event, context) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("MYVAR: " + JSON.stringify(myVar))
  if (!myVar) {
    console.log("IN MYVAR");
    await getFromCache(event.id);
  } else if (myVar === event.id) {
    console.log("MY VAR VALUE SAME AS ID PASSED IN");
    console.log(`here you go: ${JSON.stringify(myVar.body)}`);
  } else {
    await getFromCache(event.id);
  }
};
