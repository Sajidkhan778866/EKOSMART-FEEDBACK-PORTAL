import mongoose, { Schema, Document } from 'mongoose';

export interface IStockHistory {
  operation: string;
  quantity: number;
  referenceNumber?: string;
  employeeName?: string;
  employeeId?: string;
  notes?: string;
  date: Date;
}

export interface IStock extends Document {
  productId: string;
  productName: string;
  category: string;
  modelNumber?: string;
  serialNumber?: string;
  batterySerialNumber?: string;
  quantity: number;
  availableQuantity: number;
  soldQuantity: number;
  reservedQuantity: number;
  totalReceived: number;
  totalSold: number;
  unitPrice: number;
  mrp: number;
  location: string;
  status: string;
  specifications?: Record<string, any>;
  attributes?: Record<string, any>;
  customFields?: Record<string, any>;
  purchaseInfo?: {
    supplier?: string;
    purchaseDate?: Date;
    invoiceNumber?: string;
    purchaseCost?: number;
  };
  warrantyPeriodMonths?: number;
  warrantyInfo?: {
    warrantyPeriodMonths?: number;
    terms?: string;
  };
  history: IStockHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const stockHistorySchema = new Schema(
  {
    operation: { type: String, required: true },
    quantity: { type: Number, required: true },
    referenceNumber: { type: String, default: '' },
    employeeName: { type: String, default: '' },
    employeeId: { type: String, default: '' },
    notes: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const stockSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true, index: true },
    category: {
      type: String,
      default: 'Battery',
      index: true,
    },
    modelNumber: { type: String, default: '' },
    serialNumber: { type: String, default: '', index: true },
    batterySerialNumber: { type: String, default: '', index: true },
    quantity: { type: Number, required: true, default: 1 },
    availableQuantity: { type: Number, default: 1 },
    soldQuantity: { type: Number, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 1 },
    totalSold: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true, default: 0 },
    mrp: { type: Number, required: true, default: 0 },
    location: { type: String, default: 'Kota Central Plant', index: true },
    status: {
      type: String,
      default: 'In Stock',
      index: true,
    },
    specifications: { type: Schema.Types.Mixed, default: {} },
    attributes: { type: Schema.Types.Mixed, default: {} },
    customFields: { type: Schema.Types.Mixed, default: {} },
    purchaseInfo: {
      supplier: { type: String, default: '' },
      purchaseDate: { type: Date },
      invoiceNumber: { type: String, default: '' },
      purchaseCost: { type: Number, default: 0 },
    },
    warrantyPeriodMonths: { type: Number, default: 36 },
    warrantyInfo: {
      warrantyPeriodMonths: { type: Number, default: 36 },
      terms: { type: String, default: '' },
    },
    history: [stockHistorySchema],
  },
  { timestamps: true, strict: false }
);

export const Stock = mongoose.model<IStock>('Stock', stockSchema);
