import restaurantModel from "../models/restaurantModel.js";
import fs from "fs";

const listRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({});
    res.json({ success: true, data: restaurants });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const addRestaurant = async (req, res) => {
  try {
    const image_filename = req.file ? req.file.filename : "";
    const restaurant = new restaurantModel({ ...req.body, image: image_filename });
    await restaurant.save();
    res.json({ success: true, message: "Restaurant Added" });
  } catch (e) { res.json({ success: false, message: "Error: " + e.message }); }
};

const updateRestaurant = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = req.file.filename;
    await restaurantModel.findByIdAndUpdate(req.body.id, update);
    res.json({ success: true, message: "Restaurant Updated" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const removeRestaurant = async (req, res) => {
  try {
    const r = await restaurantModel.findById(req.body.id);
    if (r?.image) fs.unlink(`uploads/${r.image}`, () => {});
    await restaurantModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Restaurant Removed" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const toggleRestaurantStatus = async (req, res) => {
  try {
    const r = await restaurantModel.findById(req.body.id);
    await restaurantModel.findByIdAndUpdate(req.body.id, { isActive: !r.isActive });
    res.json({ success: true, message: "Status Updated" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const approveRestaurant = async (req, res) => {
  try {
    await restaurantModel.findByIdAndUpdate(req.body.id, { isApproved: req.body.approve });
    res.json({ success: true, message: req.body.approve ? "Restaurant Approved" : "Restaurant Rejected" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

export { listRestaurants, addRestaurant, updateRestaurant, removeRestaurant, toggleRestaurantStatus, approveRestaurant };
