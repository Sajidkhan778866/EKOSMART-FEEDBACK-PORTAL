import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate {
  id?: string;
  title: string;
  issuingAuthority?: string;
  certificateNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus?: 'Verified' | 'Pending' | 'Master';
  certificateUrl?: string;
  notes?: string;
}

export interface IIssuedItem {
  id?: string;
  name: string;
  category?: string;
  serialNumber?: string;
  assetTag?: string;
  issueDate?: string;
  returnDate?: string;
  condition?: 'New' | 'Good' | 'Refurbished' | 'Needs Service';
  status?: 'Issued' | 'Returned' | 'Damaged' | 'Audited';
  issuedBy?: string;
  notes?: string;
}

export interface IWarrantyPermissions {
  registration: boolean;
  verification: boolean;
  claim: boolean;
  claimApproval?: boolean;
  check: boolean;
  customerRecords: boolean;
  voidWarranty?: boolean;
}

export interface IWarrantyAccess {
  enabled: boolean;
  accessType?: 'Disabled' | 'View Only' | 'Registrar' | 'Inspector' | 'Manager' | 'Full Access' | 'Custom';
  divisionScope?: string[];
  permissions: IWarrantyPermissions;
}

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  department: string;
  section?: string;
  division: string[];
  designation: string;
  role: string;
  password?: string;
  photoUrl?: string;
  barcode?: string;
  permissions?: string[];
  certificates?: ICertificate[];
  issuedItems?: IIssuedItem[];
  warrantyAccess?: IWarrantyAccess;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema(
  {
    id: { type: String, default: () => `cert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` },
    title: { type: String, required: true },
    issuingAuthority: { type: String, default: 'Ekosmart Technical Academy' },
    certificateNumber: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    expiryDate: { type: String, default: 'No Expiry' },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending', 'Master'],
      default: 'Verified',
    },
    certificateUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const issuedItemSchema = new Schema(
  {
    id: { type: String, default: () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` },
    name: { type: String, required: true },
    category: { type: String, default: 'Diagnostic Tool' },
    serialNumber: { type: String, default: '' },
    assetTag: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    returnDate: { type: String, default: 'Returnable' },
    condition: {
      type: String,
      enum: ['New', 'Good', 'Refurbished', 'Needs Service'],
      default: 'Good',
    },
    status: {
      type: String,
      enum: ['Issued', 'Returned', 'Damaged', 'Audited'],
      default: 'Issued',
    },
    issuedBy: { type: String, default: 'Admin' },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const employeeSchema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    address: { type: String, default: '' },
    department: { type: String, required: true },
    section: { type: String, default: '' },
    division: [{ type: String }],
    designation: { type: String },
    role: { type: String, required: true },
    password: { type: String, required: true, select: false },
    photoUrl: { type: String },
    barcode: { type: String },
    permissions: [{ type: String }],
    certificates: [certificateSchema],
    issuedItems: [issuedItemSchema],
    warrantyAccess: {
      enabled: { type: Boolean, default: false },
      accessType: {
        type: String,
        enum: ['Disabled', 'View Only', 'Registrar', 'Inspector', 'Manager', 'Full Access', 'Custom'],
        default: 'Disabled',
      },
      divisionScope: [{ type: String, default: 'All' }],
      permissions: {
        registration: { type: Boolean, default: false },
        verification: { type: Boolean, default: false },
        claim: { type: Boolean, default: false },
        claimApproval: { type: Boolean, default: false },
        check: { type: Boolean, default: false },
        customerRecords: { type: Boolean, default: false },
        voidWarranty: { type: Boolean, default: false },
      },
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);
