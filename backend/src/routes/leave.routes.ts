import express from 'express';
import {
  previewLeaveDuration,
  applyLeave,
  getMyLeaves,
  getAdminLeaves,
  updateLeaveStatus,
} from '../controllers/leave.controller';

const router = express.Router();

// Preview calculation without saving
router.post('/calculate', previewLeaveDuration);

// Employee actions
router.post('/apply', applyLeave);
router.get('/my', getMyLeaves);

// Admin actions
router.get('/', getAdminLeaves);
router.patch('/:id/status', updateLeaveStatus);
router.put('/:id/status', updateLeaveStatus);

export default router;
