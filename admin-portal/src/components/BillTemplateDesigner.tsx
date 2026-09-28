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
} from 'lucide-react';
import { billTemplateApi } from '../api/client';

export interface IBillTemplate {
  _id?: string;
  name: string;
  type: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Custom';
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

const DEFAULT_TEMPLATES: IBillTemplate[] = [
  {
    name: 'Showroom Tax Invoice',
    type: 'Showroom',
    isActive: true,
    isDefault: true,
    companyProfile: {
      businessName: 'EKOSMART EV BATTERY SOLUTION',
      tagline: 'Clean Energy & Smart Electric Mobility',
      address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
      phone: '+91 94141 88990 / +91 94141 88991',
      email: 'sales@ekosmartevs.com',
      website: 'www.ekosmartevs.com',
      gstin: '08AABCE1234F1Z5',
      cin: 'U31909RJ2023PTC085432',
      pan: 'AABCE1234F',
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
      primaryColor: '#4f46e5', // Indigo
      secondaryColor: '#059669', // Emerald
      fontFamily: 'Inter',
      paperSize: 'A4',
      showWatermark: true,
      watermarkText: 'ORIGINAL TAX INVOICE',
      borderStyle: 'rounded',
    },
  },
];

const PRESET_COLORS = [
  { name: 'Indigo Brand', hex: '#4f46e5' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Teal Pro', hex: '#0d9488' },
  { name: 'Slate Dark', hex: '#334155' },
  { name: 'Rose Red', hex: '#e11d48' },
  { name: 'Violet Royal', hex: '#7c3aed' },
];

export const BillTemplateDesigner: React.FC = () => {
  const [templates, setTemplates] = useState<IBillTemplate[]>(DEFAULT_TEMPLATES);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState<IBillTemplate>(DEFAULT_TEMPLATES[0]);
  const [activeTab, setActiveTab] = useState<'company' | 'customer' | 'columns' | 'totals' | 'footer' | 'theme'>('company');
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await billTemplateApi.getAll();
      if (res.data?.success && res.data.data?.length > 0) {
        setTemplates(res.data.data);
        const activeIdx = res.data.data.findIndex((t: IBillTemplate) => t.isActive);
        const chosenIdx = activeIdx >= 0 ? activeIdx : 0;
        setActiveTemplateIndex(chosenIdx);
        setCurrentTemplate(res.data.data[chosenIdx]);
      }
    } catch {
      // Use defaults if backend not yet seeded
    }
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const selectTemplate = (index: number) => {
    setActiveTemplateIndex(index);
    setCurrentTemplate(templates[index]);
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      if (currentTemplate._id) {
        const res = await billTemplateApi.update(currentTemplate._id, currentTemplate);
        if (res.data?.success) {
          showAlert('success', `Bill template "${currentTemplate.name}" saved successfully!`);
          fetchTemplates();
        }
      } else {
        const res = await billTemplateApi.create(currentTemplate);
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
        showAlert('success', `Template "${currentTemplate.name}" is now the ACTIVE billing template!`);
        fetchTemplates();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to activate template');
    } finally {
      setSaving(false);
    }
  };

  const handleCloneTemplate = () => {
    const cloned: IBillTemplate = {
      ...currentTemplate,
      _id: undefined,
      name: `${currentTemplate.name} (Copy)`,
      isActive: false,
      isDefault: false,
    };
    setTemplates([...templates, cloned]);
    setActiveTemplateIndex(templates.length);
    setCurrentTemplate(cloned);
    showAlert('success', 'Cloned template as a new editable draft. Click "Save Template" when ready.');
  };

  // Move Column Up/Down Helper
  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const cols = [...currentTemplate.productColumns];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cols.length) return;

    const temp = cols[index];
    cols[index] = cols[targetIdx];
    cols[targetIdx] = temp;

