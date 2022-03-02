const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} = graphql;

const JWT_TOKEN_TYPE = new GraphQLObjectType({
  name: "jwtToken",
  fields: () => ({
    token: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLDateTime,
    },
  }),
});

const USER_TYPE = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    branchIds: { type: new GraphQLList(GraphQLString) },
    status: { type: GraphQLString },
    userRole: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    address: { type: GraphQLString },
    country: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLString },
    timeZone: { type: GraphQLString },
    jwtToken: { type: JWT_TOKEN_TYPE },
  }),
});

module.exports = { USER_TYPE };
