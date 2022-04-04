const graphql = require("graphql");
const userController = require("../controllers/userController");
const Types = require("./types");
const bcrypt = require("bcrypt");
const branchModel = require("../models/branchModel");

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const Mutations = new GraphQLObjectType({
  name: "Mutations", // This name appear in Graphiql documentation
  fields: {
    signup: {
      type: Types.USER_TYPE,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        dob: { type: GraphQLString },
        gender: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        zipCode: { type: GraphQLString },
      },
      resolve: async (_, args, request) => {
        try {
          const { isUserExist } = await userController.isUserExist(args);
          // Throw an error if user is already exist
          if (isUserExist) {
            throw "User already exist";
          }
          const newUser = await userController.signup(args);
          return newUser;
        } catch (err) {
          throw new Error(err);
        }
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
    createBlog: {
      type: Types.BLOG_TYPE,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, request) => {
        try {
          const user = userController.verifyJWT(request.headers);
          const newBlog = await userController.createBlog(user, args);
          return newBlog;
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    editUser: {
      type: Types.USER_TYPE,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        email: { type: GraphQLString },
        dob: { type: GraphQLString },
        gender: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        zipCode: { type: GraphQLString },
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
    editBlog: {
      type: Types.BLOG_TYPE,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        try {
          userController.verifyJWT(request.headers);
          const updatedUser = await userController.editBlog(args);
          return updatedUser;
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  },
});

module.exports = Mutations;
