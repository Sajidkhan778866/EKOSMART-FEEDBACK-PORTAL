import express from 'express';
import {
  registerPublicWarranty,
  checkPublicWarranty,
  getAdminWarranties,
  verifyWarrantyStaff,
  exportWarranties,
} from '../controllers/warranty.controller';

const router = express.Router();

router.post('/verify-staff', verifyWarrantyStaff);
router.post('/public/verify-staff', verifyWarrantyStaff);
router.post('/public/register', registerPublicWarranty);
router.post('/register', registerPublicWarranty);
router.get('/public/check', checkPublicWarranty);
router.get('/check', checkPublicWarranty);
router.get('/admin', getAdminWarranties);
router.get('/export/csv', exportWarranties);
router.get('/export', exportWarranties);

export default router;


