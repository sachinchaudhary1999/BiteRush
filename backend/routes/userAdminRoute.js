// ============================================================
// USER MANAGEMENT ROUTES (Admin only)
// List, block, remove users from admin panel
// ============================================================
import express from 'express';
import { listUsers, removeUser, blockUser } from '../controllers/userAdminController.js';

const userAdminRouter = express.Router();

userAdminRouter.get('/list', listUsers);       // Get all registered users
userAdminRouter.post('/remove', removeUser);   // Delete a user
userAdminRouter.post('/block', blockUser);     // Block/unblock a user

export default userAdminRouter;
