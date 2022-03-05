const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const branchModel = require("../models/branchModel");
const userModel = require("../models/userModel");

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
    token: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
  }),
});

const BRANCH_TYPE = new GraphQLObjectType({
  name: "banch",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
    user: {
      type: USER_TYPE,
      resolve: () => {
        return new Promise(async (resolve) => {
          console.log("Parents", parents);
          const users = await userModel.find();
          console.log(users);
          resolve(users);
        });
      },
    },
  }),
});

const USER_TYPE = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
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
    branches: { type: BRANCH_TYPE },
  }),
});

const MEMBER_TYPE = new GraphQLObjectType({
  name: "Member",
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    branchId: { type: GraphQLString },
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
    branch: {
      type: BRANCH_TYPE,
      resolve: (parents) => {
        return new Promise(async (resolve) => {
          const branch = await branchModel.findOne({ _id: parents.branchId });
          resolve(branch);
        });
      },
    },
  }),
});

module.exports = { USER_TYPE, BRANCH_TYPE, MEMBER_TYPE };
