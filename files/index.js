const axios = require("axios");

let myVar;

function getRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

console.log(getRandomNumber());

async function getvalue() {
  try {
    let number = getRandomNumber();
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/todos/${number}`
    );
    console.log(response.data);

    myVar = {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
    return myVar;
  } catch (error) {
    console.error(error);
    myVar = {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred" }),
    };
    return myVar;
  }
}
exports.handler = async (event, context) => {
  if (!myVar) {
    console.log("IN MYVAR");
    myVar = await getvalue();
  }
  console.log(`here you go: ${myVar.body}`);
};
