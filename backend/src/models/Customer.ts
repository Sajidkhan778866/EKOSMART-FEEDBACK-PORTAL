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
  referralCode?: string;
  referredBy?: string;
  referrerCustomerId?: mongoose.Types.ObjectId;
  walletBalance: number;
  totalEarnedCoins: number;
  totalSpentCoins: number;
  otp?: string;
  otpExpiresAt?: Date;
  isVerified: boolean;
  status: 'Active' | 'Inactive';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    mobile: { type: String, default: '', index: true },
    email: { type: String, index: true, lowercase: true, trim: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    customerType: { type: String, enum: ['General', 'Showroom', 'Plant'], default: 'General' },
    source: { type: String, default: 'Customer Portal' },
    referralCode: { type: String, unique: true, sparse: true, index: true },
    referredBy: { type: String, default: '' },
    referrerCustomerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    walletBalance: { type: Number, default: 0, min: 0 },
    totalEarnedCoins: { type: Number, default: 0, min: 0 },
    totalSpentCoins: { type: Number, default: 0, min: 0 },
    otp: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
