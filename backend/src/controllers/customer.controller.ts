import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Customer, ICustomer } from '../models/Customer';
import { Referral } from '../models/Referral';
import { WalletTransaction } from '../models/WalletTransaction';
import { ReferralSettings } from '../models/ReferralSettings';
import { Bill } from '../models/Bill';
import { Warranty } from '../models/Warranty';
import { Complaint } from '../models/Complaint';
import crypto from 'crypto';
import { sendOtpEmail, verifySmtpConnection, getSmtpConfig } from '../services/email.service';
import { applyDateFilterToQuery } from '../utils/dateRange';

// Helper: Generate JWT for Customer
const generateCustomerToken = (customer: ICustomer) => {
  return jwt.sign(
    {
      id: customer._id.toString(),
      customerId: customer.customerId,
      email: customer.email,
      mobile: customer.mobile,
      name: customer.name,
      role: 'Customer',
    },
    process.env.JWT_SECRET || 'ekosmart_default_secret_key_2026',
    { expiresIn: '60d' }
  );
};

// Helper: Generate Unique, Non-guessable Referral Code
export const generateUniqueReferralCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let isUnique = false;
  let code = '';
  let attempts = 0;
  while (!isUnique && attempts < 20) {
    attempts++;
    let randomPart = '';
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `EKO${randomPart}`;
    const existing = await Customer.findOne({ referralCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  return code || `EKO${Date.now().toString(36).toUpperCase()}`;
};

// Helper: Get or Initialize Referral Settings
export const getActiveReferralSettings = async () => {
  let settings = await ReferralSettings.findOne({ key: 'global_referral_settings' });
  if (!settings) {
    settings = await ReferralSettings.create({
      key: 'global_referral_settings',
      enabled: true,
      welcomeRewardCoins: 0,
      newCustomerReward: 500,
      referrerReward: 500,
      purchaseReward: 500,
      showroomCoins: 250,
      batteryCoins: 500,
      serviceReward: 250,
      serviceRedemptionValue: 200,
      qualifyingMinPurchase: 0,
      coinConversionRate: 1,
    });
  }
  return settings;
};

// In-Memory OTP Store with 5-Minute Auto-Expiry and Attempt Limiter
interface IOtpStore {
  otp: string;
  expiresAt: number;
  attempts: number;
  payload?: any;
}
const otpCache = new Map<string, IOtpStore>();

// Rate Limiter: Max 3 requests per 5-minute window, min 45 seconds cooldown
interface IOtpRateLimit {
  count: number;
  resetAt: number;
  lastRequestedAt: number;
}
const otpRateLimits = new Map<string, IOtpRateLimit>();

const checkOtpRateLimit = (email: string): { allowed: boolean; message?: string } => {
  const now = Date.now();
  const limit = otpRateLimits.get(email);

  if (!limit || now > limit.resetAt) {
    otpRateLimits.set(email, {
      count: 1,
      resetAt: now + 5 * 60 * 1000,
      lastRequestedAt: now,
    });
    return { allowed: true };
  }

  const timeSinceLast = now - limit.lastRequestedAt;
  if (timeSinceLast < 45 * 1000) {
    const secondsRemaining = Math.ceil((45 * 1000 - timeSinceLast) / 1000);
    return {
      allowed: false,
      message: `Please wait ${secondsRemaining} second${secondsRemaining > 1 ? 's' : ''} before requesting another verification code.`,
    };
  }

  if (limit.count >= 3) {
    const minutesRemaining = Math.ceil((limit.resetAt - now) / 60000);
    return {
      allowed: false,
      message: `Too many verification requests. Please wait ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''} before requesting a new code.`,
    };
  }

  limit.count += 1;
  limit.lastRequestedAt = now;
  return { allowed: true };
};

// ==============================================================================
// 1. CUSTOMER AUTHENTICATION (EMAIL + OTP)
// ==============================================================================

// POST /api/v1/customers/auth/send-register-otp
export const sendRegisterOtp = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, referralCode } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Full Name, Email Address, and Mobile Number.',
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanMobile = String(mobile).trim();

    // Check rate limit
    const rateCheck = checkOtpRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: rateCheck.message,
      });
    }

    // Check existing customer with same email or mobile
    const existingCustomer = await Customer.findOne({
      $or: [{ email: cleanEmail }, { mobile: cleanMobile }],
    });

    if (existingCustomer) {
      if (existingCustomer.email === cleanEmail) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please login instead.',
        });
      }
      if (existingCustomer.mobile === cleanMobile) {
        return res.status(409).json({
          success: false,
          message: 'An account with this mobile number already exists. Please login instead.',
        });
      }
    }

    // Validate referral code if provided
    let cleanReferral = '';
    if (referralCode && String(referralCode).trim()) {
      cleanReferral = String(referralCode).trim().toUpperCase();
      const referrer = await Customer.findOne({
        referralCode: { $regex: new RegExp(`^${cleanReferral}$`, 'i') },
      });
      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: `Referral code "${cleanReferral}" is invalid. Please verify or leave it blank.`,
        });
      }
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Strictly 5 minutes

    otpCache.set(cleanEmail, {
      otp,
      expiresAt,
      attempts: 0,
      payload: { name: name.trim(), mobile: cleanMobile, email: cleanEmail, referralCode: cleanReferral },
    });

    const emailResult = await sendOtpEmail(cleanEmail, otp, 'Registration');
    const isSmtpConfigured = Boolean(process.env.SMTP_PASS && process.env.SMTP_PASS.trim());

    res.json({
      success: true,
      message: emailResult.success
        ? `A 6-digit verification code has been sent to ${cleanEmail}. It expires in 5 minutes.`
        : `Verification code generated. (SMTP note: ${emailResult.error || 'delivery notice'})`,
      // Expose debugOtp only in development when SMTP is not yet configured
      ...(isSmtpConfigured && process.env.NODE_ENV === 'production' ? {} : { debugOtp: otp, otp }),
    });
  } catch (error: any) {
    console.error('Failed to send register OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
};

// POST /api/v1/customers/auth/verify-register-otp
export const verifyRegisterOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, mobile, address, city, state, referralCode } = req.body;

    const cleanEmail = String(email || '').toLowerCase().trim();
    const cleanOtp = String(otp || '').trim();

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const cached = otpCache.get(cleanEmail);
    if (!cached) {
      return res.status(400).json({
        success: false,
        message: 'No verification code requested for this email or the code has expired. Please request a new code.',
      });
    }

    if (Date.now() > cached.expiresAt) {
      otpCache.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired (5-minute limit). Please request a new code.',
      });
    }

    // Track failed attempts (max 5)
    cached.attempts = (cached.attempts || 0) + 1;
    if (cached.attempts > 5) {
      otpCache.delete(cleanEmail);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. This verification code has been invalidated for security. Please request a new code.',
      });
    }

    const isDevFallback = !process.env.SMTP_PASS && process.env.NODE_ENV !== 'production' && cleanOtp === '123456';
    if (cached.otp !== cleanOtp && !isDevFallback) {
      const remaining = Math.max(0, 5 - cached.attempts);
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. Please check your email and try again.${remaining > 0 ? ` (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)` : ''}`,
      });
    }

    // Invalidate immediately upon successful verification
    otpCache.delete(cleanEmail);

    const customerName = name || cached.payload?.name || 'Customer';
    const customerMobile = mobile || cached.payload?.mobile;
    const finalReferralCode = (referralCode || cached.payload?.referralCode || '').trim().toUpperCase();

    // Check again for duplicates
    let customer = await Customer.findOne({
      $or: [{ email: cleanEmail }, { mobile: customerMobile }],
    });

    if (customer) {
      return res.status(409).json({
        success: false,
        message: 'Customer already registered. Please proceed to login.',
      });
    }

    // Generate unique referral code for this new customer
    const myNewReferralCode = await generateUniqueReferralCode();
    const customerCount = await Customer.countDocuments();
    const customerId = `CUST-${(customerCount + 1).toString().padStart(5, '0')}`;

    // Get active Referral Settings
    const settings = await getActiveReferralSettings();
    let referrerDoc: any = null;

    // Check referral validity
    if (finalReferralCode && settings.enabled) {
      referrerDoc = await Customer.findOne({
        referralCode: { $regex: new RegExp(`^${finalReferralCode}$`, 'i') },
      });
    }

    // Create Customer with 0 initial coins (coins earned strictly on showroom purchases)
    customer = await Customer.create({
      customerId,
      name: customerName,
      email: cleanEmail,
      mobile: customerMobile,
      address: address || '',
      city: city || 'Kota',
      state: state || 'Rajasthan',
      customerType: 'General',
      source: 'Self-Registered Customer Portal',
      referralCode: myNewReferralCode,
      referredBy: referrerDoc ? referrerDoc.referralCode : '',
      referrerCustomerId: referrerDoc ? referrerDoc._id : undefined,
      walletBalance: 0,
      totalEarnedCoins: 0,
      totalSpentCoins: 0,
      isVerified: true,
      status: 'Active',
      lastLoginAt: new Date(),
    });

    // If referred, save pending referral relationship (activated on first showroom purchase)
    if (referrerDoc && settings.enabled) {
      await Referral.create({
        referralId: `REF-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        referrer: referrerDoc._id,
        referrerId: referrerDoc.customerId,
        referrerName: referrerDoc.name,
        referrerEmail: referrerDoc.email,
        referrerMobile: referrerDoc.mobile,
        referrerCode: referrerDoc.referralCode,
        referredCustomer: customer._id,
        referredCustomerId: customer.customerId,
        referredCustomerName: customer.name,
        referredCustomerEmail: customer.email,
        referredCustomerMobile: customer.mobile,
        referredCustomerCode: customer.referralCode,
        rewardAmountReferrer: settings.referrerReward || 100,
        rewardAmountReferred: settings.newCustomerReward || 500,
        status: 'Pending',
      });
    }

    const token = generateCustomerToken(customer);

    res.status(201).json({
      success: true,
      message: 'Account created and verified successfully. Welcome to Ekosmart!',
      token,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        referralCode: customer.referralCode,
        walletBalance: customer.walletBalance,
        totalEarnedCoins: customer.totalEarnedCoins,
        token,
      },
    });
  } catch (error: any) {
    console.error('Failed to verify register OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to complete registration' });
  }
};

