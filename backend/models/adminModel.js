import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
  date: { type: Date, default: Date.now }
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
