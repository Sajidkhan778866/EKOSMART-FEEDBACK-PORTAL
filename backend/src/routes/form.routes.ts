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

const router = express.Router();

// Public routes
router.get('/public/sections', getDynamicSections);
router.get('/public/complaint/:division', getComplaintForm);
router.get('/public/warranty/:category', getWarrantyForm);

// Admin routes
router.get('/admin/complaints', getAllComplaintForms);
router.post('/admin/complaint', saveComplaintForm);
router.delete('/admin/complaint/:division', deleteComplaintForm);
router.get('/admin/warranties', getAllWarrantyForms);
router.post('/admin/warranty', saveWarrantyForm);
router.delete('/admin/warranty/:category', deleteWarrantyForm);

export default router;
