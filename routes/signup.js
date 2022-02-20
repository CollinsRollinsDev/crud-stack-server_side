"use strict";
"use strict";
const express = require("express")
let router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const hash = bcrypt.hash;
const compare = bcrypt.compare

router.post("/", async (req, res) => {
  // get all user data sent from client
  const {username, emailAddress, password} = req.body;

  if(!username || !emailAddress || !password){
    return res.status(401).json({
      stats: 'failed',
      reason:"One or more input seems left out"
    })
  }

  // check is user already exist with the credentials provided
 try {
  const user = await User.findOne({
    emailAddress,
    username
  });
  if(user){
    return res.status(401).json({
      stats: 'failed',
      reason:"You already have an account created here."
    })
  }
  // if all validation is done and passed, create user account.
  hash(req.body.password, 10, async function (err, hash) {
    // Store hash in your password DB.
    // Convert incoming password to hashed password
    req.body.password = hash;
    //  save user to database
    const user = await User.create(req.body);
    return res.status(201).json({
      stats: "success",
      reason: "User created successfully! You can now login.",
    });
  });
 } catch (error) {
  return res.status(501).json({
    stats: 'failed',
    reason:"An unidentified error occured!!"
  })
 }

});

module.exports = router

// vercel env add variableName
// vercel --prod