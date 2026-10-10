import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getPublicTheme,
  getPublicPages,
  getPublicPageBySlug,
  getPublicFormSchema,
  submitPublicForm,
  getAdminPages,
  getAdminPageById,
  createAdminPage,
  updateAdminPageDraft,
  publishAdminPage,
  rollbackAdminPage,
  duplicateAdminPage,
  deleteAdminPage,
  getAdminTheme,
  updateAdminTheme,
  getAdminForms,
  saveAdminForm,
  deleteAdminForm,
  getAdminMedia,
  createAdminMedia,
  deleteAdminMedia,
  getAuditLogs,
  seedDefaultContent,
} from '../controllers/frontendBuilder.controller';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/public/theme', getPublicTheme);
router.get('/public/pages', getPublicPages);
router.get('/public/forms/:formKey', getPublicFormSchema);
router.post('/public/forms/:formKey/submit', submitPublicForm);
router.get('/public/form/:formKey', getPublicFormSchema);
router.post('/public/form/:formKey/submit', submitPublicForm);
router.get('/public/page/:slug', getPublicPageBySlug);
router.get('/public/page/*', getPublicPageBySlug);
router.get('/public/page', getPublicPageBySlug);

// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================
router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'));

// Pages
router.get('/pages', getAdminPages);
router.post('/pages', createAdminPage);
router.get('/pages/:id', getAdminPageById);
router.put('/pages/:id/draft', updateAdminPageDraft);
router.post('/pages/:id/publish', publishAdminPage);
router.post('/pages/:id/rollback/:version', rollbackAdminPage);
router.post('/pages/:id/duplicate', duplicateAdminPage);
router.delete('/pages/:id', deleteAdminPage);

// Theme & Tokens
router.get('/theme', getAdminTheme);
router.put('/theme', updateAdminTheme);

// Forms
router.get('/forms', getAdminForms);
router.post('/forms', saveAdminForm);
router.delete('/forms/:formKey', deleteAdminForm);

// Media
router.get('/media', getAdminMedia);
router.post('/media', createAdminMedia);
router.delete('/media/:assetId', deleteAdminMedia);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Seed Defaults
router.post('/seed-defaults', seedDefaultContent);

export default router;
