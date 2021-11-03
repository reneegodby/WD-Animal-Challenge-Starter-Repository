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
      password: bcrypt.hashSync(password, 13),
    });
    let token = jwt.sign({ id: userInfo.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(201).json({
      message: "User successfully created",
      user: userInfo,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Username already in use",
      });
    } else {
      res.status(500).json({
        message: "Failed to create user",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  //Silver Challenge
  let { username, password } = req.body.user;

  try {
    const loginUser = await User.findOne({
      where: {
        username: username,
      },
    });

    //GOLD CHALLENGE
    if (loginUser) {
      let passwordComparison = await bcrypt.compare(
        password,
        loginUser.password
      );
      if (passwordComparison) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });

        res.status(200).json({
          user: loginUser,
          message: "User successfully logged in!",
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect email or password",
        });
      }
    } else {
      res.status(401).json({
        message: "Login failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to log user in",
    });
  }
});

module.exports = router;
