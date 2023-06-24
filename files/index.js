let local_cache;
const check_cache = require("./check_cache");

async function isEmptyValues(value) { 
  return (
    value === undefined ||
    value === null ||
    value === NaN ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length() === 0)
  );
}

async function getFromCache(id) {
  let results = await check_cache.checkDynamo(id);
  console.log("CHECK DYNAMO RESULTS: " + JSON.stringify(results));
  if (await isEmptyValues(results)) {
    local_cache = await check_cache.getvalue(local_cache, id);
    await check_cache.insertToDynamo(local_cache);
    console.log("NO CACHE, NO DYNAMO");
    console.log(`here you go: ${JSON.stringify(local_cache)}`);
  } else {
    local_cache = {
      id: results.id,
      payload: results.payload,
      ttl: results.ttl,
    };
    console.log("NO CACHE, IN DYNAMO");
    console.log(`here you go: ${JSON.stringify(results)}`);
  }
}

exports.handler = async (event, context) => {
  //console.log("Event:", JSON.stringify(event, null, 2));
  //console.log("local_cache: " + JSON.stringify(local_cache));
  if (!local_cache) {
    console.log("IN local_cache");
    await getFromCache(event.id);
  } else if (local_cache.id === event.id && Date.now() / 1000 < local_cache.ttl) {
    console.log("Local cache value SAME AS ID PASSED IN");
  } else {
    console.log("Cache exists but not value passed in")
    await getFromCache(event.id);
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    id: local_cache.id,
    payload: local_cache.payload,
    ttl: local_cache.ttl,
  };
};