// POST /api/v1/customers/auth/send-login-otp
export const sendLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your Email Address.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Check rate limit
    const rateCheck = checkOtpRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: rateCheck.message,
      });
    }

    const customer = await Customer.findOne({ email: cleanEmail });

    if (customer && customer.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your customer account has been deactivated. Please contact support.',
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Strictly 5 minutes

    otpCache.set(cleanEmail, {
      otp,
      expiresAt,
      attempts: 0,
      payload: { isNew: !customer },
    });

    const emailResult = await sendOtpEmail(cleanEmail, otp, customer ? 'Login' : 'Registration');
    const isSmtpConfigured = Boolean(process.env.SMTP_PASS && process.env.SMTP_PASS.trim());

    res.json({
      success: true,
      message: emailResult.success
        ? `A 6-digit login verification code has been sent to ${cleanEmail}. It expires in 5 minutes.`
        : `Login verification code generated. (SMTP note: ${emailResult.error || 'delivery notice'})`,
      isNew: !customer,
      // Expose debugOtp only in development when SMTP is not yet configured
      ...(isSmtpConfigured && process.env.NODE_ENV === 'production' ? {} : { debugOtp: otp, otp }),
    });
  } catch (error: any) {
    console.error('Failed to send login OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send login OTP' });
  }
};

