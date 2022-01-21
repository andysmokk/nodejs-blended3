const express = require("express");
const dotenv = require("dotenv");
const { colors } = require("./helpers");
const connectDB = require("./config/db");

// load config variables
dotenv.config({ path: "./config/.env" });

const app = express();

// body parser
app.use(express.json());

const { PORT } = process.env;

// routes
const books = require("./routes/booksRouts");
app.use("/api/v1/books", books);

// page not found
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// connect db
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`.green.italic);
});

process.on("unhandledRejection", (error, _) => {
  if (error) {
    console.log(`error: ${error.message}`.red);
    server.close(() => process.exit(1));
  }
});
