const express = require("express");
const { Account } = require("../db/db");
const Middleware = require("../middleware");
const { startSession } = require("mongoose");
const router = express.Router();

router.get("/balance", Middleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", Middleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.starttransaction();

  const { amount , to } = req.body;

  const fromAccount = await Account.findOne({
    userId: req.userId,
  }).session(session);

  if (!fromAccount || fromAccount.balance < amount) {
    return res.json({
      msg: " undefined ",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  });

  if (!toAccount) {
    return res.json({
      msg: " undefined ",
    });
  }

  await Account.upadateOne(
    {
      userId: req.body,
    },
    { $inc: { balance: -amount } }
  ).session(session);

  await Account.upadateOne(
    {
      userId: to,
    },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();
  res.json({
    msg: "transfer succesfull",
  });
});
