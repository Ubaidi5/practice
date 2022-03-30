const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const branchModel = require("../models/branchModel");
const userModel = require("../models/userModel");

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLFloat, GraphQLID, GraphQLInt } =
  graphql;

const JWT_TOKEN_TYPE = new GraphQLObjectType({
  name: "jwtToken",
  fields: () => ({
    token: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
  }),
});

const BRANCH_TYPE = new GraphQLObjectType({
  name: "Branch",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
    users: {
      type: new GraphQLList(MEMBER_TYPE),
      resolve: async (parent) => {
        try {
          const users = await userModel.find({ _id: { $all: parent.memberIds } });
          return users;
        } catch (err) {
          throw err;
        }
      },
    },
    subAdmins: {
      type: new GraphQLList(USER_TYPE),
      resolve: async (parent) => {
        try {
          const subAdmins = await await userModel.find({ _id: { $all: parent.subAdminIds } });
          return subAdmins;
        } catch (err) {
          return err;
        }
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
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    country: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLString },
    timeZone: { type: GraphQLString },
    jwtToken: { type: JWT_TOKEN_TYPE },
    branch: {
      type: new GraphQLList(BRANCH_TYPE),
      resolve: async (parent) => {
        try {
          // const branch = await branchModel.find({ subAdminIds: { $in: [`${parent._id}`] } });
          console.log("Is ID Valid", mongoose.Types.ObjectId.isValid(parent._id));
          const branch = await branchModel.find({ subAdminIds: `${parent._id}` });
          return branch;
        } catch (err) {
          throw err;
        }
      },
    },
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
    status: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    userRole: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    address: { type: GraphQLString },
    country: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLString },
    timeZone: { type: GraphQLString },
    branch: {
      type: new GraphQLList(BRANCH_TYPE),
      resolve: async (parent) => {
        try {
          //  This works the same as the statement below
          // I am a little confused here because if memberIds is a string it will match as string but if query is array then it will automatically search if array include the query item
          // const branch = await branchModel.find({ memberIds: { $in: [`${parent._id}`] } });
          if (mongoose.Types.ObjectId.isValid(parent._id)) {
            const branch = await branchModel.find({ memberIds: `${parent._id}` });
            return branch;
          }
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});

module.exports = { USER_TYPE, BRANCH_TYPE, MEMBER_TYPE };
