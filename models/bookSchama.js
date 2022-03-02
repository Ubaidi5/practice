const { Schema, model } = require("mongoose");

const BookSchema = new Schema({
  title: String,
  genre: String,
  rating: Number,
  authorId: String,
});

module.exports = model("Books", BookSchema);
