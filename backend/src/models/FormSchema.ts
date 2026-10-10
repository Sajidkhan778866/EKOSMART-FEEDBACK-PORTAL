import mongoose, { Schema, Document } from 'mongoose';

export interface IFormField {
  fieldKey: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  placeholder?: string;
  defaultValue?: any;
  options?: string[];
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  width?: 'full' | '1/2' | '1/3';
  isVisible?: boolean;
  order?: number;
  helpText?: string;
}

export interface IFormSchema extends Document {
  formKey: string;
  title: string;
  description: string;
  fields: IFormField[];
  submitButton: {
    label: string;
    color?: string;
    icon?: string;
    size?: string;
  };
  destinationWorkflow: 'contact_inquiry' | 'ticket_submission' | 'warranty_registration' | 'custom_submission';
  successMessage: string;
  errorMessage: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema<IFormField>(
  {
    fieldKey: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'number', 'email', 'phone', 'textarea', 'select', 'radio', 'checkbox', 'date', 'file'],
      default: 'text',
    },
    placeholder: { type: String, default: '' },
    defaultValue: { type: Schema.Types.Mixed },
    options: { type: [String], default: [] },
    required: { type: Boolean, default: false },
    validation: {
      minLength: { type: Number },
      maxLength: { type: Number },
      pattern: { type: String },
      min: { type: Number },
      max: { type: Number },
    },
    width: { type: String, enum: ['full', '1/2', '1/3'], default: 'full' },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    helpText: { type: String, default: '' },
  },
  { _id: false }
);

const formSchemaDefinition = new Schema<IFormSchema>(
  {
    formKey: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    fields: [formFieldSchema],
    submitButton: {
      label: { type: String, default: 'Submit' },
      color: { type: String, default: 'emerald' },
      icon: { type: String, default: 'Send' },
      size: { type: String, default: 'md' },
    },
    destinationWorkflow: {
      type: String,
      enum: ['contact_inquiry', 'ticket_submission', 'warranty_registration', 'custom_submission'],
      default: 'contact_inquiry',
    },
    successMessage: { type: String, default: 'Thank you! Your submission has been received successfully.' },
    errorMessage: { type: String, default: 'Failed to process your submission. Please try again.' },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FormSchema = mongoose.model<IFormSchema>('FormSchema', formSchemaDefinition);
