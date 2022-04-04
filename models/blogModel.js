const mongoose = require("mongoose");

const blogModel = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    authorId: { type: String },
    createdAt: { type: Date, default: new Date() },
  },
  { versionKey: false },
  { autoIndex: false },
  { collection: "blogs" }
);

module.exports = mongoose.model("Blogs", blogModel);
