import express from "express";
import Message from "../models/Message.js";
const router = express.Router();

router.get("/:sender/:receiver", async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.params.sender, receiver: req.params.receiver },
      { sender: req.params.receiver, receiver: req.params.sender },
    ],
  });
  res.json(messages);
});

router.post("/", async (req, res) => {
  const msg = await Message.create(req.body);
  res.json(msg);
});

export default router;
