import express from 'express';
import {
  getStockConfig,
  updateStockConfig,
  getAllStock,
  getStockById,
  getStockBySerial,
  createStock,
  updateStock,
  recordStockMovement,
  getStockMovements,
  deleteStock,
  exportStock,
} from '../controllers/stock.controller';
import { protect, checkPermission, authorize } from '../middleware/auth';

const router = express.Router();

// Soft-coded configuration
router.get('/config', protect, checkPermission('stock:view', 'stock:manage'), getStockConfig);
router.put('/config', protect, authorize('ADMIN', 'SUPER_ADMIN', 'MANAGER'), updateStockConfig);

// Scanner & Audit routes (accessible by stock viewers, managers, and billing cashiers)
router.get('/serial/:serial', protect, checkPermission('stock:view', 'stock:manage', 'billing:create'), getStockBySerial);
router.get('/movements/audit', protect, checkPermission('stock:view', 'stock:manage'), getStockMovements);

// Main Stock CRUD
router.get('/export/csv', protect, checkPermission('stock:view', 'stock:manage'), exportStock);
router.get('/', protect, checkPermission('stock:view', 'stock:manage'), getAllStock);
router.get('/:id', protect, checkPermission('stock:view', 'stock:manage'), getStockById);
router.post('/', protect, checkPermission('stock:manage', 'stock:view', 'stock:create'), createStock);
router.put('/:id', protect, checkPermission('stock:manage', 'stock:view', 'stock:update'), updateStock);
router.post('/movement', protect, checkPermission('stock:manage', 'stock:view'), recordStockMovement);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteStock);

export default router;
