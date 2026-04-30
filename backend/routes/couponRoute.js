// ============================================================
// COUPON ROUTES
// Handles coupon CRUD and validation at checkout
// ============================================================
import express from 'express';
import {
  listCoupons,
  addCoupon,
  updateCoupon,
  removeCoupon,
  validateCoupon
} from '../controllers/couponController.js';

const couponRouter = express.Router();

couponRouter.get('/list', listCoupons);         // Get all coupons (admin)
couponRouter.post('/add', addCoupon);           // Create coupon
couponRouter.post('/update', updateCoupon);     // Edit coupon
couponRouter.post('/remove', removeCoupon);     // Delete coupon
couponRouter.post('/validate', validateCoupon); // Validate coupon at checkout (frontend)

export default couponRouter;
