import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // ✅ add this
  age: Number,
  linkedin: String,
  college: String,
  state: String,
  city: String,
  skills: [String],
  profilePhoto: String, // Cloudinary URL
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("User", userSchema);
