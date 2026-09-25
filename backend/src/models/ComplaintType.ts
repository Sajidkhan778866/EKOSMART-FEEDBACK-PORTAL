import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaintType extends Document {
  name: string;
  division: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const complaintTypeSchema = new Schema<IComplaintType>(
  {
    name: { type: String, required: true, trim: true },
    division: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Compound index for unique complaint type name per division
complaintTypeSchema.index({ name: 1, division: 1 }, { unique: true });

export const ComplaintType = mongoose.model<IComplaintType>('ComplaintType', complaintTypeSchema);
