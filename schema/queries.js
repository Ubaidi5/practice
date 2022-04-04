const graphql = require("graphql");
const userController = require("../controllers/userController");
const Types = require("./types");

const { GraphQLObjectType, GraphQLList } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllBlogs: {
      type: new GraphQLList(Types.BLOG_TYPE),
      args: {},
      resolve: async (parent, args, request) => {
        try {
          const userData = userController.verifyJWT(request.headers);
          const allBlogs = await userController.getAllBlogs(userData);
          return allBlogs;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});

module.exports = RootQuery;
