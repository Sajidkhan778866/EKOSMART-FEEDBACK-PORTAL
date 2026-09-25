import { Router } from 'express';
import {
  getPublicContent,
  getAdminContent,
  updateAdminContent,
} from '../controllers/content.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Content routes
router.get('/public', getPublicContent);
router.get('/admin', getAdminContent);
router.put('/admin', protect, authorize('Admin', 'SuperAdmin', 'ADMIN', 'SUPER_ADMIN', 'Staff', 'Technician'), updateAdminContent);

export default router;
