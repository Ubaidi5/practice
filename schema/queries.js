const graphql = require("graphql");
const Books = require("../models/bookSchama");
const Authors = require("../models/authorSchema");
const { AuthorType, BookType } = require("./types");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => {
        const { id } = args;
        return Books.findById(id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => {
        const { id } = args;
        return Authors.findById(id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: () => {
        return Books.find().limit(10);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => {
        return Authors.find();
      },
    },
  },
});

module.exports = RootQuery;
