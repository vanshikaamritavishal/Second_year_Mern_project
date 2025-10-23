import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { googleId, name, email, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email (not googleId)
    let user = await User.findOne({ email });

    // Create if user doesn't exist
    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        profilePhoto: photoURL,
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
