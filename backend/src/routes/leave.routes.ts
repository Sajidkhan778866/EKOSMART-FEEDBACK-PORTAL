import express from 'express';
import {
  previewLeaveDuration,
  applyLeave,
  getMyLeaves,
  getAdminLeaves,
  updateLeaveStatus,
} from '../controllers/leave.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Preview calculation without saving
router.post('/calculate', protect, previewLeaveDuration);

// Employee actions
router.post('/apply', protect, applyLeave);
router.get('/my', protect, getMyLeaves);

// Admin actions
router.get('/', protect, getAdminLeaves);
router.patch('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), updateLeaveStatus);
router.put('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), updateLeaveStatus);

export default router;
