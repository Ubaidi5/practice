const Books = require("../models/bookSchama");

const booksController = {
  addBook: (args) => {
    console.log("Arguments: ", args);
    return new Promise(async (resolve, reject) => {
      const book = new Books(args);
      book.save();
      resolve(book);
    });
  },
};

module.exports = booksController;