    // re-assign orders
    cols.forEach((col, i) => {
      col.order = i + 1;
    });

    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  // Toggle Column Visibility
  const toggleColumnVisibility = (index: number) => {
    const cols = [...currentTemplate.productColumns];
    cols[index].visible = !cols[index].visible;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  // Update Column Label
  const updateColumnLabel = (index: number, label: string) => {
    const cols = [...currentTemplate.productColumns];
    cols[index].label = label;
    setCurrentTemplate({
      ...currentTemplate,
      productColumns: cols,
    });
  };

  // Move Customer Field Up/Down Helper
  const moveCustomerField = (index: number, direction: 'up' | 'down') => {
    const fields = [...currentTemplate.customerFields];
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
    const fields = [...currentTemplate.customerFields];
    fields[index].visible = !fields[index].visible;
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
  };

  const updateCustomerFieldLabel = (index: number, label: string) => {
    const fields = [...currentTemplate.customerFields];
    fields[index].label = label;
    setCurrentTemplate({
      ...currentTemplate,
      customerFields: fields,
    });
  };

  // Sample data for realistic live preview
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
            <FileText size={20} className="text-indigo-600" />
            <span className="font-bold text-sm text-slate-800">Template:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectTemplate(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTemplateIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tpl.name}</span>
                {tpl.isActive && (
                  <span className="px-1.5 py-0.5 bg-emerald-400 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-wider">
                    LIVE ACTIVE
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
              className="flex-1 md:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-900/20"
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
            className="flex-1 md:flex-initial px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-900/30"
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
                activeTab === 'company' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={14} />
              <span>Company</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'customer' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={14} />
              <span>Fields</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('columns')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'columns' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered size={14} />
              <span>Columns</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('totals')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'totals' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign size={14} />
              <span>Taxes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('footer')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'footer' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Terms & Bank</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'theme' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
                <Building2 size={16} className="text-indigo-600" />
                <span>Company Header & Legal Identity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Business / Company Name *</label>
                  <input
                    type="text"
                    value={currentTemplate.companyProfile.businessName}
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
                    value={currentTemplate.companyProfile.tagline || ''}
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
                  value={currentTemplate.companyProfile.address}
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
                    value={currentTemplate.companyProfile.phone}
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
                    value={currentTemplate.companyProfile.email}
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
                    value={currentTemplate.companyProfile.website || ''}
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
                    value={currentTemplate.companyProfile.gstin || ''}
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
                    value={currentTemplate.companyProfile.cin || ''}
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
                  <label className="block text-slate-700 font-bold mb-1">Invoice Header Title</label>
                  <input
                    type="text"
                    value={currentTemplate.header.title}
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

          {/* TAB 2: Customer & Invoice Fields */}
          {activeTab === 'customer' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  <span>Customer Fields & Reordering</span>
                </h3>
                <span className="text-[11px] text-slate-400">Toggle visibility and rename labels</span>
              </div>

              <div className="space-y-2">
                {currentTemplate.customerFields.map((field, idx) => (
                  <div
                    key={field.key}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      field.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={field.visible}
                        onChange={() => toggleCustomerField(idx)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={field.label}
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
                        disabled={idx === currentTemplate.customerFields.length - 1}
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
          {activeTab === 'columns' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <ListOrdered size={16} className="text-indigo-600" />
                  <span>Invoice Line Items Table Columns</span>
                </h3>
                <span className="text-[11px] text-slate-400">Reorder with ↑ ↓ buttons</span>
              </div>

              <div className="space-y-2">
                {currentTemplate.productColumns.map((col, idx) => (
                  <div
                    key={col.key}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      col.visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={() => toggleColumnVisibility(idx)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={col.label}
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
                        disabled={idx === currentTemplate.productColumns.length - 1}
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
          {activeTab === 'totals' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-600" />
                <span>GST Tax Breakdown & Summary Rules</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentTemplate.totalsConfig.splitGst}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        totalsConfig: { ...currentTemplate.totalsConfig, splitGst: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
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
                    checked={currentTemplate.totalsConfig.showAmountInWords}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        totalsConfig: { ...currentTemplate.totalsConfig, showAmountInWords: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
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
                    checked={currentTemplate.warrantyConfig.enabled}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        warrantyConfig: { ...currentTemplate.warrantyConfig, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
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
                <ShieldCheck size={16} className="text-indigo-600" />
                <span>Terms, Bank Details & Signatory</span>
              </h3>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Terms & Conditions (One condition per line)
                </label>
                <textarea
                  rows={4}
                  value={currentTemplate.footer.termsAndConditions.join('\n')}
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
                    value={currentTemplate.footer.bankDetails?.bankName || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        footer: {
                          ...currentTemplate.footer,
                          bankDetails: { ...currentTemplate.footer.bankDetails, bankName: e.target.value },
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
                    value={currentTemplate.footer.bankDetails?.accountNumber || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        footer: {
                          ...currentTemplate.footer,
                          bankDetails: { ...currentTemplate.footer.bankDetails, accountNumber: e.target.value },
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
                    value={currentTemplate.footer.bankDetails?.ifscCode || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        footer: {
                          ...currentTemplate.footer,
                          bankDetails: { ...currentTemplate.footer.bankDetails, ifscCode: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">UPI ID for Payment</label>
                  <input
                    type="text"
                    value={currentTemplate.footer.bankDetails?.upiId || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        footer: {
                          ...currentTemplate.footer,
                          bankDetails: { ...currentTemplate.footer.bankDetails, upiId: e.target.value },
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
                    value={currentTemplate.footer.authorizedSignatoryLabel || ''}
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
                    value={currentTemplate.footer.signatoryName || ''}
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
                <Palette size={16} className="text-indigo-600" />
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
                        currentTemplate.theme.primaryColor === clr.hex
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
                    value={currentTemplate.theme.paperSize}
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
                    value={currentTemplate.theme.watermarkText || ''}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        theme: { ...currentTemplate.theme, watermarkText: e.target.value },
                      })
                    }
                    placeholder="e.g. ORIGINAL TAX INVOICE"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: LIVE REAL-TIME BILL PREVIEW */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Eye size={16} className="text-emerald-400" />
              <span>Real-Time Live Invoice Preview</span>
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

          {/* Realistic A4 Render Container */}
          <div
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-xl space-y-5 text-slate-900 transition-all font-sans text-xs"
            style={{
              borderColor: currentTemplate.theme.primaryColor,
            }}
          >
            {/* Header / Brand Details */}
            <div className="flex justify-between items-start border-b-2 pb-4" style={{ borderColor: currentTemplate.theme.primaryColor }}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentTemplate.theme.primaryColor }}
                  />
                  <h1 className="text-base font-black tracking-tight" style={{ color: currentTemplate.theme.primaryColor }}>
                    {currentTemplate.companyProfile.businessName}
                  </h1>
                </div>
                {currentTemplate.companyProfile.tagline && (
                  <p className="text-[10px] text-slate-500 font-semibold">{currentTemplate.companyProfile.tagline}</p>
                )}
                <p className="text-[10px] text-slate-600 max-w-sm mt-1">{currentTemplate.companyProfile.address}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                  <span>Ph: {currentTemplate.companyProfile.phone}</span>
                  <span>•</span>
                  <span>Email: {currentTemplate.companyProfile.email}</span>
                </div>
                {currentTemplate.companyProfile.gstin && (
                  <div className="text-[10px] font-mono font-bold text-slate-700">
                    GSTIN: <span className="text-slate-900">{currentTemplate.companyProfile.gstin}</span>
                  </div>
                )}
              </div>

              <div className="text-right space-y-1">
                <div
                  className="inline-block px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider"
                  style={{ backgroundColor: currentTemplate.theme.primaryColor }}
                >
                  {currentTemplate.header.title}
                </div>
                <div className="text-[10px] text-slate-400">{currentTemplate.header.subtitle}</div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-1">{sampleBill.invoiceNumber}</div>
                <div className="text-[10px] text-slate-500">Date: {sampleBill.date}</div>
              </div>
            </div>

            {/* Customer & Invoice Meta Info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed To (Customer):</div>
                {currentTemplate.customerFields
                  .filter((f) => f.visible)
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
                  <span className="font-bold text-emerald-700">{sampleBill.paymentMode} ({sampleBill.paymentStatus})</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    {currentTemplate.productColumns
                      .filter((c) => c.visible)
                      .map((col) => (
                        <th
                          key={col.key}
                          className={`p-2 ${col.key.includes('Amount') || col.key.includes('Price') ? 'text-right' : ''}`}
                        >
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sampleBill.items.map((item, idx) => (
                    <tr key={idx}>
                      {currentTemplate.productColumns
                        .filter((c) => c.visible)
                        .map((col) => {
                          let val = (item as any)[col.key];
                          if (col.key === 'unitPrice' || col.key === 'totalAmount' || col.key === 'taxAmount' || col.key === 'discount') {
                            val = `₹${(val || 0).toLocaleString('en-IN')}`;
                          }
                          return (
                            <td
                              key={col.key}
                              className={`p-2 ${
                                col.key.includes('Amount') || col.key.includes('Price')
                                  ? 'text-right font-bold'
                                  : col.key === 'batterySerial'
                                  ? 'font-mono text-emerald-700 font-semibold'
                                  : 'text-slate-800'
                              }`}
                            >
                              {val || '-'}
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
                {currentTemplate.warrantyConfig.enabled && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">
                        {currentTemplate.warrantyConfig.warrantyBadgeText || 'OFFICIAL WARRANTY ACTIVE'}
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        {currentTemplate.warrantyConfig.warrantyTerms}
                      </div>
                    </div>
                  </div>
                )}

                {currentTemplate.totalsConfig.showAmountInWords && (
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
                {currentTemplate.totalsConfig.splitGst ? (
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
                  style={{ borderColor: currentTemplate.theme.primaryColor }}
                >
                  <span>Grand Total:</span>
                  <span style={{ color: currentTemplate.theme.primaryColor }}>
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
                  {currentTemplate.footer.termsAndConditions.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              </div>

              <div className="text-right flex flex-col justify-between items-end">
                <div>
                  <div className="font-bold text-slate-800">
                    {currentTemplate.footer.authorizedSignatoryLabel || 'For EKOSMART EV'}
                  </div>
                  {currentTemplate.footer.bankDetails?.upiId && (
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Pay via UPI: {currentTemplate.footer.bankDetails.upiId}
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <div className="border-t border-slate-300 w-36 text-center text-[10px] font-bold text-slate-700">
                    {currentTemplate.footer.signatoryName || 'Authorized Signatory'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillTemplateDesigner;
