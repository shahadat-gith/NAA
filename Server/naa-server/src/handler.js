import serverless from "serverless-http";
import app from "./app.js";
import connectDB from "./config/db.js";

const serverlessHandler = serverless(app, {
  request: (req, event, context) => {
    // optional hook
  },
  response: (response, event, context) => {
    // 🔥 FORCE CORS HEADERS HERE (GLOBAL GUARANTEE)
    response.headers = {
      ...response.headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    };
  }
});

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectDB();
  console.log("✅ DB connected");

  // ✅ Handle OPTIONS at top level (failsafe)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
      },
      body: ""
    };
  }

  return serverlessHandler(event, context);
};