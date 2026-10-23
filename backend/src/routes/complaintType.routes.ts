import express from 'express';
import {
  getComplaintTypes,
  createComplaintType,
  updateComplaintType,
  deleteComplaintType,
} from '../controllers/complaintType.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getComplaintTypes);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), createComplaintType);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), updateComplaintType);
router.patch('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), updateComplaintType);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), deleteComplaintType);

export default router;
