import express from 'express';
import {
  getAdminDashboardStats,
  getCurrentApplications,
  getEmployeeDashboardStats,
} from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/admin', getAdminDashboardStats);
router.get('/current-applications', getCurrentApplications);
router.get('/admin/current-applications', getCurrentApplications);
router.get('/employee/:employeeId', getEmployeeDashboardStats);

export default router;

