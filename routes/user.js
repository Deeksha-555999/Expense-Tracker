import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

//login route
router.post("/login", async (req, res) => {
  console.log("BODY:", req.body);

  const { username, password  } = req.body;

  console.log("USERNAME:", username);

  const user = await User.findOne({ username });

  console.log("USER:", user);

  // if (!user) {
  //   return res.status(400).json({
  //     message: "User not found",
  //   });
  // }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id }, "secretKey");

  res.json({ token});
});


// get user data 

router.get("/data", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secretKey");
    const user = await User.findById(decoded.id);
    res.json({ username: user.username, saving: user.saving, _id: user._id });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

//create user
router.post("/", async (req, res) => {
  try {
    console.log("Signup body:", req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      saving: req.body.saving || 0,
    });

    res.json(user);
  } catch (err) {
    console.log("SIGNUP ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const user = await User.find();
  res.json(user);
});

// Add money
router.put("/add/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  user.saving += req.body.amount;
  await user.save();
  res.json(user);
});

// Use money
router.put("/use/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (user.saving < req.body.amount) {
    return res.json({ message: "Insufficient balance" });
  }
  user.saving -= req.body.amount;
  await user.save();
  res.json(user);
});

// Delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

export default router;
