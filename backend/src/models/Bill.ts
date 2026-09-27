import mongoose, { Schema, Document } from 'mongoose';

export interface IBillItem {
  productId: string;
  productName: string;
  category: string;
  productSerial?: string;
  batterySerial?: string;
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
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Finance' | 'Credit';
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  showroom: string;
  employeeId?: string;
  employeeName?: string;
  notes?: string;
  warrantyGenerated: boolean;
  warrantyIds?: string[];
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
      enum: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Finance', 'Credit'],
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
    warrantyGenerated: { type: Boolean, default: false },
    warrantyIds: [{ type: String }],
  },
  { timestamps: true }
);

export const Bill = mongoose.model<IBill>('Bill', billSchema);
