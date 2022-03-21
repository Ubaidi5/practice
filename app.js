const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const cors = require("cors");
require("dotenv").config();
const db_connection_string = `mongodb://admin:dbc7a8832c7447118e25d0ee49ecd168@localhost:27017/mis?authSource=admin`;
// mongodb+srv://mongodb-university:p3lvckgr@sandbox.ajavt.mongodb.net/graphql-playlist
mongoose
  .connect(db_connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
  console.log(`Server started on port ${process.env.port}`);
});

const nodemailer = require("nodemailer");
