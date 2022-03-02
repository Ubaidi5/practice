const graphql = require("graphql");
const Books = require("../models/bookSchama");
const Authors = require("../models/authorSchema");
const booksController = require("../controllers/booksController");
const userController = require("../controllers/userController");
const { AuthorType, BookType, UserType } = require("./types");

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
    addAuthor: {
      type: AuthorType, // This is return type
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { name, age } = args;
        const author = new Authors({ name, age });
        author.save();
        return author;
      },
    },
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        rating: { type: GraphQLInt },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        const response = await booksController.addBook(args);
        console.log("Response: ", response);
        return response;
      },
    },
    signupUser: {
      type: UserType,
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
    issueToken: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          const user = await userController.issueToken(args);
          resolve(user);
        });
      },
    },
  },
});

module.exports = Mutations;
