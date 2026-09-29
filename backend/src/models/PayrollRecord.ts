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
  month?: string;
  year?: number;
  payDate: Date;
  effectiveDate: Date;
  totalWorkingDays: number;
  workingDays?: number;
  paidDays: number;
  presentDays?: number;
  leaveDays: number;
  overtimeHours?: number;
  basicSalary: number;
  allowances: ISalaryComponent[];
  deductions: ISalaryComponent[];
  bonuses: ISalaryComponent[];
  otherEarnings: ISalaryComponent[];
  earnings?: any;
  deductionsSummary?: any;
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  netPayable?: number;
  amountInWords: string;
  paymentMode: string;
  paymentStatus: string;
  status?: string;
  bankDetails: any;
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
  [key: string]: any;
}

const salaryComponentSchema = new Schema(
  {
    key: { type: String, default: 'item' },
    label: { type: String, default: 'Item' },
    amount: { type: Number, default: 0 },
  },
  { _id: false, strict: false }
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
    payMonth: { type: Number, default: 1 },
    payYear: { type: Number, default: 2026 },
    month: { type: String, default: '' },
    year: { type: Number, default: 2026 },
    payDate: { type: Date, default: Date.now },
    effectiveDate: { type: Date, default: Date.now },
    totalWorkingDays: { type: Number, default: 30 },
    workingDays: { type: Number, default: 30 },
    paidDays: { type: Number, default: 30 },
    presentDays: { type: Number, default: 30 },
    leaveDays: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    basicSalary: { type: Number, required: true, default: 0 },
    allowances: [salaryComponentSchema],
    deductions: [salaryComponentSchema],
    bonuses: [salaryComponentSchema],
    otherEarnings: [salaryComponentSchema],
    earnings: { type: Schema.Types.Mixed, default: {} },
    deductionsSummary: { type: Schema.Types.Mixed, default: {} },
    grossEarnings: { type: Number, required: true, default: 0 },
    totalDeductions: { type: Number, required: true, default: 0 },
    netSalary: { type: Number, required: true, default: 0 },
    amountInWords: { type: String, default: '' },
    paymentMode: { type: String, default: 'Bank Transfer' },
    paymentStatus: {
      type: String,
      default: 'Paid',
      index: true,
    },
    status: { type: String, default: 'Issued' },
    bankDetails: {
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      branch: { type: String, default: '' },
      upiId: { type: String, default: '' },
      pan: { type: String, default: '' },
      panNumber: { type: String, default: '' },
      uan: { type: String, default: '' },
      uanNumber: { type: String, default: '' },
      pfNumber: { type: String, default: '' },
      esicNumber: { type: String, default: '' },
      paymentMode: { type: String, default: 'Bank Transfer' },
    },
    authorizedBy: { type: String, default: 'HR & Finance Director' },
    notes: { type: String, default: '' },
    isPublishedToEmployee: { type: Boolean, default: true },
    history: [
      {
        action: { type: String, default: 'Generated' },
        updatedBy: { type: String, default: 'Admin' },
        updatedAt: { type: Date, default: Date.now },
        remarks: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true, strict: false }
);

export const PayrollRecord = mongoose.model<IPayrollRecord>('PayrollRecord', payrollRecordSchema);
