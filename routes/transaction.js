import express from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  
  try {

    console.log("BODY:", req.body);

    const { userId, amount, type } = req.body;

    // validation
    if (!userId  || amount === undefined || amount === null || !type) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // if saving not present
    if (!user.saving) {
      user.saving = 0;
    }

    // update saving
    if (type === "save") {

      user.saving = Number(user.saving) + Number(amount);

    } else {

      user.saving = Number(user.saving) - Number(amount);

      // negative amount stop
      if (user.saving < 0) {
        user.saving = 0;
      }
    }

    // save user
    await user.save();

    // create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      amount,
      type,
      savings: user.saving, // store total saving after this transaction
    });

    // send updated user
    res.json({
      success: true,
      transaction,
      updatedUser: user,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// GET HISTORY

router.get("/:userId", async (req, res) => {

  try {

    const data = await Transaction.find({
      userId: req.params.userId,
    }).sort({ date: -1 });

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;