"use strict";
const express = require("express");
let router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const hash = bcrypt.hash;
const compare = bcrypt.compare;
const { sign } = require("jsonwebtoken");
const cookie = require("cookie");

router.patch("/", async (req, res) => {
  const { emailAddress, username, password, id } = req.body;
  // find unique user by email
  const user = await User.findOne({
    _id: id,
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: `We could not find anyone with this credentials`,
    });
  }

  if (emailAddress == user.emailAddress && username == user.username) {
    return res.status(401).json({
      success: false,
      message: `Sorry, you should change some details to update your profile.`,
    });
  }

  compare(req.body.password, user.password, async function (err, result) {
    if (!err && result) {
      if (username) {
        user.username = username;
      }
      if (emailAddress) {
        user.emailAddress = emailAddress;
      }

      const updated = await user.save();

      const userData = {
        id: user.id,
        emailAddress: user.emailAddress.toLowerCase(),
        username: user.username.toLowerCase(),
        createdAt: user.createdAt,
      };

      let token = sign(userData, process.env.JWT_SIGN_KEY, {
        expiresIn: "2h",
      });
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("authPlay", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 7200,
          path: "/",
        })
      );

      return res.status(200).json({
        success: true,
        message: "User updated successfully!!!",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Sorry, something went wrong. Consider checking your password.`,
      });
    }
  });
});

module.exports = router;
