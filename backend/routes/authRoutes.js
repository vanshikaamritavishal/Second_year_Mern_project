import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();

router.post("/google", async (req, res) => {
  const { googleId, name, email, photoURL } = req.body;
  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({ googleId, name, profilePhoto: photoURL });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});

export default router;
