import mongoose, { Schema, Document } from 'mongoose';

export interface IFrontendAuditLog extends Document {
  action:
    | 'create_page'
    | 'update_draft'
    | 'publish_page'
    | 'revert_page'
    | 'delete_page'
    | 'duplicate_page'
    | 'update_theme_draft'
    | 'publish_theme'
    | 'reset_theme'
    | 'upload_media'
    | 'delete_media';
  targetType: 'page' | 'theme' | 'media';
  targetId?: string;
  targetName: string;
  adminEmail: string;
  details?: Record<string, any>;
  timestamp: Date;
}

const FrontendAuditLogSchema = new Schema<IFrontendAuditLog>(
  {
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String },
    targetName: { type: String, required: true },
    adminEmail: { type: String, required: true, default: 'admin@ekosmart.com' },
    details: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

FrontendAuditLogSchema.index({ timestamp: -1 });

const FrontendAuditLog: mongoose.Model<IFrontendAuditLog> =
  (mongoose.models.FrontendAuditLog as mongoose.Model<IFrontendAuditLog>) ||
  mongoose.model<IFrontendAuditLog>('FrontendAuditLog', FrontendAuditLogSchema);
export { FrontendAuditLog };
export default FrontendAuditLog;
