import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveHistory {
  action: string;
  updatedBy: string;
  updatedAt: Date;
  remarks?: string;
}

export interface ILeaveRequest extends Document {
  employee: mongoose.Types.ObjectId;
  employeeId: string;
  employeeName: string;
  department: string;
  division: string[];
  leaveType: 'Casual' | 'Sick' | 'Earned' | 'Emergency' | 'Maternity/Paternity' | 'Unpaid' | 'Compensatory';
  startDate: Date;
  endDate: Date;
  isHalfDay: boolean;
  halfDaySession?: 'first_half' | 'second_half';
  calendarDays: number;
  workingDays: number;
  weeklyOffDay?: number; // 0 = Sunday
  reason: string;
  contactPhone?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  approvalRemarks?: string;
  history: ILeaveHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const leaveHistorySchema = new Schema(
  {
    action: { type: String, required: true },
    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    remarks: { type: String, default: '' },
  },
  { _id: false }
);

const leaveRequestSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },
    division: [{ type: String }],
    leaveType: {
      type: String,
      enum: ['Casual', 'Sick', 'Earned', 'Emergency', 'Maternity/Paternity', 'Unpaid', 'Compensatory'],
      default: 'Casual',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isHalfDay: { type: Boolean, default: false },
    halfDaySession: {
      type: String,
      enum: ['first_half', 'second_half'],
      default: 'first_half',
    },
    calendarDays: { type: Number, required: true, min: 0.5 },
    workingDays: { type: Number, required: true, min: 0.5 },
    weeklyOffDay: { type: Number, default: 0 }, // 0 = Sunday (standard weekly off)
    reason: { type: String, required: true, trim: true },
    contactPhone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    approvedBy: { type: String, default: '' },
    approvedAt: { type: Date },
    rejectionReason: { type: String, default: '' },
    approvalRemarks: { type: String, default: '' },
    history: [leaveHistorySchema],
  },
  { timestamps: true }
);

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
