import mongoose, { Schema, Document } from 'mongoose';

export interface IStockHistory {
  operation: 'Received' | 'Sold' | 'Issued' | 'Returned' | 'Transferred' | 'Adjusted';
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
  category: 'Battery' | 'Spare Parts' | 'Scooter' | 'Charger' | 'Accessory' | 'Other';
  modelNumber?: string;
  serialNumber?: string;
  batterySerialNumber?: string;
  quantity: number;
  totalReceived: number;
  totalSold: number;
  reservedQuantity: number;
  unitPrice: number;
  mrp: number;
  location: string;
  status: 'In Stock' | 'Sold' | 'Reserved' | 'Under Service' | 'Defective' | 'Returned';
  specifications?: Record<string, any>;
  warrantyPeriodMonths?: number;
  history: IStockHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const stockHistorySchema = new Schema(
  {
    operation: {
      type: String,
      enum: ['Received', 'Sold', 'Issued', 'Returned', 'Transferred', 'Adjusted'],
      required: true,
    },
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
      enum: ['Battery', 'Spare Parts', 'Scooter', 'Charger', 'Accessory', 'Other'],
      default: 'Battery',
      index: true,
    },
    modelNumber: { type: String, default: '' },
    serialNumber: { type: String, default: '', index: true },
    batterySerialNumber: { type: String, default: '', index: true },
    quantity: { type: Number, required: true, default: 1 },
    totalReceived: { type: Number, default: 1 },
    totalSold: { type: Number, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true, default: 0 },
    mrp: { type: Number, required: true, default: 0 },
    location: { type: String, default: 'Kota Central Plant', index: true },
    status: {
      type: String,
      enum: ['In Stock', 'Sold', 'Reserved', 'Under Service', 'Defective', 'Returned'],
      default: 'In Stock',
      index: true,
    },
    specifications: { type: Schema.Types.Mixed, default: {} },
    warrantyPeriodMonths: { type: Number, default: 36 },
    history: [stockHistorySchema],
  },
  { timestamps: true }
);

export const Stock = mongoose.model<IStock>('Stock', stockSchema);
