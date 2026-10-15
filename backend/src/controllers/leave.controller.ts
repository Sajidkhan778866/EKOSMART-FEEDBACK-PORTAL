import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LeaveRequest } from '../models/LeaveRequest';
import { Employee } from '../models/Employee';

// Calculate days between two dates, distinguishing calendar days from working days
export interface LeaveCalculationResult {
  calendarDays: number;
  workingDays: number;
  weeklyOffDaysCount: number;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export const calculateLeaveDays = (
  startStr: string | Date,
  endStr: string | Date,
  isHalfDay = false,
  weeklyOffDay = 0 // 0 = Sunday
): LeaveCalculationResult => {
  if (!startStr || !endStr) {
    return {
      calendarDays: 0,
      workingDays: 0,
      weeklyOffDaysCount: 0,
      startDate: '',
      endDate: '',
      isHalfDay,
      isValid: false,
      errorMessage: 'Start date and end date are both required.',
    };
  }

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      calendarDays: 0,
      workingDays: 0,
      weeklyOffDaysCount: 0,
      startDate: '',
      endDate: '',
      isHalfDay,
      isValid: false,
      errorMessage: 'Invalid date format provided.',
    };
  }

  // Normalize time to midnight UTC for pure calendar day comparison
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end.getTime() < start.getTime()) {
    return {
      calendarDays: 0,
      workingDays: 0,
      weeklyOffDaysCount: 0,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      isHalfDay,
      isValid: false,
      errorMessage: 'End date cannot be earlier than start date.',
    };
  }

  if (isHalfDay) {
    return {
      calendarDays: 0.5,
      workingDays: 0.5,
      weeklyOffDaysCount: 0,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      isHalfDay: true,
      isValid: true,
    };
  }

  let calendarCount = 0;
  let workingCount = 0;
  let weeklyOffCount = 0;

  const current = new Date(start);
  while (current.getTime() <= end.getTime()) {
    calendarCount++;
    const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === weeklyOffDay) {
      weeklyOffCount++;
    } else {
      workingCount++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    calendarDays: calendarCount,
    workingDays: workingCount,
    weeklyOffDaysCount: weeklyOffCount,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    isHalfDay: false,
    isValid: true,
  };
};

// POST /api/v1/leaves/calculate - Live automatic calculation endpoint for UI
export const previewLeaveDuration = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, isHalfDay, weeklyOffDay } = req.body;
    const result = calculateLeaveDays(startDate, endDate, !!isHalfDay, Number(weeklyOffDay ?? 0));
    
    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.errorMessage || 'Invalid date range.',
        data: result,
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error previewing leave duration:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate leave days', error: error.message });
  }
};

// POST /api/v1/leaves/apply - Submit a leave request with server-side validation
export const applyLeave = async (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      leaveType = 'Casual',
      startDate,
      endDate,
      isHalfDay = false,
      halfDaySession = 'first_half',
      reason,
      contactPhone,
      weeklyOffDay = 0,
    } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both start date and end date are required.',
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reason for leave is required.',
      });
    }

    // Verify employee
    const targetEmpId = employeeId || (req as any).user?.employeeId;
    if (!targetEmpId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required.',
      });
    }

    let employee = await Employee.findOne({ employeeId: targetEmpId });
    if (!employee && mongoose.Types.ObjectId.isValid(targetEmpId)) {
      employee = await Employee.findById(targetEmpId);
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
      });
    }

    // Recalculate duration server-side (DO NOT TRUST FRONTEND)
    const calculation = calculateLeaveDays(startDate, endDate, !!isHalfDay, Number(weeklyOffDay));
    if (!calculation.isValid) {
      return res.status(400).json({
        success: false,
        message: calculation.errorMessage || 'Invalid leave dates.',
      });
    }

    const leaveRequest = await LeaveRequest.create({
      employee: employee._id,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      department: employee.department,
      division: employee.division || [],
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isHalfDay: !!isHalfDay,
      halfDaySession: isHalfDay ? halfDaySession : undefined,
      calendarDays: calculation.calendarDays,
      workingDays: calculation.workingDays,
      weeklyOffDay: Number(weeklyOffDay),
      reason: reason.trim(),
      contactPhone: contactPhone || employee.mobile,
      status: 'Pending',
      history: [
        {
          action: 'Applied',
          updatedBy: employee.name,
          updatedAt: new Date(),
          remarks: `Submitted leave request for ${calculation.workingDays} working days (${calculation.calendarDays} calendar days)`,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: `Leave application submitted successfully for ${calculation.workingDays} working days.`,
      data: leaveRequest,
    });
  } catch (error: any) {
    console.error('Error applying for leave:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit leave request', error: error.message });
  }
};

// GET /api/v1/leaves/my - Get authenticated employee's leave records
export const getMyLeaves = async (req: Request, res: Response) => {
  try {
    const rawEmpId = req.query.employeeId || (req as any).user?.employeeId;
    if (!rawEmpId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const leaves = await LeaveRequest.find({ employeeId: String(rawEmpId) }).sort({ createdAt: -1 });

    const totalApprovedWorkingDays = leaves
      .filter((l) => l.status === 'Approved')
      .reduce((acc, curr) => acc + curr.workingDays, 0);

    const pendingRequestsCount = leaves.filter((l) => l.status === 'Pending').length;

    return res.json({
      success: true,
      data: leaves,
      summary: {
        totalLeaves: leaves.length,
        approvedWorkingDays: totalApprovedWorkingDays,
        pendingCount: pendingRequestsCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching employee leaves:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leave records', error: error.message });
  }
};

// GET /api/v1/leaves - Get all leaves for Admin Portal
export const getAdminLeaves = async (req: Request, res: Response) => {
  try {
    const { status, department, employeeId, startDate, endDate } = req.query;
    const query: any = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (department && department !== 'All') {
      query.department = department;
    }
    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate as string);
      if (endDate) query.startDate.$lte = new Date(endDate as string);
    }

    const leaves = await LeaveRequest.find(query).sort({ createdAt: -1 });

    const totalPending = await LeaveRequest.countDocuments({ status: 'Pending' });
    const totalApproved = await LeaveRequest.countDocuments({ status: 'Approved' });
    const totalRejected = await LeaveRequest.countDocuments({ status: 'Rejected' });

    return res.json({
      success: true,
      data: leaves,
      summary: {
        total: leaves.length,
        totalPending,
        totalApproved,
        totalRejected,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin leaves:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin leaves', error: error.message });
  }
};

// PATCH /api/v1/leaves/:id/status - Approve or reject leave
export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, remarks = '', approvedBy = 'HR Manager' } = req.body;

    if (!['Approved', 'Rejected', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave status.',
      });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    leave.status = status;
    if (status === 'Approved') {
      leave.approvedBy = approvedBy;
      leave.approvedAt = new Date();
      leave.approvalRemarks = remarks;
    } else if (status === 'Rejected') {
      leave.rejectionReason = remarks;
    }

    leave.history.push({
      action: `Status changed to ${status}`,
      updatedBy: approvedBy,
      updatedAt: new Date(),
      remarks: remarks || `Leave status updated to ${status}`,
    });

    await leave.save();

    return res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully.`,
      data: leave,
    });
  } catch (error: any) {
    console.error('Error updating leave status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update leave status', error: error.message });
  }
};
