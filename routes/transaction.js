import express from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const router = express.Router();

// CREATE TRANSACTION
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { userId, amount, type } = req.body;

    if (!userId || amount === undefined || amount === null || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.saving) {
      user.saving = 0;
    }

    if (type === "save") {
      user.saving = Number(user.saving) + Number(amount);
    } else {
      user.saving = Number(user.saving) - Number(amount);
      if (user.saving < 0) {
        user.saving = 0;
      }
    }

    await user.save();

    const transaction = await Transaction.create({
      userId: user._id,
      amount,
      type,
      savings: user.saving,
    });

    res.json({
      success: true,
      transaction,
      updatedUser: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET HISTORY (SORTED BY NEWMER DATE)
router.get("/:userId", async (req, res) => {
  try {
    // Yahan .sort({ date: -1 }) ki jagah { createdAt: -1 } kiya hai taaki sahi se sort ho
    const data = await Transaction.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
