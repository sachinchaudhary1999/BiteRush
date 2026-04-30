import deliveryPartnerModel from "../models/deliveryPartnerModel.js";
import bcrypt from "bcrypt";

const listPartners = async (req, res) => {
  try {
    const partners = await deliveryPartnerModel.find({}).select("-password");
    res.json({ success: true, data: partners });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const addPartner = async (req, res) => {
  try {
    const exists = await deliveryPartnerModel.findOne({ email: req.body.email });
    if (exists) return res.json({ success: false, message: "Email already registered" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const image_filename = req.file ? req.file.filename : "";
    const partner = new deliveryPartnerModel({ ...req.body, password: hashedPassword, image: image_filename });
    await partner.save();
    res.json({ success: true, message: "Delivery Partner Added" });
  } catch (e) { res.json({ success: false, message: "Error: " + e.message }); }
};

const updatePartner = async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.password;
    if (req.file) update.image = req.file.filename;
    await deliveryPartnerModel.findByIdAndUpdate(req.body.id, update);
    res.json({ success: true, message: "Partner Updated" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const removePartner = async (req, res) => {
  try {
    await deliveryPartnerModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Partner Removed" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const approvePartner = async (req, res) => {
  try {
    await deliveryPartnerModel.findByIdAndUpdate(req.body.id, { isApproved: req.body.approve });
    res.json({ success: true, message: req.body.approve ? "Partner Approved" : "Partner Rejected" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const assignOrder = async (req, res) => {
  try {
    await deliveryPartnerModel.findByIdAndUpdate(req.body.partnerId, { currentOrder: req.body.orderId, isAvailable: false });
    res.json({ success: true, message: "Order Assigned" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

export { listPartners, addPartner, updatePartner, removePartner, approvePartner, assignOrder };
