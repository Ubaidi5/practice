const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, require: true, trim: true },
    phoneNumber: { type: String, require: true },
    password: { type: String, trim: true, default: "" },
    isPasswordRequest: { type: Boolean, default: true },
    code: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: new Date(), required: true },
    branchIds: { type: Array, default: [] },
    jwtToken: {
      token: { type: String, default: "" },
      createdAt: { type: Date, default: new Date() },
    },
    loggedDevices: [
      {
        createdAt: { type: Date, default: new Date() },
        // deviceId: { type: String, required: true },
        isUser: { type: Boolean, default: true },
        notificationToken: { type: String },
        jwtToken: {
          token: { type: String, default: "" },
          createdAt: { type: Date, default: new Date() },
        },
      },
    ],
    isRegistered: { type: Boolean, default: false },
    status: { type: Number, default: 1 }, // 1=active, 2=inactive
    userRole: { type: Number, default: 1 }, // 1=admin, 3=sub-admin
    lastLogin: { type: Date, default: "" },
    phoneNo: { type: String, default: "" },
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

module.exports = mongoose.model("User", userSchema);
