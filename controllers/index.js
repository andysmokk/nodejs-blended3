const getAllBooks = require("./books/getAllBooks");
const getBook = require("./books/getBook");
const addBook = require("./books/addBook");
const updateBook = require("./books/updateBook");
const removeBook = require("./books/removeBook");
const authController = require("./AuthController");

module.exports = {
  getAllBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
  authController,
};
