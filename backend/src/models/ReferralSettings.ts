import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralSettings extends Document {
  key: string;
  enabled: boolean;
  newCustomerReward: number; // default: 500
  referrerReward: number; // default: 100
  purchaseReward: number; // default: 500
  qualifyingMinPurchase: number; // default: 0
  coinConversionRate: number; // 1 Coin = ₹X (e.g., 1 Coin = 1 Re or soft-coded)
  termsAndConditions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const referralSettingsSchema = new Schema(
  {
    key: { type: String, default: 'global_referral_settings', unique: true },
    enabled: { type: Boolean, default: true },
    newCustomerReward: { type: Number, default: 500 },
    referrerReward: { type: Number, default: 100 },
    purchaseReward: { type: Number, default: 500 },
    qualifyingMinPurchase: { type: Number, default: 0 },
    coinConversionRate: { type: Number, default: 1 },
    termsAndConditions: {
      type: [String],
      default: [
        '1. New registered customers receive 500 welcome coins upon entering a valid referral code.',
        '2. The referring customer receives 100 referral coins once the referred friend completes OTP verification.',
        '3. Every qualifying showroom product purchase awards 500 coins to the customer wallet.',
        '4. Referral codes are permanent, unique, non-guessable, and linked to the customer account.',
        '5. Self-referral and duplicate claims are strictly prohibited and monitored.',
      ],
    },
  },
  { timestamps: true }
);

export const ReferralSettings = mongoose.model<IReferralSettings>('ReferralSettings', referralSettingsSchema);
