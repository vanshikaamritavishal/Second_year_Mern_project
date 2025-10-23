import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { googleId, name, email, photoURL } = req.body;

    // 1️⃣ Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2️⃣ Find by email (avoid duplicates)
    let user = await User.findOne({ email });

    // 3️⃣ Create user if not exists
    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        profilePhoto: photoURL,
      });
    } else {
      // Optional: update googleId / profilePhoto for existing users
      user.googleId = googleId;
      user.profilePhoto = photoURL;
      await user.save();
    }

    // 4️⃣ Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
