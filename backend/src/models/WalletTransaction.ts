import mongoose, { Schema, Document } from 'mongoose';

export interface IWalletTransaction extends Document {
  transactionId: string;
  customer: mongoose.Types.ObjectId;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerMobile?: string;
  type: 'Credit' | 'Debit';
  category: 'Welcome Reward' | 'Referral Reward' | 'Referrer Reward' | 'Purchase Reward' | 'Redemption' | 'Admin Adjustment' | 'Refund' | 'Service Redemption';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  reference?: string; // Referral ID, Bill Invoice #, Registration ID
  referenceType?: 'Referral' | 'Bill' | 'Registration' | 'Admin' | 'Redemption' | 'None';
  status: 'Completed' | 'Pending' | 'Failed' | 'Reversed';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const walletTransactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerMobile: { type: String, default: '' },
    type: { type: String, enum: ['Credit', 'Debit'], required: true, index: true },
    category: {
      type: String,
      enum: [
        'Welcome Reward',
        'Referral Reward',
        'Referrer Reward',
        'Purchase Reward',
        'Redemption',
        'Service Redemption',
        'Admin Adjustment',
        'Refund',
      ],
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true, default: 0 },
    balanceAfter: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    reference: { type: String, default: '', index: true },
    referenceType: {
      type: String,
      enum: ['Referral', 'Bill', 'Registration', 'Admin', 'Redemption', 'None'],
      default: 'None',
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed', 'Reversed'],
      default: 'Completed',
      index: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const WalletTransaction = mongoose.model<IWalletTransaction>('WalletTransaction', walletTransactionSchema);
