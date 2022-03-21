const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, require: true, trim: true },
    phoneNumber: { type: String, require: true },
    password: { type: String, trim: true, default: "" },
    userRole: { type: Number, default: 1 }, // 1=admin, 2=sub-admin, 3=members
    code: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString(), required: true },
    branchId: { type: [String] },
    lastLogin: { type: Date },
    logHistory: [
      {
        createdAt: { type: Date, default: new Date().toISOString() },
        branchId: { type: String },
      },
    ],
    isRegistered: { type: Boolean, default: false },
    status: { type: String, default: 1 }, // 1=active, 2=inactive
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
