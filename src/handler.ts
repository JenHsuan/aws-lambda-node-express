const serverless = require("serverless-http");
const express = require("express");
const userRoutes = require('./routes/user');
const authenticationRoutes = require('./routes/authentication');
const app = express();

app.use("/user", userRoutes);
app.use("/authentication", authenticationRoutes);

console.log("application starts!")

exports.handler = serverless(app);
