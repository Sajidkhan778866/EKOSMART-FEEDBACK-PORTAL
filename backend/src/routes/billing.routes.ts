import express from 'express';
import {
  getAllBills,
  getBillById,
  createBill,
  deleteBill,
} from '../controllers/billing.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getAllBills);
router.get('/:id', protect, getBillById);
router.post('/', protect, createBill);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteBill);

export default router;
