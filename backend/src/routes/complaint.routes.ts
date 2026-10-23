import express from 'express';
import {
  submitPublicComplaint,
  trackPublicComplaint,
  getAdminComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
  exportComplaints,
} from '../controllers/complaint.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/public', submitPublicComplaint);
router.get('/public/track/:ticketNumber', trackPublicComplaint);

// Admin / Employee routes
router.get('/', protect, getAdminComplaints);
router.get('/admin', protect, getAdminComplaints);
router.get('/export', protect, exportComplaints);
router.get('/ticket/:ticketNumber', getComplaintById);
router.get('/admin/:id', protect, getComplaintById);
router.get('/:id', getComplaintById);
router.post('/admin/:id/assign', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), assignComplaint);
router.patch('/admin/:id/status', protect, updateComplaintStatus);
router.put('/admin/:id/status', protect, updateComplaintStatus);

export default router;

