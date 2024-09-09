const serverless = require("serverless-http");
const express = require("express");
const userRoutes = require('./routes/user');
const app = express();

//app.use("/user", userRoutes);

console.log("application starts!")

exports.handler = serverless(app);
