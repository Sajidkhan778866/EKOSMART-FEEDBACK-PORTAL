import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMovement extends Document {
  movementType: 'Received' | 'Sold' | 'Issued' | 'Returned' | 'Transferred' | 'Adjustment';
  productId: string;
  productName: string;
  category: string;
  serialNumber?: string;
  batterySerialNumber?: string;
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  performedBy?: {
    employeeId?: string;
    name?: string;
    role?: string;
  };
  referenceType?: 'Bill' | 'Complaint' | 'PurchaseOrder' | 'Manual';
  referenceId?: string;
  notes?: string;
  createdAt: Date;
}

const stockMovementSchema = new Schema(
  {
    movementType: {
      type: String,
      enum: ['Received', 'Sold', 'Issued', 'Returned', 'Transferred', 'Adjustment'],
      required: true,
      index: true,
    },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    serialNumber: { type: String, default: '', index: true },
    batterySerialNumber: { type: String, default: '', index: true },
    quantity: { type: Number, required: true },
    sourceLocation: { type: String, default: 'Kota Central Plant' },
    destinationLocation: { type: String, default: 'Showroom Counter' },
    performedBy: {
      employeeId: { type: String, default: '' },
      name: { type: String, default: '' },
      role: { type: String, default: '' },
    },
    referenceType: {
      type: String,
      enum: ['Bill', 'Complaint', 'PurchaseOrder', 'Manual'],
      default: 'Manual',
    },
    referenceId: { type: String, default: '', index: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const StockMovement = mongoose.model<IStockMovement>('StockMovement', stockMovementSchema);
