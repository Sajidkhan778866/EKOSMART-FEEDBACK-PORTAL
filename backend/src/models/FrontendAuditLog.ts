import mongoose, { Schema, Document } from 'mongoose';

export interface IFrontendAuditLog extends Document {
  adminId?: string;
  adminName: string;
  action: string;
  targetType: 'Page' | 'Theme' | 'Form' | 'Media' | 'System';
  targetId?: string;
  targetTitle?: string;
  details?: any;
  ipAddress?: string;
  timestamp: Date;
}

const frontendAuditLogSchema = new Schema<IFrontendAuditLog>(
  {
    adminId: { type: String, default: '' },
    adminName: { type: String, default: 'Administrator' },
    action: { type: String, required: true },
    targetType: {
      type: String,
      enum: ['Page', 'Theme', 'Form', 'Media', 'System'],
      default: 'Page',
    },
    targetId: { type: String, default: '' },
    targetTitle: { type: String, default: '' },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

frontendAuditLogSchema.index({ timestamp: -1 });
frontendAuditLogSchema.index({ targetType: 1, targetId: 1 });

export const FrontendAuditLog = mongoose.model<IFrontendAuditLog>('FrontendAuditLog', frontendAuditLogSchema);
