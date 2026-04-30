// ============================================================
// TOMATO BACKEND — Main Server Entry Point
// Express + MongoDB + Stripe
// Port: 4000 (configurable via .env)
// ============================================================

import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

// ---- Core Route Imports ----
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// ---- New Feature Route Imports ----
import restaurantRouter from "./routes/restaurantRoute.js";      // Restaurant management
import deliveryRouter from "./routes/deliveryPartnerRoute.js";   // Delivery partner management
import couponRouter from "./routes/couponRoute.js";             // Coupon system
import analyticsRouter from "./routes/analyticsRoute.js";       // Dashboard analytics
import userAdminRouter from "./routes/userAdminRoute.js";       // Admin user management

const app = express();
const port = process.env.PORT || 4000;

// ---- Middleware ----
app.use(express.json());    // Parse incoming JSON bodies
app.use(cors());            // Allow cross-origin requests (frontend + admin panel)

// ---- Connect to MongoDB ----
connectDB();

// ---- Static File Serving ----
// All uploaded images (food, restaurant, partner) served from /images
app.use("/images", express.static("uploads"));

// ---- API Routes ----
// Original routes (unchanged — frontend still works)
app.use("/api/user", userRouter);       // Register / Login
app.use("/api/food", foodRouter);       // Food items CRUD
app.use("/api/cart", cartRouter);       // Cart add/remove/get
app.use("/api/order", orderRouter);     // Place, list, verify orders

// New admin routes
app.use("/api/restaurant", restaurantRouter);   // Restaurant management
app.use("/api/delivery", deliveryRouter);       // Delivery partner management
app.use("/api/coupon", couponRouter);           // Coupon management + validation
app.use("/api/analytics", analyticsRouter);     // Dashboard stats
app.use("/api/users", userAdminRouter);         // Admin: manage users

// ---- Health Check ----
app.get("/", (req, res) => res.send("🍅 Tomato API is running!"));

// ---- Start Server ----
app.listen(port, () => console.log(`🚀 Server started on http://localhost:${port}`));
