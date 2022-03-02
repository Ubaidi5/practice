const graphql = require("graphql");
const userController = require("../controllers/userController");
const Types = require("./types");

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
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const { isUserExist, user } = await userController.isUserExist(args); // Check if user exist

          if (isUserExist) {
            const updatedUser = await userController.loginAdmin(user);
            resolve(updatedUser);
          } else {
            reject("Email or password is incorrect");
          }
        });
      },
    },
  },
});

module.exports = Mutations;
