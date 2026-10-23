import express from 'express';
import {
  registerPublicWarranty,
  checkPublicWarranty,
  getAdminWarranties,
  verifyWarrantyStaff,
  exportWarranties,
} from '../controllers/warranty.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/verify-staff', verifyWarrantyStaff);
router.post('/public/verify-staff', verifyWarrantyStaff);
router.post('/public/register', registerPublicWarranty);
router.post('/register', registerPublicWarranty);
router.get('/public/check', checkPublicWarranty);
router.get('/check', checkPublicWarranty);
router.get('/', protect, getAdminWarranties);
router.get('/admin', protect, getAdminWarranties);
router.get('/export/csv', protect, exportWarranties);
router.get('/export', protect, exportWarranties);

export default router;


