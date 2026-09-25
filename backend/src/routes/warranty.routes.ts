import express from 'express';
import {
  registerPublicWarranty,
  checkPublicWarranty,
  getAdminWarranties,
  verifyWarrantyStaff,
} from '../controllers/warranty.controller';

const router = express.Router();

router.post('/verify-staff', verifyWarrantyStaff);
router.post('/public/verify-staff', verifyWarrantyStaff);
router.post('/public/register', registerPublicWarranty);
router.get('/public/check', checkPublicWarranty);
router.get('/admin', getAdminWarranties);

export default router;