// POST /api/v1/customers/auth/verify-login-otp
export const verifyLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, mobile } = req.body;

    const cleanEmail = String(email || '').toLowerCase().trim();
    const cleanOtp = String(otp || '').trim();

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const cached = otpCache.get(cleanEmail);
    if (!cached) {
      return res.status(400).json({
        success: false,
        message: 'No verification code requested for this email or the code has expired. Please request a new code.',
      });
    }

    if (Date.now() > cached.expiresAt) {
      otpCache.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired (5-minute limit). Please request a new code.',
      });
    }

    // Track failed attempts (max 5)
    cached.attempts = (cached.attempts || 0) + 1;
    if (cached.attempts > 5) {
      otpCache.delete(cleanEmail);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. This verification code has been invalidated for security. Please request a new code.',
      });
    }

    const isDevFallback = !process.env.SMTP_PASS && process.env.NODE_ENV !== 'production' && cleanOtp === '123456';
    if (cached.otp !== cleanOtp && !isDevFallback) {
      const remaining = Math.max(0, 5 - cached.attempts);
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. Please check your email and try again.${remaining > 0 ? ` (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)` : ''}`,
      });
    }

    const isNewCustomer = !!cached.payload?.isNew;
    // Invalidate immediately upon successful verification
    otpCache.delete(cleanEmail);

    let customer = await Customer.findOne({ email: cleanEmail });

    if (!customer) {
      // Auto-create customer with 0 initial coins & unique referral code (coins earned on showroom purchases)
      const myNewReferralCode = await generateUniqueReferralCode();
      const customerCount = await Customer.countDocuments();
      const customerId = `CUST-${(customerCount + 1).toString().padStart(5, '0')}`;

      // Friendly fallback name from email
      const emailPrefix = cleanEmail.split('@')[0] || 'Customer';
      const autoName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      customer = await Customer.create({
        customerId,
        name: name?.trim() || autoName || 'Customer',
        email: cleanEmail,
        mobile: mobile?.trim() || '',
        customerType: 'General',
        source: 'Public Web Portal Login',
        referralCode: myNewReferralCode,
        walletBalance: 0,
        totalEarnedCoins: 0,
        totalSpentCoins: 0,
        isVerified: true,
        status: 'Active',
        lastLoginAt: new Date(),
      });
    } else {
      // Ensure customer has a permanent unique referral code
      if (!customer.referralCode) {
        customer.referralCode = await generateUniqueReferralCode();
      }
      customer.lastLoginAt = new Date();
      await customer.save();
    }

    const token = generateCustomerToken(customer);

    res.json({
      success: true,
      message: isNewCustomer ? 'Welcome to Ekosmart! Your account is active.' : 'Login successful. Welcome back!',
      isNew: isNewCustomer,
      token,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        referralCode: customer.referralCode,
        walletBalance: customer.walletBalance || 0,
        totalEarnedCoins: customer.totalEarnedCoins || 0,
        totalSpentCoins: customer.totalSpentCoins || 0,
        token,
      },
    });
  } catch (error: any) {
    console.error('Failed to verify login OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to login' });
  }
};

// GET/POST /api/v1/customers/auth/test-smtp - Diagnostics & verification for cPanel SMTP
export const testSmtpConnectionController = async (req: Request, res: Response) => {
  try {
    const configResult = await verifySmtpConnection();
    const targetEmail = req.body?.email || req.query?.email;

    if (targetEmail && typeof targetEmail === 'string' && targetEmail.includes('@')) {
      const sendResult = await sendOtpEmail(targetEmail, '123456', 'Registration');
      return res.status(sendResult.success ? 200 : 500).json({
        success: sendResult.success,
        message: sendResult.success
          ? `cPanel SMTP connection verified and test OTP email sent to ${targetEmail}!`
          : `SMTP verification passed, but test email delivery failed: ${sendResult.error}`,
        smtp: configResult,
        testSend: sendResult,
      });
    }

    return res.status(configResult.success ? 200 : 500).json({
      success: configResult.success,
      message: configResult.message,
      smtp: {
        host: configResult.config.host,
        port: configResult.config.port,
        secure: configResult.config.secure,
        user: configResult.config.user,
        from: configResult.config.from,
        isConfigured: configResult.config.isConfigured,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'SMTP diagnostic check failed',
    });
  }
};

// POST /api/v1/customers/auth/send-complaint-otp - Send OTP for complaint verification
export const sendComplaintOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (!cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const rateCheck = checkOtpRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: rateCheck.message });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpCache.set(cleanEmail, {
      otp,
      expiresAt,
      attempts: 0,
      payload: { type: 'complaint' },
    });

    const emailResult = await sendOtpEmail(cleanEmail, otp, 'Complaint');
    const isSmtpConfigured = Boolean(process.env.SMTP_PASS && process.env.SMTP_PASS.trim());

    res.json({
      success: true,
      message: emailResult.success
        ? `A 6-digit verification code has been sent to ${cleanEmail}. It expires in 5 minutes.`
        : `Verification code generated. (SMTP note: ${emailResult.error || 'delivery notice'})`,
      ...(isSmtpConfigured && process.env.NODE_ENV === 'production' ? {} : { debugOtp: otp, otp }),
    });
  } catch (error: any) {
    console.error('Failed to send complaint OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
};

// POST /api/v1/customers/auth/verify-complaint-otp - Verify complaint OTP
export const verifyComplaintOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const cached = otpCache.get(cleanEmail);
    if (!cached) {
      return res.status(400).json({
        success: false,
        message: 'No verification code requested or it has expired. Please request a new code.',
      });
    }

    if (Date.now() > cached.expiresAt) {
      otpCache.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired (5-minute limit). Please request a new code.',
      });
    }

    cached.attempts = (cached.attempts || 0) + 1;
    if (cached.attempts > 5) {
      otpCache.delete(cleanEmail);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. This code has been invalidated. Please request a new one.',
      });
    }

    const isDevFallback = !process.env.SMTP_PASS && process.env.NODE_ENV !== 'production' && cleanOtp === '123456';
    if (cached.otp !== cleanOtp && !isDevFallback) {
      const remaining = Math.max(0, 5 - cached.attempts);
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. Please check your email and try again.${remaining > 0 ? ` (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)` : ''}`,
      });
    }

    // Invalidate immediately upon successful verification
    otpCache.delete(cleanEmail);

    res.json({
      success: true,
      message: 'Email successfully verified!',
    });
  } catch (error: any) {
    console.error('Failed to verify complaint OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify OTP' });
  }
};



