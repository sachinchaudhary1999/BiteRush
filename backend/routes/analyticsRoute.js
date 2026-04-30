// ============================================================
// ANALYTICS ROUTES
// Returns dashboard stats — revenue, orders, users, etc.
// ============================================================
import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/dashboard', getDashboardStats); // Main dashboard stats

export default analyticsRouter;
