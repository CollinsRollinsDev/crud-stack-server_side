const express = require("express");
let router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  return res.json({
    message: "all fine and good. Server ready for search",
  });
});

router.post("/", async (req, res) => {
  const fullName = await username.trim();
  let search = await User.find({
    username: { $regex: new RegExp("^" + username + ".*", "i") },
  }).exec();
  // limit search results
  search = search.slice(0, 10);
  return res.status(200).json({
    status: "found",
    result: search,
  });
});

module.exports = router;