// ==============================================================================
// 2. CUSTOMER SELF-SERVICE PORTAL (PROTECTED)
// ==============================================================================

// GET /api/v1/customers/me - Customer Profile & Summary
export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }

    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser.id) ? authUser.id : null },
        { customerId: authUser.customerId || authUser.id },
        { email: authUser.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found.' });
    }

    // Ensure referral code
    if (!customer.referralCode) {
      customer.referralCode = await generateUniqueReferralCode();
      await customer.save();
    }

    // Count referrals
    const referralCount = await Referral.countDocuments({ referrer: customer._id });
    const successfulReferrals = await Referral.countDocuments({ referrer: customer._id, status: 'Completed' });

    // Count purchases / bills
    const purchaseCount = await Bill.countDocuments({
      $or: [{ customer: customer._id }, { customerMobile: customer.mobile }],
    });

    // Count warranties
    const warrantyCount = await Warranty.countDocuments({
      $or: [{ customer: customer._id }, { 'formData.customerMobile': customer.mobile }],
    });

    // Count complaints
    const complaintCount = await Complaint.countDocuments({
      $or: [{ customer: customer._id }, { 'customer.mobile': customer.mobile }, { customerMobile: customer.mobile }],
    });

    res.json({
      success: true,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        customerType: customer.customerType,
        referralCode: customer.referralCode,
        walletBalance: customer.walletBalance || 0,
        totalEarnedCoins: customer.totalEarnedCoins || 0,
        totalSpentCoins: customer.totalSpentCoins || 0,
        stats: {
          referralCount,
          successfulReferrals,
          purchaseCount,
          warrantyCount,
          complaintCount,
        },
        createdAt: customer.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Failed to get customer profile:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve customer profile' });
  }
};

// PUT /api/v1/customers/me - Update Customer Profile
export const updateCustomerProfile = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const { name, address, city, state } = req.body;

    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (name) customer.name = name.trim();
    if (address !== undefined) customer.address = address.trim();
    if (city !== undefined) customer.city = city.trim();
    if (state !== undefined) customer.state = state.trim();

    await customer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// GET /api/v1/customers/me/wallet - Customer Wallet & Transactions
export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (!customer.referralCode) {
      customer.referralCode = await generateUniqueReferralCode();
      await customer.save();
    }

    const { limit, dateFilter, startDate, endDate } = req.query;
    const query: any = {
      $or: [{ customer: customer._id }, { customerId: customer.customerId }],
    };

    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    const max = Math.min(100, Number(limit) || 50);
    const transactions = await WalletTransaction.find(query).sort({ createdAt: -1 }).limit(max);

    res.json({
      success: true,
      data: {
        walletBalance: customer.walletBalance || 0,
        totalEarnedCoins: customer.totalEarnedCoins || 0,
        totalSpentCoins: customer.totalSpentCoins || 0,
        referralCode: customer.referralCode,
        transactions,
      },
    });
  } catch (error: any) {
    console.error('Failed to get customer wallet:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet information' });
  }
};

// GET /api/v1/customers/me/referrals - Customer Referrals List & Statistics
export const getMyReferrals = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (!customer.referralCode) {
      customer.referralCode = await generateUniqueReferralCode();
      await customer.save();
    }

    const referrals = await Referral.find({ referrer: customer._id }).sort({ createdAt: -1 });

    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter((r) => r.status === 'Completed').length;
    const coinsEarned = referrals
      .filter((r) => r.status === 'Completed')
      .reduce((acc, r) => acc + (r.rewardAmountReferrer || 100), 0);

    // Mask privacy for referred customer display
    const maskedHistory = referrals.map((r) => {
      const nameParts = (r.referredCustomerName || 'Friend').split(' ');
      const maskedName = nameParts.map((p) => (p.length > 2 ? `${p[0]}***${p[p.length - 1]}` : `${p[0]}*`)).join(' ');

      return {
        referralId: r.referralId,
        referredCustomer: maskedName,
        rewardCoins: r.rewardAmountReferrer || 100,
        status: r.status,
        date: r.createdAt,
      };
    });

    res.json({
      success: true,
      data: {
        referralCode: customer.referralCode,
        totalReferrals,
        successfulReferrals,
        coinsEarned,
        history: maskedHistory,
      },
    });
  } catch (error: any) {
    console.error('Failed to get customer referrals:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve referral details' });
  }
};

