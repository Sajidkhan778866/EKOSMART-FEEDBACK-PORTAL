import express from 'express';
import {
  submitPublicComplaint,
  trackPublicComplaint,
  getAdminComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
} from '../controllers/complaint.controller';

const router = express.Router();

// Public routes
router.post('/public', submitPublicComplaint);
router.get('/public/track/:ticketNumber', trackPublicComplaint);

// Admin / Employee routes
router.get('/', getAdminComplaints);
router.get('/admin', getAdminComplaints);
router.get('/ticket/:ticketNumber', getComplaintById);
router.get('/admin/:id', getComplaintById);
router.get('/:id', getComplaintById);
router.post('/admin/:id/assign', assignComplaint);
router.patch('/admin/:id/status', updateComplaintStatus);
router.put('/admin/:id/status', updateComplaintStatus);

export default router;

