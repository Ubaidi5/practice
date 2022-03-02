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
        { $set: { jwtToken }, $push: { loggedDevices: jwtToken } }
      );

      resolve(user);
    });
  },
};

module.exports = userController;

// Steps for signup used by Hassaan ---> Inser tUser, Issue Token,
