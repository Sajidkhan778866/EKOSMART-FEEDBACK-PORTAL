import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Bill } from '../models/Bill';
import { Customer } from '../models/Customer';
import { Stock } from '../models/Stock';
import { StockMovement } from '../models/StockMovement';
import { Warranty } from '../models/Warranty';
import { Content } from '../models/Content';
import { BillTemplate } from '../models/BillTemplate';
import { WalletTransaction } from '../models/WalletTransaction';
import { ReferralSettings } from '../models/ReferralSettings';
import { Referral } from '../models/Referral';
import { generateUniqueReferralCode } from './customer.controller';
import { applyDateFilterToQuery } from '../utils/dateRange';
import { sendInvoiceSoftCopyEmail } from '../services/email.service';

// Default Showroom Bill Template
export const defaultBillTemplate = {
  templateName: 'Showroom GST Tax Invoice',
  name: 'Showroom GST Tax Invoice',
  templateType: 'Showroom' as const,
  type: 'Showroom' as const,
  description: 'Official showroom retail tax invoice for EV batteries and components',
  isActive: true,
  companyProfile: {
    businessName: 'EKOSMART EV BATTERY SOLUTION',
    tagline: 'Clean Energy & Smart Electric Mobility',
    address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    phone: '+91 8949049003 / +91 9549730483',
    email: 'support@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    cin: 'U31909RJ2023PTC085432',
    pan: 'AABCE1234F',
    logoUrl: '',
    qrCodeUrl: '',
  },
  company: {
    name: 'EKOSMART EV BATTERY SOLUTION',
    subtitle: 'High Power Lithium-Ion & LFP Technologies',
    logoType: 'preset' as const,
    logoUrl: '',
    address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    city: 'Kota',
    state: 'Rajasthan',
    pincode: '324002',
    phone: '+91 8949049003',
    alternatePhone: '+91 9549730483',
    email: 'support@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    cin: 'U31909RJ2023PTC085432',
    showroomName: 'Kota Central Showroom Counter',
    showroomAddress: 'Plot No. 14, Electronic Complex, IPIA, Kota - 324005',
  },
  header: {
    title: 'TAX INVOICE',
    subtitle: 'Original for Recipient (Showroom Retail)',
    showLogo: true,
    showGstin: true,
    showContact: true,
  },
  customerFields: [
    { key: 'customerName', label: 'Customer Name', visible: true, required: true, order: 1 },
    { key: 'customerMobile', label: 'Mobile Number', visible: true, required: true, order: 2 },
    { key: 'customerEmail', label: 'Email Address', visible: true, required: false, order: 3 },
    { key: 'customerAddress', label: 'Billing Address', visible: true, required: false, order: 4 },
    { key: 'city', label: 'City', visible: true, required: false, order: 5 },
    { key: 'state', label: 'State', visible: true, required: false, order: 6 },
  ],
  invoiceFields: [
    { key: 'invoiceNumber', label: 'Invoice No', visible: true, required: true, order: 1 },
    { key: 'createdAt', label: 'Invoice Date', visible: true, required: true, order: 2 },
    { key: 'paymentMode', label: 'Payment Mode', visible: true, required: true, order: 3 },
    { key: 'paymentStatus', label: 'Payment Status', visible: true, required: true, order: 4 },
    { key: 'showroom', label: 'Showroom / Counter', visible: true, required: false, order: 5 },
    { key: 'employeeName', label: 'Billed By', visible: true, required: false, order: 6 },
  ],
  productColumns: [
    { key: 'index', label: '#', visible: true, width: '5%', align: 'center' as const, order: 1 },
    { key: 'productName', label: 'Product / Battery Description', visible: true, width: '32%', align: 'left' as const, order: 2 },
    { key: 'category', label: 'Category', visible: true, width: '12%', align: 'left' as const, order: 3 },
    { key: 'serialNumber', label: 'Serial / Battery #', visible: true, width: '15%', align: 'left' as const, order: 4 },
    { key: 'quantity', label: 'Qty', visible: true, width: '8%', align: 'center' as const, order: 5 },
    { key: 'unitPrice', label: 'Rate (₹)', visible: true, width: '10%', align: 'right' as const, order: 6 },
    { key: 'discount', label: 'Discount', visible: true, width: '8%', align: 'right' as const, order: 7 },
    { key: 'taxRate', label: 'GST %', visible: true, width: '8%', align: 'center' as const, order: 8 },
    { key: 'totalAmount', label: 'Amount (₹)', visible: true, width: '12%', align: 'right' as const, order: 9 },
  ],
  warrantyConfig: {
    enabled: true,
    visible: true,
    title: 'Official EBS Warranty Certificate Included',
    badgeText: 'VERIFIED OFFICIAL WARRANTY',
    showWarrantyNumber: true,
    showStartDate: true,
    showExpiryDate: true,
    showSerialNumber: true,
    showWarrantyPeriod: true,
    termsSummary: 'Guaranteed battery capacity and free technical service support across all authorized service centers.',
  },
  totalsConfig: {
    showSubtotal: true,
    showDiscountTotal: true,
    showDiscount: true,
    showTaxBreakdown: true,
    showTaxBreakup: true,
    splitGst: true,
    showRoundOff: true,
    showOtherCharges: false,
    showGrandTotal: true,
    showAmountPaid: true,
    showBalance: true,
    showAmountInWords: true,
    currencySymbol: '₹',
  },
  footer: {
    termsAndConditions: [
      '1. Goods once sold are covered under Ekosmart official replacement/repair warranty policy.',
      '2. Warranty seal must remain intact and pack untampered.',
      '3. Pan-India technical service assistance available on official helpline.',
    ],
    warrantyPolicy: '3 Years Warranty on 48V LFP Packs; 1.5 Years on 60V/72V Packs; 1 Year on Lithium Fast Chargers.',
    returnPolicy: 'Defective verified units will be repaired or replaced by authorized service engineers within standard SLA.',
    supportHelpline: 'Helpline: +91 8949049003 / +91 9549730483 | support@ekosmartdrive.in',
    thankYouMessage: 'Thank you for choosing Ekosmart High Power Lithium Technologies!',
    authorizedSignatoryLabel: 'For EKOSMART EV BATTERY SOLUTION',
    authorizedSignatoryTitle: 'Authorized Signatory (Kota Central Plant)',
    signatoryName: 'Authorized Signatory',
    showAuthorizedSignature: true,
    showSignatureBox: true,
    showCustomerSignature: true,
    showBarcode: true,
    showQrCode: true,
    footerNote: 'Thank you for choosing EKOSMART Clean Energy & Green Mobility!',
  },
  softBillEmailConfig: {
    enabled: true,
    autoEmailCustomer: true,
    rewardCoins: 500,
    welcomeCoins: 500,
    referrerCoins: 100,
    emailSubject: 'Official EKOSMART GST Tax Invoice & Soft Copy - {{invoiceNumber}}',
    emailHeading: 'Showroom Retail Soft Copy Tax Invoice',
    emailMatter: 'Dear {{customerName}},\n\nThank you for choosing EKOSMART Clean Energy & Green Mobility. Please find your official GST Tax Invoice, Warranty Certificate registration, and exclusive Customer Referral Code details attached below.\n\nYour Unique Referral Code is: {{referralCode}}\nShare this code with your friends and family so they receive {{welcomeCoins}} Coins, and you earn {{referrerCoins}} Coins on their qualifying purchase!',
    referralBoxTitle: 'Ekosmart Referral & Rewards Program',
    referralBoxMessage: 'Share your referral code {{referralCode}} with friends & earn {{coins}} Coins on every qualifying purchase!',
    footerHelplineText: 'For billing assistance or warranty queries, contact Kota Helpline: +91 8949049003 | support@ekosmartdrive.in',
    showReferralCode: true,
    showCoinsSummary: true,
    showWarrantyBadge: true,
  },
  theme: {
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#047857',
    fontPreset: 'sans' as const,
    fontFamily: 'Inter',
    paperSize: 'A4' as const,
    showWatermark: true,
    watermarkText: 'ORIGINAL TAX INVOICE',
    borderStyle: 'rounded' as const,
    headerStyle: 'modern' as const,
  },
};

