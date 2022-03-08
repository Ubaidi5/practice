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
    login: {
      type: Types.USER_TYPE,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        try {
          const { isUserExist, user } = await userController.isUserExist(args); // Check if user exist
          if (isUserExist) {
            const match = await bcrypt.compare(args.password, user.password);
            if (match) {
              const updatedUser = await userController.loginAdmin(user);
              return updatedUser;
            } else {
              throw "Email or password is incorrect";
            }
          }
        } catch (err) {
          throw new Error("User does not exist");
        }
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
            reject(new Error("Doesn't found any account associated with this email"));
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
      resolve: async (parent, args) => {
        try {
          const { isUserExist, user } = await userController.isUserExist(args);
          console.log("args.newPassword", args.newPassword, args);
          if (isUserExist && args.code === user.code) {
            const updatedUser = await userController.resetPassword(user, args.newPassword);
            return updatedUser;
          } else {
            throw "Code is not valid";
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    addNewBranch: {
      type: Types.BRANCH_TYPE,
      args: {
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        subAdminIds: { type: GraphQLList(GraphQLString) },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const branch = new branchModel(args);
          // console.log("Branch", branch);

          await branch.save();
          resolve(branch);
        });
      },
    },
    createNewMember: {
      type: Types.MEMBER_TYPE,
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
      resolve: async (_, args) => {
        try {
          const newMember = await userController.createNewMember(args);
          return newMember;
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    createSubAdmin: {
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
        branchId: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const { isUserExist } = await userController.isUserExist(args);

          if (isUserExist) {
            throw "User already exist";
          }

          const newSubAdmin = await userController.createSubAdmin(args);
          return newSubAdmin;
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  },
});

module.exports = Mutations;
