const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userController = {
  signupUser: (args) => {
    return new Promise(async (resolve, reject) => {
      // Step 0 - check if user already exist
      // Step 1 - Hash password
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
      user.loggedDevices.push(jwtToken);

      await user.save();
      resolve(user);
    });
  },
  isUserExist: (args) => {
    return new Promise(async (resolve) => {
      const [user] = await userModel.find({ email: args.email });
      if (user) {
        resolve({ isUserExist: true, user: user });
      } else {
        resolve({ isUserExist: false });
      }
    });
  },
  loginAdmin: (userData) => {
    return new Promise(async (resolve, reject) => {
      //-------------------------------------------------------------------------------------//
      //                                     Issue Token                                     //
      //-------------------------------------------------------------------------------------//
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

      resolve(user);
    });
  },
};

module.exports = userController;