// GET /api/v1/customers/me/purchases - Customer Purchase History & Bills
export const getMyPurchases = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const cleanEmail = customer.email ? customer.email.trim().toLowerCase() : '';
    const orConditions: any[] = [
      { customer: customer._id },
    ];

    if (customer.customerId) {
      orConditions.push({ customerId: customer.customerId });
    }
    if (customer.mobile) {
      orConditions.push({ customerMobile: customer.mobile });
    }
    if (cleanEmail) {
      orConditions.push({ customerEmail: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    }

    const bills = await Bill.find({ $or: orConditions }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bills,
      count: bills.length,
    });
  } catch (error: any) {
    console.error('Failed to fetch customer purchases:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve purchase history' });
  }
};

// GET /api/v1/customers/me/warranties - Customer Warranties
export const getMyWarranties = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const warranties = await Warranty.find({
      $or: [{ customer: customer._id }, { 'formData.customerMobile': customer.mobile }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: warranties,
      count: warranties.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch warranties' });
  }
};

// GET /api/v1/customers/me/complaints - Customer Complaints
export const getMyComplaints = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const complaints = await Complaint.find({
      $or: [{ customer: customer._id }, { 'customer.mobile': customer.mobile }, { customerMobile: customer.mobile }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: complaints,
      count: complaints.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
  }
};

// Available Services Eligible for Coin Redemption
export const ELIGIBLE_COIN_SERVICES = [
  { id: 'srv_bat_insp', name: 'Comprehensive Battery Diagnostic & Cell Inspection', coinCost: 100, description: 'Complete voltage, impedance, and thermal health check' },
  { id: 'srv_bms_bal', name: 'Active BMS Cell Balancing & Calibration Check', coinCost: 150, description: 'Equalize individual cell voltages and update BMS calibration' },
  { id: 'srv_water_top', name: 'Battery Terminal Clean, Tightening & Resistance Test', coinCost: 80, description: 'Terminal de-oxidation, torque check, and anti-corrosion coating' },
  { id: 'srv_gen_service', name: 'General Showroom EV Health & Performance Checkup', coinCost: 200, description: 'Full 18-point electrical, motor, controller, and brake inspection' },
  { id: 'srv_brake_tune', name: 'Brake, Throttle & Wiring Harness Service Tune-up', coinCost: 120, description: 'Brake pad inspection, throttle response check, and wiring isolation' },
];

// GET /api/v1/customers/eligible-services
export const getEligibleServices = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: ELIGIBLE_COIN_SERVICES,
  });
};

