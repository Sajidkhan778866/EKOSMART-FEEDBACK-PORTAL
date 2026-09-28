import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplateField {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;
  order: number;
}

export interface IProductColumn {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  order: number;
}

export interface IBillTemplate extends Document {
  templateName: string;
  templateType: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Custom';
  description?: string;
  isActive: boolean;
  company: {
    name: string;
    subtitle?: string;
    logoType: 'preset' | 'image';
    logoUrl?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    alternatePhone?: string;
    email: string;
    website?: string;
    gstin: string;
    cin?: string;
    showroomName?: string;
    showroomAddress?: string;
  };
  customerFields: ITemplateField[];
  invoiceFields: ITemplateField[];
  productColumns: IProductColumn[];
  warrantyConfig: {
    visible: boolean;
    title: string;
    badgeText?: string;
    showWarrantyNumber: boolean;
    showStartDate: boolean;
    showExpiryDate: boolean;
    showSerialNumber: boolean;
    termsSummary?: string;
  };
  totalsConfig: {
    showSubtotal: boolean;
    showDiscount: boolean;
    showTaxBreakup: boolean;
    showOtherCharges: boolean;
    showGrandTotal: boolean;
    showAmountPaid: boolean;
    showBalance: boolean;
    showAmountInWords: boolean;
    currencySymbol: string;
  };
  footer: {
    termsAndConditions: string;
    warrantyPolicy?: string;
    returnPolicy?: string;
    supportHelpline?: string;
    thankYouMessage: string;
    authorizedSignatoryTitle: string;
    showAuthorizedSignature: boolean;
    showCustomerSignature: boolean;
    showBarcode: boolean;
    showQrCode: boolean;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    fontPreset: 'sans' | 'mono' | 'serif';
    borderStyle: 'solid' | 'dashed' | 'double';
    headerStyle: 'modern' | 'classic' | 'minimal';
  };
  createdAt: Date;
  updatedAt: Date;
}

const templateFieldSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const productColumnSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    width: { type: String, default: 'auto' },
    align: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const billTemplateSchema = new Schema(
  {
    templateName: { type: String, required: true, trim: true },
    templateType: {
      type: String,
      enum: ['Showroom', 'Plant', 'Rental', 'Warranty', 'Custom'],
      default: 'Showroom',
    },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    company: {
      name: { type: String, default: 'Ekosmart Battery Solution (EBS)' },
      subtitle: { type: String, default: 'High Power Lithium-Ion & LFP Technologies' },
      logoType: { type: String, enum: ['preset', 'image'], default: 'preset' },
      logoUrl: { type: String, default: '' },
      address: { type: String, default: 'Rang Talab, Near by Star Kids School' },
      city: { type: String, default: 'Kota' },
      state: { type: String, default: 'Rajasthan' },
      pincode: { type: String, default: '324002' },
      phone: { type: String, default: '+91 8949049003' },
      alternatePhone: { type: String, default: '+91 9549730483' },
      email: { type: String, default: 'support@ekosmartdrive.in' },
      website: { type: String, default: 'www.ekosmartdrive.in' },
      gstin: { type: String, default: '08DTUPM4205B1Z0' },
      cin: { type: String, default: 'REG-RJ-2026-EBS' },
      showroomName: { type: String, default: 'Kota Central Showroom Counter' },
      showroomAddress: { type: String, default: 'Rang Talab, Kota, Rajasthan - 324002' },
    },
    customerFields: [templateFieldSchema],
    invoiceFields: [templateFieldSchema],
    productColumns: [productColumnSchema],
    warrantyConfig: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: 'Official EBS Warranty Assurance' },
      badgeText: { type: String, default: 'VERIFIED WARRANTY' },
      showWarrantyNumber: { type: Boolean, default: true },
      showStartDate: { type: Boolean, default: true },
      showExpiryDate: { type: Boolean, default: true },
      showSerialNumber: { type: Boolean, default: true },
      termsSummary: {
        type: String,
        default: 'Covers internal cell defect and BMS replacement as per standard EBS warranty policy.',
      },
    },
    totalsConfig: {
      showSubtotal: { type: Boolean, default: true },
      showDiscount: { type: Boolean, default: true },
      showTaxBreakup: { type: Boolean, default: true },
      showOtherCharges: { type: Boolean, default: false },
      showGrandTotal: { type: Boolean, default: true },
      showAmountPaid: { type: Boolean, default: true },
      showBalance: { type: Boolean, default: true },
      showAmountInWords: { type: Boolean, default: true },
      currencySymbol: { type: String, default: '₹' },
    },
    footer: {
      termsAndConditions: {
        type: String,
        default:
          '1. Goods once sold are covered under Ekosmart official replacement/repair warranty.\n2. Warranty is void if tamper-proof seal is broken or unit suffers physical crush/water immersion.\n3. Transportation / courier charges for factory inspection are extra as applicable.',
      },
      warrantyPolicy: {
        type: String,
        default: '3 Years Warranty on 48V LFP Packs; 1.5 Years on 60V/72V Packs; 1 Year on Lithium Fast Chargers.',
      },
      returnPolicy: {
        type: String,
        default: 'Defective units will be repaired or replaced by authorized service engineers within standard SLA.',
      },
      supportHelpline: { type: String, default: 'Helpline: +91 8949049003 / +91 9549730483 | support@ekosmartdrive.in' },
      thankYouMessage: { type: String, default: 'Thank you for choosing Ekosmart Green Mobility!' },
      authorizedSignatoryTitle: { type: String, default: 'Authorized Signatory (Ekosmart)' },
      showAuthorizedSignature: { type: Boolean, default: true },
      showCustomerSignature: { type: Boolean, default: true },
      showBarcode: { type: Boolean, default: true },
      showQrCode: { type: Boolean, default: true },
    },
    theme: {
      primaryColor: { type: String, default: '#059669' }, // Emerald green
      accentColor: { type: String, default: '#047857' },
      fontPreset: { type: String, enum: ['sans', 'mono', 'serif'], default: 'sans' },
      borderStyle: { type: String, enum: ['solid', 'dashed', 'double'], default: 'solid' },
      headerStyle: { type: String, enum: ['modern', 'classic', 'minimal'], default: 'modern' },
    },
  },
  { timestamps: true }
);

export const BillTemplate = mongoose.model<IBillTemplate>('BillTemplate', billTemplateSchema);
