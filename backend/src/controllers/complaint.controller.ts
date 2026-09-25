import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Complaint } from '../models/Complaint';
import { Customer } from '../models/Customer';
import { Employee } from '../models/Employee';

const DIVISION_PREFIXES: Record<string, string> = {
  Battery: 'BAT',
  Rental: 'REN',
  Showroom: 'SHR',
  'Spare Parts': 'SPR',
  Warranty: 'WRN',
  Plant: 'PLN',
};

export const generateTicketNumber = async (division: string): Promise<string> => {
  const prefix = DIVISION_PREFIXES[division] || (division ? division.slice(0, 3).toUpperCase() : 'CMP');
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Count complaints today for this division
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const count = await Complaint.countDocuments({
    division: division,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const seq = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${dateStr}-${seq}`;
};

export const submitPublicComplaint = async (req: Request, res: Response) => {
  try {
    const {
      division,
      complaintType,
      customerName,
      customerMobile,
      customerEmail,
      address,
      description,
      formData,
      priority,
    } = req.body;

    if (!division || !customerName || !customerMobile) {
      return res.status(400).json({
        success: false,
        message: 'Division, Customer Name, and Mobile Number are required.',
      });
    }

    // 1. Find or create Customer
    let customer = await Customer.findOne({ mobile: customerMobile.trim() });
    if (!customer) {
      const customerId = `CUST-${Date.now().toString().slice(-6)}`;
      customer = await Customer.create({
        customerId,
        name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail ? customerEmail.trim() : undefined,
        address: address ? address.trim() : undefined,
        customerType: division === 'Showroom' ? 'Showroom' : 'General',
      });
    } else if (address && !customer.address) {
      customer.address = address.trim();
      await customer.save();
    }

    // 2. Generate Ticket Number
    const ticketNumber = await generateTicketNumber(division);

    // 3. Create Complaint
    const complaint = await Complaint.create({
      ticketNumber,
      customer: customer._id,
      division: division.trim(),
      complaintType: complaintType ? complaintType.trim() : '',
      description: description ? description.trim() : (formData?.complaintDescription || ''),
      formData: formData || {},
      status: 'Pending',
      priority: priority || 'Medium',
      timeline: [
        {
          status: 'Pending',
          note: 'Customer submitted complaint ticket online.',
          updatedBy: customerName.trim(),
          updatedAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      data: {
        ticketNumber: complaint.ticketNumber,
        status: complaint.status,
        division: complaint.division,
        complaintType: complaint.complaintType,
        createdAt: complaint.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to submit complaint' });
  }
};

export const trackPublicComplaint = async (req: Request, res: Response) => {
  try {
    const ticketNumber = (req.params.ticketNumber as string || '').trim();
    const complaint = await Complaint.findOne({ ticketNumber })
      .populate('customer', 'name mobile email address')
      .populate('assignedTo', 'name designation employeeId mobile');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'No complaint found with this ticket number.',
      });
    }

    res.json({
      success: true,
      data: {
        ticketNumber: complaint.ticketNumber,
        division: complaint.division,
        complaintType: complaint.complaintType,
        description: complaint.description || complaint.formData?.complaintDescription,
        status: complaint.status,
        priority: complaint.priority,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        formData: complaint.formData,
        customerName: (complaint.customer as any)?.name,
        customerMobile: (complaint.customer as any)?.mobile,
        assignedEngineer: (complaint.assignedTo as any)?.name || 'Pending Assignment',
        assignedEmployeeId: (complaint.assignedTo as any)?.employeeId,
        timeline: complaint.timeline,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error tracking complaint' });
  }
};

// GET /api/v1/complaints/admin OR /api/v1/tickets
export const getAdminComplaints = async (req: Request, res: Response) => {
  try {
    const { division, status, priority, complaintType, assignedTo, search, startDate, endDate } = req.query;
    const query: any = {};

    if (division && division !== 'All') query.division = division;
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (complaintType && complaintType !== 'All') query.complaintType = complaintType;
    if (assignedTo && assignedTo !== 'All') query.assignedTo = assignedTo;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const e = new Date(endDate as string);
        e.setHours(23, 59, 59, 999);
        query.createdAt.$lte = e;
      }
    }

    if (search) {
      const searchStr = (search as string).trim();
      const matchingCustomers = await Customer.find({
        $or: [
          { name: { $regex: searchStr, $options: 'i' } },
          { mobile: { $regex: searchStr, $options: 'i' } },
          { email: { $regex: searchStr, $options: 'i' } },
          { customerId: { $regex: searchStr, $options: 'i' } },
        ],
      }).select('_id');
      const customerIds = matchingCustomers.map((c) => c._id);

      const searchConditions: any[] = [
        { ticketNumber: { $regex: searchStr, $options: 'i' } },
        { complaintType: { $regex: searchStr, $options: 'i' } },
        { description: { $regex: searchStr, $options: 'i' } },
        { division: { $regex: searchStr, $options: 'i' } },
        { status: { $regex: searchStr, $options: 'i' } },
        { priority: { $regex: searchStr, $options: 'i' } },
      ];

      if (customerIds.length > 0) {
        searchConditions.push({ customer: { $in: customerIds } });
      }

      query.$or = searchConditions;
    }

    const complaints = await Complaint.find(query)
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division mobile photoUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
  }
};

// GET /api/v1/complaints/:id OR /api/v1/tickets/:id OR /api/v1/complaints/ticket/:ticketNumber
export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId || '').trim();
    let complaint;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      complaint = await Complaint.findById(id)
        .populate('customer', 'customerId name mobile email address customerType')
        .populate('assignedTo', 'employeeId name designation division mobile email photoUrl');
    }

    if (!complaint && id) {
      complaint = await Complaint.findOne({ ticketNumber: id })
        .populate('customer', 'customerId name mobile email address customerType')
        .populate('assignedTo', 'employeeId name designation division mobile email photoUrl');
    }

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
    }

    res.json({ success: true, data: complaint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaint details', error: error.message });
  }
};

export const assignComplaint = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId || '').trim();
    const { employeeId } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    complaint.assignedTo = employee._id as any;
    complaint.status = 'Assigned';
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({
      status: 'Assigned',
      note: `Assigned to ${employee.name} (${employee.employeeId} - ${employee.designation})`,
      updatedBy: 'Admin',
      updatedAt: new Date(),
    });

    await complaint.save();

    const updated = await Complaint.findById(id)
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division mobile photoUrl');

    res.json({
      success: true,
      message: `Complaint assigned to ${employee.name} successfully`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to assign complaint' });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId || '').trim();
    const { status, priority, remarks, employeeRemarks, adminRemarks, resolutionDetails, updatedBy } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status && status !== complaint.status) {
      complaint.status = status;
      if (!complaint.timeline) complaint.timeline = [];
      complaint.timeline.push({
        status: status,
        note: resolutionDetails || remarks || `Status changed to ${status}`,
        updatedBy: updatedBy || 'Staff',
        updatedAt: new Date(),
      });
    }

    if (priority) complaint.priority = priority;

    if (remarks !== undefined || employeeRemarks !== undefined || adminRemarks !== undefined || resolutionDetails !== undefined) {
      complaint.remarks = {
        employee: employeeRemarks !== undefined ? employeeRemarks : (complaint.remarks?.employee || ''),
        admin: adminRemarks !== undefined ? adminRemarks : (complaint.remarks?.admin || ''),
        resolutionDetails: resolutionDetails !== undefined ? resolutionDetails : (complaint.remarks?.resolutionDetails || ''),
      };
    }

    await complaint.save();

    const updated = await Complaint.findById(id)
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division mobile photoUrl');

    res.json({ success: true, message: 'Complaint updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update complaint' });
  }
};