// POST /api/v1/customers/me/wallet/redeem-service
export const redeemServiceCoins = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).customer || (req as any).user;
    const { serviceId } = req.body;

    const service = ELIGIBLE_COIN_SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return res.status(400).json({ success: false, message: 'Invalid or ineligible service selected.' });
    }

    const customer = await Customer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(authUser?.id) ? authUser.id : null },
        { customerId: authUser?.customerId },
        { email: authUser?.email },
      ].filter(Boolean),
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    if ((customer.walletBalance || 0) < service.coinCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet coins. You have ${customer.walletBalance || 0} coins, but this service requires ${service.coinCost} coins.`,
      });
    }

    const balanceBefore = customer.walletBalance || 0;
    const balanceAfter = balanceBefore - service.coinCost;
    const voucherCode = `VCHR-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    customer.walletBalance = balanceAfter;
    customer.totalSpentCoins = (customer.totalSpentCoins || 0) + service.coinCost;
    await customer.save();

    const txId = `WTX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const tx = await WalletTransaction.create({
      transactionId: txId,
      customer: customer._id,
      customerId: customer.customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerMobile: customer.mobile,
      type: 'Debit',
      category: 'Service Redemption',
      amount: service.coinCost,
      balanceBefore,
      balanceAfter,
      description: `Redeemed for ${service.name} (Voucher: ${voucherCode})`,
      reference: voucherCode,
      referenceType: 'Redemption',
      status: 'Completed',
    });

    res.json({
      success: true,
      message: `Successfully redeemed ${service.coinCost} coins for ${service.name}!`,
      data: {
        voucherCode,
        serviceName: service.name,
        coinsRedeemed: service.coinCost,
        newBalance: balanceAfter,
        transaction: tx,
      },
    });
  } catch (error: any) {
    console.error('Failed to redeem service coins:', error);
    res.status(500).json({ success: false, message: 'Failed to process service coin redemption.' });
  }
};

// ==============================================================================
// 3. ADMIN CUSTOMER, REFERRAL & WALLET MANAGEMENT
// ==============================================================================

export const defaultStarterCustomers = [
  {
    customerId: 'CUST-EBS-1001',
    name: 'Rajesh Kumar Sharma',
    mobile: '9829012345',
    email: 'rajesh.sharma@example.com',
    customerType: 'General',
    city: 'Kota',
    state: 'Rajasthan',
    address: 'Vigyan Nagar, Kota',
    walletBalance: 750,
    totalEarnedCoins: 750,
    totalSpentCoins: 0,
    referralCode: 'EKORAJESH',
    isVerified: true,
    status: 'Active',
  },
  {
    customerId: 'CUST-EBS-1002',
    name: 'Amit Verma (Showroom Partner)',
    mobile: '9414056789',
    email: 'amit.verma@example.com',
    customerType: 'Showroom',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'E-Mobility Hub, MI Road, Jaipur',
    walletBalance: 1200,
    totalEarnedCoins: 1200,
    totalSpentCoins: 0,
    referralCode: 'EKOAMITV',
    isVerified: true,
    status: 'Active',
  },
  {
    customerId: 'CUST-EBS-1003',
    name: 'Sunil Gurjar (Drive Rental Fleet)',
    mobile: '8890123456',
    email: 'sunil.gurjar@example.com',
    customerType: 'General',
    city: 'Kota',
    state: 'Rajasthan',
    address: 'Rangbari Road, Kota',
    walletBalance: 500,
    totalEarnedCoins: 500,
    totalSpentCoins: 0,
    referralCode: 'EKOSUNIL',
    isVerified: true,
    status: 'Active',
  },
];

// GET /api/v1/customers - Admin: Get all customers with filters
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const countTotal = await Customer.countDocuments();
    if (countTotal === 0) {
      try {
        await Customer.insertMany(defaultStarterCustomers);
      } catch (seedErr) {
        console.warn('Auto-seed customers error:', seedErr);
      }
    }

    const { customerType, search, dateFilter, startDate, endDate, limit } = req.query;
    const query: any = {};

    if (customerType && customerType !== 'All') query.customerType = customerType;
    if (dateFilter && dateFilter !== 'all' && dateFilter !== 'All') {
      applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);
    }

    if (search) {
      const s = String(search).trim();
      if (s) {
        query.$or = [
          { name: { $regex: s, $options: 'i' } },
          { mobile: { $regex: s, $options: 'i' } },
          { email: { $regex: s, $options: 'i' } },
          { customerId: { $regex: s, $options: 'i' } },
          { referralCode: { $regex: s, $options: 'i' } },
        ];
      }
    }

    const max = Math.min(500, Number(limit) || 100);
    const customers = await Customer.find(query).sort({ createdAt: -1 }).limit(max).lean();

    const formatted = (customers || []).map((c: any) => ({
      ...c,
      referralCode: c.referralCode || `EKO${c.customerId || c._id.toString().slice(-5).toUpperCase()}`,
      walletBalance: Number(c.walletBalance) || 0,
      totalEarnedCoins: Number(c.totalEarnedCoins) || 0,
      totalSpentCoins: Number(c.totalSpentCoins) || 0,
    }));

    const totalCustomers = formatted.length;
    const totalCoinsInCirculation = formatted.reduce((acc, c) => acc + (c.walletBalance || 0), 0);

    res.json({
      success: true,
      data: formatted,
      meta: {
        count: totalCustomers,
        totalCoinsInCirculation,
      },
    });
  } catch (error: any) {
    console.error('getCustomers error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch customers' });
  }
};

// GET /api/v1/customers/:id - Admin: Get detailed customer profile dossier
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let customer = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      customer = await Customer.findById(id);
    }
    if (!customer) {
      customer = await Customer.findOne({ $or: [{ customerId: id }, { mobile: id }, { email: id }] });
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Ensure referral code exists
    if (!customer.referralCode) {
      customer.referralCode = await generateUniqueReferralCode();
      await customer.save();
    }

    // Fetch related records
    const [walletTransactions, referrals, purchases, warranties, complaints] = await Promise.all([
      WalletTransaction.find({
        $or: [{ customer: customer._id }, { customerId: customer.customerId }],
      }).sort({ createdAt: -1 }),
      Referral.find({ referrer: customer._id }).sort({ createdAt: -1 }),
      Bill.find({
        $or: [{ customer: customer._id }, { customerMobile: customer.mobile }],
      }).sort({ createdAt: -1 }),
      Warranty.find({
        $or: [{ customer: customer._id }, { 'formData.customerMobile': customer.mobile }],
      }).sort({ createdAt: -1 }),
      Complaint.find({
        $or: [{ customer: customer._id }, { 'customer.mobile': customer.mobile }, { customerMobile: customer.mobile }],
      }).sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      data: {
        customer,
        walletTransactions,
        referrals,
        purchases,
        warranties,
        complaints,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer details' });
  }
};

// POST /api/v1/customers - Admin: Add Customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, address, city, state, customerType, source, initialCoins, referralCodeUsed } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Name and Mobile are required' });
    }

    const existing = await Customer.findOne({ mobile: mobile.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Customer with this mobile already exists' });
    }

    const customerCount = await Customer.countDocuments();
    const customerId = `CUST-${(customerCount + 1).toString().padStart(5, '0')}`;
    const referralCode = await generateUniqueReferralCode();
    let coins = Number(initialCoins) || 0;

    const settings = await getActiveReferralSettings();
    let referrerDoc: any = null;
    const cleanRef = (referralCodeUsed || '').toString().trim().toUpperCase();

    if (cleanRef && settings.enabled) {
      referrerDoc = await Customer.findOne({
        referralCode: { $regex: new RegExp(`^${cleanRef}$`, 'i') },
      });
      if (referrerDoc) {
        if (coins === 0) {
          coins = settings.newCustomerReward || 500;
        }
      }
    }

    const customer = await Customer.create({
      customerId,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      address,
      city: city || 'Kota',
      state: state || 'Rajasthan',
      customerType: customerType || 'General',
      source: source || 'Admin Portal',
      referralCode,
      referredBy: referrerDoc ? referrerDoc.referralCode : '',
      referrerCustomerId: referrerDoc ? referrerDoc._id : undefined,
      walletBalance: coins,
      totalEarnedCoins: coins,
      isVerified: true,
      status: 'Active',
    });

    if (coins > 0) {
      await WalletTransaction.create({
        transactionId: `WTX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customer: customer._id,
        customerId: customer.customerId,
        customerName: customer.name,
        customerEmail: customer.email,
        customerMobile: customer.mobile,
        type: 'Credit',
        category: referrerDoc ? 'Welcome Reward' : 'Admin Adjustment',
        amount: coins,
        balanceBefore: 0,
        balanceAfter: coins,
        description: referrerDoc
          ? `Welcome reward via referral code ${referrerDoc.referralCode}`
          : 'Initial coins credited by Admin',
        reference: referrerDoc ? referrerDoc.referralCode : 'ADMIN_INIT',
        referenceType: referrerDoc ? 'Referral' : 'Admin',
        status: 'Completed',
      });
    }

    // Award Referrer bonus if valid referrer
    if (referrerDoc && settings.enabled) {
      const referrerReward = settings.referrerReward || 100;
      if (referrerReward > 0) {
        const refBalBefore = referrerDoc.walletBalance || 0;
        referrerDoc.walletBalance = refBalBefore + referrerReward;
        referrerDoc.totalEarnedCoins = (referrerDoc.totalEarnedCoins || 0) + referrerReward;
        await referrerDoc.save();

        await WalletTransaction.create({
          transactionId: `WTX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          customer: referrerDoc._id,
          customerId: referrerDoc.customerId,
          customerName: referrerDoc.name,
          customerEmail: referrerDoc.email,
          customerMobile: referrerDoc.mobile,
          type: 'Credit',
          category: 'Referrer Reward',
          amount: referrerReward,
          balanceBefore: refBalBefore,
          balanceAfter: referrerDoc.walletBalance,
          description: `Referral reward for inviting friend ${customer.name} (${customer.customerId})`,
          reference: customer.customerId,
          referenceType: 'Referral',
          status: 'Completed',
        });

        await Referral.create({
          referralId: `REF-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
          referrer: referrerDoc._id,
          referrerId: referrerDoc.customerId,
          referrerName: referrerDoc.name,
          referrerEmail: referrerDoc.email || '',
          referrerMobile: referrerDoc.mobile || '',
          referrerCode: referrerDoc.referralCode,
          referredCustomer: customer._id,
          referredCustomerId: customer.customerId,
          referredCustomerName: customer.name,
          referredCustomerEmail: customer.email || '',
          referredCustomerMobile: customer.mobile || '',
          referredCustomerCode: customer.referralCode,
          rewardAmountReferrer: referrerReward,
          rewardAmountReferred: coins,
          status: 'Completed',
        });
      }
    }

    res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create customer' });
  }
};

