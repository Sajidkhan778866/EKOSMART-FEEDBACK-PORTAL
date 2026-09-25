import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaintTimeline {
  status: string;
  note: string;
  updatedBy?: string;
  updatedAt: Date;
}

export interface IComplaint extends Document {
  ticketNumber: string;
  customer: mongoose.Types.ObjectId;
  division: string;
  complaintType?: string;
  description?: string;
  formData: any;
  status: 'New' | 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: mongoose.Types.ObjectId;
  remarks?: {
    employee?: string;
    admin?: string;
    resolutionDetails?: string;
  };
  timeline?: IComplaintTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    division: { 
      type: String, 
      required: true,
      index: true,
    },
    complaintType: { type: String, default: '' },
    description: { type: String, default: '' },
    formData: { type: Schema.Types.Mixed },
    status: { 
      type: String, 
      enum: ['New', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'], 
      default: 'Pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee' },
    remarks: {
      employee: { type: String, default: '' },
      admin: { type: String, default: '' },
      resolutionDetails: { type: String, default: '' },
    },
    timeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        updatedBy: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);

