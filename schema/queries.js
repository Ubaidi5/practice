const graphql = require("graphql");
const userModel = require("../models/userModel");
const emailHelper = require("../helpers/email_helper");
const userController = require("../controllers/userController");
const JWT = require("jsonwebtoken");

const Types = require("./types");

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLFloat, GraphQLID, GraphQLInt } =
  graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllMembers: {
      type: new GraphQLList(Types.MEMBER_TYPE),
      args: {},
      resolve: async (parent, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const allMembers = await userController.getAllMembers();
          return allMembers;
        } catch (err) {
          throw err;
        }
      },
    },
    getAllBranches: {
      type: new GraphQLList(Types.BRANCH_TYPE),
      args: {},
      resolve: async (parent, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const allBranches = await userController.getAllBranches();
          return allBranches;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});

module.exports = RootQuery;
