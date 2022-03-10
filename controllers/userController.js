const userModel = require("../models/userModel");
const branchModel = require("../models/branchModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Chance = require("chance");
const emailHelper = require("../helpers/email_helper");

require("dotenv").config();
const chance = new Chance();

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
      throw err;
    }
  },
  verifyJWT: (headers) => {
    try {
      if (headers["authorization"]) {
        const result = JWT.verify(headers["authorization"], "process.env.jwt_token");
        return result;
      } else {
        throw new Error("Not authorized");
      }
    } catch (err) {
      throw err;
    }
  },
  signupUser: async (args) => {
    try {
      const hashedPassword = await bcrypt.hash(args.password, 10); // for now having low level security
      args.password = hashedPassword;
      args.email = args.email.replaceAll(" ", "").toLowerCase();

      const user = new userModel(args); // New User Created

      const newToken = JWT.sign({ id: user._id, email: user.email }, process.env.token_secret);
      const jwtToken = {
        token: newToken,
        createdAt: new Date(),
      };

      user.jwtToken = jwtToken;
      user.loggedDevices.push({ jwtToken });

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  },
  loginAdmin: async (userData) => {
    try {
      const newToken = JWT.sign(
        { id: userData._id, email: userData.email, roleId: userData.userRole },
        "process.env.jwt_token",
        { expiresIn: "1d" }
      );
      const jwtToken = {
        token: newToken,
        createdAt: new Date(),
      };

      const user = await userModel.findOneAndUpdate(
        { _id: userData._id },
        { $set: { jwtToken: jwtToken }, $push: { loggedDevices: { jwtToken } } },
        { new: true }
      );
      return user;
    } catch (err) {
      throw err;
    }
  },
  forgotPassword: async (userData) => {
    try {
      const code = chance.string({ length: 5, alpha: false, numeric: true });

      const templateData = { code };

      emailHelper.emailDocument(
        process.env.send_email, // Sender email address
        process.env.send_email_password, // Sender email password
        userData.email, // Reciver email address
        "Request for reset password", // Email subject
        "views/emailTemplates/password_reset_code_template.html", // Email template
        "REQUEST FOR RESET PASSWORD", // Don't know the use of this
        templateData // Data to use in email template
        // ,function (isError, data) {  // Function that run return error or success
        //   console.log("Error Occured", isError);
        //   console.log("Response of email", data);
        // }
      );
      await userModel.findOneAndUpdate({ _id: userData._id }, { $set: { code } });
      return userData;
      // Still don't know how send email feature is working but its working 😎
    } catch (err) {
      throw err;
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
      throw err;
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
      throw err;
    }
  },
  createSubAdmin: async (args) => {
    try {
      const newPassword = chance.string({
        length: 8,
        casing: "lower",
        alpha: true,
        numeric: true,
        symbols: true,
      });

      const hashedPassword = await bcrypt.hash(newPassword, 10); // for now having low level security

      args.password = hashedPassword;
      args.email = args.email.replaceAll(" ", "").toLowerCase();
      args.userRole = 2; // User role 2 for sub admin

      const newSubAdmin = new userModel(args); // New User Created

      const templateData = {
        firstName: newSubAdmin.firstName,
        lastName: newSubAdmin.lastName,
        email: newSubAdmin.email,
        password: newPassword,
      };

      emailHelper.emailDocument(
        process.env.send_email, // Sender email address
        process.env.send_email_password, // Sender email password
        newSubAdmin.email, // Reciver email address
        "New account created.", // Email subject
        "views/emailTemplates/new_account_created_template.html", // Email template
        "NEW ACCOUNT CREATED", // Don't know the use of this
        templateData // Data to use in email template
        // ,function (isError, data) {  // Function that run return error or success
        //   console.log("Error Occured", isError);
        //   console.log("Response of email", data);
        // }
      );

      const newToken = JWT.sign(
        { id: newSubAdmin._id, email: newSubAdmin.email },
        process.env.token_secret
      );
      const jwtToken = {
        token: newToken,
        createdAt: new Date(),
      };
      newSubAdmin.jwtToken = jwtToken;
      newSubAdmin.loggedDevices.push({ jwtToken });
      // Saving after inserting JWT
      await newSubAdmin.save();

      return newSubAdmin;
    } catch (err) {
      throw err;
    }
  },
  getAllSubAdmins: async () => {
    try {
      const allSubAdmins = await userModel.find({ userRole: 2 });
      return allSubAdmins;
    } catch (err) {
      throw err;
    }
  },
  getAllMembers: async () => {
    try {
      const allMembers = await userModel.find({ userRole: 3 });
      return allMembers;
    } catch (err) {
      throw err;
    }
  },
  getAllBranches: async () => {
    try {
      const allBranches = await branchModel.find();
      return allBranches;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userController;