// Default Official Salary Slip / Payslip Template
export const defaultSalarySlipTemplate = {
  templateName: 'Employee Official Salary Slip / Payslip',
  name: 'Employee Official Salary Slip / Payslip',
  templateType: 'Salary' as const,
  type: 'Salary' as const,
  description: 'Soft-coded monthly salary slip with earnings, deductions, PF, ESIC, attendance, and net pay',
  isActive: true,
  isDefault: true,
  companyProfile: {
    businessName: 'EKOSMART EV BATTERY SOLUTION',
    tagline: 'Clean Energy & Smart Electric Mobility',
    address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    phone: '+91 8949049003 / +91 9549730483',
    email: 'hr@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    cin: 'U31909RJ2023PTC085432',
    pan: 'AABCE1234F',
    logoUrl: '',
    qrCodeUrl: '',
  },
  company: {
    name: 'EKOSMART EV BATTERY SOLUTION',
    subtitle: 'Clean Energy & Smart Electric Mobility',
    address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    phone: '+91 8949049003',
    email: 'hr@ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
  },
  header: {
    title: 'PAYSLIP / SALARY STATEMENT',
    subtitle: 'Confidential Monthly Employee Remuneration Slip',
    showLogo: true,
    showGstin: true,
    showContact: true,
  },
  salaryConfig: {
    allowancesTitle: 'Earnings / Gross Pay',
    deductionsTitle: 'Deductions & Recoveries',
    netSalaryLabel: 'Net Pay / Take Home Salary',
    showWorkingDays: true,
    showLeaveSummary: true,
    showBankDetails: true,
    authorizedSignatory: 'HR & Finance Director / Authorized Signatory',
    earningsColumns: [
      { key: 'basicPay', label: 'Basic Salary', visible: true, defaultAmount: 25000 },
      { key: 'hra', label: 'House Rent Allowance (HRA)', visible: true, defaultAmount: 10000 },
      { key: 'conveyance', label: 'Conveyance Allowance', visible: true, defaultAmount: 3000 },
      { key: 'specialAllowance', label: 'Special / Performance Allowance', visible: true, defaultAmount: 5000 },
      { key: 'overtime', label: 'Overtime & Incentives', visible: true, defaultAmount: 0 },
    ],
    deductionsColumns: [
      { key: 'pf', label: 'Provident Fund (EPF 12%)', visible: true, defaultAmount: 1800 },
      { key: 'esi', label: 'ESI Contribution', visible: true, defaultAmount: 500 },
      { key: 'professionalTax', label: 'Professional Tax (PT)', visible: true, defaultAmount: 200 },
      { key: 'tds', label: 'TDS / Income Tax', visible: true, defaultAmount: 0 },
      { key: 'advance', label: 'Advance / Loan Recovery', visible: true, defaultAmount: 0 },
    ],
    employeeFields: [
      { key: 'employeeId', label: 'Employee ID', visible: true },
      { key: 'name', label: 'Employee Name', visible: true },
      { key: 'designation', label: 'Designation', visible: true },
      { key: 'department', label: 'Department', visible: true },
      { key: 'division', label: 'Division / Unit', visible: true },
      { key: 'joiningDate', label: 'Date of Joining', visible: true },
      { key: 'bankAccount', label: 'Bank Account Number', visible: true },
      { key: 'bankName', label: 'Bank Name & Branch', visible: true },
      { key: 'ifscCode', label: 'IFSC Code', visible: true },
      { key: 'pan', label: 'PAN Card #', visible: true },
      { key: 'uan', label: 'UAN / PF Number', visible: true },
      { key: 'workingDays', label: 'Total Working Days', visible: true },
      { key: 'presentDays', label: 'Paid / Present Days', visible: true },
      { key: 'payPeriod', label: 'Pay Month & Year', visible: true },
    ],
  },
  customerFields: [],
  invoiceFields: [],
  productColumns: [],
  warrantyConfig: { enabled: false, visible: false },
  totalsConfig: {
    showSubtotal: true,
    showDiscountTotal: false,
    showDiscount: false,
    showTaxBreakdown: false,
    showTaxBreakup: false,
    splitGst: false,
    showRoundOff: true,
    showGrandTotal: true,
    showAmountInWords: true,
    currencySymbol: '₹',
  },
  footer: {
    termsAndConditions: [
      '1. This payslip is a confidential document generated by the EKOSMART HR & Payroll system.',
      '2. Discrepancies in attendance or salary computation must be reported to HR within 7 days of credit.',
      '3. PF and ESIC contributions are remitted directly to respective statutory bodies.',
      '4. Subject to Kota jurisdiction.',
    ],
    bankDetails: {
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200088991122',
      ifscCode: 'HDFC0001234',
      branch: 'Industrial Area Branch, Kota',
      upiId: 'ekosmartpayroll@hdfcbank',
    },
    authorizedSignatoryLabel: 'For EKOSMART EV BATTERY SOLUTION',
    signatoryName: 'Authorized HR Signatory',
    showSignatureBox: true,
    footerNote: 'This is a computer-generated salary slip and requires authorized signature & company seal.',
  },
  theme: {
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#047857',
    fontPreset: 'sans' as const,
    fontFamily: 'Inter',
    paperSize: 'A4' as const,
    showWatermark: true,
    watermarkText: 'CONFIDENTIAL PAYSLIP',
    borderStyle: 'rounded' as const,
    headerStyle: 'modern' as const,
  },
};

