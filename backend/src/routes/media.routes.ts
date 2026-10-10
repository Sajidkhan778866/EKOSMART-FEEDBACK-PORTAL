import { Router } from 'express';
import { getMediaAssets, uploadMediaAsset, deleteMediaAsset } from '../controllers/media.controller';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Admin media routes
router.get('/admin', protect, getMediaAssets);
router.post('/admin/upload', protect, upload.single('file'), uploadMediaAsset);
router.delete('/admin/:id', protect, deleteMediaAsset);

export default router;
