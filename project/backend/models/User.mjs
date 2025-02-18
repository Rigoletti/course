import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true }, 
  lastName: { type: String, required: true, trim: true }, 
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true }, 
  password: { type: String, required: true, minlength: 6 }, 
  role: { type: String, enum: ["user", "admin"], default: "user" }, 
}, { timestamps: true }); 


export default mongoose.model("User", userSchema);