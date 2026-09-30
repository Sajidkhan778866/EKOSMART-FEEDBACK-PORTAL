import express from 'express';
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  sendLoginOtp,
  verifyLoginOtp,
  getCustomerProfile,
  updateCustomerProfile,
  getMyWallet,
  getMyReferrals,
  getMyPurchases,
  getMyWarranties,
  getMyComplaints,
  getEligibleServices,
  redeemServiceCoins,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  adjustCustomerWallet,
  getReferralSettings,
  updateReferralSettings,
  getAllReferrals,
  getAllWalletTransactions,
  exportCustomers,
  exportReferrals,
  exportWalletTransactions,
} from '../controllers/customer.controller';
import { protect, protectCustomer, authorize } from '../middleware/auth';

const router = express.Router();

// ============================================================================
// 1. PUBLIC CUSTOMER AUTHENTICATION (OTP BASED)
// ============================================================================
router.post('/auth/send-register-otp', sendRegisterOtp);
router.post('/auth/verify-register-otp', verifyRegisterOtp);
router.post('/auth/send-login-otp', sendLoginOtp);
router.post('/auth/verify-login-otp', verifyLoginOtp);
router.get('/referral-settings/public', getReferralSettings);
router.get('/eligible-services', getEligibleServices);

// ============================================================================
// 2. CUSTOMER SELF-SERVICE PORTAL (PROTECTED)
// ============================================================================
router.get('/me', protectCustomer, getCustomerProfile);
router.put('/me', protectCustomer, updateCustomerProfile);
router.get('/me/wallet', protectCustomer, getMyWallet);
router.post('/me/wallet/redeem-service', protectCustomer, redeemServiceCoins);
router.get('/me/referrals', protectCustomer, getMyReferrals);
router.get('/me/purchases', protectCustomer, getMyPurchases);
router.get('/me/warranties', protectCustomer, getMyWarranties);
router.get('/me/complaints', protectCustomer, getMyComplaints);

// ============================================================================
// 3. ADMIN MANAGEMENT ROUTES (PROTECTED)
// ============================================================================
// Referral & Wallet Management
router.get('/referral-settings', protect, getReferralSettings);
router.put('/referral-settings', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), updateReferralSettings);
router.get('/referrals/all', protect, getAllReferrals);
router.get('/referrals/export/csv', protect, exportReferrals);
router.get('/wallet-transactions/all', protect, getAllWalletTransactions);
router.get('/wallet/export/csv', protect, exportWalletTransactions);

// Customer Directory & Dossier
router.get('/export/csv', protect, exportCustomers);
router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomerById);
router.post('/', protect, createCustomer);
router.put('/:id', protect, updateCustomer);
router.post('/:id/wallet/adjust', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'), adjustCustomerWallet);

export default router;
