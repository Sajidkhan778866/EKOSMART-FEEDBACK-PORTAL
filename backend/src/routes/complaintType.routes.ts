import express from 'express';
import {
  getComplaintTypes,
  createComplaintType,
  updateComplaintType,
  deleteComplaintType,
} from '../controllers/complaintType.controller';

const router = express.Router();

router.get('/', getComplaintTypes);
router.post('/', createComplaintType);
router.put('/:id', updateComplaintType);
router.patch('/:id', updateComplaintType);
router.delete('/:id', deleteComplaintType);

export default router;
