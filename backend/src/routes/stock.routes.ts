import express from 'express';
import {
  getAllStock,
  getStockById,
  getStockBySerial,
  createStock,
  updateStock,
  recordStockMovement,
  getStockMovements,
  deleteStock,
} from '../controllers/stock.controller';
import { protect, checkPermission, authorize } from '../middleware/auth';

const router = express.Router();

// Scanner & Audit routes (accessible by stock viewers, managers, and billing cashiers)
router.get('/serial/:serial', protect, checkPermission('stock:view', 'stock:manage', 'billing:create'), getStockBySerial);
router.get('/movements/audit', protect, checkPermission('stock:view', 'stock:manage'), getStockMovements);

// Main Stock CRUD
router.get('/', protect, checkPermission('stock:view', 'stock:manage'), getAllStock);
router.get('/:id', protect, checkPermission('stock:view', 'stock:manage'), getStockById);
router.post('/', protect, checkPermission('stock:manage'), createStock);
router.put('/:id', protect, checkPermission('stock:manage'), updateStock);
router.post('/movement', protect, checkPermission('stock:manage'), recordStockMovement);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteStock);

export default router;
