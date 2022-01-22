const { model, Schema } = require("mongoose");

const userSchema = Schema(
  {
    firstName: {
      type: String,
      default: "Jon",
    },
    lastName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("user", userSchema);
