import mongoose, { Schema, Document } from 'mongoose';

export interface IBillItem {
  productId: string;
  productName: string;
  category: string;
  productSerial?: string;
  batterySerial?: string;
  productImage?: string;
  images?: string[];
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  warrantyPeriodMonths: number;
}

export interface IBill extends Document {
  invoiceNumber: string;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  items: IBillItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paymentMode: 'Cash' | 'UPI' | 'Wallet' | 'Card' | 'Bank Transfer' | 'Finance' | 'Credit';
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  showroom: string;
  employeeId?: string;
  employeeName?: string;
  notes?: string;
  billUrls?: string[];
  attachments?: Array<{
    pageNumber: number;
    url: string;
    name?: string;
    fileType?: string;
  }>;
  warrantyGenerated: boolean;
  warrantyIds?: string[];
  purchaseRewardAwarded: boolean;
  rewardCoinsAwarded: number;
  referralCodeUsed?: string;
  referralCoinsAwarded?: number;
  softCopyEmailed?: boolean;
  softCopyEmailedAt?: Date;
  softCopyRecipient?: string;
  createdAt: Date;
  updatedAt: Date;
}

const billItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, default: 'Battery' },
    productSerial: { type: String, default: '' },
    batterySerial: { type: String, default: '' },
    productImage: { type: String, default: '' },
    images: [{ type: String }],
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 18 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    warrantyPeriodMonths: { type: Number, default: 36 },
  },
  { _id: false }
);

const billSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true, index: true },
    customerEmail: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    items: [billItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI', 'Wallet', 'Card', 'Bank Transfer', 'Finance', 'Credit'],
      default: 'UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Paid',
    },
    showroom: { type: String, default: 'Showroom Counter', index: true },
    employeeId: { type: String, default: '' },
    employeeName: { type: String, default: '' },
    notes: { type: String, default: '' },
    billUrls: [{ type: String }],
    attachments: [
      {
        pageNumber: { type: Number, default: 1 },
        url: { type: String, required: true },
        name: { type: String, default: '' },
        fileType: { type: String, default: 'image' },
      },
    ],
    warrantyGenerated: { type: Boolean, default: false },
    warrantyIds: [{ type: String }],
    purchaseRewardAwarded: { type: Boolean, default: false },
    rewardCoinsAwarded: { type: Number, default: 0 },
    referralCodeUsed: { type: String, default: '' },
    referralCoinsAwarded: { type: Number, default: 0 },
    softCopyEmailed: { type: Boolean, default: false },
    softCopyEmailedAt: { type: Date },
    softCopyRecipient: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Bill = mongoose.model<IBill>('Bill', billSchema);
