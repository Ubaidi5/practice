const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userController = {
  isUserExist: async (args) => {
    try {
      const [user] = await userModel.find({
        email: args.email.replaceAll(" ", "").toLowerCase(),
      });
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
      args.email = args.email.replaceAll(" ", "").toLowerCase();

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
  forgotPassword: async (userData) => {
    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userData._id },
        { $set: { code: 12345 } }
      );

      return user;
    } catch (err) {
      return err;
    }
  },
  resetPassword: async (userData, newPassword) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10); // for now having low level security

      const user = await userModel.findOneAndUpdate(
        { _id: userData._id },
        {
          $set: { password: hashedPassword, code: "" },
        }
      );

      return user;
    } catch (err) {
      return err;
    }
  },
  createNewMember: async (args) => {
    try {
      args.email = args.email.replaceAll(" ", "").toLowerCase();

      const newMember = new userModel({ ...args, userRole: 3 }); // New User Created
      // A logged device will create to contains all check-ins of a user
      // JWT is not required for member so there is no need to create one
      // user.loggedDevices.push({ createdAt: new Date() });

      await newMember.save();
      return newMember;
    } catch (err) {
      return err;
    }
  },
};

module.exports = userController;
