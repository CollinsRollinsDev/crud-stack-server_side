
const express = require("express");
let router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const hash = bcrypt.hash;
const compare = bcrypt.compare;
const { sign } = require("jsonwebtoken");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
let app = express();
app.use(cookieParser());
let proceed;

router.post("/", async (req, res) => {
  const method = req.method;
  const { emailAddress, username } = req.body;
  const { queryP } = req.query;

  // based on outcome, query db vis email or username
  let user;
  if (queryP === "email") {
    user = await User.findOne({
      emailAddress,
    });
  } else {
    user = await User.findOne({
      username: emailAddress,
    });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: `We could not find anyone with this credentials`,
    });
  }

  if (user) {
    //   Check if emailAddress matches emailAddress on the database
    if (queryP === "email") {
      (await user.emailAddress) === emailAddress
        ? (proceed = true)
        : (proceed = false);
    } else {
      (await user.username) === emailAddress
        ? (proceed = true)
        : (proceed = false);
    }
    if (proceed) {
      // Check if password matches password on the database using bcrypt and log user in.
      compare(req.body.password, user.password, async function (err, result) {
        if (!err && result) {
          const userData = {
            id: user.id,
            emailAddress: user.emailAddress.toLowerCase(),
            username: user.username.toLowerCase(),
            // createdAt: user.createdAt,
          };

          let token = sign(userData, process.env.JWT_SIGN_KEY, {
            expiresIn: "1h",
          });
         const setMyCookie = await res.setHeader(
            "Set-Cookie",
            cookie.serialize("authplay_auth", token, {
              httpOnly: false,
              // not a very serious app to set secure=true to only production
              secure: process.env.NODE_ENV === "development",
              sameSite: "none",
              maxAge: 2600,
              path: "/",
            })
          );
          if(setMyCookie){
            return res.status(200).json({
              success: true,
              message: "Welcome to Auth Play",
            });
          }
       
        } else {
          return res.status(401).json({
            success: false,
            message: `Sorry, something went wrong. Consider checking your password.`,
          });
        }
      });
    }
  }
});

module.exports = router;
