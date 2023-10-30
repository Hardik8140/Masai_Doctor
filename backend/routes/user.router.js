const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// User Signup

userRouter.post("/signup", async (req, res) => {
  const { email, password, confirm_password } = req.body;

  try {
    if (password === confirm_password) {
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({ email, password: hash });
        await user.save();
        res.status(200).json({ msg: "New User Added Successful!!" });
      });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// User Login

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user._id }, process.env.secretKey, {
            expiresIn: "1d",
          });
          const refToken = jwt.sign(
            { userID: user._id },
            process.env.secretKey,
            {
              expiresIn: "2d",
            }
          );
          res.status(200).json({
            msg: "Login Successful",
            token: token,
            refToken: refToken,
          });
        } else {
          res.status(401).json({ err: "Invalid Credentials" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

module.exports = { userRouter };
