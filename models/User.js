const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a first name"],
      unique: [true, "Sorry, this username already exist."],
    },
    emailAddress: {
      type: String,
      required: [true, "Please provide a last name"],
      unique: [true, "Sorry, this username already exist."],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
