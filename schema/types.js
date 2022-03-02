const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} = graphql;

/**
 * Auhtor Type
 */
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parents) => {
        const { id } = parents;
        return Books.find({ authorId: id });
      },
    },
  }),
});

/**
 * Book Type
 */
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    author: {
      type: AuthorType,
      resolve: (parents) => {
        const { authorId: id } = parents;
        return Authors.findById(id);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    branchIds: { type: new GraphQLList(GraphQLString) },
    status: { type: GraphQLString },
    userRole: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    address: { type: GraphQLString },
    country: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLString },
    timeZone: { type: GraphQLString },
  }),
});

module.exports = { AuthorType, BookType, UserType };
