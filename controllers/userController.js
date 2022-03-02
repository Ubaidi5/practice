const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userController = {
  isUserExist: async (args) => {
    try {
      const [user] = await userModel.find({ email: args.email });
      if (user) {
        return { isUserExist: true, user };
      } else {
        return { isUserExist: false };
      }
    } catch (err) {
      return err;
    }
  },
  signupUser: async (args) => {
    try {
      const hashedPassword = await bcrypt.hash(args.password, 10); // for now having low level security
      args.password = hashedPassword;

      const user = new userModel(args); // New User Created

      const newToken = JWT.sign(
        { id: user._id, email: user.email },
        process.env.token_secret
      );
      const jwtToken = {
        token: newToken,
        createdAt: new Date(),
      };

      user.jwtToken = jwtToken;
      user.loggedDevices.push({ jwtToken });

      await user.save();
      return user;
    } catch (err) {
      return err;
    }
  },
  loginAdmin: async (userData) => {
    try {
      const newToken = JWT.sign(
        { id: userData._id, email: userData.email, roleId: userData.userRole },
        "process.env.jwt_token"
      );
      const jwtToken = {
        token: newToken,
        createdAt: new Date(),
      };

      const user = await userModel.findOneAndUpdate(
        { _id: userData._id },
        { $set: { jwtToken }, $push: { loggedDevices: { jwtToken } } }
      );
      return user;
    } catch (err) {
      return err;
    }
  },
};

module.exports = userController;
