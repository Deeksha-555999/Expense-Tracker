import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

//login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = User.findOneByUsername(username);

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user.id }, "secretKey");

  res.json({ token });
});

// get user data

router.get("/data", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secretKey");
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: user.username, saving: user.saving, _id: user.id });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

//create user
router.post("/", async (req, res) => {
  try {
    const existingUser = User.findOneByUsername(req.body.username);

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = User.create({
      username: req.body.username,
      password: hashedPassword,
      saving: req.body.saving || 0,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = User.findAll();
  res.json(users);
});

// Add money
router.put("/add/:id", async (req, res) => {
  const user = User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = User.updateSaving(
    req.params.id,
    Number(user.saving) + Number(req.body.amount),
  );

  res.json(updatedUser);
});

// Use money
router.put("/use/:id", async (req, res) => {
  const user = User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (Number(user.saving) < Number(req.body.amount)) {
    return res.json({ message: "Insufficient balance" });
  }

  const updatedUser = User.updateSaving(
    req.params.id,
    Number(user.saving) - Number(req.body.amount),
  );

  res.json(updatedUser);
});

// Delete user
router.delete("/:id", async (req, res) => {
  User.deleteById(req.params.id);
  res.json({ message: "deleted" });
});

export default router;