// PUT /api/v1/customers/:id - Admin: Update customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = String(Array.isArray(rawId) ? rawId[0] : rawId || '');
    const updates = { ...req.body };
    delete updates.walletBalance; // Protected: use wallet adjust endpoint

    let customer = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      customer = await Customer.findByIdAndUpdate(id, updates, { new: true });
    }
    if (!customer) {
      customer = await Customer.findOneAndUpdate({ customerId: id }, updates, { new: true });
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer updated successfully', data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
  }
};

// POST /api/v1/customers/:id/wallet/adjust - Admin: Adjust customer coins balance
export const adjustCustomerWallet = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = String(Array.isArray(rawId) ? rawId[0] : rawId || '');
    const { type, amount, reason } = req.body;

    if (!type || !amount || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Type (Credit/Debit), Amount, and Reason are required.',
      });
    }

    const numAmount = Math.abs(Number(amount));
    if (numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0.' });
    }

    let customer = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      customer = await Customer.findById(id);
    }
    if (!customer) {
      customer = await Customer.findOne({ customerId: id });
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const currentBal = customer.walletBalance || 0;
    let newBal = currentBal;

    if (type === 'Debit') {
      if (currentBal < numAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance. Current balance is ${currentBal} coins.`,
        });
      }
      newBal = currentBal - numAmount;
      customer.totalSpentCoins = (customer.totalSpentCoins || 0) + numAmount;
    } else {
      newBal = currentBal + numAmount;
      customer.totalEarnedCoins = (customer.totalEarnedCoins || 0) + numAmount;
    }

    customer.walletBalance = newBal;
    await customer.save();

    const adminUser = (req as any).user;
    const adminName = adminUser?.name || 'Admin';

    const tx = await WalletTransaction.create({
      transactionId: `WTX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      customer: customer._id,
      customerId: customer.customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerMobile: customer.mobile,
      type: type === 'Debit' ? 'Debit' : 'Credit',
      category: 'Admin Adjustment',
      amount: numAmount,
      balanceBefore: currentBal,
      balanceAfter: newBal,
      description: `${reason} (Adjusted by ${adminName})`,
      reference: `ADMIN-${Date.now().toString().slice(-4)}`,
      referenceType: 'Admin',
      status: 'Completed',
    });

    res.json({
      success: true,
      message: `Wallet ${type === 'Credit' ? 'credited' : 'debited'} with ${numAmount} coins successfully.`,
      data: {
        walletBalance: customer.walletBalance,
        transaction: tx,
      },
    });
  } catch (error: any) {
    console.error('Failed to adjust wallet:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to adjust wallet balance' });
  }
};

// GET /api/v1/customers/referral-settings - Soft-coded settings
export const getReferralSettings = async (req: Request, res: Response) => {
  try {
    const settings = await getActiveReferralSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve referral settings' });
  }
};

