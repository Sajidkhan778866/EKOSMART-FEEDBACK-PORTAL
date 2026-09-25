import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  customerType: 'General' | 'Showroom' | 'Plant';
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    customerType: { type: String, enum: ['General', 'Showroom', 'Plant'], default: 'General' },
    source: { type: String },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
