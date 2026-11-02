import express from 'express';
import {
  getDatabaseConfigAndStatus,
  testDatabaseConnection,
  saveDatabaseConfiguration,
  reconnectDatabaseController,
} from '../controllers/database.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Strictly protect all database configuration routes for Admin / SuperAdmin only
router.use(protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'));

router.get('/status', getDatabaseConfigAndStatus);
router.post('/test', testDatabaseConnection);
router.post('/save', saveDatabaseConfiguration);
router.put('/save', saveDatabaseConfiguration);
router.post('/reconnect', reconnectDatabaseController);

export default router;
