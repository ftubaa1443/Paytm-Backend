const express = require("express");
const { User, Account } = require("../db/db");
const router = express.Router();
const zod = require("zod");

const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

const signupbody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string().min(8),
});

router.post("/signup", (req, res) => {
  const success = signupbody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      msg: " please completely filled all queries / ",
    });
  }

  const existingUser = User.findOne({
    username: req.body.username,
  });

  if (!existingUser) {
    return res.status(411).json({
      msg: " user already exist ",
    });
  }

  const user = User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
  });
  const userId = user._id;

  const account = Account.create({
    userId,
    balance: Math.floor(Math.random()) + 10000,
  });
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    msg: " user created successfully",
    token: token,
  });
});

const signinbody = zod.object({
  username: zod.string(),
  password: zod.string().min(8),
});

router.post("/signin", async (req, res) => {
  const formattedInputs = signinbody.safeParse(req.body);

  if (!formattedInputs) {
    return res.status(403).json({
      msg: " not valid inputs ",
    });
  }
  const exist = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (!exist) {
    return res.status(403).json({
      msg: " user not found ",
    });
  }

  const userId = exist._id;

  const token = jwt.sign(userId, JWT_SECRET);

  res.json({
    userId: userId,
    token: token,
  });
});

const updatebody = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().min(8).optional(),
});

router.put("/", Middleware, async (req, res) => {
  const formattedInputs = updatebody.safeParse(req.body);

  if (!formattedInputs) {
    return res.status(403).json({
      msg: " inputs are not valid ",
    });
  }

  await User.updateOne(req.body, {
    _id: req.userId,
  });
  res.status(203).json({
    msg: "updated successfully",
  });
});

module.exports = router;





