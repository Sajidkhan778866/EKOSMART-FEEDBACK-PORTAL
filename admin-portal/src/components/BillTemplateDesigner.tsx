import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Building2,
  User,
  ListOrdered,
  DollarSign,
  ShieldCheck,
  Palette,
  ArrowUp,
  ArrowDown,
  Copy,
  Printer,
  Sparkles,
  Briefcase,
  FileSpreadsheet,
  Mail,
  Gift,
  Coins,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from 'lucide-react';
import { billTemplateApi } from '../api/client';

export interface IBillTemplate {
  _id?: string;
  name: string;
  templateName?: string;
  type: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Salary' | 'Custom';
  templateType?: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Salary' | 'Custom';
  isActive: boolean;
  isDefault?: boolean;
  referralConfig?: {
    enabled?: boolean;
    showReferralCodeOnBill?: boolean;
    referralCodeLabel?: string;
    showWalletCoinsStamp?: boolean;
    walletCoinsLabel?: string;
    rewardCoins?: number;
    welcomeCoins?: number;
    referrerCoins?: number;
    showroomCoins?: number;
    batteryCoins?: number;
    serviceCoins?: number;
    badgeTitle?: string;
    benefitNote?: string;
    referralPromoNote?: string;
  };
  softBillEmailConfig?: {
    enabled?: boolean;
    autoEmailCustomer?: boolean;
    rewardCoins?: number;
    welcomeCoins?: number;
    referrerCoins?: number;
    showroomCoins?: number;
    batteryCoins?: number;
    serviceCoins?: number;
    emailSubject?: string;
    emailHeading?: string;
    emailMatter?: string;
    referralBoxTitle?: string;
    referralBoxMessage?: string;
    footerHelplineText?: string;
    showReferralCode?: boolean;
    showCoinsSummary?: boolean;
    showWarrantyBadge?: boolean;
  };
  companyProfile: {
    businessName: string;
    tagline?: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    gstin?: string;
    cin?: string;
    pan?: string;
    logoUrl?: string;
    qrCodeUrl?: string;
  };
  header: {
    title: string;
    subtitle?: string;
    showLogo: boolean;
    showGstin: boolean;
    showContact: boolean;
  };
  customerFields: Array<{
    key: string;
    label: string;
    visible: boolean;
    required: boolean;
    order: number;
  }>;
  invoiceFields: Array<{
    key: string;
    label: string;
    visible: boolean;
    order: number;
  }>;
  productColumns: Array<{
    key: string;
    label: string;
    visible: boolean;
    widthPercent?: number;
    align?: 'left' | 'center' | 'right';
    order: number;
  }>;
  salaryConfig: {
    allowancesTitle: string;
    deductionsTitle: string;
    netSalaryLabel: string;
    showWorkingDays: boolean;
    showLeaveSummary: boolean;
    showBankDetails: boolean;
    authorizedSignatory: string;
    earningsColumns: Array<{
      key: string;
      label: string;
      visible: boolean;
      defaultAmount: number;
    }>;
    deductionsColumns: Array<{
      key: string;
      label: string;
      visible: boolean;
      defaultAmount: number;
    }>;
    employeeFields: Array<{
      key: string;
      label: string;
      visible: boolean;
    }>;
  };
  warrantyConfig: {
    enabled: boolean;
    showSerialNumbers: boolean;
    showWarrantyPeriod: boolean;
    warrantyBadgeText?: string;
    warrantyTerms?: string;
  };
  totalsConfig: {
    showSubtotal: boolean;
    showDiscountTotal: boolean;
    showTaxBreakdown: boolean;
    splitGst: boolean;
    showRoundOff: boolean;
    showGrandTotal: boolean;
    showAmountInWords: boolean;
    currencySymbol: string;
  };
  footer: {
    termsAndConditions: string[];
    bankDetails?: {
      bankName?: string;
      accountNumber?: string;
      ifscCode?: string;
      branch?: string;
      upiId?: string;
    };
    authorizedSignatoryLabel?: string;
    signatoryName?: string;
    showSignatureBox: boolean;
    footerNote?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor?: string;
    fontFamily?: string;
    paperSize: 'A4' | 'Thermal-80mm';
    showWatermark: boolean;
    watermarkText?: string;
    borderStyle?: 'rounded' | 'sharp' | 'minimal';
  };
}

