import serverless from "serverless-http";
import app from "./app.js";
import connectDB from "./config/db.js";

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  console.log("✅ DB connected ");
  return serverlessHandler(event, context);
};
