import mongoose, { Schema, Document } from 'mongoose';
import { IFormField } from './ComplaintForm'; // Re-use interface or extract it

// To avoid duplicate code, we can define formFieldSchema again or extract it.
const formFieldSchema = new Schema<IFormField>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Text', 'Textarea', 'Number', 'Email', 'Mobile', 'Date', 'DateTime', 'Dropdown', 'Radio', 'Checkbox', 'File Upload', 'Serial Number', 'Address']
  },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  placeholder: { type: String },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

export interface IWarrantyForm extends Document {
  category: string;
  fields: IFormField[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const warrantyFormSchema = new Schema<IWarrantyForm>(
  {
    category: { 
      type: String, 
      required: true,
      unique: true
    },
    fields: [formFieldSchema],
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const WarrantyForm = mongoose.model<IWarrantyForm>('WarrantyForm', warrantyFormSchema);
