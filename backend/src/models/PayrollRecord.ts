import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryComponent {
  key: string;
  label: string;
  amount: number;
}

export interface IPayrollRecord extends Document {
  payslipNumber: string;
  employeeId: string;
  employee: mongoose.Types.ObjectId;
  employeeName: string;
  department: string;
  designation: string;
  division?: string;
  payPeriod: string; // e.g. "September 2026"
  payMonth: number; // 1-12
  payYear: number;
  payDate: Date;
  effectiveDate: Date;
  totalWorkingDays: number;
  paidDays: number;
  leaveDays: number;
  basicSalary: number;
  allowances: ISalaryComponent[];
  deductions: ISalaryComponent[];
  bonuses: ISalaryComponent[];
  otherEarnings: ISalaryComponent[];
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  amountInWords: string;
  paymentMode: string;
  paymentStatus: 'Paid' | 'Processed' | 'Pending';
  bankDetails: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
    upiId?: string;
    pan?: string;
    uan?: string;
    pfNumber?: string;
    esicNumber?: string;
  };
  authorizedBy: string;
  notes?: string;
  isPublishedToEmployee: boolean;
  history: Array<{
    action: string;
    updatedBy: string;
    updatedAt: Date;
    remarks?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const salaryComponentSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const payrollRecordSchema = new Schema(
  {
    payslipNumber: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    employeeName: { type: String, required: true },
    department: { type: String, default: 'Technical' },
    designation: { type: String, default: 'Service Engineer' },
    division: { type: String, default: 'Showroom' },
    payPeriod: { type: String, required: true, index: true },
    payMonth: { type: Number, required: true },
    payYear: { type: Number, required: true },
    payDate: { type: Date, default: Date.now },
    effectiveDate: { type: Date, default: Date.now },
    totalWorkingDays: { type: Number, default: 30 },
    paidDays: { type: Number, default: 30 },
    leaveDays: { type: Number, default: 0 },
    basicSalary: { type: Number, required: true, default: 0 },
    allowances: [salaryComponentSchema],
    deductions: [salaryComponentSchema],
    bonuses: [salaryComponentSchema],
    otherEarnings: [salaryComponentSchema],
    grossEarnings: { type: Number, required: true, default: 0 },
    totalDeductions: { type: Number, required: true, default: 0 },
    netSalary: { type: Number, required: true, default: 0 },
    amountInWords: { type: String, default: '' },
    paymentMode: { type: String, default: 'Bank Transfer' },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Processed', 'Pending'],
      default: 'Paid',
      index: true,
    },
    bankDetails: {
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      branch: { type: String, default: '' },
      upiId: { type: String, default: '' },
      pan: { type: String, default: '' },
      uan: { type: String, default: '' },
      pfNumber: { type: String, default: '' },
      esicNumber: { type: String, default: '' },
    },
    authorizedBy: { type: String, default: 'HR & Finance Director' },
    notes: { type: String, default: '' },
    isPublishedToEmployee: { type: Boolean, default: true },
    history: [
      {
        action: { type: String, required: true },
        updatedBy: { type: String, default: 'Admin' },
        updatedAt: { type: Date, default: Date.now },
        remarks: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export const PayrollRecord = mongoose.model<IPayrollRecord>('PayrollRecord', payrollRecordSchema);
