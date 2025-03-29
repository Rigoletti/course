import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  githubId: { type: String, unique: true, sparse: true },
  needsCompletion: { type: Boolean, default: false },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  balance: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  rating: { type: Number, default: 0 },
  reviews: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);