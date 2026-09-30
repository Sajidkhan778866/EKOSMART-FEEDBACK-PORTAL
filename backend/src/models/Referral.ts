import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referralId: string;
  referrer: mongoose.Types.ObjectId;
  referrerId: string;
  referrerName: string;
  referrerEmail?: string;
  referrerMobile?: string;
  referrerCode: string;
  referredCustomer: mongoose.Types.ObjectId;
  referredCustomerId: string;
  referredCustomerName: string;
  referredCustomerEmail?: string;
  referredCustomerMobile?: string;
  referredCustomerCode?: string;
  rewardAmountReferrer: number;
  rewardAmountReferred: number;
  qualificationPurchase?: string;
  rewardedAt?: Date;
  status: 'Completed' | 'Pending' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema(
  {
    referralId: { type: String, required: true, unique: true, index: true },
    referrer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    referrerId: { type: String, required: true, index: true },
    referrerName: { type: String, required: true },
    referrerEmail: { type: String, default: '' },
    referrerMobile: { type: String, default: '' },
    referrerCode: { type: String, required: true, index: true },
    referredCustomer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true, index: true },
    referredCustomerId: { type: String, required: true, index: true },
    referredCustomerName: { type: String, required: true },
    referredCustomerEmail: { type: String, default: '' },
    referredCustomerMobile: { type: String, default: '' },
    referredCustomerCode: { type: String, default: '' },
    rewardAmountReferrer: { type: Number, default: 100 },
    rewardAmountReferred: { type: Number, default: 500 },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Cancelled'],
      default: 'Completed',
      index: true,
    },
  },
  { timestamps: true }
);

export const Referral = mongoose.model<IReferral>('Referral', referralSchema);
