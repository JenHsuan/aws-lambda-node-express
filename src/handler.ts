const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", (req: any, res: any, next: any) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req: any, res: any, next: any) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req: any, res: any, next: any) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

console.log("application starts!")

exports.handler = serverless(app);
