const graphql = require("graphql");
const userModel = require("../models/userModel");

const Types = require("./types");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: Types.USER_TYPE,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => {
        const { id } = args;
        return userModel.findById(id);
      },
    },
  },
});

module.exports = RootQuery;
