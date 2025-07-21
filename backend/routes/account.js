const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, Transaction } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();
router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;

  if (!amount || amount <= 0) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid amount",
    });
  }

  //fetch the accounts within the transaction
  const account = await Account.findOne({
    userId: req.userId,
  }).session(session);

  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid recipient",
    });
  }

  // Update balances
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  // Create transaction record
  await Transaction.create(
    [
      {
        fromUserId: req.userId,
        toUserId: to,
        amount: amount,
        status: "completed",
        timestamp: new Date(),
      },
    ],
    { session }
  );

  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

// Get transaction history
router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
    });

    res.json({
      transactions: transactions.map((tx) => ({
        _id: tx._id,
        amount: tx.amount,
        type: tx.fromUserId._id.toString() === req.userId ? "sent" : "received",
        from: tx.fromUserId.firstName + " " + tx.fromUserId.lastName,
        to: tx.toUserId.firstName + " " + tx.toUserId.lastName,
        timestamp: tx.timestamp,
        status: tx.status,
      })),
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
    });
  }
});

// Add money to account (for testing purposes)
router.post("/add-money", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: amount } }
    );

    res.json({
      message: "Money added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding money",
    });
  }
});

// Get transaction statistics
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // This month transactions
    const thisMonthTransactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
      timestamp: { $gte: startOfMonth },
    });

    // Last month transactions
    const lastMonthTransactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
      timestamp: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Calculate this month totals
    const thisMonthSent = thisMonthTransactions
      .filter((tx) => tx.fromUserId.toString() === req.userId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const thisMonthReceived = thisMonthTransactions
      .filter((tx) => tx.toUserId.toString() === req.userId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate last month totals
    const lastMonthSent = lastMonthTransactions
      .filter((tx) => tx.fromUserId.toString() === req.userId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthReceived = lastMonthTransactions
      .filter((tx) => tx.toUserId.toString() === req.userId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    res.json({
      thisMonth: {
        sent: thisMonthSent,
        received: thisMonthReceived,
        net: thisMonthReceived - thisMonthSent,
      },
      lastMonth: {
        sent: lastMonthSent,
        received: lastMonthReceived,
        net: lastMonthReceived - lastMonthSent,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transaction statistics",
    });
  }
});

module.exports = router;
