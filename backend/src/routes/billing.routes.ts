import express from 'express';
import {
  getAllBills,
  getBillById,
  createBill,
  deleteBill,
} from '../controllers/billing.controller';
import { protect, authorize, checkPermission } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, checkPermission('billing:view', 'billing:create'), getAllBills);
router.get('/:id', protect, checkPermission('billing:view', 'billing:create'), getBillById);
router.post('/', protect, checkPermission('billing:create'), createBill);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteBill);

export default router;
