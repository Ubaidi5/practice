const userModel = require("../models/userModel");
const branchModel = require("../models/branchModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Chance = require("chance");
const validations = require("../helpers/schemaValidation");
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
      return err;
    }
  },
  verifyJWT: (headers) => {
    try {
      if (headers["authorization"]) {
        const result = JWT.verify(headers["authorization"], process.env.jwt_token_secret);
        return result;
      } else {
        throw "Not authorized";
      }
    } catch (err) {
      throw err;
    }
  },
  loginAdmin: async (userData) => {
    try {
      const newToken = JWT.sign(
        {
          id: userData._id,
          email: userData.email,
          status: userData.status,
          userRole: userData.userRole,
        },
        process.env.jwt_token_secret,
        { expiresIn: "30d" }
      );

      const jwtToken = {
        token: newToken,
        createdAt: new Date().toISOString(),
      };

      const lastLogin = { createdAt: new Date().toISOString() };

      const user = await userModel.findOneAndUpdate(
        { _id: userData._id },
        { $set: { lastLogin }, $push: { logHistory: { lastLogin } } },
        { new: true }
      );
      return { ...user._doc, jwtToken };
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
  createSubAdmin: async (args) => {
    try {
      await validations.member.validateAsync(args);
      const newPassword = chance.string({
        length: 8,
        casing: "lower",
        alpha: true,
        numeric: true,
        symbols: true,
      });
      // console.log("New Password: ", newPassword);
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

      await userController.assingBranchToSubAadmin(args.branchIds[0], newSubAdmin);
      await newSubAdmin.save();
      return newSubAdmin;
    } catch (err) {
      return err;
    }
  },
  getAllSubAdmins: async () => {
    try {
      const allSubAdmins = await userModel.find({ userRole: 2 }).sort({ _id: -1 });
      return allSubAdmins;
    } catch (err) {
      return err;
    }
  },
  getAllMembers: async () => {
    try {
      const allMembers = await userModel.find({ userRole: 3 }).sort({ _id: -1 });
      return allMembers;
    } catch (err) {
      return err;
    }
  },
  getAllBranches: async () => {
    try {
      const allBranches = await branchModel.find().sort({ location: 1 });
      return allBranches;
    } catch (err) {
      return err;
    }
  },
  changeUserStatus: async (args) => {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: args._id },
        { $set: { status: args.status } },
        { new: true }
      );
      return updatedUser;
    } catch (err) {
      return err;
    }
  },
  editUser: async (userData) => {
    try {
      await validations.member.validateAsync(userData);
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userData._id },
        { $set: { ...userData } },
        { new: true }
      );
      return updatedUser;
    } catch (err) {
      return err;
    }
  },
  assingBranchToSubAadmin: async (branchId, userData) => {
    try {
      const branch = await branchModel.findOneAndUpdate(
        { _id: branchId },
        { $push: { subAdminIds: `${userData._id}` } },
        { new: true }
      );
      if (branch == null) {
        throw new Error("Invalid branch id is provided");
      }
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userController;
