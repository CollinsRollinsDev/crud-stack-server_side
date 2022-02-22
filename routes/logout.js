"use strict";
const express = require("express");
let router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const hash = bcrypt.hash;
const compare = bcrypt.compare;
const { sign } = require("jsonwebtoken");
const cookie = require("cookie");

router.get("/", async (req, res) => {
  try {
    // res.setHeader(
    //   "Set-Cookie",
    //   cookie.serialize("authplay_auth", "", {
    //     maxAge: -1,
    //     path: "/",
    //   })
    // );
    res.clearCookie("authplay_auth");
    return res.status(200).json({
      success: true,
      message: `you are logged out`,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: `Sorry, something went wrong. Try again`,
    });
  }
});

module.exports = router;
