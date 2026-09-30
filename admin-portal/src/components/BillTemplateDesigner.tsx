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

  const customerFields = Array.isArray(tpl.customerFields) && tpl.customerFields.length > 0
    ? tpl.customerFields.map((f: any, idx: number) => ({
        key: f.key || `field_${idx}`,
        label: f.label || f.key || 'Field',
        visible: f.visible !== undefined ? Boolean(f.visible) : true,
        required: Boolean(f.required),
        order: f.order || idx + 1,
      }))
    : DEFAULT_TEMPLATES[0].customerFields;

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

  return {
    _id: tpl._id,
    name: tpl.name || tpl.templateName || (isSalary ? 'Employee Official Salary Slip' : 'Showroom Tax Invoice'),
    templateName: tpl.templateName || tpl.name || (isSalary ? 'Employee Official Salary Slip' : 'Showroom Tax Invoice'),
    type: templateType,
    templateType,
    isActive: Boolean(tpl.isActive),
    isDefault: Boolean(tpl.isDefault),
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
  const [activeTab, setActiveTab] = useState<'company' | 'customer' | 'columns' | 'salary' | 'totals' | 'footer' | 'theme'>(
    restrictType === 'Salary' || initialType === 'Salary' ? 'salary' : 'company'
  );
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

  // Move Column Up/Down Helper
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

  // Customer Field Handlers
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <Briefcase size={16} className="text-emerald-600" />
                <span>Salary Allowances & Deductions Setup</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Earnings Section Title</label>
                  <input
                    type="text"
                    value={currentTemplate.salaryConfig?.allowancesTitle || 'Earnings / Gross Pay'}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        salaryConfig: { ...currentTemplate.salaryConfig, allowancesTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deductions Section Title</label>
                  <input
                    type="text"
                    value={currentTemplate.salaryConfig?.deductionsTitle || 'Deductions & Recoveries'}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        salaryConfig: { ...currentTemplate.salaryConfig, deductionsTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700 block mb-2">Standard Earnings Components Included:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(Array.isArray(currentTemplate.salaryConfig?.earningsColumns)
                      ? currentTemplate.salaryConfig.earningsColumns
                      : []
                    ).map((col, i) => (
                      <div key={i} className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span className="font-semibold text-emerald-950 text-[11px]">{col.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700 block mb-2">Standard Deductions Components Included:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(Array.isArray(currentTemplate.salaryConfig?.deductionsColumns)
                      ? currentTemplate.salaryConfig.deductionsColumns
                      : []
                    ).map((col, i) => (
                      <div key={i} className="p-2 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-rose-600 shrink-0" />
                        <span className="font-semibold text-rose-950 text-[11px]">{col.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Customer & Invoice Fields */}
          {activeTab === 'customer' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <User size={16} className="text-emerald-600" />
                  <span>Customer Fields & Reordering</span>
                </h3>
                <span className="text-[11px] text-slate-400">Toggle visibility and rename labels</span>
              </div>

              <div className="space-y-2">
                {(Array.isArray(currentTemplate.customerFields) ? currentTemplate.customerFields : []).map((field, idx) => (
                  <div
                    key={field.key || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      field.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={Boolean(field.visible)}
                        onChange={() => toggleCustomerField(idx)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={field.label || ''}
                        onChange={(e) => updateCustomerFieldLabel(idx, e.target.value)}
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">({field.key})</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveCustomerField(idx, 'up')}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (currentTemplate.customerFields?.length || 0) - 1}
                        onClick={() => moveCustomerField(idx, 'down')}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Line Item Columns Designer */}
          {activeTab === 'columns' && !isSalaryTemplate && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <ListOrdered size={16} className="text-emerald-600" />
                  <span>Invoice Line Items Table Columns</span>
                </h3>
                <span className="text-[11px] text-slate-400">Reorder with ↑ ↓ buttons</span>
              </div>

              <div className="space-y-2">
                {(Array.isArray(currentTemplate.productColumns) ? currentTemplate.productColumns : []).map((col, idx) => (
                  <div
                    key={col.key || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      col.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={Boolean(col.visible)}
                        onChange={() => toggleColumnVisibility(idx)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={col.label || ''}
                        onChange={(e) => updateColumnLabel(idx, e.target.value)}
                        placeholder="Column Header Name"
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">({col.key})</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveColumn(idx, 'up')}
                        title="Move Left / Up"
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (currentTemplate.productColumns?.length || 0) - 1}
                        onClick={() => moveColumn(idx, 'down')}
                        title="Move Right / Down"
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={14} />
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Terms, Bank Details & Signatory</span>
              </h3>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Terms & Conditions (One condition per line)
                </label>
                <textarea
                  rows={4}
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
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
        </div>

        {/* Right Side: LIVE REAL-TIME BILL OR SALARY SLIP PREVIEW */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Eye size={16} className="text-emerald-400" />
              <span>
                {isSalaryTemplate ? 'Real-Time Employee Salary Slip Preview' : 'Real-Time Live Invoice Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
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
                    ?.filter((f) => f.visible)
                    .map((f) => {
                      let val = (sampleBill as any)[f.key] || '-';
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
                  <div className="text-[11px]">
                    <span className="text-slate-500">Showroom:</span>{' '}
                    <span className="font-bold text-slate-800">{sampleBill.showroom}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-500">Executive:</span>{' '}
                    <span className="font-bold text-slate-800">{sampleBill.employeeName}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-500">Payment:</span>{' '}
                    <span className="font-bold text-emerald-700">
                      {sampleBill.paymentMode} ({sampleBill.paymentStatus})
                    </span>
                  </div>
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
                          const isNumeric = colKey.toLowerCase().includes('amount') || colKey.toLowerCase().includes('price') || colKey.toLowerCase().includes('rate');
                          return (
                            <th
                              key={colKey}
                              className={`p-2 ${isNumeric ? 'text-right' : ''}`}
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
                            let val = (item as any)[colKey];
                            if (
                              colKey === 'unitPrice' ||
                              colKey === 'totalAmount' ||
                              colKey === 'taxAmount' ||
                              colKey === 'discount'
                            ) {
                              val = `₹${(Number(val) || 0).toLocaleString('en-IN')}`;
                            }
                            const isNumeric = colKey.toLowerCase().includes('amount') || colKey.toLowerCase().includes('price') || colKey.toLowerCase().includes('rate');
                            return (
                              <td
                                key={colKey}
                                className={`p-2 ${
                                  isNumeric
                                    ? 'text-right font-bold'
                                    : colKey === 'batterySerial'
                                    ? 'font-mono text-emerald-700 font-semibold'
                                    : 'text-slate-800'
                                }`}
                              >
                                {val !== undefined && val !== null ? String(val) : '-'}
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
                <div className="space-y-1.5 flex-1">
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

                  {currentTemplate.totalsConfig?.showAmountInWords && (
                    <div className="text-[10px] text-slate-500 italic mt-2">
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
