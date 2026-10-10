import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaAsset extends Document {
  name: string;
  category: 'logo' | 'banner' | 'card' | 'icon' | 'product' | 'general';
  url: string;
  altText: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  tags: string[];
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['logo', 'banner', 'card', 'icon', 'product', 'general'],
      default: 'general',
    },
    url: { type: String, required: true, trim: true },
    altText: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: 'image/png' },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    tags: { type: [String], default: [] },
    uploadedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

MediaAssetSchema.index({ category: 1, name: 1 });

const MediaAsset: mongoose.Model<IMediaAsset> =
  (mongoose.models.MediaAsset as mongoose.Model<IMediaAsset>) ||
  mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);
export { MediaAsset };
export default MediaAsset;
