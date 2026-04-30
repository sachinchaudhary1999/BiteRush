// ============================================================
// ORDER CONTROLLER
// placeOrder  — creates order, redirects to Stripe (or COD)
// verifyOrder — confirms payment after Stripe callback
// userOrders  — returns orders for the logged-in user
// listOrders  — returns ALL orders (admin panel)
// updateStatus — admin updates order delivery status
// ============================================================
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";

// ---- Place Order ----
// Creates order in DB. If payment method is COD, marks as placed directly.
// For online payment, creates a Stripe checkout session and returns URL.
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    // Save order to MongoDB (payment: false until confirmed by Stripe)
    const newOrder = new orderModel({
      userId: req.body.userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
      date: Date.now(),
    });
    await newOrder.save();

    // Clear user's cart after placing order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Build Stripe line items — one per food item
    const line_items = items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        // Stripe requires amount in smallest unit (paise = ₹ × 100)
        unit_amount: item.price * 80 * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery fee as a separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 40 * 100,
      },
      quantity: 1,
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      // Stripe redirects here after payment — orderId used to verify
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:  `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("placeOrder error:", error.message);
    res.json({ success: false, message: "Order placement failed" });
  }
};

// ---- Verify Payment (called by /verify page after Stripe redirect) ----
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      // Mark order as paid in DB
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Order confirmed and paid" });
    } else {
      // Payment was cancelled — remove the order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    res.json({ success: false, message: "Verification error" });
  }
};

// ---- Get Orders for Logged-in User ----
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ---- List All Orders (Admin) ----
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error listing orders" });
  }
};

// ---- Update Order Status (Admin) ----
// Status values: "Food Processing" → "Out for delivery" → "Delivered"
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
