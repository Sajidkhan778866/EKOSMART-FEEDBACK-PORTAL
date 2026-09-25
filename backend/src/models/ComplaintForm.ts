import mongoose, { Schema, Document } from 'mongoose';

export interface IFormField {
  name: string;
  label: string;
  type: 'Text' | 'Textarea' | 'Number' | 'Email' | 'Mobile' | 'Date' | 'DateTime' | 'Dropdown' | 'Radio' | 'Checkbox' | 'File Upload' | 'Serial Number' | 'Address';
  required: boolean;
  options?: string[];
  placeholder?: string;
  order: number;
  isActive: boolean;
}

export interface IComplaintForm extends Document {
  division: string;
  fields: IFormField[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

const complaintFormSchema = new Schema<IComplaintForm>(
  {
    division: { 
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

export const ComplaintForm = mongoose.model<IComplaintForm>('ComplaintForm', complaintFormSchema);
