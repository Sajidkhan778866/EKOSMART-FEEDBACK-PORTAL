import express from 'express';
import {
  getAdminDashboardStats,
  getCurrentApplications,
  getEmployeeDashboardStats,
} from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/admin', protect, getAdminDashboardStats);
router.get('/current-applications', protect, getCurrentApplications);
router.get('/admin/current-applications', protect, getCurrentApplications);
router.get('/employee/:employeeId', protect, getEmployeeDashboardStats);

export default router;

