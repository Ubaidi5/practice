const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const cors = require("cors");
require("dotenv").config();

mongoose
  .connect(process.env.local_db_connection_string, {
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
