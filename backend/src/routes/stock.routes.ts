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
import { protect } from '../middleware/auth';

const router = express.Router();

// Scanner & Audit routes (must precede /:id)
router.get('/serial/:serial', protect, getStockBySerial);
router.get('/movements/audit', protect, getStockMovements);

// Main Stock CRUD
router.get('/', protect, getAllStock);
router.get('/:id', protect, getStockById);
router.post('/', protect, createStock);
router.put('/:id', protect, updateStock);
router.post('/movement', protect, recordStockMovement);
router.delete('/:id', protect, deleteStock);

export default router;
