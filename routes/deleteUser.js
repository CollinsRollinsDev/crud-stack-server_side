"use strict";
const express = require("express");
let router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const hash = bcrypt.hash;
const compare = bcrypt.compare;
const { sign } = require("jsonwebtoken");
const cookie = require("cookie");

router.delete("/", async (req, res) => {
  const {id} = req.body;
  // find unique user by email
  const user = await User.findOne({
    _id:id,
  });

  if(!user){
    return res.status(401).json({
      success: false,
      message: `We could not find anyone with this credentials`,
    });
  }

  // compare(req.body.password, user.password, async function (err, result) {
    // if (!err && result) {
      try {
        const deleted = user.delete();
        if(deleted){
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("authplay_auth", "", {
              maxAge: -1,
              path: "/",
            })
          );
                return res.status(200).json({
                  success: true,
                  message: "User deleted successfully!!!",
                });
        }
      } catch (error) {
          return res.status(500).json({
        success: false,
        message: `Sorry, something went wrong.`,
      });
      }

})

module.exports = router;