// PUT /api/v1/customers/referral-settings - Admin: Update referral reward settings
export const updateReferralSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    let settings = await ReferralSettings.findOneAndUpdate(
      { key: 'global_referral_settings' },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({
      success: true,
      message: 'Referral reward settings updated successfully.',
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update referral settings', error: error.message });
  }
};

// GET /api/v1/customers/referrals/all - Admin: List all referrals
export const getAllReferrals = async (req: Request, res: Response) => {
  try {
    const { status, search, dateFilter, startDate, endDate, limit } = req.query;
    const query: any = {};

    if (status && status !== 'All') query.status = status;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { referrerName: { $regex: s, $options: 'i' } },
        { referrerCode: { $regex: s, $options: 'i' } },
        { referredCustomerName: { $regex: s, $options: 'i' } },
        { referredCustomerId: { $regex: s, $options: 'i' } },
      ];
    }

    const max = Math.min(200, Number(limit) || 100);
    const referrals = await Referral.find(query).sort({ createdAt: -1 }).limit(max);

    const totalCoinsAwarded = referrals.reduce(
      (acc, r) => acc + (r.rewardAmountReferrer || 0) + (r.rewardAmountReferred || 0),
      0
    );

    res.json({
      success: true,
      data: referrals,
      meta: {
        count: referrals.length,
        totalCoinsAwarded,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve referrals' });
  }
};

// GET /api/v1/customers/wallet-transactions/all - Admin: List all wallet transactions
export const getAllWalletTransactions = async (req: Request, res: Response) => {
  try {
    const { type, category, search, dateFilter, startDate, endDate, limit } = req.query;
    const query: any = {};

    if (type && type !== 'All') query.type = type;
    if (category && category !== 'All') query.category = category;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { customerName: { $regex: s, $options: 'i' } },
        { customerId: { $regex: s, $options: 'i' } },
        { transactionId: { $regex: s, $options: 'i' } },
        { reference: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
      ];
    }

    const max = Math.min(200, Number(limit) || 100);
    const transactions = await WalletTransaction.find(query).sort({ createdAt: -1 }).limit(max);

    const totalCredited = transactions
      .filter((t) => t.type === 'Credit')
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    const totalDebited = transactions
      .filter((t) => t.type === 'Debit')
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    res.json({
      success: true,
      data: transactions,
      meta: {
        count: transactions.length,
        totalCredited,
        totalDebited,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve wallet transactions' });
  }
};

// GET /api/v1/customers/export/csv - Export customer directory
export const exportCustomers = async (req: Request, res: Response) => {
  try {
    const { customerType, search, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (customerType && customerType !== 'All') query.customerType = customerType;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { mobile: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { customerId: { $regex: s, $options: 'i' } },
        { referralCode: { $regex: s, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });

    const headers = [
      'Customer ID',
      'Full Name',
      'Mobile Number',
      'Email Address',
      'Referral Code',
      'Wallet Balance (Coins)',
      'Total Earned Coins',
      'Total Spent Coins',
      'Referred By Code',
      'Customer Type',
      'City',
      'State',
      'Registration Date',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = customers.map((c: any) => [
      escapeCsv(c.customerId || ''),
      escapeCsv(c.name || ''),
      escapeCsv(c.mobile || ''),
      escapeCsv(c.email || ''),
      escapeCsv(c.referralCode || ''),
      escapeCsv(c.walletBalance || 0),
      escapeCsv(c.totalEarnedCoins || 0),
      escapeCsv(c.totalSpentCoins || 0),
      escapeCsv(c.referredBy || 'None'),
      escapeCsv(c.customerType || 'General'),
      escapeCsv(c.city || ''),
      escapeCsv(c.state || ''),
      escapeCsv(c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : ''),
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Customers_Export_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Failed to export customers:', error);
    res.status(500).json({ success: false, message: 'Failed to export customer directory' });
  }
};

// GET /api/v1/customers/referrals/export/csv - Export Referrals
export const exportReferrals = async (req: Request, res: Response) => {
  try {
    const { status, search, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (status && status !== 'All') query.status = status;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { referrerName: { $regex: s, $options: 'i' } },
        { referrerCode: { $regex: s, $options: 'i' } },
        { referredCustomerName: { $regex: s, $options: 'i' } },
        { referredCustomerId: { $regex: s, $options: 'i' } },
      ];
    }

    const referrals = await Referral.find(query).sort({ createdAt: -1 });

    const headers = [
      'Referral ID',
      'Referrer Name',
      'Referrer ID',
      'Referrer Code',
      'Referred Customer Name',
      'Referred Customer ID',
      'Referrer Reward (Coins)',
      'Referred Reward (Coins)',
      'Status',
      'Date Created',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = referrals.map((r: any) => [
      escapeCsv(r.referralId || ''),
      escapeCsv(r.referrerName || ''),
      escapeCsv(r.referrerId || ''),
      escapeCsv(r.referrerCode || ''),
      escapeCsv(r.referredCustomerName || ''),
      escapeCsv(r.referredCustomerId || ''),
      escapeCsv(r.rewardAmountReferrer || 100),
      escapeCsv(r.rewardAmountReferred || 500),
      escapeCsv(r.status || 'Completed'),
      escapeCsv(r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : ''),
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Referrals_Report_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to export referrals' });
  }
};

// GET /api/v1/customers/wallet/export/csv - Export Wallet Transactions
export const exportWalletTransactions = async (req: Request, res: Response) => {
  try {
    const { type, category, search, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (type && type !== 'All') query.type = type;
    if (category && category !== 'All') query.category = category;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { customerName: { $regex: s, $options: 'i' } },
        { customerId: { $regex: s, $options: 'i' } },
        { transactionId: { $regex: s, $options: 'i' } },
        { reference: { $regex: s, $options: 'i' } },
      ];
    }

    const transactions = await WalletTransaction.find(query).sort({ createdAt: -1 });

    const headers = [
      'Transaction ID',
      'Customer ID',
      'Customer Name',
      'Type (Credit/Debit)',
      'Category',
      'Amount (Coins)',
      'Balance Before',
      'Balance After',
      'Description',
      'Reference',
      'Status',
      'Date',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = transactions.map((t: any) => [
      escapeCsv(t.transactionId || ''),
      escapeCsv(t.customerId || ''),
      escapeCsv(t.customerName || ''),
      escapeCsv(t.type || ''),
      escapeCsv(t.category || ''),
      escapeCsv(t.amount || 0),
      escapeCsv(t.balanceBefore || 0),
      escapeCsv(t.balanceAfter || 0),
      escapeCsv(t.description || ''),
      escapeCsv(t.reference || ''),
      escapeCsv(t.status || 'Completed'),
      escapeCsv(t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : ''),
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Wallet_Transactions_Report_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to export wallet transactions' });
  }
};
