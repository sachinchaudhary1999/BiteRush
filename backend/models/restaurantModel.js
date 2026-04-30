import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  cuisine: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  image: { type: String, default: "" },
  ownerId: { type: String, default: "" },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: Number, default: 30 },
  priceForTwo: { type: Number, default: 400 },
  deliveryFee: { type: Number, default: 40 },
  minOrder: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  openingTime: { type: String, default: "09:00" },
  closingTime: { type: String, default: "23:00" },
  tags: { type: Array, default: [] },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;
