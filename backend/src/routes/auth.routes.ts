import express from 'express';
import { adminLogin, employeeLogin, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);
router.get('/me', protect, getMe);

export default router;
