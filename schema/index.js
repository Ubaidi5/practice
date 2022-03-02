const { GraphQLSchema } = require("graphql");
const Mutations = require("./mutations");
const RootQuery = require("./queries");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
