import { Router } from 'express';
import {
  getPublicTheme,
  getAdminTheme,
  updateAdminThemeDraft,
  publishAdminTheme,
  resetAdminTheme,
} from '../controllers/theme.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public', getPublicTheme);

// Admin routes
router.get('/admin', protect, getAdminTheme);
router.put('/admin/draft', protect, updateAdminThemeDraft);
router.post('/admin/publish', protect, publishAdminTheme);
router.post('/admin/reset', protect, resetAdminTheme);

export default router;
