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
    sendEmail: {
      type: Types.USER_TYPE,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const templateData = {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phoneNumber: args.phoneNumber,
          password: "args.password",
        };

        emailHelper.emailDocument(
          "ubaid.uok@gmail.com",
          "xpgyzq7c8",
          "ubaid@yopmail.com",
          "Request for reset password",
          "views/emailTemplates/signup_without_password_template.html",
          "Request for reset password",
          templateData,
          function (isError, data) {
            // console.log("Error Occured", isError);
            // console.log("Response of email", data);
          }
        );
        const user = await userModel.findOne({ email: args.email });
        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      },
    },
    getAllMembers: {
      type: new GraphQLList(Types.MEMBER_TYPE),
      args: {},
      resolve: async () => {
        try {
          const allMembers = await userController.getAllMembers();
          return allMembers;
        } catch (err) {
          return err;
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
