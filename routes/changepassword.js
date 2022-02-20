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

  let {username, oldPassword, password} = req.body;
  // console.log(oldPassword)

  // find unique user by email
  const user = await User.findOne({
    username,
  });

  if(!user){
    return res.status(401).json({
      success: false,
      message: `We could not find anyone with this credentials`,
    });
  }
  

  compare(oldPassword, user.password, async function (err, result) {
    if (!err && result) {

      compare(password, user.password, async function (err, result) {
        if (!err && result) {
          return res.status(401).json({
            success: false,
            message: `Please use a different password than your previous one.`,
          });
        } else{
          hash(req.body.password, 12, async function (err, hash) {
            // Store hash in your password DB.
            password = await hash;
            user.password = await password;
            const update = user.save()
            //  save user to database
            return res.status(201).json({
              success: true,
              message: "Password changed successfully!!!",
            });
          });
        }
      })
      
    } else {
      return res.status(401).json({
        success: false,
        message: `Sorry, something went wrong. Consider checking your password.`,
      });
    }
  });



})

module.exports = router;