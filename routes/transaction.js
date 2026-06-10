import express from "express";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

const router = express.Router();

// CREATE TRANSACTION
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { userId, amount, type } = req.body;

    if (!userId || amount === undefined || amount === null || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = User.findById(userId);
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

    const updatedUser = User.updateSaving(user.id, user.saving);

    const transaction = Transaction.create({
      userId: user.id,
      amount,
      type,
      savings: updatedUser.saving,
    });

    res.json({
      success: true,
      transaction,
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET HISTORY (SORTED BY NEWMER DATE)
router.get("/:userId", async (req, res) => {
  try {
    const data = Transaction.findByUserId(req.params.userId);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
