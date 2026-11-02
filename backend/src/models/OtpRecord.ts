import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpRecord extends Document {
  email: string;
  purpose: 'Registration' | 'Login' | 'Complaint' | 'General';
  hashedOtp: string;
  expiresAt: Date;
  attempts: number;
  payload?: any;
  lastRequestedAt: Date;
  requestCount: number;
  rateLimitResetAt: Date;
}

const OtpRecordSchema = new Schema<IOtpRecord>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ['Registration', 'Login', 'Complaint', 'General'],
      required: true,
    },
    hashedOtp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 300 }, // Auto-cleanup 5 minutes after expiry
    },
    attempts: {
      type: Number,
      default: 0,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    lastRequestedAt: {
      type: Date,
      default: Date.now,
    },
    requestCount: {
      type: Number,
      default: 1,
    },
    rateLimitResetAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  { timestamps: true }
);

OtpRecordSchema.index({ email: 1, purpose: 1 }, { unique: true });

export const OtpRecord: mongoose.Model<IOtpRecord> =
  (mongoose.models.OtpRecord as mongoose.Model<IOtpRecord>) ||
  mongoose.model<IOtpRecord>('OtpRecord', OtpRecordSchema);
