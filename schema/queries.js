const graphql = require("graphql");
// const userModel = require("../models/userModel");
// const branchModel = require("../models/branchModel");
const userController = require("../controllers/userController");

const Types = require("./types");

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLFloat, GraphQLID, GraphQLInt } =
  graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAlSubAdmins: {
      type: new GraphQLList(Types.USER_TYPE),
      args: {},
      resolve: async (parent, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const allSubAdmins = await userController.getAllSubAdmins();
          return allSubAdmins;
        } catch (err) {
          throw err;
        }
      },
    },
    getAllMembers: {
      type: new GraphQLList(Types.MEMBER_TYPE),
      args: {},
      resolve: async (parent, args, request) => {
        //  add a condition here to check if the user is admin or not.
        //  If the user is not super admin the throw an unauthorized message
        // Remember only super admin can get all users from this api.
        // All sub-admin gets their their user from their branches
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
