import { Request, Response } from 'express';
import { Complaint } from '../models/Complaint';
import { Warranty } from '../models/Warranty';
import { Employee } from '../models/Employee';
import { Customer } from '../models/Customer';

export const getAdminDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const newComplaints = await Complaint.countDocuments({ status: 'New' });
    const pendingComplaints = await Complaint.countDocuments({ status: { $in: ['Pending', 'New'] } });
    const assignedComplaints = await Complaint.countDocuments({ status: 'Assigned' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const closedComplaints = await Complaint.countDocuments({ status: 'Closed' });
    const rejectedComplaints = await Complaint.countDocuments({ status: 'Rejected' });

    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });

    const totalCustomers = await Customer.countDocuments();

    const totalWarranties = await Warranty.countDocuments();
    const activeWarranties = await Warranty.countDocuments({ status: 'Active' });
    const expiringWarranties = await Warranty.countDocuments({ status: 'Expiring Soon' });
    const expiredWarranties = await Warranty.countDocuments({ status: 'Expired' });

    // Division breakdown
    const batteryComplaints = await Complaint.countDocuments({ division: 'Battery' });
    const rentalComplaints = await Complaint.countDocuments({ division: 'Rental' });
    const showroomComplaints = await Complaint.countDocuments({ division: 'Showroom' });
    const sparePartsComplaints = await Complaint.countDocuments({ division: 'Spare Parts' });
    const warrantyComplaints = await Complaint.countDocuments({ division: 'Warranty' });
    const plantComplaints = await Complaint.countDocuments({ division: 'Plant' });

    // Calculate last 7 days activity
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayName = days[d.getDay()];
      const complaintsCount = await Complaint.countDocuments({
        createdAt: { $gte: d, $lt: nextD },
      });
      const warrantiesCount = await Warranty.countDocuments({
        createdAt: { $gte: d, $lt: nextD },
      });

      weeklyActivity.push({
        name: dayName,
        date: d.toISOString().split('T')[0],
        complaints: complaintsCount,
        warranties: warrantiesCount,
      });
    }

    // Fetch latest complaints for dashboard feed
    const recentComplaints = await Complaint.find()
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division mobile photoUrl')
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      data: {
        totalComplaints,
        newComplaints,
        pendingComplaints,
        assignedComplaints,
        inProgressComplaints,
        resolvedComplaints,
        closedComplaints,
        rejectedComplaints,
        totalEmployees,
        activeEmployees,
        totalCustomers,
        totalWarranties,
        activeWarranties,
        expiringWarranties,
        expiredWarranties,
        weeklyActivity,
        recentComplaints,
        divisionBreakdown: [
          { name: 'Battery', complaints: batteryComplaints },
          { name: 'Rental', complaints: rentalComplaints },
          { name: 'Showroom', complaints: showroomComplaints },
          { name: 'Spare Parts', complaints: sparePartsComplaints },
          { name: 'Warranty', complaints: warrantyComplaints },
          { name: 'Plant', complaints: plantComplaints },
        ].filter(d => d.complaints > 0 || ['Battery', 'Rental', 'Showroom', 'Spare Parts'].includes(d.name)),
        warrantyBreakdown: [
          { name: 'Active', value: activeWarranties, color: '#3b82f6' },
          { name: 'Expiring Soon', value: expiringWarranties, color: '#f59e0b' },
          { name: 'Expired', value: expiredWarranties, color: '#ef4444' },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

// GET /api/v1/dashboard/current-applications
export const getCurrentApplications = async (req: Request, res: Response) => {
  try {
    const {
      department,
      division,
      complaintType,
      status,
      assignedTo,
      priority,
      startDate,
      endDate,
      search,
      limit = 50,
      page = 1,
    } = req.query;

    const query: any = {};

    const targetDivision = division || department;
    if (targetDivision && targetDivision !== 'All') {
      query.division = targetDivision;
    }

    if (complaintType && complaintType !== 'All') {
      query.complaintType = complaintType;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (assignedTo && assignedTo !== 'All') {
      query.assignedTo = assignedTo;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) {
        const e = new Date(endDate as string);
        e.setHours(23, 59, 59, 999);
        query.createdAt.$lte = e;
      }
    }

    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search as string, $options: 'i' } },
        { complaintType: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Complaint.find(query)
        .populate('customer', 'customerId name mobile email address')
        .populate('assignedTo', 'employeeId name designation division mobile photoUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        applications,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Error fetching current applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch current applications', error: error.message });
  }
};

export const getEmployeeDashboardStats = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const assignedComplaints = await Complaint.countDocuments({ assignedTo: employee._id });
    const pendingComplaints = await Complaint.countDocuments({ assignedTo: employee._id, status: { $in: ['Assigned', 'Pending', 'New'] } });
    const inProgressComplaints = await Complaint.countDocuments({ assignedTo: employee._id, status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ assignedTo: employee._id, status: 'Resolved' });

    const recentAssignments = await Complaint.find({ assignedTo: employee._id })
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division photoUrl')
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        employee: {
          name: employee.name,
          employeeId: employee.employeeId,
          department: employee.department,
          division: employee.division,
          designation: employee.designation,
          photoUrl: employee.photoUrl,
          barcode: employee.barcode,
          warrantyAccess: employee.warrantyAccess,
        },
        stats: {
          assignedComplaints,
          pendingComplaints,
          inProgressComplaints,
          resolvedComplaints,
        },
        recentAssignments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employee dashboard data' });
  }
};

