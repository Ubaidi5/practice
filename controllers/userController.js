const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");

const userController = {
  signupUser: (args) => {
    return new Promise(async (resolve, reject) => {
      const user = new userModel(args);
      await user.save();
      resolve(user);
    });
  },
  isUserExist: (args) => {
    return new Promise(async (resolve, reject) => {
      const user = await userModel.find({ email: args.email });
      if (user.length > 0) {
        resolve({ isUserExist: true });
      } else {
        resolve({ isUserExist: false });
      }
    });
  },
  issueToken: (userData) => {
    return new Promise((resolve, reject) => {
      const newToken = JWT.sign(
        { id: userData._id, email: userData.email, roleId: userData.userRole },
        "process.env.jwt_token"
      );

      const jwtToken = {
        token: newToken,
        createdAt: new Date(),
      };

      const user = userModel.updateOne(
        { email: userData.email },
        { $set: { jwtToken } },
        { new: true }
      );
      resolve(user);
    });
  },
};

module.exports = userController;
