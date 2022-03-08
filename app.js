const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const cors = require("cors");
require("dotenv").config();

// mongodb+srv://mongodb-university:p3lvckgr@sandbox.ajavt.mongodb.net/graphql-playlist
mongoose
  .connect(`mongodb://localhost:27017/mis`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((args) => {
    console.log("Database Connection Successful!");
  })
  .catch((err) => {
    console.log("Database Connection Failed\n", err);
  });

const app = express();
app.use(cors());
app.use("/api/graphql", graphqlHTTP({ schema, graphiql: true }));

app.listen(process.env.port, () => {
  console.log("Server started on port 3000");
});

const nodemailer = require("nodemailer");
