const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    fullName: { type: String, default: "", require: true },
    firstName: { type: String, default: "", require: true },
    lastName: { type: String, default: "" },
    email: { type: String, require: true, trim: true },
    phoneNumber: { type: String },
    password: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: Date, default: "" },
    pictureURL: { type: String, default: "" },
    userRole: { type: Number, default: 1 }, // 1=admin, 2=sub-admin, 3=members
    code: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString(), required: true },
    branchIds: { type: [String] },
    lastLogin: {
      createdAt: { type: Date },
      branchId: { type: String },
    },
    logHistory: [
      {
        createdAt: { type: Date, default: new Date().toISOString() },
        branchId: { type: String },
      },
    ],
    isRegistered: { type: Boolean, default: false },
    status: { type: String, default: 1 }, // 1=active, 2=inactive, 0=deleted
    address: { type: String, default: "" },
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    timeZone: { type: String, default: "" },
  },
  { versionKey: false },
  { autoIndex: false },
  { collection: "users" }
);

module.exports = mongoose.model("User", userModel);
