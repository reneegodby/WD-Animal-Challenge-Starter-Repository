const { UniqueConstraintError } = require("sequelize/lib/errors");
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  //Bronze challenge

  let { username, password } = req.body.user;
  try {
    const userInfo = await User.create({
      //line 4
      username,
      password,
    });
    res.status(201).json({
      message: "User successfully registered",
      user: userInfo,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Username already in use",
      });
    } else {
      res.status(500).json({
        message: "Failed to register user",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    const loginUser = await User.findOne({
      where: {
        username: username,
      },
    });
    if(loginUser) {
      res.status(200).json({
      user: loginUser,
      message: "User successfully logged in!",
      
    });
  } else{
    res.status(401).json({
      message: "Incorrect email or password"
    })
  }
} catch (error) {
    res.status(500).json({
      message: "failed to log user in",
    })
  }
});

module.exports = router;
