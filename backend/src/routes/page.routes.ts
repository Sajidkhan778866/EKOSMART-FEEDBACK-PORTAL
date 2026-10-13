import { Router } from 'express';
import {
  getPublicPage,
  getPublicNavPages,
  getAdminPages,
  createAdminPage,
  getAdminPageById,
  updateAdminPageDraft,
  publishAdminPage,
  revertAdminPage,
  duplicateAdminPage,
  deleteAdminPage,
} from '../controllers/page.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public', getPublicNavPages);
router.get('/public/by-slug', getPublicPage);
router.get('/public/*slug', getPublicPage);

// Admin routes
router.get('/admin', protect, getAdminPages);
router.post('/admin', protect, createAdminPage);
router.get('/admin/:id', protect, getAdminPageById);
router.put('/admin/:id', protect, updateAdminPageDraft);
router.post('/admin/:id/publish', protect, publishAdminPage);
router.post('/admin/:id/revert/:revisionId', protect, revertAdminPage);
router.post('/admin/:id/duplicate', protect, duplicateAdminPage);
router.delete('/admin/:id', protect, deleteAdminPage);

export default router;
