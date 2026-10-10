import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaAsset extends Document {
  assetId: string;
  name: string;
  url: string;
  category: 'general' | 'banners' | 'products' | 'icons' | 'logos' | 'documents';
  altText: string;
  size: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedBy?: string;
  createdAt: Date;
}

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
    assetId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ['general', 'banners', 'products', 'icons', 'logos', 'documents'],
      default: 'general',
    },
    altText: { type: String, default: '' },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: 'image/jpeg' },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    uploadedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export const MediaAsset = mongoose.model<IMediaAsset>('MediaAsset', mediaAssetSchema);
