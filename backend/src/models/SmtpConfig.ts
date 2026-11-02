import mongoose, { Document, Schema } from 'mongoose';

export interface ISmtpConfigDoc extends Document {
  key: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  rejectUnauthorized: boolean;
  updatedBy?: string;
}

const SmtpConfigSchema = new Schema<ISmtpConfigDoc>(
  {
    key: {
      type: String,
      default: 'global_smtp_config',
      unique: true,
      index: true,
    },
    host: {
      type: String,
      default: 'server62.hostingraja.org',
      trim: true,
    },
    port: {
      type: Number,
      default: 465,
    },
    secure: {
      type: Boolean,
      default: true,
    },
    user: {
      type: String,
      default: 'support_otp_email@ekosmartdrivecomplain.in',
      trim: true,
    },
    pass: {
      type: String,
      default: '',
      select: false,
    },
    from: {
      type: String,
      default: '"Ekosmart Verification" <support_otp_email@ekosmartdrivecomplain.in>',
      trim: true,
    },
    rejectUnauthorized: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  { timestamps: true }
);

export const SmtpConfig: mongoose.Model<ISmtpConfigDoc> =
  (mongoose.models.SmtpConfig as mongoose.Model<ISmtpConfigDoc>) ||
  mongoose.model<ISmtpConfigDoc>('SmtpConfig', SmtpConfigSchema);
