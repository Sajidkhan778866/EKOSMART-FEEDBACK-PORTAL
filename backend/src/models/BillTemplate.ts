import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplateField {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;
  order: number;
}

export interface IProductColumn {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  order: number;
}

export interface IBillTemplate extends Document {
  templateName?: string;
  name?: string;
  templateType?: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Salary' | 'Custom';
  type?: 'Showroom' | 'Plant' | 'Rental' | 'Warranty' | 'Salary' | 'Custom';
  description?: string;
  isActive: boolean;
  isDefault?: boolean;
  company?: any;
  companyProfile?: any;
  header?: any;
  customerFields?: any[];
  invoiceFields?: any[];
  productColumns?: any[];
  salaryConfig?: any;
  warrantyConfig?: any;
  totalsConfig?: any;
  footer?: any;
  theme?: any;
  createdAt: Date;
  updatedAt: Date;
}

const templateFieldSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const productColumnSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    width: { type: String, default: 'auto' },
    align: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const billTemplateSchema = new Schema(
  {
    templateName: { type: String, trim: true },
    name: { type: String, trim: true },
    templateType: {
      type: String,
      enum: ['Showroom', 'Plant', 'Rental', 'Warranty', 'Salary', 'Custom'],
      default: 'Showroom',
    },
    type: {
      type: String,
      enum: ['Showroom', 'Plant', 'Rental', 'Warranty', 'Salary', 'Custom'],
      default: 'Showroom',
    },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    company: { type: Schema.Types.Mixed },
    companyProfile: { type: Schema.Types.Mixed },
    header: { type: Schema.Types.Mixed },
    customerFields: [Schema.Types.Mixed],
    invoiceFields: [Schema.Types.Mixed],
    productColumns: [Schema.Types.Mixed],
    salaryConfig: { type: Schema.Types.Mixed },
    warrantyConfig: { type: Schema.Types.Mixed },
    totalsConfig: { type: Schema.Types.Mixed },
    footer: { type: Schema.Types.Mixed },
    theme: { type: Schema.Types.Mixed },
  },
  { timestamps: true, strict: false }
);

export const BillTemplate = mongoose.model<IBillTemplate>('BillTemplate', billTemplateSchema);
