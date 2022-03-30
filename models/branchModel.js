const mongoose = require("mongoose");

const branchModel = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    location: { type: String, default: "" },
    createdAt: { type: Date, default: new Date() },
    subAdminIds: { type: [String] },
    memberIds: { type: [String] },
  },
  { versionKey: false },
  { autoIndex: false },
  { collection: "branches" }
);

module.exports = mongoose.model("Branch", branchModel);
