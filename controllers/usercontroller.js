const { UniqueConstraintError } = require("sequelize/lib/errors");
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
    
  let { username, password } = req.body.user;
  try {
    const userInfo = await User.create({
      username: username,
      password: password,
    });
    res.status(201).json({
      message: "the user object is saved",
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

module.exports = router;