// Generate unique invoice number
const generateInvoiceNumber = async (prefix = 'EBS-INV'): Promise<string> => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await Bill.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });
  const seq = (countToday + 1).toString().padStart(4, '0');
  const candidate = `${prefix}-${dateStr}-${seq}`;
  const existing = await Bill.findOne({ invoiceNumber: candidate });
  if (existing) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${dateStr}-${seq}-${randomSuffix}`;
  }
  return candidate;
};

// ==============================================================================
// 1. BILL TEMPLATE CONTROLLERS
// ==============================================================================

// GET /api/v1/billing/template - Get active bill template
export const getActiveBillTemplate = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const query: any = { isActive: true };
    if (type) {
      query.$or = [{ templateType: type }, { type: type }];
    }

    let template = await BillTemplate.findOne(query);
    if (!template && type === 'Salary') {
      template = await BillTemplate.findOne({ $or: [{ templateType: 'Salary' }, { type: 'Salary' }] });
    }
    if (!template) {
      template = await BillTemplate.findOne({ isActive: true });
    }
    if (!template) {
      template = await BillTemplate.findOne();
    }

    if (!template) {
      const fallback = type === 'Salary' ? defaultSalarySlipTemplate : defaultBillTemplate;
      return res.json({
        success: true,
        data: fallback,
        isDefault: true,
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    console.error('Failed to get active bill template:', error);
    const fallback = req.query.type === 'Salary' ? defaultSalarySlipTemplate : defaultBillTemplate;
    res.json({
      success: true,
      data: fallback,
      isDefault: true,
    });
  }
};

// GET /api/v1/billing/templates - List all templates (Admin)
export const getAllBillTemplates = async (req: Request, res: Response) => {
  try {
    let templates = await BillTemplate.find().sort({ isActive: -1, updatedAt: -1 });
    if (templates.length === 0) {
      // Seed default showroom and salary templates if none exist
      const createdShowroom = await BillTemplate.create(defaultBillTemplate);
      const createdSalary = await BillTemplate.create(defaultSalarySlipTemplate);
      return res.json({ success: true, data: [createdShowroom, createdSalary] });
    }

    // Ensure at least one Salary template exists
    const hasSalary = templates.some((t: any) => t.templateType === 'Salary' || t.type === 'Salary');
    if (!hasSalary) {
      const createdSalary = await BillTemplate.create(defaultSalarySlipTemplate);
      templates.push(createdSalary);
    }

    res.json({ success: true, data: templates });
  } catch (error: any) {
    console.error('Failed to get bill templates:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve templates', error: error.message });
  }
};

// GET /api/v1/billing/templates/:id - Get template by ID
export const getBillTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await BillTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Bill template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch template', error: error.message });
  }
};

// POST /api/v1/billing/templates - Create new bill template (Admin)
export const createBillTemplate = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const tName = payload.templateName || payload.name;
    if (!tName) {
      return res.status(400).json({ success: false, message: 'Template name is required' });
    }

    const tType = payload.templateType || payload.type || 'Showroom';
    payload.templateName = tName;
    payload.name = tName;
    payload.templateType = tType;
    payload.type = tType;

    // If marked as active, deactivate other templates of same type
    if (payload.isActive) {
      await BillTemplate.updateMany(
        { $or: [{ templateType: tType }, { type: tType }] },
        { $set: { isActive: false } }
      );
    }

    const baseTemplate = tType === 'Salary' ? defaultSalarySlipTemplate : defaultBillTemplate;
    const newTemplate = await BillTemplate.create({
      ...baseTemplate,
      ...payload,
    });

    res.status(201).json({
      success: true,
      message: 'Bill template created successfully',
      data: newTemplate,
    });
  } catch (error: any) {
    console.error('Failed to create bill template:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create template' });
  }
};

// PUT /api/v1/billing/templates/:id - Update bill template (Admin)
export const updateBillTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const tName = payload.templateName || payload.name;
    if (tName) {
      payload.templateName = tName;
      payload.name = tName;
    }
    const tType = payload.templateType || payload.type;
    if (tType) {
      payload.templateType = tType;
      payload.type = tType;
    }

    if (payload.isActive && tType) {
      await BillTemplate.updateMany(
        { $or: [{ templateType: tType }, { type: tType }], _id: { $ne: id } },
        { $set: { isActive: false } }
      );
    }

    const updated = await BillTemplate.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Bill template not found' });
    }

    res.json({
      success: true,
      message: 'Bill template updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Failed to update bill template:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update template' });
  }
};

// PATCH /api/v1/billing/templates/:id/activate - Activate template
export const activateBillTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await BillTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    await BillTemplate.updateMany(
      { templateType: template.templateType },
      { $set: { isActive: false } }
    );

    template.isActive = true;
    await template.save();

    res.json({
      success: true,
      message: `Template "${template.templateName}" set as active`,
      data: template,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to activate template', error: error.message });
  }
};

// DELETE /api/v1/billing/templates/:id - Delete template
export const deleteBillTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await BillTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const count = await BillTemplate.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only remaining template' });
    }

    await BillTemplate.findByIdAndDelete(id);

    // If deleted template was active, activate another
    if (template.isActive) {
      const next = await BillTemplate.findOne();
      if (next) {
        next.isActive = true;
        await next.save();
      }
    }

    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete template', error: error.message });
  }
};

// ==============================================================================
// 2. INVOICE & BILL GENERATION CONTROLLERS
// ==============================================================================

// GET /api/v1/billing - List bills
export const getAllBills = async (req: Request, res: Response) => {
  try {
    const { search, paymentStatus, showroom, category, division, dateFilter, startDate, endDate, limit } = req.query;
    const query: any = {};

    if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;
    if (showroom && showroom !== 'All') query.showroom = showroom;

    const cat = category || division;
    if (cat && cat !== 'All') {
      query['items.category'] = { $regex: new RegExp(`^${cat}$`, 'i') };
    }

    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { invoiceNumber: { $regex: s, $options: 'i' } },
        { customerName: { $regex: s, $options: 'i' } },
        { customerMobile: { $regex: s, $options: 'i' } },
        { customerReferralCode: { $regex: s, $options: 'i' } },
        { referralCodeUsed: { $regex: s, $options: 'i' } },
      ];
    }

    const max = Math.min(200, Number(limit) || 100);
    const rawBills = await Bill.find(query)
      .populate('customer', 'referralCode walletBalance totalEarnedCoins customerId mobile')
      .sort({ createdAt: -1 })
      .limit(max);

    // Ensure customerReferralCode is populated for every bill
    const bills = rawBills.map((b: any) => {
      const doc = b.toObject ? b.toObject() : { ...b };
      if (!doc.customerReferralCode && doc.customer?.referralCode) {
        doc.customerReferralCode = doc.customer.referralCode;
      }
      return doc;
    });

    const totalRevenue = bills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);

    res.json({
      success: true,
      data: bills,
      meta: {
        totalRecords: bills.length,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Failed to get bills:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bills', error: error.message });
  }
};

// GET /api/v1/billing/:id - Get bill details
export const getBillById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || '');
    let bill = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      bill = await Bill.findById(id).populate('customer');
    }
    if (!bill) {
      bill = await Bill.findOne({ invoiceNumber: id }).populate('customer');
    }

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const billObj = bill.toObject ? bill.toObject() : { ...bill };
    if (!billObj.customerReferralCode && billObj.customer?.referralCode) {
      billObj.customerReferralCode = billObj.customer.referralCode;
    }

    res.json({ success: true, data: billObj });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve invoice', error: error.message });
  }
};

// POST /api/v1/billing - Create new invoice
export const createBill = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerMobile,
      customerEmail,
      customerAddress,
      city,
      state,
      items,
      paymentMode,
      paymentStatus,
      showroom,
      notes,
      referralCode,
    } = req.body;

    if (!customerName || !customerMobile) {
      return res.status(400).json({ success: false, message: 'Customer Name and Mobile are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invoice must contain at least one line item.' });
    }

    // 1. Find or create Customer
    let customer = await Customer.findOne({ mobile: customerMobile.trim() });
    if (!customer) {
      const count = await Customer.countDocuments();
      const customerId = `CUST-${(count + 1).toString().padStart(5, '0')}`;
      const referralCode = await generateUniqueReferralCode();
      customer = await Customer.create({
        customerId,
        name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail ? customerEmail.trim() : '',
        address: customerAddress ? customerAddress.trim() : '',
        city: city || 'Kota',
        state: state || 'Rajasthan',
        customerType: 'Showroom',
        source: 'Showroom Billing Counter',
        referralCode,
        walletBalance: 0,
        totalEarnedCoins: 0,
        isVerified: true,
        status: 'Active',
      });
    } else {
      if (customerAddress && !customer.address) customer.address = customerAddress.trim();
      if (customerEmail && !customer.email) customer.email = customerEmail.trim();
      if (!customer.referralCode) {
        customer.referralCode = await generateUniqueReferralCode();
      }
      await customer.save();
    }

    // 2. Fetch soft-coded invoice prefix from active template or CMS
    let invoicePrefix = 'EBS-INV';
    try {
      const cmsContent = await Content.findOne({ key: 'global_cms' });
      if (cmsContent?.billingConfig?.invoicePrefix) {
        invoicePrefix = cmsContent.billingConfig.invoicePrefix;
      }
    } catch {
      // fallback
    }

    const invoiceNumber = await generateInvoiceNumber(invoicePrefix);

    // 3. Process line items, verify images and compute totals
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    const processedItems = await Promise.all(
      items.map(async (item: any) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Number(item.unitPrice) || 0;
        const discount = Number(item.discount) || 0;
        const taxRate = Number(item.taxRate) !== undefined ? Number(item.taxRate) : 18;

        const lineGross = qty * unitPrice - discount;
        const lineTax = (lineGross * taxRate) / 100;
        const lineTotal = lineGross + lineTax;

        subtotal += qty * unitPrice;
        discountTotal += discount;
        taxTotal += lineTax;
        grandTotal += lineTotal;

        let pImg = item.productImage || item.photoUrl || '';
        let itemImages = Array.isArray(item.images) ? item.images : [];

        // Check stock if photo is missing
        if (!pImg || itemImages.length === 0) {
          const matchStock = await Stock.findOne({
            $or: [
              item.productSerial ? { serialNumber: item.productSerial } : null,
              item.batterySerial ? { batterySerialNumber: item.batterySerial } : null,
              item.productId ? { productId: item.productId } : null,
            ].filter(Boolean) as any,
          });
          if (matchStock) {
            if (!pImg) pImg = matchStock.photoUrl || (matchStock.images && matchStock.images[0]) || '';
            if (itemImages.length === 0 && matchStock.images) itemImages = matchStock.images;
          }
        }

        return {
          productId: item.productId || `PRD-${Date.now().toString().slice(-4)}`,
          productName: item.productName || 'EV Battery / Accessory',
          category: item.category || 'Battery',
          productSerial: (item.productSerial || item.serialNumber || '').trim(),
          batterySerial: (item.batterySerial || item.batterySerialNumber || '').trim(),
          productImage: pImg,
          images: itemImages,
          quantity: qty,
          unitPrice,
          discount,
          taxRate,
          taxAmount: Math.round(lineTax * 100) / 100,
          totalAmount: Math.round(lineTotal * 100) / 100,
          warrantyPeriodMonths: Number(item.warrantyPeriodMonths) !== undefined ? Number(item.warrantyPeriodMonths) : 36,
        };
      })
    );

    const employeeUser = (req as any).user;
    const employeeId = employeeUser?.employeeId || employeeUser?.id || '';
    const employeeName = employeeUser?.name || 'Authorized Billing Staff';

    // 4. Stock deduction & movements
    for (const item of processedItems) {
      let stock = null;
      if (item.productSerial) {
        stock = await Stock.findOne({ serialNumber: item.productSerial });
      }
      if (!stock && item.batterySerial) {
        stock = await Stock.findOne({ batterySerialNumber: item.batterySerial });
      }
      if (!stock && item.productId) {
        stock = await Stock.findOne({ productId: item.productId });
      }

      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - item.quantity);
        stock.totalSold = (stock.totalSold || 0) + item.quantity;
        if (stock.quantity === 0) {
          stock.status = 'Sold';
        }
        stock.history.unshift({
          operation: 'Sold',
          quantity: item.quantity,
          referenceNumber: invoiceNumber,
          employeeName,
          employeeId,
          notes: `Billed to ${customerName} (${customerMobile})`,
          date: new Date(),
        });
        await stock.save();

        await StockMovement.create({
          movementType: 'Sold',
          productId: stock.productId,
          productName: stock.productName,
          category: stock.category,
          serialNumber: item.productSerial || stock.serialNumber,
          batterySerialNumber: item.batterySerial || stock.batterySerialNumber,
          quantity: item.quantity,
          sourceLocation: stock.location || showroom || 'Showroom Store',
          destinationLocation: `Customer: ${customerName}`,
          performedBy: {
            employeeId,
            name: employeeName,
            role: employeeUser?.role || 'Staff',
          },
          referenceType: 'Bill',
          referenceId: invoiceNumber,
          notes: `Showroom Bill created`,
        }).catch(() => {});
      }
    }

    // 5. Automatic Warranty Generation for serialized/warrantied items
    const warrantyIds: string[] = [];
    const purchaseDate = new Date();

    for (const item of processedItems) {
      if (item.warrantyPeriodMonths > 0) {
        const warrantyPrefix = item.category === 'Battery' ? 'WRN-BAT' : 'WRN-EV';
        const serialTag = item.batterySerial || item.productSerial || Date.now().toString().slice(-6);
        const warrantyNumber = `${warrantyPrefix}-${Date.now().toString().slice(-4)}-${serialTag.slice(-4)}`;

        const startDate = new Date(purchaseDate);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + item.warrantyPeriodMonths);

        try {
          const warranty = await Warranty.create({
            warrantyNumber,
            category: item.category === 'Battery' ? 'Showroom' : 'Plant',
            customer: customer._id,
            product: item.productName,
            serialNumber: item.batterySerial || item.productSerial || `AUTO-${invoiceNumber}`,
            billNumber: invoiceNumber,
            purchaseDate,
            warrantyStartDate: startDate,
            warrantyExpiryDate: expiryDate,
            status: 'Active',
            formData: {
              invoiceNumber,
              showroom: showroom || 'Main Showroom',
              unitPrice: item.unitPrice,
              warrantyMonths: item.warrantyPeriodMonths,
            },
            registeredBy: {
              employeeId,
              name: employeeName,
              role: employeeUser?.role || 'Staff',
            },
          });
          warrantyIds.push(warranty.warrantyNumber);
        } catch (err: any) {
          console.warn('Auto-warranty creation notice:', err.message);
        }
      }
    }

    // 6. Process Purchase Reward for Customer Wallet
    let rewardCoinsAwarded = 0;
    let purchaseRewardAwarded = false;

    try {
      let settings = await ReferralSettings.findOne({ key: 'global_referral_settings' });
      if (!settings) {
        settings = await ReferralSettings.create({
          key: 'global_referral_settings',
          enabled: true,
          newCustomerReward: 500,
          referrerReward: 100,
          purchaseReward: 500,
          qualifyingMinPurchase: 0,
        });
      }

      const purchaseCoins = settings.purchaseReward || 500;
      const minQualifying = settings.qualifyingMinPurchase || 0;

      if (settings.enabled && purchaseCoins > 0 && grandTotal >= minQualifying) {
        // Prevent duplicate reward for same invoice
        const existingReward = await WalletTransaction.findOne({
          customer: customer._id,
          reference: invoiceNumber,
          category: 'Purchase Reward',
        });

        if (!existingReward) {
          const balBefore = customer.walletBalance || 0;
          customer.walletBalance = balBefore + purchaseCoins;
          customer.totalEarnedCoins = (customer.totalEarnedCoins || 0) + purchaseCoins;
          await customer.save();

          await WalletTransaction.create({
            transactionId: `WTX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            customer: customer._id,
            customerId: customer.customerId,
            customerName: customer.name,
            customerEmail: customer.email,
            customerMobile: customer.mobile,
            type: 'Credit',
            category: 'Purchase Reward',
            amount: purchaseCoins,
            balanceBefore: balBefore,
            balanceAfter: customer.walletBalance,
            description: `Purchase reward coins for showroom invoice ${invoiceNumber} (Total: ₹${grandTotal.toFixed(2)})`,
            reference: invoiceNumber,
            referenceType: 'Bill',
            status: 'Completed',
          });

          rewardCoinsAwarded = purchaseCoins;
          purchaseRewardAwarded = true;
        }
      }
    } catch (rewErr: any) {
      console.warn('Purchase reward processing error:', rewErr.message);
    }

    // 7. Referral Code Handling & Referrer Reward Processing
    let referralCodeUsed = '';
    let referralCoinsAwarded = 0;

    try {
      let settings = await ReferralSettings.findOne({ key: 'global_referral_settings' });
      const referrerBonus = settings?.referrerReward || 100;
      const cleanRef = (referralCode || '').toString().trim().toUpperCase();

      if (cleanRef) {
        const referrerCustomer = await Customer.findOne({
          referralCode: { $regex: new RegExp(`^${cleanRef}$`, 'i') },
        });
        if (referrerCustomer && referrerCustomer._id.toString() !== customer._id.toString()) {
          referralCodeUsed = referrerCustomer.referralCode || cleanRef;
          if (!customer.referredBy) {
            customer.referredBy = referrerCustomer.referralCode || cleanRef;
            customer.referrerCustomerId = referrerCustomer._id;
            await customer.save();
          }

          // Check if referral was already recorded between these two
          const existingRefRecord = await Referral.findOne({
            referrer: referrerCustomer._id,
            referredCustomer: customer._id,
          });

          if (!existingRefRecord && referrerBonus > 0) {
            const refBalBefore = referrerCustomer.walletBalance || 0;
            referrerCustomer.walletBalance = refBalBefore + referrerBonus;
            referrerCustomer.totalEarnedCoins = (referrerCustomer.totalEarnedCoins || 0) + referrerBonus;
            await referrerCustomer.save();

            await WalletTransaction.create({
              transactionId: `WTX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              customer: referrerCustomer._id,
              customerId: referrerCustomer.customerId,
              customerName: referrerCustomer.name,
              customerEmail: referrerCustomer.email,
              customerMobile: referrerCustomer.mobile,
              type: 'Credit',
              category: 'Referrer Reward',
              amount: referrerBonus,
              balanceBefore: refBalBefore,
              balanceAfter: referrerCustomer.walletBalance,
              description: `Referral reward: Referred friend ${customer.name} billed under invoice ${invoiceNumber}`,
              reference: invoiceNumber,
              referenceType: 'Bill',
              status: 'Completed',
            });

            await Referral.create({
              referralId: `REF-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
              referrer: referrerCustomer._id,
              referrerId: referrerCustomer.customerId,
              referrerName: referrerCustomer.name,
              referrerEmail: referrerCustomer.email || '',
              referrerMobile: referrerCustomer.mobile || '',
              referrerCode: referrerCustomer.referralCode,
              referredCustomer: customer._id,
              referredCustomerId: customer.customerId,
              referredCustomerName: customer.name,
              referredCustomerEmail: customer.email || '',
              referredCustomerMobile: customer.mobile || '',
              referredCustomerCode: customer.referralCode || '',
              rewardAmountReferrer: referrerBonus,
              rewardAmountReferred: settings?.newCustomerReward || 500,
              qualificationPurchase: invoiceNumber,
              rewardedAt: new Date(),
              status: 'Completed',
            });

            referralCoinsAwarded = referrerBonus;
          }
        }
      }

      // Also check if customer had a pending referral registered previously
      if (!referralCodeUsed) {
        const pendingReferral: any = await Referral.findOne({
          $or: [
            { referredCustomer: customer._id },
            { referredCustomerMobile: customer.mobile },
            { referredCustomerEmail: customer.email },
          ].filter(Boolean),
          status: 'Pending',
        });

        if (pendingReferral) {
          const referrerCustomer = await Customer.findById(pendingReferral.referrer);
          if (referrerCustomer && referrerBonus > 0) {
            const refBalBefore = referrerCustomer.walletBalance || 0;
            referrerCustomer.walletBalance = refBalBefore + referrerBonus;
            referrerCustomer.totalEarnedCoins = (referrerCustomer.totalEarnedCoins || 0) + referrerBonus;
            await referrerCustomer.save();

            await WalletTransaction.create({
              transactionId: `WTX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              customer: referrerCustomer._id,
              customerId: referrerCustomer.customerId,
              customerName: referrerCustomer.name,
              customerEmail: referrerCustomer.email,
              customerMobile: referrerCustomer.mobile,
              type: 'Credit',
              category: 'Referrer Reward',
              amount: referrerBonus,
              balanceBefore: refBalBefore,
              balanceAfter: referrerCustomer.walletBalance,
              description: `Referral reward: Friend ${customer.name} completed qualifying purchase (${invoiceNumber})`,
              reference: invoiceNumber,
              referenceType: 'Bill',
              status: 'Completed',
            });
          }

          pendingReferral.status = 'Completed';
          pendingReferral.qualificationPurchase = invoiceNumber;
          pendingReferral.rewardedAt = new Date();
          await pendingReferral.save();

          referralCodeUsed = pendingReferral.referrerCode || '';
          referralCoinsAwarded = referrerBonus;
        }
      }
    } catch (refErr: any) {
      console.warn('Referral processing notice:', refErr.message);
    }

    // 8. Create and Save Bill
    const newBill = await Bill.create({
      invoiceNumber,
      customer: customer._id,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : '',
      customerAddress: customerAddress ? customerAddress.trim() : '',
      items: processedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(discountTotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      paymentMode: paymentMode || 'UPI',
      paymentStatus: paymentStatus || 'Paid',
      showroom: showroom || 'Kota Showroom Counter',
      employeeId,
      employeeName,
      notes: notes || '',
      billUrls: Array.isArray(req.body.billUrls) ? req.body.billUrls : [],
      attachments: Array.isArray(req.body.attachments)
        ? req.body.attachments
        : (Array.isArray(req.body.billUrls)
            ? req.body.billUrls.map((url: string, i: number) => ({
                pageNumber: i + 1,
                url,
                name: `Attachment Page ${i + 1}`,
                fileType: url.startsWith('data:application/pdf') ? 'pdf' : 'image',
              }))
            : []),
      warrantyGenerated: warrantyIds.length > 0,
      warrantyIds,
      purchaseRewardAwarded,
      rewardCoinsAwarded: rewardCoinsAwarded || (purchaseRewardAwarded ? 500 : 0),
      customerReferralCode: customer.referralCode || '',
      referralCodeUsed,
      referralCoinsAwarded,
    });

    // 9. Automatically dispatch Soft Copy Tax Invoice & Referral Code via email
    const targetEmail = (customerEmail || customer.email || '').trim();
    if (targetEmail && targetEmail.includes('@')) {
      try {
        const activeTemplate = await BillTemplate.findOne({
          $or: [{ templateType: 'Showroom' }, { type: 'Showroom' }],
          isActive: true,
        });

        if (activeTemplate?.softBillEmailConfig?.enabled !== false && activeTemplate?.softBillEmailConfig?.autoEmailCustomer !== false) {
          sendInvoiceSoftCopyEmail({
            to: targetEmail,
            bill: newBill,
            customer,
            referralCode: customer.referralCode || newBill.customerReferralCode,
            templateConfig: activeTemplate || defaultBillTemplate,
          }).then(async (result) => {
            if (result.success) {
              newBill.softCopyEmailed = true;
              newBill.softCopyEmailedAt = new Date();
              newBill.softCopyRecipient = targetEmail;
              await newBill.save().catch(() => {});
            }
          }).catch((err) => console.warn('Auto soft copy email dispatch notice:', err.message));
        }
      } catch (emErr: any) {
        console.warn('Auto-email soft copy trigger notice:', emErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `Showroom Bill and Invoices generated successfully.${rewardCoinsAwarded > 0 ? ` +${rewardCoinsAwarded} Purchase Coins credited to customer wallet.` : ''}${referralCoinsAwarded > 0 ? ` +${referralCoinsAwarded} Referral Coins awarded to referrer (${referralCodeUsed}).` : ''}`,
      data: newBill,
      warrantiesGenerated: warrantyIds,
      rewardCoinsAwarded,
      referralCodeUsed,
      referralCoinsAwarded,
    });
  } catch (error: any) {
    console.error('Failed to create bill:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate showroom bill' });
  }
};

// POST /api/v1/billing/:id/email - Send or resend invoice soft copy via email
export const sendBillEmail = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || '');
    const { recipientEmail, customMatter, customSubject, coinsAwarded } = req.body;

    let bill = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      bill = await Bill.findById(id).populate('customer');
    }
    if (!bill) {
      bill = await Bill.findOne({ invoiceNumber: id }).populate('customer');
    }

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const emailTo = recipientEmail || bill.customerEmail || (bill.customer as any)?.email;
    if (!emailTo || !emailTo.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid recipient email address is required.' });
    }

    if (coinsAwarded !== undefined && !isNaN(Number(coinsAwarded))) {
      bill.rewardCoinsAwarded = Number(coinsAwarded);
    }

    // Get active template config for matter/branding
    const activeTemplate = await BillTemplate.findOne({
      $or: [{ templateType: 'Showroom' }, { type: 'Showroom' }],
      isActive: true,
    });

    // Resolve customer document to ensure referralCode is available
    let customerDoc = bill.customer;
    if (!customerDoc || !customerDoc.referralCode) {
      customerDoc = await Customer.findOne({
        $or: [
          bill.customer && mongoose.Types.ObjectId.isValid(bill.customer) ? { _id: bill.customer } : null,
          bill.customerMobile ? { mobile: bill.customerMobile } : null,
          bill.customerEmail ? { email: bill.customerEmail } : null,
        ].filter(Boolean) as any,
      });
    }

    const refCode = (customerDoc as any)?.referralCode || bill.customerReferralCode || bill.referralCodeUsed || 'EKO' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const emailResult = await sendInvoiceSoftCopyEmail({
      to: emailTo,
      bill,
      customer: customerDoc || bill.customer,
      referralCode: refCode,
      coinsAwarded: coinsAwarded !== undefined ? Number(coinsAwarded) : bill.rewardCoinsAwarded,
      customMatter,
      customSubject,
      templateConfig: activeTemplate || defaultBillTemplate,
    });

    if (emailResult.success) {
      bill.softCopyEmailed = true;
      bill.softCopyEmailedAt = new Date();
      bill.softCopyRecipient = emailTo;
      await bill.save();
    }

    res.json({
      success: emailResult.success,
      message: emailResult.message,
      data: {
        softCopyEmailed: bill.softCopyEmailed,
        softCopyEmailedAt: bill.softCopyEmailedAt,
        softCopyRecipient: bill.softCopyRecipient,
      },
    });
  } catch (error: any) {
    console.error('Failed to send invoice email:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send invoice email' });
  }
};

// DELETE /api/v1/billing/:id - Delete bill (admin only)
export const deleteBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndDelete(id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete invoice', error: error.message });
  }
};

// GET /api/v1/billing/export/csv - Export billing invoices to CSV / Excel
export const exportBills = async (req: Request, res: Response) => {
  try {
    const { search, paymentStatus, showroom, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;
    if (showroom && showroom !== 'All') query.showroom = showroom;

    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { invoiceNumber: { $regex: s, $options: 'i' } },
        { customerName: { $regex: s, $options: 'i' } },
        { customerMobile: { $regex: s, $options: 'i' } },
      ];
    }

    const bills = await Bill.find(query).sort({ createdAt: -1 });

    const headers = [
      'Invoice Number',
      'Invoice Date',
      'Customer Name',
      'Mobile Number',
      'Email Address',
      'Address',
      'Showroom / Location',
      'Billed By',
      'Products Summary',
      'Subtotal (INR)',
      'Discount (INR)',
      'Tax (INR)',
      'Grand Total (INR)',
      'Payment Mode',
      'Payment Status',
      'Warranty Linked',
      'Purchase Reward Coins',
      'Referral Code Used',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = bills.map((b: any) => {
      const itemsSummary = (b.items || [])
        .map((it: any) => `${it.productName || 'Item'} (Qty: ${it.quantity || 1}, Serial: ${it.productSerial || it.batterySerial || 'N/A'})`)
        .join('; ');

      return [
        escapeCsv(b.invoiceNumber),
        escapeCsv(b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB') : ''),
        escapeCsv(b.customerName || ''),
        escapeCsv(b.customerMobile || ''),
        escapeCsv(b.customerEmail || ''),
        escapeCsv(b.customerAddress || ''),
        escapeCsv(b.showroom || ''),
        escapeCsv(b.employeeName || ''),
        escapeCsv(itemsSummary),
        escapeCsv(b.subtotal || 0),
        escapeCsv(b.discountTotal || 0),
        escapeCsv(b.taxTotal || 0),
        escapeCsv(b.grandTotal || 0),
        escapeCsv(b.paymentMode || ''),
        escapeCsv(b.paymentStatus || ''),
        escapeCsv(b.warrantyGenerated ? 'Yes' : 'No'),
        escapeCsv(b.rewardCoinsAwarded || (b.purchaseRewardAwarded ? 500 : 0)),
        escapeCsv(b.referralCodeUsed || 'N/A'),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Billing_Invoices_Export_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Failed to export invoices:', error);
    res.status(500).json({ success: false, message: 'Failed to export invoices' });
  }
};
