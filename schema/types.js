const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const JWT_TOKEN_TYPE = new GraphQLObjectType({
  name: "jwtToken",
  fields: () => ({
    token: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
  }),
});

const BLOG_TYPE = new GraphQLObjectType({
  name: "Blog",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    authors: {
      type: USER_TYPE,
      resolve: async (parent) => {
        try {
          const [users] = await userModel.find({ _id: parent.authorId });
          return users;
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});

const USER_TYPE = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
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
    userRole: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    jwtToken: { type: JWT_TOKEN_TYPE },
    timeZone: { type: GraphQLString },
    blog: {
      type: BLOG_TYPE,
      resolve: async (parent) => {
        try {
          const [branch] = await blogModel.find({ authorId: parent._id });
          return branch;
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});

module.exports = { USER_TYPE, BLOG_TYPE };
