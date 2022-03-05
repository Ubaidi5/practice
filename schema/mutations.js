const graphql = require("graphql");
const userController = require("../controllers/userController");
const Types = require("./types");
const bcrypt = require("bcrypt");
const branchModel = require("../models/branchModel");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} = graphql;

const Mutations = new GraphQLObjectType({
  name: "Mutations", // This name appear in Graphiql documentation
  fields: {
    signupUser: {
      type: Types.USER_TYPE, // This is return type
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        branchIds: { type: new GraphQLList(GraphQLString) },
        password: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const { isUserExist } = await userController.isUserExist(args);

          if (isUserExist) {
            reject(new Error("User already exixt"));
          } else {
            const response = await userController.signupUser(args);
            resolve(response);
          }
        });
      },
    },
    loginAdmin: {
      type: Types.USER_TYPE,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const { isUserExist, user } = await userController.isUserExist(args); // Check if user exist

          if (isUserExist) {
            const match = await bcrypt.compare(args.password, user.password);
            if (match) {
              const updatedUser = await userController.loginAdmin(user);
              resolve(updatedUser);
            } else {
              reject(new Error("Email or password is incorrect"));
            }
          } else {
            reject(new Error("Email or password is incorrect"));
          }
        });
      },
    },
    forgotPassword: {
      type: Types.USER_TYPE,
      args: {
        email: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const { isUserExist, user } = await userController.isUserExist(args);
          if (isUserExist) {
            const updatedUser = await userController.forgotPassword(user);
            resolve(updatedUser);
          } else {
            reject(
              new Error("Doesn't found any account associated with this email")
            );
          }
        });
      },
    },
    resetPassword: {
      type: Types.USER_TYPE,
      args: {
        email: { type: GraphQLString },
        code: { type: GraphQLString },
        newPassword: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const { isUserExist, user } = await userController.isUserExist(args);

          if (isUserExist && args.code === user.code) {
            const updatedUser = await userController.resetPassword(
              user,
              args.newPassword
            );
            resolve(updatedUser);
          } else {
            reject(new Error("Code is not valid"));
          }
        });
      },
    },
    addNewBranch: {
      type: Types.BRANCH_TYPE,
      args: {
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        subAdminId: { type: GraphQLList(GraphQLString) },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const branch = new branchModel(args);
          console.log("Branch", branch);

          await branch.save();
          resolve(branch);
        });
      },
    },
    createNewMember: {
      type: Types.USER_TYPE,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        dob: { type: GraphQLString },
        gender: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zipCode: { type: GraphQLString },
        street: { type: GraphQLString },
        startDate: { type: GraphQLString },
        branchId: { type: GraphQLString },
      },
      resolve: (parents, args) => {
        return new Promise(async (resolve, reject) => {
          const newMember = await userController.createNewMember(args);
          console.log("New member is created \n", newMember);
          resolve(newMember);
        });
      },
    },
  },
});

module.exports = Mutations;
