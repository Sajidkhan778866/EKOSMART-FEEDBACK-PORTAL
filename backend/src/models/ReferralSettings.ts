import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralSettings extends Document {
  key: string;
  enabled: boolean;
  welcomeRewardCoins: number; // default: 250 (on account opening)
  newCustomerReward: number; // default: 500 (referred new customer bonus)
  referrerReward: number; // default: 500 (bonus to referrer)
  purchaseReward: number; // default: 500 (coins on bill purchase)
  showroomCoins: number; // default: 250 (showroom purchase coins)
  batteryCoins: number; // default: 500 (battery purchase coins)
  serviceReward: number; // default: 250 (service usage / redemption)
  serviceRedemptionValue: number; // default: 200 (250 coins = ₹200 value)
  qualifyingMinPurchase: number; // default: 0
  coinConversionRate: number; // 1 Coin = ₹X (default: 1)
  termsAndConditions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const referralSettingsSchema = new Schema(
  {
    key: { type: String, default: 'global_referral_settings', unique: true },
    enabled: { type: Boolean, default: true },
    welcomeRewardCoins: { type: Number, default: 250 },
    newCustomerReward: { type: Number, default: 500 },
    referrerReward: { type: Number, default: 500 },
    purchaseReward: { type: Number, default: 500 },
    showroomCoins: { type: Number, default: 250 },
    batteryCoins: { type: Number, default: 500 },
    serviceReward: { type: Number, default: 250 },
    serviceRedemptionValue: { type: Number, default: 200 },
    qualifyingMinPurchase: { type: Number, default: 0 },
    coinConversionRate: { type: Number, default: 1 },
    termsAndConditions: {
      type: [String],
      default: [
        '1. New registered customers receive welcome coins upon entering a valid referral code or opening an account.',
        '2. The referring customer receives referral coins once their referred friend completes verification or first purchase.',
        '3. Every qualifying showroom & EV battery product purchase awards reward coins directly to the customer digital wallet.',
        '4. Accumulated coins can be redeemed for EV battery servicing, maintenance charges, and accessories.',
        '5. Referral codes are permanent, unique, non-guessable, and linked to the customer account.',
      ],
    },
  },
  { timestamps: true }
);

export const ReferralSettings = mongoose.model<IReferralSettings>('ReferralSettings', referralSettingsSchema);
