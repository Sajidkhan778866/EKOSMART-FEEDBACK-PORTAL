import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEligibleEmployees,
  getEmployeeTasks,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
  exportEmployees,
} from '../controllers/employee.controller';
import { uploadEmployeePhoto } from '../middleware/upload';

const router = express.Router();

// Admin Endpoints
router.get('/', getEmployees);
router.get('/export', exportEmployees);
router.post('/', uploadEmployeePhoto.single('photo'), createEmployee);
router.get('/eligible/:division', getEligibleEmployees);
router.get('/:id', getEmployeeById);
router.get('/:id/tasks', getEmployeeTasks);
router.patch('/:id', uploadEmployeePhoto.single('photo'), updateEmployee);
router.put('/:id', uploadEmployeePhoto.single('photo'), updateEmployee);
router.patch('/:id/status', toggleEmployeeStatus);
router.delete('/:id', deleteEmployee);

export default router;
