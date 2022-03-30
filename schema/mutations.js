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
  GraphQLNonNull,
} = graphql;

const Mutations = new GraphQLObjectType({
  name: "Mutations", // This name appear in Graphiql documentation
  fields: {
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
          } else {
            throw "User does not exist";
          }
        } catch (err) {
          throw new Error(err);
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
      resolve: async (parent, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const branch = new branchModel(args);
          await branch.save();
          return branch;
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    createNewMember: {
      type: Types.MEMBER_TYPE,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        dob: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        zipCode: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        startDate: { type: new GraphQLNonNull(GraphQLString) },
        branchId: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (_, args, request) => {
        try {
          userController.verifyJWT(request.headers);
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
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        dob: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        zipCode: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        branchIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
      },
      resolve: async (_, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const { isUserExist } = await userController.isUserExist(args);
          // Throw an error if user is already exist
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
    editMember: {
      type: Types.MEMBER_TYPE,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
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
        branchId: { type: new GraphQLList(GraphQLString) },
        status: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const updatedUser = await userController.editUser(args);
          return updatedUser;
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  },
});

module.exports = Mutations;
