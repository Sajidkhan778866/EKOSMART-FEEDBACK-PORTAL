import express from 'express';
import {
  getAllBills,
  getBillById,
  createBill,
  deleteBill,
  getActiveBillTemplate,
  getAllBillTemplates,
  getBillTemplateById,
  createBillTemplate,
  updateBillTemplate,
  activateBillTemplate,
  deleteBillTemplate,
  exportBills,
  sendBillEmail,
} from '../controllers/billing.controller';
import { protect, authorize, checkPermission } from '../middleware/auth';

const router = express.Router();

// 1. Bill Template Routes (Accessible by Admin and POS renderers)
router.get('/template', getActiveBillTemplate);
router.get('/templates', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), getAllBillTemplates);
router.get('/templates/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), getBillTemplateById);
router.post('/templates', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), createBillTemplate);
router.put('/templates/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), updateBillTemplate);
router.patch('/templates/:id/activate', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), activateBillTemplate);
router.delete('/templates/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), deleteBillTemplate);

// 2. Invoices & Billing Routes
router.get('/export/csv', protect, checkPermission('billing:view', 'billing:create'), exportBills);
router.get('/', protect, checkPermission('billing:view', 'billing:create'), getAllBills);
router.get('/:id', protect, checkPermission('billing:view', 'billing:create'), getBillById);
router.post('/:id/email', protect, checkPermission('billing:view', 'billing:create'), sendBillEmail);
router.post('/', protect, checkPermission('billing:create'), createBill);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), deleteBill);

export default router;
