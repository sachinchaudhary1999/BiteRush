// ============================================================
// RESTAURANT ROUTES
// Handles all restaurant CRUD + approval + status toggle
// ============================================================
import express from 'express';
import multer from 'multer';
import {
  listRestaurants,
  addRestaurant,
  updateRestaurant,
  removeRestaurant,
  toggleRestaurantStatus,
  approveRestaurant
} from '../controllers/restaurantController.js';

const restaurantRouter = express.Router();

// Image upload config — saves to /uploads folder with timestamp prefix
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});
const upload = multer({ storage });

restaurantRouter.get('/list', listRestaurants);               // Get all restaurants
restaurantRouter.post('/add', upload.single('image'), addRestaurant);     // Add new restaurant
restaurantRouter.post('/update', upload.single('image'), updateRestaurant); // Update restaurant
restaurantRouter.post('/remove', removeRestaurant);           // Delete restaurant
restaurantRouter.post('/toggle', toggleRestaurantStatus);     // Enable/disable restaurant
restaurantRouter.post('/approve', approveRestaurant);         // Approve/reject restaurant

export default restaurantRouter;