export const DEFAULT_TEMPLATES: IBillTemplate[] = [
  {
    name: 'Showroom Tax Invoice',
    templateName: 'Showroom Tax Invoice',
    type: 'Showroom',
    templateType: 'Showroom',
    isActive: true,
    isDefault: true,
    companyProfile: {
      businessName: 'EKOSMART EV BATTERY SOLUTION',
      tagline: 'Clean Energy & Smart Electric Mobility',
      address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
      phone: '+91 8949049003 / +91 9549730483',
      email: 'sales@ekosmartevs.com',
      website: 'www.ekosmartevs.com',
      gstin: '08DTUPM4205B1Z0',
      cin: 'U31909RJ2023PTC085432',
      pan: 'AABCE1234F',
      logoUrl: '',
      qrCodeUrl: '',
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
      { key: 'city', label: 'City & State', visible: true, required: false, order: 5 },
      { key: 'customerGstin', label: 'Customer GSTIN', visible: true, required: false, order: 6 },
      { key: 'vehicleNumber', label: 'EV Vehicle Reg No.', visible: true, required: false, order: 7 },
      { key: 'referralCode', label: 'Customer Referral Code', visible: true, required: false, order: 8 },
    ],
    invoiceFields: [
      { key: 'invoiceNumber', label: 'Invoice No', visible: true, order: 1 },
      { key: 'createdAt', label: 'Invoice Date', visible: true, order: 2 },
      { key: 'paymentMode', label: 'Payment Mode', visible: true, order: 3 },
      { key: 'paymentStatus', label: 'Payment Status', visible: true, order: 4 },
      { key: 'showroom', label: 'Showroom / Branch', visible: true, order: 5 },
      { key: 'employeeName', label: 'Sales Executive', visible: true, order: 6 },
    ],
    productColumns: [
      { key: 'sno', label: '#', visible: true, widthPercent: 5, order: 1 },
      { key: 'productName', label: 'Description of Goods', visible: true, widthPercent: 35, order: 2 },
      { key: 'batterySerial', label: 'Battery / Serial #', visible: true, widthPercent: 20, order: 3 },
      { key: 'hsn', label: 'HSN / SAC', visible: true, widthPercent: 10, order: 4 },
      { key: 'quantity', label: 'Qty', visible: true, widthPercent: 8, order: 5 },
      { key: 'unitPrice', label: 'Unit Rate (₹)', visible: true, widthPercent: 12, order: 6 },
      { key: 'discount', label: 'Discount', visible: true, widthPercent: 10, order: 7 },
      { key: 'taxAmount', label: 'GST (18%)', visible: true, widthPercent: 10, order: 8 },
      { key: 'totalAmount', label: 'Amount (₹)', visible: true, widthPercent: 14, order: 9 },
    ],
    salaryConfig: {
      allowancesTitle: 'Earnings / Gross Pay',
      deductionsTitle: 'Deductions',
      netSalaryLabel: 'Net Pay',
      showWorkingDays: true,
      showLeaveSummary: true,
      showBankDetails: true,
      authorizedSignatory: 'HR & Accounts Manager',
      earningsColumns: [
        { key: 'basicPay', label: 'Basic Salary', visible: true, defaultAmount: 25000 },
        { key: 'hra', label: 'House Rent Allowance (HRA)', visible: true, defaultAmount: 10000 },
        { key: 'conveyance', label: 'Conveyance Allowance', visible: true, defaultAmount: 3000 },
        { key: 'specialAllowance', label: 'Special Allowance', visible: true, defaultAmount: 5000 },
        { key: 'overtime', label: 'Overtime & Incentives', visible: true, defaultAmount: 0 },
      ],
      deductionsColumns: [
        { key: 'pf', label: 'Provident Fund (EPF 12%)', visible: true, defaultAmount: 1800 },
        { key: 'esi', label: 'ESI Contribution', visible: true, defaultAmount: 500 },
        { key: 'professionalTax', label: 'Professional Tax (PT)', visible: true, defaultAmount: 200 },
        { key: 'tds', label: 'TDS / Tax', visible: true, defaultAmount: 0 },
        { key: 'advance', label: 'Loan / Advance Recovery', visible: true, defaultAmount: 0 },
      ],
      employeeFields: [
        { key: 'employeeId', label: 'Employee ID', visible: true },
        { key: 'name', label: 'Employee Name', visible: true },
        { key: 'designation', label: 'Designation', visible: true },
        { key: 'department', label: 'Department', visible: true },
        { key: 'division', label: 'Division', visible: true },
        { key: 'bankAccount', label: 'Bank Account', visible: true },
        { key: 'pan', label: 'PAN Card', visible: true },
      ],
    },
    warrantyConfig: {
      enabled: true,
      showSerialNumbers: true,
      showWarrantyPeriod: true,
      warrantyBadgeText: 'OFFICIAL EKOSMART WARRANTY APPLIED',
      warrantyTerms: 'Covers manufacturer defects & cell performance as per standard warranty policy.',
    },
    totalsConfig: {
      showSubtotal: true,
      showDiscountTotal: true,
      showTaxBreakdown: true,
      splitGst: true,
      showRoundOff: true,
      showGrandTotal: true,
      showAmountInWords: true,
      currencySymbol: '₹',
    },
    referralConfig: {
      enabled: true,
      showReferralCodeOnBill: true,
      referralCodeLabel: 'Customer Referral Code',
      showWalletCoinsStamp: true,
      walletCoinsLabel: '+500 Coins Credited',
      rewardCoins: 500,
      welcomeCoins: 500,
      referrerCoins: 500,
      showroomCoins: 250,
      batteryCoins: 500,
      serviceCoins: 250,
      badgeTitle: 'OFFICIAL EKOSMART REWARDS & DIGITAL WALLET',
      benefitNote: 'Redeem coins for EV battery servicing, maintenance & showroom accessories',
      referralPromoNote: 'Give 500 Coins, Get 500 Coins on every successful friend referral',
    },
    footer: {
      termsAndConditions: [
        'Goods once sold will not be taken back without valid manufacturing defect authorization.',
        'Warranty claims require this original invoice and matching battery serial number.',
        'Warranty is void if safety seal is broken, pack is tampered, or charged with non-certified chargers.',
        'Subject to Kota jurisdiction only.',
      ],
      bankDetails: {
        bankName: 'HDFC Bank Ltd',
        accountNumber: '50200088991122',
        ifscCode: 'HDFC0001234',
        branch: 'Industrial Area Branch, Kota',
        upiId: 'ekosmartevs@hdfcbank',
      },
      authorizedSignatoryLabel: 'For EKOSMART EV BATTERY SOLUTION',
      signatoryName: 'Authorized Signatory',
      showSignatureBox: true,
      footerNote: 'Thank you for choosing EKOSMART Clean Energy & Green Mobility!',
    },
    theme: {
      primaryColor: '#059669', // Emerald
      secondaryColor: '#047857',
      fontFamily: 'Inter',
      paperSize: 'A4',
      showWatermark: true,
      watermarkText: 'ORIGINAL TAX INVOICE',
      borderStyle: 'rounded',
    },
    softBillEmailConfig: {
      enabled: true,
      autoEmailCustomer: true,
      rewardCoins: 500,
      welcomeCoins: 500,
      referrerCoins: 500,
      showroomCoins: 250,
      batteryCoins: 500,
      serviceCoins: 250,
      emailSubject: 'Official EKOSMART GST Tax Invoice & Soft Copy - {{invoiceNumber}}',
      emailHeading: 'Showroom Retail Soft Copy Tax Invoice',
      emailMatter: 'Dear {{customerName}},\n\nThank you for choosing EKOSMART Clean Energy & Green Mobility. Please find your official GST Tax Invoice, Warranty Certificate registration, and exclusive Customer Referral Code details attached below.\n\nYour Unique Referral Code is: {{referralCode}}\nShare this code with your friends and family so they receive {{welcomeCoins}} Coins, and you receive {{referrerCoins}} Coins on their qualifying purchase!',
      referralBoxTitle: 'Ekosmart Referral & Rewards Program',
      referralBoxMessage: 'Share your referral code {{referralCode}} with friends & earn {{coins}} Coins on every qualifying purchase!',
      footerHelplineText: 'For billing assistance or warranty queries, contact Kota Helpline: +91 8949049003 | support@ekosmartdrive.in',
      showReferralCode: true,
      showCoinsSummary: true,
      showWarrantyBadge: true,
    },
  },
  {
    name: 'Employee Official Salary Slip / Payslip',
    templateName: 'Employee Official Salary Slip / Payslip',
    type: 'Salary',
    templateType: 'Salary',
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
    header: {
      title: 'PAYSLIP / SALARY STATEMENT',
      subtitle: 'Confidential Monthly Employee Remuneration Slip',
      showLogo: true,
      showGstin: true,
      showContact: true,
    },
    customerFields: [],
    invoiceFields: [],
    productColumns: [],
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
    warrantyConfig: {
      enabled: false,
      showSerialNumbers: false,
      showWarrantyPeriod: false,
      warrantyBadgeText: '',
      warrantyTerms: '',
    },
    totalsConfig: {
      showSubtotal: true,
      showDiscountTotal: false,
      showTaxBreakdown: false,
      splitGst: false,
      showRoundOff: true,
      showGrandTotal: true,
      showAmountInWords: true,
      currencySymbol: '₹',
    },
    referralConfig: {
      enabled: false,
      showReferralCodeOnBill: false,
      showWalletCoinsStamp: false,
    },
    footer: {
      termsAndConditions: [
        'This payslip is a confidential document generated by the EKOSMART HR & Payroll system.',
        'Discrepancies in attendance or salary computation must be reported to HR within 7 days of credit.',
        'PF and ESIC contributions are remitted directly to respective statutory bodies.',
        'Subject to Kota jurisdiction only.',
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
      primaryColor: '#059669', // Emerald
      secondaryColor: '#047857',
      fontFamily: 'Inter',
      paperSize: 'A4',
      showWatermark: true,
      watermarkText: 'CONFIDENTIAL PAYSLIP',
      borderStyle: 'rounded',
    },
  },
];

export const normalizeTemplate = (tpl?: any): IBillTemplate => {
  if (!tpl) return DEFAULT_TEMPLATES[0];

  const templateType = (tpl.type || tpl.templateType || 'Showroom') as any;
  const isSalary = templateType === 'Salary';

  const company = tpl.companyProfile || tpl.company || {};
  const companyProfile = {
    businessName: company.businessName || company.name || 'EKOSMART EV BATTERY SOLUTION',
    tagline: company.tagline || company.subtitle || 'Clean Energy & Smart Electric Mobility',
    address: company.address || 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    phone: company.phone || '+91 8949049003 / +91 9549730483',
    email: company.email || (isSalary ? 'hr@ekosmartdrive.in' : 'support@ekosmartdrive.in'),
    website: company.website || 'www.ekosmartdrive.in',
    gstin: company.gstin || '08DTUPM4205B1Z0',
    cin: company.cin || 'U31909RJ2023PTC085432',
    pan: company.pan || 'AABCE1234F',
    logoUrl: company.logoUrl || '',
    qrCodeUrl: company.qrCodeUrl || '',
  };

  const header = {
    title: tpl.header?.title || (isSalary ? 'PAYSLIP / SALARY STATEMENT' : 'TAX INVOICE'),
    subtitle: tpl.header?.subtitle || (isSalary ? 'Confidential Monthly Employee Remuneration Slip' : 'Original for Recipient (Showroom Retail)'),
    showLogo: tpl.header?.showLogo !== undefined ? Boolean(tpl.header.showLogo) : true,
    showGstin: tpl.header?.showGstin !== undefined ? Boolean(tpl.header.showGstin) : true,
    showContact: tpl.header?.showContact !== undefined ? Boolean(tpl.header.showContact) : true,
  };

  let customerFields = Array.isArray(tpl.customerFields) && tpl.customerFields.length > 0
    ? tpl.customerFields.map((f: any, idx: number) => ({
        key: f.key || `field_${idx}`,
        label: f.label || f.key || 'Field',
        visible: f.visible !== undefined ? Boolean(f.visible) : true,
        required: Boolean(f.required),
        order: f.order || idx + 1,
      }))
    : DEFAULT_TEMPLATES[0].customerFields;

  // Ensure referralCode exists in customerFields for invoice templates
  if (!isSalary && !customerFields.some((f: any) => f.key === 'referralCode')) {
    customerFields = [
      ...customerFields,
      {
        key: 'referralCode',
        label: 'Customer Referral Code',
        visible: true,
        required: false,
        order: customerFields.length + 1,
      },
    ];
  }

  const invoiceFields = Array.isArray(tpl.invoiceFields) && tpl.invoiceFields.length > 0
    ? tpl.invoiceFields.map((f: any, idx: number) => ({
        key: f.key || `inv_field_${idx}`,
        label: f.label || f.key || 'Field',
        visible: f.visible !== undefined ? Boolean(f.visible) : true,
        order: f.order || idx + 1,
      }))
    : DEFAULT_TEMPLATES[0].invoiceFields;

  const productColumns = Array.isArray(tpl.productColumns) && tpl.productColumns.length > 0
    ? tpl.productColumns.map((c: any, idx: number) => ({
        key: c.key || `col_${idx}`,
        label: c.label || c.key || 'Column',
        visible: c.visible !== undefined ? Boolean(c.visible) : true,
        widthPercent: c.widthPercent || (c.width ? parseInt(c.width) : 10),
        order: c.order || idx + 1,
      }))
    : DEFAULT_TEMPLATES[0].productColumns;

  const salaryConfig = {
    allowancesTitle: tpl.salaryConfig?.allowancesTitle || 'Earnings / Gross Pay',
    deductionsTitle: tpl.salaryConfig?.deductionsTitle || 'Deductions & Recoveries',
    netSalaryLabel: tpl.salaryConfig?.netSalaryLabel || 'Net Pay / Take Home Salary',
    showWorkingDays: tpl.salaryConfig?.showWorkingDays !== undefined ? Boolean(tpl.salaryConfig.showWorkingDays) : true,
    showLeaveSummary: tpl.salaryConfig?.showLeaveSummary !== undefined ? Boolean(tpl.salaryConfig.showLeaveSummary) : true,
    showBankDetails: tpl.salaryConfig?.showBankDetails !== undefined ? Boolean(tpl.salaryConfig.showBankDetails) : true,
    authorizedSignatory: tpl.salaryConfig?.authorizedSignatory || 'HR & Finance Director / Authorized Signatory',
    earningsColumns: Array.isArray(tpl.salaryConfig?.earningsColumns) && tpl.salaryConfig.earningsColumns.length > 0
      ? tpl.salaryConfig.earningsColumns
      : DEFAULT_TEMPLATES[1].salaryConfig.earningsColumns,
    deductionsColumns: Array.isArray(tpl.salaryConfig?.deductionsColumns) && tpl.salaryConfig.deductionsColumns.length > 0
      ? tpl.salaryConfig.deductionsColumns
      : DEFAULT_TEMPLATES[1].salaryConfig.deductionsColumns,
    employeeFields: Array.isArray(tpl.salaryConfig?.employeeFields) && tpl.salaryConfig.employeeFields.length > 0
      ? tpl.salaryConfig.employeeFields
      : DEFAULT_TEMPLATES[1].salaryConfig.employeeFields,
  };

  const warrantyConfig = {
    enabled: tpl.warrantyConfig?.enabled !== undefined ? Boolean(tpl.warrantyConfig.enabled) : (tpl.warrantyConfig?.visible !== undefined ? Boolean(tpl.warrantyConfig.visible) : !isSalary),
    showSerialNumbers: tpl.warrantyConfig?.showSerialNumbers !== undefined ? Boolean(tpl.warrantyConfig.showSerialNumbers) : true,
    showWarrantyPeriod: tpl.warrantyConfig?.showWarrantyPeriod !== undefined ? Boolean(tpl.warrantyConfig.showWarrantyPeriod) : true,
    warrantyBadgeText: tpl.warrantyConfig?.badgeText || tpl.warrantyConfig?.warrantyBadgeText || 'OFFICIAL EKOSMART WARRANTY APPLIED',
    warrantyTerms: tpl.warrantyConfig?.warrantyTerms || tpl.warrantyConfig?.termsSummary || 'Covers manufacturer defects & cell performance as per standard warranty policy.',
  };

  const totalsConfig = {
    showSubtotal: tpl.totalsConfig?.showSubtotal !== undefined ? Boolean(tpl.totalsConfig.showSubtotal) : true,
    showDiscountTotal: tpl.totalsConfig?.showDiscountTotal !== undefined ? Boolean(tpl.totalsConfig.showDiscountTotal) : (tpl.totalsConfig?.showDiscount !== undefined ? Boolean(tpl.totalsConfig.showDiscount) : true),
    showTaxBreakdown: tpl.totalsConfig?.showTaxBreakdown !== undefined ? Boolean(tpl.totalsConfig.showTaxBreakdown) : (tpl.totalsConfig?.showTaxBreakup !== undefined ? Boolean(tpl.totalsConfig.showTaxBreakup) : true),
    splitGst: tpl.totalsConfig?.splitGst !== undefined ? Boolean(tpl.totalsConfig.splitGst) : true,
    showRoundOff: tpl.totalsConfig?.showRoundOff !== undefined ? Boolean(tpl.totalsConfig.showRoundOff) : true,
    showGrandTotal: tpl.totalsConfig?.showGrandTotal !== undefined ? Boolean(tpl.totalsConfig.showGrandTotal) : true,
    showAmountInWords: tpl.totalsConfig?.showAmountInWords !== undefined ? Boolean(tpl.totalsConfig.showAmountInWords) : true,
    currencySymbol: tpl.totalsConfig?.currencySymbol || '₹',
  };

  let rawTerms = tpl.footer?.termsAndConditions;
  let termsList: string[] = [];
  if (Array.isArray(rawTerms)) {
    termsList = rawTerms;
  } else if (typeof rawTerms === 'string' && rawTerms.trim()) {
    termsList = rawTerms.split('\n').filter(Boolean);
  } else {
    termsList = isSalary
      ? DEFAULT_TEMPLATES[1].footer.termsAndConditions
      : DEFAULT_TEMPLATES[0].footer.termsAndConditions;
  }

  const footer = {
    termsAndConditions: termsList,
    bankDetails: {
      bankName: tpl.footer?.bankDetails?.bankName || 'HDFC Bank Ltd',
      accountNumber: tpl.footer?.bankDetails?.accountNumber || '50200088991122',
      ifscCode: tpl.footer?.bankDetails?.ifscCode || 'HDFC0001234',
      branch: tpl.footer?.bankDetails?.branch || 'Industrial Area Branch, Kota',
      upiId: tpl.footer?.bankDetails?.upiId || (isSalary ? 'ekosmartpayroll@hdfcbank' : 'ekosmartevs@hdfcbank'),
    },
    authorizedSignatoryLabel: tpl.footer?.authorizedSignatoryLabel || tpl.footer?.authorizedSignatoryTitle || 'For EKOSMART EV BATTERY SOLUTION',
    signatoryName: tpl.footer?.signatoryName || (isSalary ? 'Authorized HR Signatory' : 'Authorized Signatory'),
    showSignatureBox: tpl.footer?.showSignatureBox !== undefined ? Boolean(tpl.footer.showSignatureBox) : true,
    footerNote: tpl.footer?.footerNote || tpl.footer?.thankYouMessage || (isSalary ? 'This is a computer-generated salary slip and requires authorized signature & company seal.' : 'Thank you for choosing EKOSMART Clean Energy & Green Mobility!'),
  };

  const theme = {
    primaryColor: tpl.theme?.primaryColor || '#059669',
    secondaryColor: tpl.theme?.secondaryColor || tpl.theme?.accentColor || '#047857',
    fontFamily: tpl.theme?.fontFamily || 'Inter',
    paperSize: (tpl.theme?.paperSize as 'A4' | 'Thermal-80mm') || 'A4',
    showWatermark: tpl.theme?.showWatermark !== undefined ? Boolean(tpl.theme.showWatermark) : true,
    watermarkText: tpl.theme?.watermarkText || (isSalary ? 'CONFIDENTIAL PAYSLIP' : 'ORIGINAL TAX INVOICE'),
    borderStyle: (tpl.theme?.borderStyle as 'rounded' | 'sharp' | 'minimal') || 'rounded',
  };

  const softBillEmailConfig = {
    enabled: tpl.softBillEmailConfig?.enabled !== undefined ? Boolean(tpl.softBillEmailConfig.enabled) : true,
    autoEmailCustomer: tpl.softBillEmailConfig?.autoEmailCustomer !== undefined ? Boolean(tpl.softBillEmailConfig.autoEmailCustomer) : true,
    rewardCoins: Number(tpl.softBillEmailConfig?.rewardCoins ?? tpl.referralConfig?.rewardCoins) || 500,
    welcomeCoins: Number(tpl.softBillEmailConfig?.welcomeCoins ?? tpl.referralConfig?.welcomeCoins) || 500,
    referrerCoins: Number(tpl.softBillEmailConfig?.referrerCoins ?? tpl.referralConfig?.referrerCoins) || 500,
    showroomCoins: Number(tpl.softBillEmailConfig?.showroomCoins ?? tpl.referralConfig?.showroomCoins) || 250,
    batteryCoins: Number(tpl.softBillEmailConfig?.batteryCoins ?? tpl.referralConfig?.batteryCoins) || 500,
    serviceCoins: Number(tpl.softBillEmailConfig?.serviceCoins ?? tpl.referralConfig?.serviceCoins) || 250,
    emailSubject: tpl.softBillEmailConfig?.emailSubject || 'Official EKOSMART GST Tax Invoice & Soft Copy - {{invoiceNumber}}',
    emailHeading: tpl.softBillEmailConfig?.emailHeading || 'Showroom Retail Soft Copy Tax Invoice',
    emailMatter: tpl.softBillEmailConfig?.emailMatter || 'Dear {{customerName}},\n\nThank you for choosing EKOSMART Clean Energy & Green Mobility. Please find your official GST Tax Invoice, Warranty Certificate registration, and exclusive Customer Referral Code details attached below.\n\nYour Unique Referral Code is: {{referralCode}}\nShare this code with your friends and family so they receive {{welcomeCoins}} Coins, and you receive {{referrerCoins}} Coins on their qualifying purchase!',
    referralBoxTitle: tpl.softBillEmailConfig?.referralBoxTitle || 'Ekosmart Referral & Rewards Program',
    referralBoxMessage: tpl.softBillEmailConfig?.referralBoxMessage || 'Share your referral code {{referralCode}} with friends & earn {{coins}} Coins on every qualifying purchase!',
    footerHelplineText: tpl.softBillEmailConfig?.footerHelplineText || 'For billing assistance or warranty queries, contact Kota Helpline: +91 8949049003 | support@ekosmartdrive.in',
    showReferralCode: tpl.softBillEmailConfig?.showReferralCode !== undefined ? Boolean(tpl.softBillEmailConfig.showReferralCode) : true,
    showCoinsSummary: tpl.softBillEmailConfig?.showCoinsSummary !== undefined ? Boolean(tpl.softBillEmailConfig.showCoinsSummary) : true,
    showWarrantyBadge: tpl.softBillEmailConfig?.showWarrantyBadge !== undefined ? Boolean(tpl.softBillEmailConfig.showWarrantyBadge) : true,
  };

  const referralConfig = {
    enabled: tpl.referralConfig?.enabled !== undefined ? Boolean(tpl.referralConfig.enabled) : true,
    showReferralCodeOnBill: tpl.referralConfig?.showReferralCodeOnBill !== undefined ? Boolean(tpl.referralConfig.showReferralCodeOnBill) : true,
    referralCodeLabel: tpl.referralConfig?.referralCodeLabel || 'Customer Referral Code',
    showWalletCoinsStamp: tpl.referralConfig?.showWalletCoinsStamp !== undefined ? Boolean(tpl.referralConfig.showWalletCoinsStamp) : true,
    walletCoinsLabel: tpl.referralConfig?.walletCoinsLabel || `+${tpl.referralConfig?.rewardCoins ?? softBillEmailConfig.rewardCoins} Coins Credited`,
    rewardCoins: Number(tpl.referralConfig?.rewardCoins ?? softBillEmailConfig.rewardCoins) || 500,
    welcomeCoins: Number(tpl.referralConfig?.welcomeCoins ?? softBillEmailConfig.welcomeCoins) || 500,
    referrerCoins: Number(tpl.referralConfig?.referrerCoins ?? softBillEmailConfig.referrerCoins) || 500,
    showroomCoins: Number(tpl.referralConfig?.showroomCoins ?? softBillEmailConfig.showroomCoins) || 250,
    batteryCoins: Number(tpl.referralConfig?.batteryCoins ?? softBillEmailConfig.batteryCoins) || 500,
    serviceCoins: Number(tpl.referralConfig?.serviceCoins ?? softBillEmailConfig.serviceCoins) || 250,
    badgeTitle: tpl.referralConfig?.badgeTitle || 'OFFICIAL EKOSMART REWARDS & DIGITAL WALLET',
    benefitNote: tpl.referralConfig?.benefitNote || 'Redeem coins for EV battery servicing, maintenance & showroom accessories',
    referralPromoNote: tpl.referralConfig?.referralPromoNote || 'Give 500 Coins, Get 500 Coins on every successful friend referral',
  };

  return {
    _id: tpl._id,
    name: tpl.name || tpl.templateName || (isSalary ? 'Employee Official Salary Slip' : 'Showroom Tax Invoice'),
    templateName: tpl.templateName || tpl.name || (isSalary ? 'Employee Official Salary Slip' : 'Showroom Tax Invoice'),
    type: templateType,
    templateType,
    isActive: Boolean(tpl.isActive),
    isDefault: Boolean(tpl.isDefault),
    referralConfig,
    softBillEmailConfig,
    companyProfile,
    header,
    customerFields,
    invoiceFields,
    productColumns,
    salaryConfig,
    warrantyConfig,
    totalsConfig,
    footer,
    theme,
  };
};

const PRESET_COLORS = [
  { name: 'Emerald Brand', hex: '#059669' },
  { name: 'Indigo Corporate', hex: '#4f46e5' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Teal Pro', hex: '#0d9488' },
  { name: 'Slate Dark', hex: '#334155' },
  { name: 'Rose Red', hex: '#e11d48' },
  { name: 'Violet Royal', hex: '#7c3aed' },
];

export interface BillTemplateDesignerProps {
  initialType?: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Salary' | 'Custom';
  restrictType?: 'Salary' | 'Billing';
}

export const BillTemplateDesigner: React.FC<BillTemplateDesignerProps> = ({
  initialType,
  restrictType,
}) => {
  const [templates, setTemplates] = useState<IBillTemplate[]>(() => {
    const list = DEFAULT_TEMPLATES.map(normalizeTemplate);
    if (restrictType === 'Salary') {
      return list.filter((t) => t.type === 'Salary');
    }
    if (restrictType === 'Billing') {
      return list.filter((t) => t.type !== 'Salary');
    }
    return list;
  });
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState<IBillTemplate>(() => {
    if (restrictType === 'Salary' || initialType === 'Salary') {
      return normalizeTemplate(DEFAULT_TEMPLATES.find((t) => t.type === 'Salary') || DEFAULT_TEMPLATES[1]);
    }
    return normalizeTemplate(DEFAULT_TEMPLATES[0]);
  });
  const [activeTab, setActiveTab] = useState<'company' | 'customer' | 'columns' | 'salary' | 'totals' | 'referral' | 'footer' | 'theme' | 'email'>(
    restrictType === 'Salary' || initialType === 'Salary' ? 'salary' : 'company'
  );
  const [previewMode, setPreviewMode] = useState<'invoice' | 'softEmail'>('invoice');
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [restrictType]);

  const fetchTemplates = async () => {
    try {
      const res = await billTemplateApi.getAll();
      let normalized: IBillTemplate[] = [];
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        normalized = res.data.data.map(normalizeTemplate);
      } else {
        normalized = DEFAULT_TEMPLATES.map(normalizeTemplate);
      }

      if (restrictType === 'Salary') {
        normalized = normalized.filter((t) => t.type === 'Salary');
        if (normalized.length === 0) {
          normalized = [normalizeTemplate(DEFAULT_TEMPLATES.find((t) => t.type === 'Salary') || DEFAULT_TEMPLATES[1])];
        }
      } else if (restrictType === 'Billing') {
        normalized = normalized.filter((t) => t.type !== 'Salary');
      }

      setTemplates(normalized);
      const activeIdx = normalized.findIndex((t: IBillTemplate) => t.isActive);
      const chosenIdx = activeIdx >= 0 ? activeIdx : 0;
      setActiveTemplateIndex(chosenIdx);
      if (normalized[chosenIdx]) {
        setCurrentTemplate(normalized[chosenIdx]);
      }
    } catch {
      let defaults = DEFAULT_TEMPLATES.map(normalizeTemplate);
      if (restrictType === 'Salary') {
        defaults = defaults.filter((t) => t.type === 'Salary');
      } else if (restrictType === 'Billing') {
        defaults = defaults.filter((t) => t.type !== 'Salary');
      }
      setTemplates(defaults);
      setCurrentTemplate(defaults[0]);
    }
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const selectTemplate = (index: number) => {
    if (templates[index]) {
      setActiveTemplateIndex(index);
      setCurrentTemplate(normalizeTemplate(templates[index]));
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      const payload = {
        ...currentTemplate,
        templateName: currentTemplate.name,
        templateType: currentTemplate.type,
      };

      if (currentTemplate._id) {
        const res = await billTemplateApi.update(currentTemplate._id, payload);
        if (res.data?.success) {
          showAlert('success', `Bill template "${currentTemplate.name}" saved successfully!`);
          fetchTemplates();
        }
      } else {
        const res = await billTemplateApi.create(payload);
        if (res.data?.success) {
          showAlert('success', `New template "${currentTemplate.name}" created successfully!`);
          fetchTemplates();
        }
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to save bill template');
    } finally {
      setSaving(false);
    }
  };

  const handleActivateTemplate = async () => {
    if (!currentTemplate._id) {
      showAlert('error', 'Please save the template first before setting it as active.');
      return;
    }
    try {
      setSaving(true);
      const res = await billTemplateApi.activate(currentTemplate._id);
      if (res.data?.success) {
        showAlert('success', `Template "${currentTemplate.name}" is now the ACTIVE template for ${currentTemplate.type}!`);
        fetchTemplates();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to activate template');
    } finally {
      setSaving(false);
    }
  };

  const handleCloneTemplate = () => {
    const cloned: IBillTemplate = normalizeTemplate({
      ...currentTemplate,
      _id: undefined,
      name: `${currentTemplate.name} (Custom Copy)`,
      templateName: `${currentTemplate.name} (Custom Copy)`,
      isActive: false,
      isDefault: false,
    });
    setTemplates([...templates, cloned]);
    setActiveTemplateIndex(templates.length);
    setCurrentTemplate(cloned);
    showAlert('success', 'Cloned template as a new editable draft. Click "Save Template" when ready.');
  };

  // --- DYNAMIC ADD & CUSTOM FIELD STATE ---
  const [newColumnForm, setNewColumnForm] = useState({
    label: '',
    key: '',
    widthPercent: 12,
    align: 'left' as 'left' | 'center' | 'right',
  });
  const [showAddColumn, setShowAddColumn] = useState(false);

  const [newCustomerFieldForm, setNewCustomerFieldForm] = useState({
    label: '',
    key: '',
    required: false,
  });
  const [showAddCustomerField, setShowAddCustomerField] = useState(false);

  const [newInvoiceFieldForm, setNewInvoiceFieldForm] = useState({
    label: '',
    key: '',
  });
  const [showAddInvoiceField, setShowAddInvoiceField] = useState(false);

  const [newTermInput, setNewTermInput] = useState('');
  const [showBulkTerms, setShowBulkTerms] = useState(false);
  const [newEarningForm, setNewEarningForm] = useState({ label: '', defaultAmount: 5000 });
  const [newDeductionForm, setNewDeductionForm] = useState({ label: '', defaultAmount: 500 });
  const [newEmpFieldForm, setNewEmpFieldForm] = useState({ label: '', key: '' });

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join('') || `field_${Date.now()}`;
  };

  // --- COLUMN HANDLERS ---
  const handleAddColumn = (preset?: { label: string; key?: string; widthPercent?: number; align?: 'left' | 'center' | 'right' }) => {
    const label = (preset?.label || newColumnForm.label).trim();
    if (!label) {
      showAlert('error', 'Please enter a column header label name.');
      return;
    }
    const key = preset?.key || (newColumnForm.key.trim() ? slugify(newColumnForm.key) : slugify(label));
    const widthPercent = preset?.widthPercent || Number(newColumnForm.widthPercent) || 12;
    const align = preset?.align || newColumnForm.align || 'left';

    const cols = [...(currentTemplate.productColumns || [])];
    if (cols.some((c) => c.key === key)) {
      showAlert('error', `A table column with key "${key}" already exists.`);
      return;
    }

    cols.push({
      key,
      label,
      visible: true,
      widthPercent,
      align,
      order: cols.length + 1,
    });

    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
    setNewColumnForm({ label: '', key: '', widthPercent: 12, align: 'left' });
    setShowAddColumn(false);
    showAlert('success', `Added new column "${label}" to product table!`);
  };

  const handleDeleteColumn = (index: number) => {
    const cols = [...(currentTemplate.productColumns || [])];
    const removed = cols.splice(index, 1)[0];
    cols.forEach((col, idx) => {
      col.order = idx + 1;
    });
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
    showAlert('success', `Removed column "${removed?.label || 'Column'}" from table.`);
  };

  const updateColumnWidth = (index: number, widthPercent: number) => {
    const cols = [...(currentTemplate.productColumns || [])];
    if (!cols[index]) return;
    cols[index].widthPercent = widthPercent;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  const updateColumnAlign = (index: number, align: 'left' | 'center' | 'right') => {
    const cols = [...(currentTemplate.productColumns || [])];
    if (!cols[index]) return;
    (cols[index] as any).align = align;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const cols = [...(currentTemplate.productColumns || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cols.length) return;

    const temp = cols[index];
    cols[index] = cols[targetIdx];
    cols[targetIdx] = temp;

    cols.forEach((col, i) => {
      col.order = i + 1;
    });

    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  const toggleColumnVisibility = (index: number) => {
    const cols = [...(currentTemplate.productColumns || [])];
    if (!cols[index]) return;
    cols[index].visible = !cols[index].visible;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  const updateColumnLabel = (index: number, label: string) => {
    const cols = [...(currentTemplate.productColumns || [])];
    if (!cols[index]) return;
    cols[index].label = label;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  const handleResetColumns = () => {
    const defaults = isSalaryTemplate
      ? DEFAULT_TEMPLATES[1].productColumns
      : DEFAULT_TEMPLATES[0].productColumns;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: defaults.map((c, i) => ({ ...c, order: i + 1 })),
    });
    showAlert('success', 'Reset product table columns to default.');
  };

  // --- CUSTOMER FIELD HANDLERS ---
  const handleAddCustomerField = (preset?: { label: string; key?: string; required?: boolean }) => {
    const label = (preset?.label || newCustomerFieldForm.label).trim();
    if (!label) {
      showAlert('error', 'Please enter a field label.');
      return;
    }
    const key = preset?.key || (newCustomerFieldForm.key.trim() ? slugify(newCustomerFieldForm.key) : slugify(label));
    const required = preset?.required !== undefined ? preset.required : Boolean(newCustomerFieldForm.required);

    const fields = [...(currentTemplate.customerFields || [])];
    if (fields.some((f) => f.key === key)) {
      showAlert('error', `A customer field with key "${key}" already exists.`);
      return;
    }

    fields.push({
      key,
      label,
      visible: true,
      required,
      order: fields.length + 1,
    });

    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
    setNewCustomerFieldForm({ label: '', key: '', required: false });
    setShowAddCustomerField(false);
    showAlert('success', `Added new customer field "${label}"!`);
  };

  const handleDeleteCustomerField = (index: number) => {
    const fields = [...(currentTemplate.customerFields || [])];
    const removed = fields.splice(index, 1)[0];
    fields.forEach((f, idx) => {
      f.order = idx + 1;
    });
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
    showAlert('success', `Removed field "${removed?.label || 'Field'}".`);
  };

  const moveCustomerField = (index: number, direction: 'up' | 'down') => {
    const fields = [...(currentTemplate.customerFields || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIdx];
    fields[targetIdx] = temp;

    fields.forEach((f, i) => {
      f.order = i + 1;
    });

    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
  };

  const toggleCustomerField = (index: number) => {
    const fields = [...(currentTemplate.customerFields || [])];
    if (!fields[index]) return;
    fields[index].visible = !fields[index].visible;
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
  };

  const updateCustomerFieldLabel = (index: number, label: string) => {
    const fields = [...(currentTemplate.customerFields || [])];
    if (!fields[index]) return;
    fields[index].label = label;
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
  };

  const toggleCustomerFieldRequired = (index: number) => {
    const fields = [...(currentTemplate.customerFields || [])];
    if (!fields[index]) return;
    fields[index].required = !fields[index].required;
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
  };

  const handleResetCustomerFields = () => {
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: DEFAULT_TEMPLATES[0].customerFields.map((f, i) => ({ ...f, order: i + 1 })),
    });
    showAlert('success', 'Reset customer fields to default.');
  };

  // --- INVOICE META FIELD HANDLERS ---
  const handleAddInvoiceField = (preset?: { label: string; key?: string }) => {
    const label = (preset?.label || newInvoiceFieldForm.label).trim();
    if (!label) {
      showAlert('error', 'Please enter an invoice field label.');
      return;
    }
    const key = preset?.key || (newInvoiceFieldForm.key.trim() ? slugify(newInvoiceFieldForm.key) : slugify(label));

    const fields = [...(currentTemplate.invoiceFields || [])];
    if (fields.some((f) => f.key === key)) {
      showAlert('error', `An invoice field with key "${key}" already exists.`);
      return;
    }

    fields.push({
      key,
      label,
      visible: true,
      order: fields.length + 1,
    });

    setCurrentTemplate({
      ...currentTemplate,
      invoiceFields: fields,
    });
    setNewInvoiceFieldForm({ label: '', key: '' });
    setShowAddInvoiceField(false);
    showAlert('success', `Added new invoice meta field "${label}"!`);
  };

  const handleDeleteInvoiceField = (index: number) => {
    const fields = [...(currentTemplate.invoiceFields || [])];
    const removed = fields.splice(index, 1)[0];
    fields.forEach((f, idx) => {
      f.order = idx + 1;
    });
    setCurrentTemplate({
      ...currentTemplate,
      invoiceFields: fields,
    });
    showAlert('success', `Removed invoice field "${removed?.label || 'Field'}".`);
  };

  const toggleInvoiceField = (index: number) => {
    const fields = [...(currentTemplate.invoiceFields || [])];
    if (!fields[index]) return;
    fields[index].visible = !fields[index].visible;
    setCurrentTemplate({
      ...currentTemplate,
      invoiceFields: fields,
    });
  };

  const updateInvoiceFieldLabel = (index: number, label: string) => {
    const fields = [...(currentTemplate.invoiceFields || [])];
    if (!fields[index]) return;
    fields[index].label = label;
    setCurrentTemplate({
      ...currentTemplate,
      invoiceFields: fields,
    });
  };

  const moveInvoiceField = (index: number, direction: 'up' | 'down') => {
    const fields = [...(currentTemplate.invoiceFields || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const temp = fields[index];
    fields[index] = fields[targetIdx];
    fields[targetIdx] = temp;
    fields.forEach((f, i) => {
      f.order = i + 1;
    });
    setCurrentTemplate({
      ...currentTemplate,
      invoiceFields: fields,
    });
  };

  // --- TERMS & CONDITIONS HANDLERS ---
  const handleAddTerm = (text?: string) => {
    const term = (text || newTermInput).trim();
    if (!term) return;
    const terms = [...(currentTemplate.footer?.termsAndConditions || [])];
    terms.push(term);
    setCurrentTemplate({
      ...currentTemplate,
      footer: {
        ...currentTemplate.footer,
        termsAndConditions: terms,
      },
    });
    setNewTermInput('');
    showAlert('success', 'Added new invoice term / condition!');
  };

  const handleDeleteTerm = (index: number) => {
    const terms = [...(currentTemplate.footer?.termsAndConditions || [])];
    terms.splice(index, 1);
    setCurrentTemplate({
      ...currentTemplate,
      footer: {
        ...currentTemplate.footer,
        termsAndConditions: terms,
      },
    });
  };

  const handleMoveTerm = (index: number, direction: 'up' | 'down') => {
    const terms = [...(currentTemplate.footer?.termsAndConditions || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= terms.length) return;
    const temp = terms[index];
    terms[index] = terms[targetIdx];
    terms[targetIdx] = temp;
    setCurrentTemplate({
      ...currentTemplate,
      footer: {
        ...currentTemplate.footer,
        termsAndConditions: terms,
      },
    });
  };

  const handleUpdateTerm = (index: number, text: string) => {
    const terms = [...(currentTemplate.footer?.termsAndConditions || [])];
    terms[index] = text;
    setCurrentTemplate({
      ...currentTemplate,
      footer: {
        ...currentTemplate.footer,
        termsAndConditions: terms,
      },
    });
  };

  // --- SALARY CONFIG HANDLERS ---
  const handleAddEarning = (preset?: { label: string; defaultAmount: number }) => {
    const label = (preset?.label || newEarningForm.label).trim();
    if (!label) return;
    const defaultAmount = preset?.defaultAmount || Number(newEarningForm.defaultAmount) || 0;
    const earnings = [...(currentTemplate.salaryConfig?.earningsColumns || [])];
    const key = slugify(label);
    earnings.push({ key, label, visible: true, defaultAmount });
    setCurrentTemplate({
      ...currentTemplate,
      salaryConfig: {
        ...currentTemplate.salaryConfig,
        earningsColumns: earnings,
      },
    });
    setNewEarningForm({ label: '', defaultAmount: 5000 });
    showAlert('success', `Added earning head "${label}"!`);
  };

  const handleDeleteEarning = (index: number) => {
    const earnings = [...(currentTemplate.salaryConfig?.earningsColumns || [])];
    earnings.splice(index, 1);
    setCurrentTemplate({
      ...currentTemplate,
      salaryConfig: {
        ...currentTemplate.salaryConfig,
        earningsColumns: earnings,
      },
    });
  };

  const handleAddDeduction = (preset?: { label: string; defaultAmount: number }) => {
    const label = (preset?.label || newDeductionForm.label).trim();
    if (!label) return;
    const defaultAmount = preset?.defaultAmount || Number(newDeductionForm.defaultAmount) || 0;
    const deductions = [...(currentTemplate.salaryConfig?.deductionsColumns || [])];
    const key = slugify(label);
    deductions.push({ key, label, visible: true, defaultAmount });
    setCurrentTemplate({
      ...currentTemplate,
      salaryConfig: {
        ...currentTemplate.salaryConfig,
        deductionsColumns: deductions,
      },
    });
    setNewDeductionForm({ label: '', defaultAmount: 500 });
    showAlert('success', `Added deduction head "${label}"!`);
  };

  const handleDeleteDeduction = (index: number) => {
    const deductions = [...(currentTemplate.salaryConfig?.deductionsColumns || [])];
    deductions.splice(index, 1);
    setCurrentTemplate({
      ...currentTemplate,
      salaryConfig: {
        ...currentTemplate.salaryConfig,
        deductionsColumns: deductions,
      },
    });
  };

  const handleAddEmployeeField = (preset?: { label: string; key?: string }) => {
    const label = (preset?.label || newEmpFieldForm.label).trim();
    if (!label) return;
    const key = preset?.key || (newEmpFieldForm.key.trim() ? slugify(newEmpFieldForm.key) : slugify(label));
    const empFields = [...(currentTemplate.salaryConfig?.employeeFields || [])];
    empFields.push({ key, label, visible: true });
    setCurrentTemplate({
      ...currentTemplate,
      salaryConfig: {
        ...currentTemplate.salaryConfig,
        employeeFields: empFields,
      },
    });
    setNewEmpFieldForm({ label: '', key: '' });
    showAlert('success', `Added employee field "${label}"!`);
  };

  const handleDeleteEmployeeField = (index: number) => {
    const empFields = [...(currentTemplate.salaryConfig?.employeeFields || [])];
    empFields.splice(index, 1);
    setCurrentTemplate({
      ...currentTemplate,
      salaryConfig: {
        ...currentTemplate.salaryConfig,
        employeeFields: empFields,
      },
    });
  };

  const isSalaryTemplate = currentTemplate.type === 'Salary';

  // Sample data for realistic live invoice preview
  const sampleBill = {
    invoiceNumber: 'EBS-SHW-2026-0042',
    date: new Date().toLocaleDateString('en-IN'),
    time: '02:45 PM',
    customerName: 'Rahul Sharma',
    customerMobile: '9829012345',
    customerEmail: 'rahul.sharma@example.com',
    customerAddress: '42, Vigyan Nagar, Aerodrome Circle',
    city: 'Kota, Rajasthan - 324005',
    customerGstin: '08ABCD1234E1Z2',
    vehicleNumber: 'RJ-20-EV-9942',
    referralCode: 'EBS-REF-9942',
    customerReferralCode: 'EBS-REF-9942',
    paymentMode: 'UPI (QR Code Scan)',
    paymentStatus: 'Paid',
    showroom: 'Kota Main Showroom Counter',
    employeeName: 'Mohit Verma (Billing Staff)',
    items: [
      {
        sno: 1,
        productName: '60V 30Ah LFP Smart EV Battery Pack',
        batterySerial: 'BAT-LFP-6030-9941',
        hsn: '85076000',
        quantity: 1,
        unitPrice: 26000,
        discount: 1000,
        taxAmount: 4500,
        totalAmount: 29500,
        warrantyPeriodMonths: 36,
      },
      {
        sno: 2,
        productName: '67.2V 6A High-Speed Smart Charger',
        batterySerial: 'CHG-6720-1102',
        hsn: '85044030',
        quantity: 1,
        unitPrice: 3500,
        discount: 200,
        taxAmount: 594,
        totalAmount: 3894,
        warrantyPeriodMonths: 12,
      },
    ],
    subtotal: 29500,
    discountTotal: 1200,
    cgst: 2547,
    sgst: 2547,
    grandTotal: 33394,
    amountInWords: 'Thirty-Three Thousand Three Hundred Ninety-Four Rupees Only',
  };

  // Sample data for realistic live salary slip preview
  const sampleSalary = {
    monthYear: 'September 2026',
    employeeId: 'EMP-6462',
    employeeName: 'Sajid Khan',
    designation: 'Senior Battery Systems Engineer',
    department: 'Technical Engineering',
    division: 'Battery & R&D Plant',
    joiningDate: '15-Mar-2024',
    bankName: 'HDFC Bank Ltd',
    bankAccount: '50200088996462',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE6462F',
    uanNumber: '101234566462',
    totalWorkingDays: 30,
    paidDays: 28,
    leaveDays: 2,
    earnings: [
      { label: 'Basic Salary', amount: 25000 },
      { label: 'House Rent Allowance (HRA)', amount: 10000 },
      { label: 'Conveyance Allowance', amount: 3000 },
      { label: 'Special / Performance Allowance', amount: 5000 },
      { label: 'Overtime & Incentives', amount: 0 },
    ],
    deductions: [
      { label: 'Provident Fund (EPF 12%)', amount: 1800 },
      { label: 'ESI Contribution', amount: 500 },
      { label: 'Professional Tax (PT)', amount: 200 },
      { label: 'TDS / Income Tax', amount: 0 },
    ],
    grossEarnings: 43000,
    totalDeductions: 2500,
    netPayable: 40500,
    amountInWords: 'Forty Thousand Five Hundred Rupees Only',
  };

  const getSampleColumnValue = (item: any, colKey: string): string => {
    if (item[colKey] !== undefined && item[colKey] !== null) {
      const val = item[colKey];
      if (typeof val === 'number') {
        const isCur = ['price', 'unitprice', 'total', 'totalamount', 'discount', 'mrp', 'taxamount'].some((k) =>
          colKey.toLowerCase().includes(k)
        );
        return isCur ? `₹${val.toLocaleString('en-IN')}` : String(val);
      }
      return String(val);
    }
    const lk = colKey.toLowerCase();
    if (lk.includes('hsn') || lk.includes('sac')) return item.hsn || '85076000';
    if (lk.includes('volt') || lk.includes('voltage')) return item.sno === 1 ? '60V' : '67.2V';
    if (lk.includes('cap') || lk.includes('ah') || lk.includes('capacity')) return item.sno === 1 ? '30Ah' : '6A';
    if (lk.includes('chem') || lk.includes('cell')) return 'LFP Grade-A';
    if (lk.includes('warranty') || lk.includes('war')) return `${item.warrantyPeriodMonths || 36} Mo`;
    if (lk.includes('motor')) return 'MOT-BLDC-9941';
    if (lk.includes('charger')) return 'CHG-6720-1102';
    if (lk.includes('mrp')) return item.sno === 1 ? '₹29,000' : '₹4,000';
    if (lk.includes('discount')) return item.sno === 1 ? '₹1,000' : '₹200';
    if (lk.includes('tax') || lk.includes('gst')) return '18%';
    if (lk.includes('rate') || lk.includes('price')) return `₹${(item.unitPrice || 0).toLocaleString('en-IN')}`;
    if (lk.includes('total') || lk.includes('amount')) return `₹${(item.totalAmount || 0).toLocaleString('en-IN')}`;
    if (lk.includes('serial') || lk.includes('sn')) return item.batterySerial || 'BAT-9941';
    if (lk.includes('qty') || lk.includes('quantity')) return String(item.quantity || 1);
    if (lk.includes('name') || lk.includes('desc') || lk.includes('product')) return item.productName || 'Product';
    return '-';
  };

  const getSampleCustomerFieldValue = (fieldKey: string): string => {
    if ((sampleBill as any)[fieldKey] !== undefined && (sampleBill as any)[fieldKey] !== null) {
      return String((sampleBill as any)[fieldKey]);
    }
    const lk = fieldKey.toLowerCase();
    if (lk.includes('referral') || lk.includes('ref')) return sampleBill.referralCode;
    if (lk.includes('alt') || lk.includes('phone') || lk.includes('contact') || lk.includes('mobile')) return '+91 9414012345';
    if (lk.includes('aadhaar') || lk.includes('uid') || lk.includes('aadhar')) return '5489-1234-9942';
    if (lk.includes('chassis') || lk.includes('frame') || lk.includes('vin')) return 'CHS-2026-EK-8842';
    if (lk.includes('model') || lk.includes('vehicle')) return sampleBill.vehicleNumber || 'RJ-20-EV-9942';
    if (lk.includes('depot') || lk.includes('hub') || lk.includes('location')) return 'Kota Central Distribution Hub';
    if (lk.includes('chem') || lk.includes('battery')) return 'LFP (Lithium Iron Phosphate)';
    if (lk.includes('gst') || lk.includes('gstin')) return sampleBill.customerGstin;
    if (lk.includes('city') || lk.includes('state')) return sampleBill.city;
    if (lk.includes('email')) return sampleBill.customerEmail;
    if (lk.includes('name')) return sampleBill.customerName;
    if (lk.includes('addr')) return sampleBill.customerAddress;
    return `Sample ${fieldKey}`;
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-md ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Top Template Selector & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-emerald-600" />
            <span className="font-bold text-sm text-slate-800">Select Template:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectTemplate(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTemplateIndex === idx
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tpl.type === 'Salary' ? (
                  <FileSpreadsheet size={13} className="text-emerald-400" />
                ) : (
                  <FileText size={13} className="text-blue-400" />
                )}
                <span>{tpl.name}</span>
                {tpl.isActive && (
                  <span className="px-1.5 py-0.5 bg-emerald-400 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-wider">
                    ACTIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {!currentTemplate.isActive && currentTemplate._id && (
            <button
              type="button"
              onClick={handleActivateTemplate}
              disabled={saving}
              className="flex-1 md:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles size={14} />
              <span>Set as Active</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCloneTemplate}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Copy size={14} />
            <span>Clone</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={saving}
            className="flex-1 md:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Template'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Config Panel + Right Live Bill Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Soft-Coded Configuration Tabs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Navigation Subtabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('company')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'company' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={14} />
              <span>Company</span>
            </button>

            {isSalaryTemplate ? (
              <button
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'salary' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase size={14} />
                <span>Salary Config</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('customer')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'customer' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User size={14} />
                  <span>Fields</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('columns')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'columns' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ListOrdered size={14} />
                  <span>Columns</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('totals')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'totals' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <DollarSign size={14} />
                  <span>Taxes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('referral')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'referral'
                      ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-amber-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Coins size={14} className="text-amber-500 fill-amber-500" />
                  <span>Referral & Coins</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('footer')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'footer' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Terms & Bank</span>
            </button>
            {!isSalaryTemplate && (
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'email' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail size={14} />
                <span>Email & Matter</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'theme' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette size={14} />
              <span>Theme</span>
            </button>
          </div>

          {/* TAB 1: Company Profile & Header */}
          {activeTab === 'company' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <Building2 size={16} className="text-emerald-600" />
                <span>Company Header & Legal Identity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Business / Company Name *</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.businessName || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, businessName: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.tagline || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, tagline: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Registered Address</label>
                <textarea
                  rows={2}
                  value={currentTemplate.companyProfile?.address || ''}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      companyProfile: { ...currentTemplate.companyProfile, address: e.target.value },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.phone || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, phone: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Support Email</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.email || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, email: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Website URL</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.website || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, website: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.gstin || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, gstin: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CIN Number</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile?.cin || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        companyProfile: { ...currentTemplate.companyProfile, cin: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document Header Title</label>
                  <input
                    type="text"
                    value={currentTemplate.header?.title || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        header: { ...currentTemplate.header, title: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: SALARY CONFIGURATION (Dedicated for Salary Slip) */}
          {activeTab === 'salary' && isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                    <Briefcase size={16} className="text-emerald-600" />
                    <span>Salary Allowances, Deductions & Employee Data Setup</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add or remove earnings heads, statutory deduction heads, and employee details fields.
                  </p>
                </div>
              </div>

              {/* SECTION 1: Earnings / Allowances */}
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Earnings & Allowances Components</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {currentTemplate.salaryConfig?.earningsColumns?.length || 0} Heads
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Earnings Section Header Title</label>
                  <input
                    type="text"
                    value={currentTemplate.salaryConfig?.allowancesTitle || 'Earnings / Gross Pay'}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        salaryConfig: { ...currentTemplate.salaryConfig, allowancesTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* Preset Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    💡 1-Click Add Common Allowances:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Medical Allowance', defaultAmount: 2000 },
                      { label: 'Attendance Bonus', defaultAmount: 1500 },
                      { label: 'Mobile & Internet Allowance', defaultAmount: 1000 },
                      { label: 'Overtime & Incentives', defaultAmount: 0 },
                      { label: 'Special Project Bonus', defaultAmount: 3000 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleAddEarning(preset)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Plus size={10} className="text-emerald-600" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Add Custom Earning */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="New Earning Head Name (e.g. Travel Allowance)"
                    value={newEarningForm.label}
                    onChange={(e) => setNewEarningForm({ ...newEarningForm, label: e.target.value })}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="number"
                    placeholder="Default ₹"
                    value={newEarningForm.defaultAmount || ''}
                    onChange={(e) => setNewEarningForm({ ...newEarningForm, defaultAmount: Number(e.target.value) || 0 })}
                    className="w-24 p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddEarning()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Earning Items List */}
                <div className="space-y-1.5 pt-1">
                  {(Array.isArray(currentTemplate.salaryConfig?.earningsColumns)
                    ? currentTemplate.salaryConfig.earningsColumns
                    : []
                  ).map((col, idx) => (
                    <div
                      key={col.key || idx}
                      className="p-2.5 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={col.label}
                          onChange={(e) => {
                            const updated = [...(currentTemplate.salaryConfig?.earningsColumns || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setCurrentTemplate({
                              ...currentTemplate,
                              salaryConfig: { ...currentTemplate.salaryConfig, earningsColumns: updated },
                            });
                          }}
                          className="flex-1 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">₹{col.defaultAmount ?? 0}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteEarning(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: Deductions & Recoveries */}
              <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-rose-600" />
                    <span>Statutory Deductions & Recoveries</span>
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    {currentTemplate.salaryConfig?.deductionsColumns?.length || 0} Heads
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deductions Section Header Title</label>
                  <input
                    type="text"
                    value={currentTemplate.salaryConfig?.deductionsTitle || 'Deductions & Recoveries'}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        salaryConfig: { ...currentTemplate.salaryConfig, deductionsTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* Preset Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    💡 1-Click Add Common Deductions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Employee State Insurance (ESI)', defaultAmount: 500 },
                      { label: 'Professional Tax (PT)', defaultAmount: 200 },
                      { label: 'TDS / Income Tax', defaultAmount: 0 },
                      { label: 'Staff Advance / Loan Recovery', defaultAmount: 0 },
                      { label: 'Late Mark / Leave Deduction', defaultAmount: 0 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleAddDeduction(preset)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white text-rose-800 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Plus size={10} className="text-rose-600" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Add Custom Deduction */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="New Deduction Head Name (e.g. Welfare Fund)"
                    value={newDeductionForm.label}
                    onChange={(e) => setNewDeductionForm({ ...newDeductionForm, label: e.target.value })}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="number"
                    placeholder="Default ₹"
                    value={newDeductionForm.defaultAmount || ''}
                    onChange={(e) => setNewDeductionForm({ ...newDeductionForm, defaultAmount: Number(e.target.value) || 0 })}
                    className="w-24 p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDeduction()}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Deduction Items List */}
                <div className="space-y-1.5 pt-1">
                  {(Array.isArray(currentTemplate.salaryConfig?.deductionsColumns)
                    ? currentTemplate.salaryConfig.deductionsColumns
                    : []
                  ).map((col, idx) => (
                    <div
                      key={col.key || idx}
                      className="p-2.5 bg-white rounded-xl border border-rose-200/80 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <AlertCircle size={14} className="text-rose-600 shrink-0" />
                        <input
                          type="text"
                          value={col.label}
                          onChange={(e) => {
                            const updated = [...(currentTemplate.salaryConfig?.deductionsColumns || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setCurrentTemplate({
                              ...currentTemplate,
                              salaryConfig: { ...currentTemplate.salaryConfig, deductionsColumns: updated },
                            });
                          }}
                          className="flex-1 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">₹{col.defaultAmount ?? 0}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteDeduction(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Employee Details Fields */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <User size={14} className="text-slate-600" />
                    <span>Employee Profile Metadata Fields</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                    {currentTemplate.salaryConfig?.employeeFields?.length || 0} Fields
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    💡 1-Click Add Employee Fields:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'PF UAN Number', key: 'uan' },
                      { label: 'ESI IP Number', key: 'esiNumber' },
                      { label: 'Blood Group', key: 'bloodGroup' },
                      { label: 'Date of Confirmation', key: 'confirmationDate' },
                      { label: 'Emergency Contact', key: 'emergencyContact' },
                    ].map((preset) => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => handleAddEmployeeField(preset)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Plus size={10} className="text-emerald-600" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="New Employee Field Label (e.g. Work Location)"
                    value={newEmpFieldForm.label}
                    onChange={(e) => setNewEmpFieldForm({ ...newEmpFieldForm, label: e.target.value })}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddEmployeeField()}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(Array.isArray(currentTemplate.salaryConfig?.employeeFields)
                    ? currentTemplate.salaryConfig.employeeFields
                    : []
                  ).map((fld, idx) => (
                    <div
                      key={fld.key || idx}
                      className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <input
                        type="text"
                        value={fld.label}
                        onChange={(e) => {
                          const updated = [...(currentTemplate.salaryConfig?.employeeFields || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setCurrentTemplate({
                            ...currentTemplate,
                            salaryConfig: { ...currentTemplate.salaryConfig, employeeFields: updated },
                          });
                        }}
                        className="flex-1 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteEmployeeField(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Customer & Invoice Fields */}
          {activeTab === 'customer' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
              {/* SECTION A: Customer Fields */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                      <User size={16} className="text-emerald-600" />
                      <span>Customer Details & Profile Fields</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Customize customer profile attributes displayed on invoice bills and slips.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCustomerField(!showAddCustomerField)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>+ Add Customer Field</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetCustomerFields}
                      title="Reset to factory standard customer fields"
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    💡 1-Click Quick Add Customer Fields:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Alternate Mobile #', key: 'altMobile', required: false },
                      { label: 'Aadhaar / National ID', key: 'aadhaarNumber', required: false },
                      { label: 'Vehicle Frame / Chassis #', key: 'chassisNumber', required: false },
                      { label: 'Battery Chemistry (LFP / NMC)', key: 'batteryChemistry', required: false },
                      { label: 'Vehicle Model & Year', key: 'vehicleModel', required: false },
                      { label: 'Delivery Depot / Hub', key: 'deliveryDepot', required: false },
                      { label: 'Customer Referral Code', key: 'referralCode', required: false },
                    ].map((preset) => {
                      const exists = (currentTemplate.customerFields || []).some((f) => f.key === preset.key);
                      return (
                        <button
                          key={preset.key}
                          type="button"
                          disabled={exists}
                          onClick={() => handleAddCustomerField(preset)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                            exists
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800'
                          }`}
                        >
                          <Plus size={10} className="text-emerald-600" />
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Add Custom Customer Field Form */}
                {showAddCustomerField && (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-300 space-y-3 shadow-sm animate-in fade-in">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                        <Plus size={14} className="text-emerald-600" />
                        <span>Add New Customer Detail Field</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomerField(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Field Label *</label>
                        <input
                          type="text"
                          value={newCustomerFieldForm.label}
                          onChange={(e) => setNewCustomerFieldForm({ ...newCustomerFieldForm, label: e.target.value })}
                          placeholder="e.g. Alternate Mobile Number"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Key / Code <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={newCustomerFieldForm.key}
                          onChange={(e) => setNewCustomerFieldForm({ ...newCustomerFieldForm, key: e.target.value })}
                          placeholder="e.g. altMobile"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newCustomerFieldForm.required}
                          onChange={(e) => setNewCustomerFieldForm({ ...newCustomerFieldForm, required: e.target.checked })}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-800 text-xs">Mandatory / Required Field</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCustomerField(false)}
                          className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddCustomerField()}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={14} />
                          <span>Add Field</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Fields List */}
                <div className="space-y-2">
                  {(Array.isArray(currentTemplate.customerFields) ? currentTemplate.customerFields : []).map((field, idx) => (
                    <div
                      key={field.key || idx}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        field.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={Boolean(field.visible)}
                          onChange={() => toggleCustomerField(idx)}
                          title={field.visible ? 'Hide field' : 'Show field'}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                        />

                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <input
                          type="text"
                          value={field.label || ''}
                          onChange={(e) => updateCustomerFieldLabel(idx, e.target.value)}
                          placeholder="Field Label"
                          className="flex-1 p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />

                        <span className="px-1.5 py-0.5 bg-slate-200/80 text-slate-600 rounded font-mono text-[10px] shrink-0">
                          {field.key}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {/* Required Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleCustomerFieldRequired(idx)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                            field.required
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-700'
                          }`}
                        >
                          {field.required ? '★ Required' : 'Optional'}
                        </button>

                        {/* Move Up / Down */}
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveCustomerField(idx, 'up')}
                            title="Move Up"
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (currentTemplate.customerFields?.length || 0) - 1}
                            onClick={() => moveCustomerField(idx, 'down')}
                            title="Move Down"
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomerField(idx)}
                          title="Delete this field"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: Invoice Metadata Fields */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                      <FileText size={16} className="text-emerald-600" />
                      <span>Invoice Metadata & Order Identifiers</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      E-Way Bill, Purchase Order #, Dispatch Details, Vehicle No, Counter.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddInvoiceField(!showAddInvoiceField)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Invoice Field</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    💡 1-Click Add Invoice Meta Fields:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'E-Way Bill Number', key: 'ewayBillNo' },
                      { label: 'Purchase Order (PO) #', key: 'poNumber' },
                      { label: 'Dispatch Vehicle #', key: 'vehicleNumber' },
                      { label: 'Payment UTR / Trans ID', key: 'paymentUtr' },
                      { label: 'Billing Showroom Branch', key: 'showroomBranch' },
                    ].map((preset) => {
                      const exists = (currentTemplate.invoiceFields || []).some((f) => f.key === preset.key);
                      return (
                        <button
                          key={preset.key}
                          type="button"
                          disabled={exists}
                          onClick={() => handleAddInvoiceField(preset)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                            exists
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <Plus size={10} className="text-slate-600" />
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Add Invoice Meta Field Form */}
                {showAddInvoiceField && (
                  <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-300 space-y-3 shadow-sm animate-in fade-in">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Plus size={14} className="text-slate-700" />
                        <span>Add New Invoice Metadata Field</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddInvoiceField(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Field Label *</label>
                        <input
                          type="text"
                          value={newInvoiceFieldForm.label}
                          onChange={(e) => setNewInvoiceFieldForm({ ...newInvoiceFieldForm, label: e.target.value })}
                          placeholder="e.g. E-Way Bill Number"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Key / Code <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={newInvoiceFieldForm.key}
                          onChange={(e) => setNewInvoiceFieldForm({ ...newInvoiceFieldForm, key: e.target.value })}
                          placeholder="e.g. ewayBill"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowAddInvoiceField(false)}
                        className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddInvoiceField()}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Add Field</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Invoice Fields List */}
                <div className="space-y-2">
                  {(Array.isArray(currentTemplate.invoiceFields) ? currentTemplate.invoiceFields : []).map((field, idx) => (
                    <div
                      key={field.key || idx}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        field.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={Boolean(field.visible)}
                          onChange={() => toggleInvoiceField(idx)}
                          title={field.visible ? 'Hide field' : 'Show field'}
                          className="w-4 h-4 rounded text-slate-700 focus:ring-slate-500 cursor-pointer shrink-0"
                        />

                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <input
                          type="text"
                          value={field.label || ''}
                          onChange={(e) => updateInvoiceFieldLabel(idx, e.target.value)}
                          placeholder="Field Label"
                          className="flex-1 p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />

                        <span className="px-1.5 py-0.5 bg-slate-200/80 text-slate-600 rounded font-mono text-[10px] shrink-0">
                          {field.key}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveInvoiceField(idx, 'up')}
                            title="Move Up"
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (currentTemplate.invoiceFields?.length || 0) - 1}
                            onClick={() => moveInvoiceField(idx, 'down')}
                            title="Move Down"
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteInvoiceField(idx)}
                          title="Delete this field"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Line Item Columns Designer */}
          {activeTab === 'columns' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                    <ListOrdered size={16} className="text-emerald-600" />
                    <span>Product Line Items Table Columns</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add custom columns, set widths, alignment, toggle visibility, or delete unwanted columns.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddColumn(!showAddColumn)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Custom Column</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetColumns}
                    title="Reset to factory standard columns"
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* QUICK PRESET ADD CHIPS */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  💡 1-Click Quick Add Common Columns:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'HSN / SAC Code', key: 'hsn', widthPercent: 12, align: 'left' as const },
                    { label: 'Battery Voltage (V)', key: 'voltage', widthPercent: 10, align: 'center' as const },
                    { label: 'Capacity (Ah)', key: 'capacity', widthPercent: 10, align: 'center' as const },
                    { label: 'Pack Warranty (Mos)', key: 'warranty', widthPercent: 12, align: 'center' as const },
                    { label: 'Motor Serial #', key: 'motorSerial', widthPercent: 14, align: 'left' as const },
                    { label: 'Charger Serial #', key: 'chargerSerial', widthPercent: 14, align: 'left' as const },
                    { label: 'MRP Rate (₹)', key: 'mrp', widthPercent: 12, align: 'right' as const },
                    { label: 'Unit Discount (₹)', key: 'discount', widthPercent: 10, align: 'right' as const },
                    { label: 'GST Tax %', key: 'taxRate', widthPercent: 8, align: 'center' as const },
                    { label: 'Tax Amount (₹)', key: 'taxAmount', widthPercent: 12, align: 'right' as const },
                  ].map((preset) => {
                    const exists = (currentTemplate.productColumns || []).some((c) => c.key === preset.key);
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        disabled={exists}
                        onClick={() => handleAddColumn(preset)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                          exists
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        <Plus size={10} className="text-emerald-600" />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLLAPSIBLE ADD NEW CUSTOM COLUMN FORM */}
              {showAddColumn && (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-300 space-y-3 shadow-sm animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                      <Plus size={14} className="text-emerald-600" />
                      <span>Create New Custom Column</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddColumn(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Column Header Label *</label>
                      <input
                        type="text"
                        value={newColumnForm.label}
                        onChange={(e) => setNewColumnForm({ ...newColumnForm, label: e.target.value })}
                        placeholder="e.g. Battery Cell Brand / Chemistry"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Column Width (%)</label>
                      <select
                        value={newColumnForm.widthPercent}
                        onChange={(e) => setNewColumnForm({ ...newColumnForm, widthPercent: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="8">8% (Narrow / Qty)</option>
                        <option value="10">10% (Compact)</option>
                        <option value="12">12% (Standard)</option>
                        <option value="15">15% (Medium)</option>
                        <option value="20">20% (Wide)</option>
                        <option value="25">25% (Product Name)</option>
                        <option value="35">35% (Description)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Field Key <span className="text-slate-400 font-normal text-[10px]">(Optional - Auto-generated)</span>
                      </label>
                      <input
                        type="text"
                        value={newColumnForm.key}
                        onChange={(e) => setNewColumnForm({ ...newColumnForm, key: e.target.value })}
                        placeholder="e.g. cellBrand"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Text Alignment</label>
                      <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => setNewColumnForm({ ...newColumnForm, align })}
                            className={`flex-1 py-1 rounded-lg font-bold text-xs capitalize flex items-center justify-center gap-1 transition cursor-pointer ${
                              newColumnForm.align === align
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {align === 'left' && <AlignLeft size={12} />}
                            {align === 'center' && <AlignCenter size={12} />}
                            {align === 'right' && <AlignRight size={12} />}
                            <span>{align}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setShowAddColumn(false)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddColumn()}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Add Column to Table</span>
                    </button>
                  </div>
                </div>
              )}

              {/* EXISTING COLUMNS LIST WITH FULL CONTROLS */}
              <div className="space-y-2">
                {(Array.isArray(currentTemplate.productColumns) ? currentTemplate.productColumns : []).map((col, idx) => (
                  <div
                    key={col.key || idx}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      col.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={Boolean(col.visible)}
                        onChange={() => toggleColumnVisibility(idx)}
                        title={col.visible ? 'Hide column' : 'Show column'}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />

                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <input
                        type="text"
                        value={col.label || ''}
                        onChange={(e) => updateColumnLabel(idx, e.target.value)}
                        placeholder="Column Header Name"
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />

                      <span className="px-1.5 py-0.5 bg-slate-200/80 text-slate-600 rounded font-mono text-[10px] shrink-0">
                        {col.key}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {/* Width Selector */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400">Width:</span>
                        <select
                          value={col.widthPercent || 12}
                          onChange={(e) => updateColumnWidth(idx, Number(e.target.value))}
                          className="p-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          <option value="8">8%</option>
                          <option value="10">10%</option>
                          <option value="12">12%</option>
                          <option value="15">15%</option>
                          <option value="20">20%</option>
                          <option value="25">25%</option>
                          <option value="35">35%</option>
                        </select>
                      </div>

                      {/* Alignment Selector */}
                      <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
                        {(['left', 'center', 'right'] as const).map((aln) => (
                          <button
                            key={aln}
                            type="button"
                            onClick={() => updateColumnAlign(idx, aln)}
                            title={`Align ${aln}`}
                            className={`p-1 rounded cursor-pointer ${
                              (col.align || (['unitPrice', 'totalAmount', 'discount', 'taxAmount', 'mrp'].includes(col.key) ? 'right' : 'left')) === aln
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            {aln === 'left' && <AlignLeft size={11} />}
                            {aln === 'center' && <AlignCenter size={11} />}
                            {aln === 'right' && <AlignRight size={11} />}
                          </button>
                        ))}
                      </div>

                      {/* Move Up / Down */}
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveColumn(idx, 'up')}
                          title="Move Left / Up"
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (currentTemplate.productColumns?.length || 0) - 1}
                          onClick={() => moveColumn(idx, 'down')}
                          title="Move Right / Down"
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(idx)}
                        title="Delete this column"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Taxes & Totals */}
          {activeTab === 'totals' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-600" />
                <span>GST Tax Breakdown & Summary Rules</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentTemplate.totalsConfig?.splitGst}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        totalsConfig: { ...currentTemplate.totalsConfig, splitGst: e.target.checked },
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Split CGST & SGST (9% + 9%)</div>
                    <div className="text-[11px] text-slate-400">
                      Standard for intra-state Rajasthan billing. Shows separate CGST and SGST lines.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentTemplate.totalsConfig?.showAmountInWords}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        totalsConfig: { ...currentTemplate.totalsConfig, showAmountInWords: e.target.checked },
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Show Grand Total Amount in Words</div>
                    <div className="text-[11px] text-slate-400">
                      e.g. "Thirty-Three Thousand Three Hundred Ninety-Four Rupees Only"
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentTemplate.warrantyConfig?.enabled}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        warrantyConfig: { ...currentTemplate.warrantyConfig, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Print Official Warranty Certificate Seal</div>
                    <div className="text-[11px] text-slate-400">
                      Adds official warranty verification badge directly on the invoice slip.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: Terms, Bank Details & Footer */}
          {activeTab === 'footer' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Terms, Conditions & Legal Signatory</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {currentTemplate.footer?.termsAndConditions?.length || 0} Clauses
                </span>
              </div>

              {/* TERMS & CONDITIONS INTERACTIVE MANAGER */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-xs">Invoice Terms & Warranty Policy Clauses</span>
                  <button
                    type="button"
                    onClick={() => setShowBulkTerms(!showBulkTerms)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                  >
                    {showBulkTerms ? 'Switch to Individual Items' : 'Bulk Edit Text Mode'}
                  </button>
                </div>

                {/* Preset Term Clauses */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    💡 1-Click Add Legal & Warranty Clauses:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Warranty claims require this original invoice and matching battery serial number.',
                      'Warranty is void if safety seal is broken, pack is tampered, or charged with non-certified chargers.',
                      'Goods once sold will not be taken back without valid manufacturing defect authorization.',
                      'Vehicle and battery health inspection is mandatory before counter delivery acceptance.',
                      'Subject to Kota, Rajasthan jurisdiction only.',
                    ].map((clause, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddTerm(clause)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 flex items-center gap-1 cursor-pointer transition text-left"
                      >
                        <Plus size={10} className="text-emerald-600 shrink-0" />
                        <span className="truncate max-w-xs">{clause}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {showBulkTerms ? (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Terms & Conditions (One condition per line)
                    </label>
                    <textarea
                      rows={5}
                      value={(currentTemplate.footer?.termsAndConditions || []).join('\n')}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          footer: {
                            ...currentTemplate.footer,
                            termsAndConditions: e.target.value.split('\n').filter((t) => t.trim()),
                          },
                        })
                      }
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>
                ) : (
                  <>
                    {/* Add Term Input Bar */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a new invoice term or condition..."
                        value={newTermInput}
                        onChange={(e) => setNewTermInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTerm();
                          }
                        }}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTerm()}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Add Term</span>
                      </button>
                    </div>

                    {/* Term List */}
                    <div className="space-y-1.5 pt-1">
                      {(Array.isArray(currentTemplate.footer?.termsAndConditions)
                        ? currentTemplate.footer.termsAndConditions
                        : []
                      ).map((term, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={term}
                            onChange={(e) => handleUpdateTerm(idx, e.target.value)}
                            className="flex-1 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveTerm(idx, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (currentTemplate.footer?.termsAndConditions?.length || 0) - 1}
                              onClick={() => handleMoveTerm(idx, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTerm(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* BANK DETAILS SECTION */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">Bank & Digital Disbursal Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={currentTemplate.footer?.bankDetails?.bankName || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          footer: {
                            ...currentTemplate.footer,
                            bankDetails: { ...currentTemplate.footer?.bankDetails, bankName: e.target.value },
                          },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Bank A/C Number</label>
                    <input
                      type="text"
                      value={currentTemplate.footer?.bankDetails?.accountNumber || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          footer: {
                            ...currentTemplate.footer,
                            bankDetails: { ...currentTemplate.footer?.bankDetails, accountNumber: e.target.value },
                          },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={currentTemplate.footer?.bankDetails?.ifscCode || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          footer: {
                            ...currentTemplate.footer,
                            bankDetails: { ...currentTemplate.footer?.bankDetails, ifscCode: e.target.value },
                          },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">UPI ID for Disbursal / Payment</label>
                    <input
                      type="text"
                      value={currentTemplate.footer?.bankDetails?.upiId || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          footer: {
                            ...currentTemplate.footer,
                            bankDetails: { ...currentTemplate.footer?.bankDetails, upiId: e.target.value },
                          },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SIGNATORY DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Authorized Signatory Label</label>
                  <input
                    type="text"
                    value={currentTemplate.footer?.authorizedSignatoryLabel || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        footer: { ...currentTemplate.footer, authorizedSignatoryLabel: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Signatory Title</label>
                  <input
                    type="text"
                    value={currentTemplate.footer?.signatoryName || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        footer: { ...currentTemplate.footer, signatoryName: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Theme & Typography */}
          {activeTab === 'theme' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <Palette size={16} className="text-emerald-600" />
                <span>Visual Theme, Color & Paper Format</span>
              </h3>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Accent Brand Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((clr) => (
                    <button
                      key={clr.hex}
                      type="button"
                      onClick={() =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          theme: { ...currentTemplate.theme, primaryColor: clr.hex },
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                        currentTemplate.theme?.primaryColor === clr.hex
                          ? 'border-slate-800 ring-2 ring-slate-800/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: clr.hex }} />
                      <span>{clr.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Print Paper Size</label>
                  <select
                    value={currentTemplate.theme?.paperSize || 'A4'}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        theme: { ...currentTemplate.theme, paperSize: e.target.value as any },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="A4">Standard A4 (Deskjet / Laser)</option>
                    <option value="Thermal-80mm">Thermal POS Slip (80mm Roll)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={currentTemplate.theme?.watermarkText || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        theme: { ...currentTemplate.theme, watermarkText: e.target.value },
                      })
                    }
                    placeholder="e.g. CONFIDENTIAL / ORIGINAL"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: REFERRAL & DIGITAL WALLET COINS CONFIGURATION (100% Soft-Coded) */}
          {activeTab === 'referral' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                    <Coins size={18} className="fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-800">
                      Customer Referral & Digital Wallet Stamp Setup
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Soft-code referral code visibility, digital wallet stamp text, coin awards, and redemption terms.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] rounded-full flex items-center gap-1">
                  <Coins size={11} className="fill-amber-600 text-amber-600" />
                  <span>🪙 Coins Only</span>
                </span>
              </div>

              {/* SECTION 1: Referral Code on Invoice & Slips */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentTemplate.referralConfig?.showReferralCodeOnBill !== false}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            showReferralCodeOnBill: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 text-xs">Print Customer Referral Code on Invoice Slips</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    EBS-REF-XXXXX
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Referral Code Field Label</label>
                    <input
                      type="text"
                      value={currentTemplate.referralConfig?.referralCodeLabel || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            referralCodeLabel: e.target.value,
                          },
                        })
                      }
                      placeholder="Customer Referral Code"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Live Badge Preview</label>
                    <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-900">EBS-REF-9942</span>
                      <span className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded border border-emerald-300">
                        1-Click Copy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Digital Wallet Reward Stamp */}
              <div className="p-4 bg-gradient-to-br from-amber-50/70 to-emerald-50/50 rounded-2xl border-2 border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentTemplate.referralConfig?.showWalletCoinsStamp !== false}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            showWalletCoinsStamp: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="font-bold text-amber-950 text-xs">Print Digital Wallet Reward Stamp on Invoice Slip</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Reward Stamp
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Stamp Header Title</label>
                    <input
                      type="text"
                      value={currentTemplate.referralConfig?.badgeTitle || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            badgeTitle: e.target.value,
                          },
                        })
                      }
                      placeholder="OFFICIAL EKOSMART REWARDS & DIGITAL WALLET"
                      className="w-full p-2 bg-white border border-amber-300 rounded-xl font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Wallet Coins Credited Stamp Label</label>
                    <input
                      type="text"
                      value={currentTemplate.referralConfig?.walletCoinsLabel || ''}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            walletCoinsLabel: e.target.value,
                          },
                        })
                      }
                      placeholder="+500 Coins Credited"
                      className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-amber-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Coin Redemption Benefit Note (Print On Bill)</label>
                  <input
                    type="text"
                    value={currentTemplate.referralConfig?.benefitNote || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        referralConfig: {
                          ...currentTemplate.referralConfig,
                          benefitNote: e.target.value,
                        },
                      })
                    }
                    placeholder="Redeem coins for EV battery servicing, maintenance & showroom accessories"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Explains to the customer what they can redeem their wallet coins for.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Referral Offer Note (Print On Bill)</label>
                  <input
                    type="text"
                    value={currentTemplate.referralConfig?.referralPromoNote || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        referralConfig: {
                          ...currentTemplate.referralConfig,
                          referralPromoNote: e.target.value,
                        },
                      })
                    }
                    placeholder="Give 500 Coins, Get 500 Coins on every successful friend referral"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* SECTION 3: Soft-Coded Reward Coins Matrix (🪙 Coins Only) */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-400 text-xs">
                    <Coins size={16} className="fill-amber-400" />
                    <span>Soft-Coded Reward Coins Matrix (🪙 Coins Only)</span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                    Template Default Rates
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Configure default coin amounts for this template. Only coins (🪙) are displayed to customers without currency notation.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                    <label className="block text-[11px] font-bold text-emerald-400">
                      🔋 Battery Purchase (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.referralConfig?.batteryCoins ?? 500}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            batteryCoins: val,
                          },
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            batteryCoins: val,
                          },
                        });
                      }}
                      className="w-full p-2 bg-black/40 border border-white/20 rounded-lg text-xs font-mono font-black text-amber-300 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                    <label className="block text-[11px] font-bold text-teal-400">
                      🛵 Showroom Sales (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.referralConfig?.showroomCoins ?? 250}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            showroomCoins: val,
                          },
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            showroomCoins: val,
                          },
                        });
                      }}
                      className="w-full p-2 bg-black/40 border border-white/20 rounded-lg text-xs font-mono font-black text-amber-300 focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                    <label className="block text-[11px] font-bold text-amber-400">
                      🎁 Welcome Signup (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.referralConfig?.welcomeCoins ?? 500}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            welcomeCoins: val,
                          },
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            welcomeCoins: val,
                          },
                        });
                      }}
                      className="w-full p-2 bg-black/40 border border-white/20 rounded-lg text-xs font-mono font-black text-amber-300 focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                    <label className="block text-[11px] font-bold text-blue-400">
                      🤝 Referrer Bonus (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.referralConfig?.referrerCoins ?? 500}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            referrerCoins: val,
                          },
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            referrerCoins: val,
                          },
                        });
                      }}
                      className="w-full p-2 bg-black/40 border border-white/20 rounded-lg text-xs font-mono font-black text-amber-300 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                    <label className="block text-[11px] font-bold text-purple-400">
                      ⚙️ Service Reward (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.referralConfig?.serviceCoins ?? 250}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            serviceCoins: val,
                          },
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            serviceCoins: val,
                          },
                        });
                      }}
                      className="w-full p-2 bg-black/40 border border-white/20 rounded-lg text-xs font-mono font-black text-amber-300 focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                    <label className="block text-[11px] font-bold text-emerald-300">
                      🧾 Purchase Coins (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.referralConfig?.rewardCoins ?? 500}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setCurrentTemplate({
                          ...currentTemplate,
                          referralConfig: {
                            ...currentTemplate.referralConfig,
                            rewardCoins: val,
                            walletCoinsLabel: `+${val} Coins Credited`,
                          },
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            rewardCoins: val,
                          },
                        });
                      }}
                      className="w-full p-2 bg-black/40 border border-white/20 rounded-lg text-xs font-mono font-black text-amber-300 focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Soft Bill Email Template & Matter Configuration */}
          {activeTab === 'email' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <Mail size={16} className="text-emerald-600" />
                  <span>Soft Copy Tax Invoice Email Template & Matter</span>
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                  Soft-Coded
                </span>
              </div>

              {/* Auto Email Toggle */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoEmailToggle"
                    checked={currentTemplate.softBillEmailConfig?.autoEmailCustomer !== false}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        softBillEmailConfig: {
                          ...currentTemplate.softBillEmailConfig,
                          autoEmailCustomer: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="autoEmailToggle" className="cursor-pointer">
                    <div className="font-bold text-emerald-950">Auto-Email Customer on Billing</div>
                    <div className="text-[11px] text-emerald-700">
                      When an invoice is generated with a valid customer email, dispatch soft bill & referral code automatically.
                    </div>
                  </label>
                </div>
              </div>

              {/* Soft-Coded Coins Configuration */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-950 font-black text-xs">
                    <Coins size={16} className="text-amber-600 fill-amber-600" />
                    <span>Soft-Coded Referral Coins Parameters (🪙 Coins Only)</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Editable Tokens
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Only digital wallet coins are shown to customers in soft bills and referral banners. You can edit default coin reward amounts below:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                    <label className="block text-[11px] font-bold text-amber-950">
                      Purchase Coins (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.softBillEmailConfig?.rewardCoins ?? 500}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            rewardCoins: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full p-2 border border-amber-300 rounded-lg text-xs font-black text-amber-900 bg-amber-50/40"
                    />
                    <span className="text-[9px] font-mono text-slate-500 block">Token: {"{{coins}}"} / {"{{rewardCoins}}"}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                    <label className="block text-[11px] font-bold text-amber-950">
                      Welcome Bonus Coins (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.softBillEmailConfig?.welcomeCoins ?? 500}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            welcomeCoins: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full p-2 border border-amber-300 rounded-lg text-xs font-black text-amber-900 bg-amber-50/40"
                    />
                    <span className="text-[9px] font-mono text-slate-500 block">Token: {"{{welcomeCoins}}"}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                    <label className="block text-[11px] font-bold text-amber-950">
                      Referrer Bonus Coins (🪙)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentTemplate.softBillEmailConfig?.referrerCoins ?? 100}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          softBillEmailConfig: {
                            ...currentTemplate.softBillEmailConfig,
                            referrerCoins: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full p-2 border border-amber-300 rounded-lg text-xs font-black text-amber-900 bg-amber-50/40"
                    />
                    <span className="text-[9px] font-mono text-slate-500 block">Token: {"{{referrerCoins}}"}</span>
                  </div>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={currentTemplate.softBillEmailConfig?.emailSubject || ''}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      softBillEmailConfig: {
                        ...currentTemplate.softBillEmailConfig,
                        emailSubject: e.target.value,
                      },
                    })
                  }
                  placeholder="Official EKOSMART GST Tax Invoice & Soft Copy - {{invoiceNumber}}"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Placeholder tag: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">{"{{invoiceNumber}}"}</code>
                </span>
              </div>

              {/* Email Heading */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Invoice Header Title in Email</label>
                <input
                  type="text"
                  value={currentTemplate.softBillEmailConfig?.emailHeading || ''}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      softBillEmailConfig: {
                        ...currentTemplate.softBillEmailConfig,
                        emailHeading: e.target.value,
                      },
                    })
                  }
                  placeholder="Showroom Retail Soft Copy Tax Invoice"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              {/* Custom Matter / Message Body */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-700 font-bold">Customer Greeting & Soft Bill Matter</label>
                  <span className="text-[10px] text-slate-400">Personalized Message</span>
                </div>
                <textarea
                  rows={6}
                  value={currentTemplate.softBillEmailConfig?.emailMatter || ''}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      softBillEmailConfig: {
                        ...currentTemplate.softBillEmailConfig,
                        emailMatter: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-xs"
                />
                <div className="mt-1.5 p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">Available Placeholder Tokens:</span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold">{"{{coins}}"}</span>
                    <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold">{"{{welcomeCoins}}"}</span>
                    <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold">{"{{referrerCoins}}"}</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-emerald-800">{"{{customerName}}"}</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-emerald-800">{"{{invoiceNumber}}"}</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-emerald-800">{"{{referralCode}}"}</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-emerald-800">{"{{grandTotal}}"}</span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-emerald-800">{"{{showroom}}"}</span>
                  </div>
                </div>
              </div>

              {/* Referral Promotion Card Matter */}
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Gift size={14} className="text-amber-600" />
                  <span>Referral Code Banner in Soft Bill (Only Coins)</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Referral Box Title</label>
                  <input
                    type="text"
                    value={currentTemplate.softBillEmailConfig?.referralBoxTitle || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        softBillEmailConfig: {
                          ...currentTemplate.softBillEmailConfig,
                          referralBoxTitle: e.target.value,
                        },
                      })
                    }
                    placeholder="Ekosmart Referral & Rewards Program"
                    className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Referral Promotion Matter</label>
                  <input
                    type="text"
                    value={currentTemplate.softBillEmailConfig?.referralBoxMessage || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        softBillEmailConfig: {
                          ...currentTemplate.softBillEmailConfig,
                          referralBoxMessage: e.target.value,
                        },
                      })
                    }
                    placeholder="Share your referral code {{referralCode}} with friends & earn {{coins}} Coins on every qualifying purchase!"
                    className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Footer Helpline */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Support & Helpline Text</label>
                <input
                  type="text"
                  value={currentTemplate.softBillEmailConfig?.footerHelplineText || ''}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      softBillEmailConfig: {
                        ...currentTemplate.softBillEmailConfig,
                        footerHelplineText: e.target.value,
                      },
                    })
                  }
                  placeholder="Helpline: +91 8949049003 | support@ekosmartdrive.in"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: LIVE REAL-TIME BILL OR SALARY SLIP PREVIEW */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Eye size={16} className="text-emerald-400" />
              <span>
                {isSalaryTemplate
                  ? 'Real-Time Employee Salary Slip Preview'
                  : previewMode === 'softEmail'
                  ? 'Soft Copy Email HTML Live Preview'
                  : 'Real-Time Live Invoice Slip Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!isSalaryTemplate && (
                <div className="flex items-center bg-white/10 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('invoice')}
                    className={`px-2 py-1 rounded-md transition cursor-pointer ${
                      previewMode === 'invoice' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('softEmail')}
                    className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                      previewMode === 'softEmail' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Mail size={11} />
                    <span>Soft Bill</span>
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer size={12} />
                <span>Test Print</span>
              </button>
            </div>
          </div>

          {/* Render Container */}
          {isSalaryTemplate ? (
            /* SALARY SLIP PREVIEW */
            <div
              className="bg-white p-6 sm:p-8 rounded-2xl border-2 shadow-xl space-y-5 text-slate-900 transition-all font-sans text-xs"
              style={{ borderColor: currentTemplate.theme?.primaryColor || '#059669' }}
            >
              {/* Header / Brand Details */}
              <div
                className="flex justify-between items-start border-b-2 pb-4"
                style={{ borderColor: currentTemplate.theme?.primaryColor || '#059669' }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: currentTemplate.theme?.primaryColor || '#059669' }}
                    />
                    <h1
                      className="text-base font-black tracking-tight"
                      style={{ color: currentTemplate.theme?.primaryColor || '#059669' }}
                    >
                      {currentTemplate.companyProfile?.businessName}
                    </h1>
                  </div>
                  {currentTemplate.companyProfile?.tagline && (
                    <p className="text-[10px] text-slate-500 font-semibold">{currentTemplate.companyProfile.tagline}</p>
                  )}
                  <p className="text-[10px] text-slate-600 max-w-sm mt-0.5">{currentTemplate.companyProfile?.address}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                    <span>Ph: {currentTemplate.companyProfile?.phone}</span>
                    <span>•</span>
                    <span>Email: {currentTemplate.companyProfile?.email}</span>
                  </div>
                  {currentTemplate.companyProfile?.gstin && (
                    <div className="text-[10px] font-mono font-bold text-slate-700">
                      GSTIN: <span className="text-slate-900">{currentTemplate.companyProfile.gstin}</span>
                    </div>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <div
                    className="inline-block px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider"
                    style={{ backgroundColor: currentTemplate.theme?.primaryColor || '#059669' }}
                  >
                    {currentTemplate.header?.title || 'PAYSLIP'}
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 uppercase">{sampleSalary.monthYear}</div>
                  <div className="text-[10px] font-mono text-slate-500">Ref: EBS-SLIP-{sampleSalary.employeeId}-0926</div>
                  <div className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              {/* Employee Info Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee Name</span>
                  <span className="font-bold text-slate-800">{sampleSalary.employeeName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee ID</span>
                  <span className="font-mono font-bold text-emerald-700">{sampleSalary.employeeId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Department</span>
                  <span className="font-semibold text-slate-700">{sampleSalary.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Designation</span>
                  <span className="font-semibold text-slate-700">{sampleSalary.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Division</span>
                  <span className="font-semibold text-slate-700">{sampleSalary.division}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid / Working Days</span>
                  <span className="font-bold text-slate-800">
                    {sampleSalary.paidDays} / {sampleSalary.totalWorkingDays} Days
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank Account #</span>
                  <span className="font-mono text-slate-700">{sampleSalary.bankAccount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank & IFSC</span>
                  <span className="font-mono text-slate-700">{sampleSalary.ifscCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">PAN Number</span>
                  <span className="font-mono text-slate-700">{sampleSalary.panNumber}</span>
                </div>
              </div>

              {/* Earnings vs Deductions Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-emerald-50 text-emerald-950 font-bold p-2.5 border-b border-emerald-100 flex justify-between">
                    <span>{currentTemplate.salaryConfig?.allowancesTitle || 'EARNINGS'}</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {sampleSalary.earnings.map((e, i) => (
                      <div key={i} className="p-2 flex justify-between">
                        <span className="text-slate-600">{e.label}</span>
                        <span className="font-mono font-semibold">₹{e.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 border-t border-emerald-200 flex justify-between font-bold text-emerald-950">
                    <span>GROSS EARNINGS:</span>
                    <span className="font-mono">₹{sampleSalary.grossEarnings.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-rose-50 text-rose-950 font-bold p-2.5 border-b border-rose-100 flex justify-between">
                    <span>{currentTemplate.salaryConfig?.deductionsTitle || 'DEDUCTIONS'}</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {sampleSalary.deductions.map((d, i) => (
                      <div key={i} className="p-2 flex justify-between">
                        <span className="text-slate-600">{d.label}</span>
                        <span className="font-mono font-semibold text-rose-700">₹{d.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-rose-50/70 p-2.5 border-t border-rose-200 flex justify-between font-bold text-rose-950">
                    <span>TOTAL DEDUCTIONS:</span>
                    <span className="font-mono">₹{sampleSalary.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Highlighted Net Take-Home Salary */}
              <div
                className="p-4 rounded-xl border flex justify-between items-center"
                style={{
                  backgroundColor: `${currentTemplate.theme?.primaryColor || '#059669'}0d`,
                  borderColor: `${currentTemplate.theme?.primaryColor || '#059669'}40`,
                }}
              >
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {currentTemplate.salaryConfig?.netSalaryLabel || 'NET TAKE-HOME SALARY'}
                  </div>
                  <div className="text-xs text-slate-600 italic mt-0.5">
                    <span className="font-bold not-italic text-slate-800">In Words:</span> {sampleSalary.amountInWords}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="text-2xl font-black font-mono tracking-tight"
                    style={{ color: currentTemplate.theme?.primaryColor || '#059669' }}
                  >
                    ₹{sampleSalary.netPayable.toLocaleString('en-IN')}
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Disbursed & Audited
                  </span>
                </div>
              </div>

              {/* Footer Terms & Signatory */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                <div>
                  <div className="font-bold text-slate-700 uppercase mb-1">Company Policy & Notes</div>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    {(Array.isArray(currentTemplate.footer?.termsAndConditions)
                      ? currentTemplate.footer.termsAndConditions
                      : []
                    ).map((term, idx) => (
                      <li key={idx}>{term}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-right flex flex-col justify-between items-end">
                  <div>
                    <div className="font-bold text-slate-800">
                      {currentTemplate.footer?.authorizedSignatoryLabel || 'For EKOSMART EV BATTERY SOLUTION'}
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="border-t border-slate-300 w-36 text-center text-[10px] font-bold text-slate-700">
                      {currentTemplate.footer?.signatoryName || 'Authorized Signatory'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : previewMode === 'softEmail' ? (
            /* SOFT COPY EMAIL TEMPLATE LIVE PREVIEW */
            <div className="bg-white rounded-2xl border-2 border-emerald-600 shadow-xl overflow-hidden font-sans text-xs">
              {/* Fake Email Client Chrome Header */}
              <div className="bg-slate-100 p-3 border-b border-slate-200 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-700">From:</span> EKOSMART Billing Counter &lt;support@ekosmartdrive.in&gt;
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    Live Email Mockup
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">To:</span> {sampleBill.customerName} &lt;{sampleBill.customerEmail}&gt;
                </div>
                <div>
                  <span className="font-bold text-slate-700">Subject:</span>{' '}
                  <span className="font-semibold text-slate-900">
                    {(currentTemplate.softBillEmailConfig?.emailSubject || 'Official EKOSMART GST Tax Invoice & Soft Copy - {{invoiceNumber}}').replace('{{invoiceNumber}}', sampleBill.invoiceNumber)}
                  </span>
                </div>
              </div>

              {/* Email Content Body Preview */}
              <div className="p-4 sm:p-6 bg-slate-50 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  {/* Email Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex justify-between items-start">
                    <div>
                      <h2 className="text-base font-black text-emerald-400">
                        {currentTemplate.companyProfile?.businessName || 'EKOSMART EV BATTERY SOLUTION'}
                      </h2>
                      <p className="text-[10px] text-slate-300">
                        {currentTemplate.companyProfile?.tagline || 'Clean Energy & Smart Electric Mobility'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                        GSTIN: {currentTemplate.companyProfile?.gstin || '08DTUPM4205B1Z0'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-emerald-600 text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded-lg">
                        {sampleBill.invoiceNumber}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Date: {sampleBill.date}</p>
                    </div>
                  </div>

                  {/* Soft Coded Matter Body */}
                  <div className="p-5 space-y-4">
                    <div className="bg-slate-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                      {(currentTemplate.softBillEmailConfig?.emailMatter || 'Dear {{customerName}},\n\nThank you for choosing EKOSMART Clean Energy & Green Mobility. Please find attached below your official Soft Copy GST Tax Invoice, Warranty Certificate registration, and exclusive Customer Referral Code.\n\nYour Unique Referral Code is: {{referralCode}}\nShare this code with your friends & family so they receive {{welcomeCoins}} Coins, and you earn {{referrerCoins}} Coins on their qualifying purchase!')
                        .replace(/\{\{customerName\}\}/g, sampleBill.customerName)
                        .replace(/\{\{invoiceNumber\}\}/g, sampleBill.invoiceNumber)
                        .replace(/\{\{referralCode\}\}/g, 'EKO89A4')
                        .replace(/\{\{coins\}\}/g, String(currentTemplate.softBillEmailConfig?.rewardCoins ?? 500))
                        .replace(/\{\{rewardCoins\}\}/g, String(currentTemplate.softBillEmailConfig?.rewardCoins ?? 500))
                        .replace(/\{\{welcomeCoins\}\}/g, String(currentTemplate.softBillEmailConfig?.welcomeCoins ?? 500))
                        .replace(/\{\{referrerCoins\}\}/g, String(currentTemplate.softBillEmailConfig?.referrerCoins ?? 100))
                        .replace(/\{\{grandTotal\}\}/g, `₹${sampleBill.grandTotal.toLocaleString('en-IN')}`)
                        .replace(/\{\{showroom\}\}/g, sampleBill.showroom)}
                    </div>

                    {/* Customer & Invoice Meta */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Customer:</div>
                        <div className="font-bold text-slate-900 text-sm">{sampleBill.customerName}</div>
                        <div className="text-slate-600 font-mono text-[11px]">📱 {sampleBill.customerMobile}</div>
                        <div className="text-slate-500 text-[10px]">{sampleBill.customerAddress}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Payment Details:</div>
                        <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] mt-1">
                          {sampleBill.paymentMode} • {sampleBill.paymentStatus}
                        </span>
                        <div className="text-slate-500 text-[10px] mt-1">Counter: {sampleBill.showroom}</div>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="p-2.5">Product Description</th>
                            <th className="p-2.5">Battery / Serial #</th>
                            <th className="p-2.5 text-center">Qty</th>
                            <th className="p-2.5 text-right">Rate</th>
                            <th className="p-2.5 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sampleBill.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-bold text-slate-800">{it.productName}</td>
                              <td className="p-2.5 font-mono text-emerald-700 font-semibold">{it.batterySerial}</td>
                              <td className="p-2.5 text-center">{it.quantity}</td>
                              <td className="p-2.5 text-right">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">₹{it.totalAmount.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals and Warranty Badge */}
                    <div className="flex justify-between items-start pt-2">
                      <div className="space-y-2">
                        {currentTemplate.softBillEmailConfig?.showWarrantyBadge !== false && (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center gap-2 max-w-xs">
                            <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                            <div>
                              <div className="font-bold text-[11px]">Official EBS Warranty Included</div>
                              <div className="text-[10px] text-emerald-700">
                                Warranty serials linked directly with technical service depots.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-48 text-right space-y-1 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span className="font-mono">₹{sampleBill.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Discount:</span>
                          <span className="font-mono text-emerald-600">-₹{sampleBill.discountTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>GST Tax (18%):</span>
                          <span className="font-mono">₹{(sampleBill.cgst + sampleBill.sgst).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                          <span>Grand Total:</span>
                          <span className="text-emerald-700 font-mono">₹{sampleBill.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Referral & Wallet Promo Box */}
                    {currentTemplate.softBillEmailConfig?.showReferralCode !== false && (
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-300 text-center space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center justify-center gap-1.5">
                          <Gift size={15} className="text-amber-600" />
                          <span>{currentTemplate.softBillEmailConfig?.referralBoxTitle || 'Ekosmart Referral & Rewards Program'}</span>
                        </div>
                        <div className="inline-block px-4 py-1.5 bg-white border border-amber-300 rounded-xl shadow-xs font-mono font-black text-xl text-amber-950 tracking-widest">
                          EKO89A4
                        </div>
                        <p className="text-xs text-amber-900 max-w-md mx-auto">
                          {(currentTemplate.softBillEmailConfig?.referralBoxMessage || 'Share your referral code {{referralCode}} with friends & earn {{coins}} Coins on every qualifying purchase!')
                            .replace('{{referralCode}}', 'EKO89A4')
                            .replace(/\{\{coins\}\}/g, String(currentTemplate.softBillEmailConfig?.rewardCoins ?? 500))
                            .replace(/\{\{rewardCoins\}\}/g, String(currentTemplate.softBillEmailConfig?.rewardCoins ?? 500))
                            .replace(/\{\{welcomeCoins\}\}/g, String(currentTemplate.softBillEmailConfig?.welcomeCoins ?? 500))
                            .replace(/\{\{referrerCoins\}\}/g, String(currentTemplate.softBillEmailConfig?.referrerCoins ?? 100))}
                        </p>
                        {currentTemplate.softBillEmailConfig?.showCoinsSummary !== false && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 font-bold rounded-lg text-[11px]">
                            <Coins size={14} className="text-amber-700" />
                            <span>+{currentTemplate.softBillEmailConfig?.rewardCoins ?? 500} Coins Credited to Customer Digital Wallet</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Contact */}
                    <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-center text-[10px] space-y-1">
                      <p className="text-white font-bold">{currentTemplate.companyProfile?.businessName}</p>
                      <p>{currentTemplate.companyProfile?.address}</p>
                      <p className="text-emerald-400 font-semibold">{currentTemplate.softBillEmailConfig?.footerHelplineText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAX / SALES INVOICE PREVIEW */
            <div
              className="bg-white p-6 sm:p-8 rounded-2xl border-2 shadow-xl space-y-5 text-slate-900 transition-all font-sans text-xs"
              style={{
                borderColor: currentTemplate.theme?.primaryColor || '#059669',
              }}
            >
              {/* Header / Brand Details */}
              <div
                className="flex justify-between items-start border-b-2 pb-4"
                style={{ borderColor: currentTemplate.theme?.primaryColor || '#059669' }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: currentTemplate.theme?.primaryColor || '#059669' }}
                    />
                    <h1
                      className="text-base font-black tracking-tight"
                      style={{ color: currentTemplate.theme?.primaryColor || '#059669' }}
                    >
                      {currentTemplate.companyProfile?.businessName}
                    </h1>
                  </div>
                  {currentTemplate.companyProfile?.tagline && (
                    <p className="text-[10px] text-slate-500 font-semibold">{currentTemplate.companyProfile.tagline}</p>
                  )}
                  <p className="text-[10px] text-slate-600 max-w-sm mt-0.5">{currentTemplate.companyProfile?.address}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                    <span>Ph: {currentTemplate.companyProfile?.phone}</span>
                    <span>•</span>
                    <span>Email: {currentTemplate.companyProfile?.email}</span>
                  </div>
                  {currentTemplate.companyProfile?.gstin && (
                    <div className="text-[10px] font-mono font-bold text-slate-700">
                      GSTIN: <span className="text-slate-900">{currentTemplate.companyProfile.gstin}</span>
                    </div>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <div
                    className="inline-block px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider"
                    style={{ backgroundColor: currentTemplate.theme?.primaryColor || '#059669' }}
                  >
                    {currentTemplate.header?.title}
                  </div>
                  <div className="text-[10px] text-slate-400">{currentTemplate.header?.subtitle}</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">{sampleBill.invoiceNumber}</div>
                  <div className="text-[10px] text-slate-500">Date: {sampleBill.date}</div>
                </div>
              </div>

              {/* Customer & Invoice Meta Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed To (Customer):</div>
                  {currentTemplate.customerFields
                    ?.filter((f) => f && f.visible)
                    .map((f) => {
                      const val = getSampleCustomerFieldValue(f.key);
                      if (f.key === 'referralCode') {
                        return (
                          <div key={f.key} className="text-[11px] leading-tight flex items-center gap-1.5 pt-0.5">
                            <span className="text-slate-500 font-semibold">{f.label}:</span>
                            <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1 text-[11px]">
                              <Gift size={11} className="text-emerald-600" />
                              <span>{val}</span>
                              <span className="text-[9px] font-sans font-bold text-emerald-700 bg-white px-1 rounded border border-emerald-300">Copy</span>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={f.key} className="text-[11px] leading-tight">
                          <span className="text-slate-500">{f.label}:</span>{' '}
                          <span className="font-bold text-slate-800">{val}</span>
                        </div>
                      );
                    })}
                </div>

                <div className="space-y-1 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Details:</div>
                  {(currentTemplate.invoiceFields && currentTemplate.invoiceFields.length > 0
                    ? currentTemplate.invoiceFields.filter((f) => f.visible)
                    : [
                        { label: 'Showroom', key: 'showroom' },
                        { label: 'Executive', key: 'employeeName' },
                        { label: 'Payment', key: 'paymentMode' },
                      ]
                  ).map((invF, i) => {
                    let val = (sampleBill as any)[invF.key] || `Ref-${invF.key.toUpperCase()}-99`;
                    if (invF.key === 'paymentMode') {
                      val = `${sampleBill.paymentMode} (${sampleBill.paymentStatus})`;
                    }
                    return (
                      <div key={i} className="text-[11px]">
                        <span className="text-slate-500">{invF.label}:</span>{' '}
                        <span className="font-bold text-slate-800">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      {(currentTemplate.productColumns || [])
                        .filter((c) => c && c.visible)
                        .map((col, idx) => {
                          const colKey = String(col.key || `col_${idx}`);
                          const align = col.align || (['unitPrice', 'totalAmount', 'discount', 'taxAmount', 'mrp'].includes(colKey) ? 'right' : 'left');
                          return (
                            <th
                              key={colKey}
                              style={{ width: col.widthPercent ? `${col.widthPercent}%` : undefined }}
                              className={`p-2 text-[11px] font-bold ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
                            >
                              {col.label || colKey}
                            </th>
                          );
                        })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sampleBill.items.map((item, rowIdx) => (
                      <tr key={rowIdx}>
                        {(currentTemplate.productColumns || [])
                          .filter((c) => c && c.visible)
                          .map((col, cIdx) => {
                            const colKey = String(col.key || `col_${cIdx}`);
                            const val = getSampleColumnValue(item, colKey);
                            const align = col.align || (['unitPrice', 'totalAmount', 'discount', 'taxAmount', 'mrp'].includes(colKey) ? 'right' : 'left');
                            return (
                              <td
                                key={colKey}
                                className={`p-2 ${
                                  align === 'right'
                                    ? 'text-right font-bold font-mono'
                                    : align === 'center'
                                    ? 'text-center'
                                    : colKey === 'batterySerial'
                                    ? 'font-mono text-emerald-700 font-semibold text-left'
                                    : 'text-slate-800 text-left'
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations & Totals */}
              <div className="border-t pt-3 flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  {currentTemplate.warrantyConfig?.enabled && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">
                          {currentTemplate.warrantyConfig?.warrantyBadgeText || 'OFFICIAL WARRANTY ACTIVE'}
                        </div>
                        <div className="text-[10px] text-emerald-700">{currentTemplate.warrantyConfig?.warrantyTerms}</div>
                      </div>
                    </div>
                  )}

                  {currentTemplate.referralConfig?.showWalletCoinsStamp !== false && (
                    <div className="p-2.5 bg-gradient-to-r from-amber-50/90 via-emerald-50/50 to-amber-50/90 rounded-xl border border-amber-300 text-amber-950 space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider text-amber-900">
                          <Coins size={14} className="text-amber-600 fill-amber-500" />
                          <span>{currentTemplate.referralConfig?.badgeTitle || 'OFFICIAL REWARDS & DIGITAL WALLET'}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-full shadow-2xs">
                          {currentTemplate.referralConfig?.walletCoinsLabel || `+${currentTemplate.referralConfig?.rewardCoins || 500} Coins Credited`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-700 leading-snug">
                        💡 <strong>Benefit:</strong> {currentTemplate.referralConfig?.benefitNote || 'Redeem coins for EV battery servicing, maintenance & showroom accessories'}
                      </div>
                      {currentTemplate.referralConfig?.referralPromoNote && (
                        <div className="text-[10px] text-emerald-800 font-semibold pt-0.5 border-t border-amber-200/60">
                          🎁 <strong>Referral Offer:</strong> {currentTemplate.referralConfig.referralPromoNote}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTemplate.totalsConfig?.showAmountInWords && (
                    <div className="text-[10px] text-slate-500 italic mt-1">
                      <span className="font-bold not-italic text-slate-700">Amount in Words:</span>{' '}
                      {sampleBill.amountInWords}
                    </div>
                  )}
                </div>

                <div className="w-56 space-y-1 text-right">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{sampleBill.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Discount:</span>
                    <span className="font-mono text-emerald-600">-₹{sampleBill.discountTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {currentTemplate.totalsConfig?.splitGst ? (
                    <>
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>CGST (9%):</span>
                        <span className="font-mono">₹{sampleBill.cgst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>SGST (9%):</span>
                        <span className="font-mono">₹{sampleBill.sgst.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>GST Tax (18%):</span>
                      <span className="font-mono">₹{(sampleBill.cgst + sampleBill.sgst).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div
                    className="flex justify-between text-sm font-black pt-2 border-t text-slate-900"
                    style={{ borderColor: currentTemplate.theme?.primaryColor || '#059669' }}
                  >
                    <span>Grand Total:</span>
                    <span style={{ color: currentTemplate.theme?.primaryColor || '#059669' }}>
                      ₹{sampleBill.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Terms & Signatory */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                <div>
                  <div className="font-bold text-slate-700 uppercase mb-1">Terms & Conditions</div>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    {(Array.isArray(currentTemplate.footer?.termsAndConditions)
                      ? currentTemplate.footer.termsAndConditions
                      : []
                    ).map((term, idx) => (
                      <li key={idx}>{term}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-right flex flex-col justify-between items-end">
                  <div>
                    <div className="font-bold text-slate-800">
                      {currentTemplate.footer?.authorizedSignatoryLabel || 'For EKOSMART EV'}
                    </div>
                    {currentTemplate.footer?.bankDetails?.upiId && (
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        Pay via UPI: {currentTemplate.footer.bankDetails.upiId}
                      </div>
                    )}
                  </div>

                  <div className="pt-8">
                    <div className="border-t border-slate-300 w-36 text-center text-[10px] font-bold text-slate-700">
                      {currentTemplate.footer?.signatoryName || 'Authorized Signatory'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillTemplateDesigner;
