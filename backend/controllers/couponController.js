import couponModel from "../models/couponModel.js";

const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({});
    res.json({ success: true, data: coupons });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const addCoupon = async (req, res) => {
  try {
    const exists = await couponModel.findOne({ code: req.body.code.toUpperCase() });
    if (exists) return res.json({ success: false, message: "Coupon code already exists" });
    const coupon = new couponModel({ ...req.body, code: req.body.code.toUpperCase() });
    await coupon.save();
    res.json({ success: true, message: "Coupon Created" });
  } catch (e) { res.json({ success: false, message: "Error: " + e.message }); }
};

const updateCoupon = async (req, res) => {
  try {
    await couponModel.findByIdAndUpdate(req.body.id, req.body);
    res.json({ success: true, message: "Coupon Updated" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const removeCoupon = async (req, res) => {
  try {
    await couponModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Coupon Removed" });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

const validateCoupon = async (req, res) => {
  try {
    const coupon = await couponModel.findOne({ code: req.body.code.toUpperCase(), isActive: true });
    if (!coupon) return res.json({ success: false, message: "Invalid coupon code" });
    if (new Date() > coupon.expiryDate) return res.json({ success: false, message: "Coupon expired" });
    if (coupon.usedCount >= coupon.usageLimit) return res.json({ success: false, message: "Coupon limit reached" });
    if (req.body.orderAmount < coupon.minOrderAmount) return res.json({ success: false, message: `Minimum order ₹${coupon.minOrderAmount} required` });
    let discount = coupon.discountType === "percentage"
      ? Math.min((req.body.orderAmount * coupon.discountValue) / 100, coupon.maxDiscount)
      : Math.min(coupon.discountValue, coupon.maxDiscount);
    res.json({ success: true, discount, coupon });
  } catch (e) { res.json({ success: false, message: "Error" }); }
};

export { listCoupons, addCoupon, updateCoupon, removeCoupon, validateCoupon };
