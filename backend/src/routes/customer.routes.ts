import express from 'express';
import { getCustomers, createCustomer, exportCustomers } from '../controllers/customer.controller';

const router = express.Router();

router.get('/export/csv', exportCustomers);
router.get('/', getCustomers);
router.post('/', createCustomer);

export default router;
