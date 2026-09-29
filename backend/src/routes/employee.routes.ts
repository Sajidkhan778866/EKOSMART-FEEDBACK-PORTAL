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
  getEmployeeSalary,
  updateEmployeeSalary,
  generateEmployeePayslip,
  getEmployeePayslips,
  getAllPayslips,
  getMyPayslips,
  getMyPayslipById,
  deletePayslip,
} from '../controllers/employee.controller';
import { uploadEmployeePhoto } from '../middleware/upload';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Employee Self-Service (Authenticated)
router.get('/me/payslips', protect, getMyPayslips);
router.get('/me/payslips/:id', protect, getMyPayslipById);

// Admin Payslip & Salary Endpoints
router.get('/payslips/all', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), getAllPayslips);
router.delete('/payslips/:payslipId', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), deletePayslip);

// Admin Employee CRUD Endpoints
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

// Individual Salary Structure & Generation
router.get('/:id/salary', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), getEmployeeSalary);
router.put('/:id/salary', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), updateEmployeeSalary);
router.post('/:id/generate-payslip', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), generateEmployeePayslip);
router.get('/:id/payslips', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'), getEmployeePayslips);

export default router;
