import express from 'express';
import {
  getComplaintForm,
  getAllComplaintForms,
  getWarrantyForm,
  getAllWarrantyForms,
  saveComplaintForm,
  saveWarrantyForm,
  getDynamicSections,
  deleteComplaintForm,
  deleteWarrantyForm,
} from '../controllers/form.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/public/sections', getDynamicSections);
router.get('/public/complaint/:division', getComplaintForm);
router.get('/public/warranty/:category', getWarrantyForm);

// Admin routes
router.get('/admin/complaints', protect, getAllComplaintForms);
router.post('/admin/complaint', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), saveComplaintForm);
router.delete('/admin/complaint/:division', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), deleteComplaintForm);
router.get('/admin/warranties', protect, getAllWarrantyForms);
router.post('/admin/warranty', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), saveWarrantyForm);
router.delete('/admin/warranty/:category', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), deleteWarrantyForm);

export default router;
