import mongoose, { Schema, Document } from 'mongoose';

export interface IWarranty extends Document {
  warrantyNumber: string;
  category: string;
  customer: mongoose.Types.ObjectId;
  product: string;
  serialNumber: string;
  billNumber: string;
  purchaseDate: Date;
  warrantyStartDate: Date;
  warrantyExpiryDate: Date;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Pending' | 'Cancelled';
  formData: any;
  registeredBy?: {
    employeeId?: string;
    name?: string;
    role?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const warrantySchema = new Schema(
  {
    warrantyNumber: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: String, required: true },
    serialNumber: { type: String, required: true },
    billNumber: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    warrantyStartDate: { type: Date, required: true },
    warrantyExpiryDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Active', 'Expiring Soon', 'Expired', 'Pending', 'Cancelled'], 
      default: 'Pending' 
    },
    formData: { type: Schema.Types.Mixed },
    registeredBy: {
      employeeId: { type: String },
      name: { type: String },
      role: { type: String },
    },
  },
  { timestamps: true }
);

export const Warranty = mongoose.model<IWarranty>('Warranty', warrantySchema);
