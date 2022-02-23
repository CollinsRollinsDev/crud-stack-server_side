const express = require("express");
const index = express();
const mongoose = require("mongoose");
index.use(express.urlencoded({ extended: true }));
const dotenv = require("dotenv").config();
index.use(express.json());

const uri = process.env.MONGODB_CONNECTION_URI;
const cors = require("cors");
let corsOptions = {
  origin: ["https://crud-stack.vercel.app", "http://localhost:3000", "http://127.0.0.1:5500", "https://quizzical-edison-8668a9.netlify.app", "https://crudstack-client-side.vercel.app", "https://stupefied-engelbart-d5d211.netlify.app", "http://localhost:3001", "https://frontend-crud.netlify.app", "https://keen-tereshkova-d56b5b.netlify.app"],
  credentials: true,
};
index.use(cors(corsOptions));

// routes imports
const signup = require("./routes/signup");
const login = require("./routes/login");
const deleteUser = require("./routes/deleteUser");
const searchUsers = require("./routes/searchUsers");
const updateuser = require("./routes/updateuser");
const changepassword = require("./routes/changepassword");
const logout = require("./routes/logout");

// using imported routes
index.use("/signup", signup);
index.use("/login", login);
index.use("/searchUsers", searchUsers);
index.use("/deleteUser", deleteUser);
index.use("/updateuser", updateuser);
index.use("/changepassword", changepassword);
index.use("/logout", logout);

// Connecting MongoDb Atlas to Application
mongoose.connect(uri);

const connection = mongoose.connection;

try {
  console.log("trying to connect");
  connection.on("error", console.error.bind(console, "connection error:"));
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully....");
  });
} catch (error) {
  console.log("Something went wrong");
}

//  Assigning Port
const PORT = process.env.PORT || 8088;

// Routes
index.get("/", async (req, res) => {
  res.send("Hello, all fine and good!");
});

//   index Listening to Port Requests
index.listen(PORT, () => {
  console.log(`index is running on Port: ${PORT}`);
});
