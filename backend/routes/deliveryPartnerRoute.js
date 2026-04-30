// ============================================================
// DELIVERY PARTNER ROUTES
// Handles partner registration, approval, assignment, removal
// ============================================================
import express from 'express';
import multer from 'multer';
import {
  listPartners,
  addPartner,
  updatePartner,
  removePartner,
  approvePartner,
  assignOrder
} from '../controllers/deliveryPartnerController.js';

const deliveryRouter = express.Router();

// Image upload for partner profile photo
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});
const upload = multer({ storage });

deliveryRouter.get('/list', listPartners);                          // Get all partners
deliveryRouter.post('/add', upload.single('image'), addPartner);   // Register new partner
deliveryRouter.post('/update', upload.single('image'), updatePartner); // Update partner info
deliveryRouter.post('/remove', removePartner);                     // Remove partner
deliveryRouter.post('/approve', approvePartner);                   // Approve/reject partner
deliveryRouter.post('/assign', assignOrder);                       // Assign order to partner

export default deliveryRouter;
