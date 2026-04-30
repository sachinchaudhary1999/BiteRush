import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleType: { type: String, enum: ["bike", "scooter", "cycle"], default: "bike" },
  vehicleNumber: { type: String, default: "" },
  city: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  currentOrder: { type: String, default: null },
  totalDeliveries: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  image: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

const deliveryPartnerModel = mongoose.models.deliveryPartner || mongoose.model("deliveryPartner", deliveryPartnerSchema);
export default deliveryPartnerModel;
