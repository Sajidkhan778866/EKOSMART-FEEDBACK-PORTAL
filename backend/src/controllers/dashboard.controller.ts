import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Complaint } from '../models/Complaint';
import { Warranty } from '../models/Warranty';
import { Employee } from '../models/Employee';
import { Customer } from '../models/Customer';
import { Bill } from '../models/Bill';
import { StockMovement } from '../models/StockMovement';
import { Stock } from '../models/Stock';
import { getDateFilterBounds, applyDateFilterToQuery } from '../utils/dateRange';

export const getAdminDashboardStats = async (req: Request, res: Response) => {
  try {
    const { dateFilter = 'today', startDate, endDate } = req.query;
    const { startDate: start, endDate: end } = getDateFilterBounds(
      dateFilter as string,
      startDate as string,
      endDate as string
    );

    const dateQuery: any = {};
    if (start || end) {
      dateQuery.createdAt = {};
      if (start) dateQuery.createdAt.$gte = start;
      if (end) dateQuery.createdAt.$lte = end;
    }

    // Filtered counts for selected date range (default TODAY)
    const [
      rangeComplaints,
      rangeNewComplaints,
      rangePendingComplaints,
      rangeAssignedComplaints,
      rangeInProgressComplaints,
      rangeResolvedComplaints,
      rangeClosedComplaints,
      rangeCustomers,
      rangeBills,
      rangeWarranties,
      rangeStockMovements,
    ] = await Promise.all([
      Complaint.countDocuments(dateQuery),
      Complaint.countDocuments({ ...dateQuery, status: 'New' }),
      Complaint.countDocuments({ ...dateQuery, status: { $in: ['Pending', 'New'] } }),
      Complaint.countDocuments({ ...dateQuery, status: 'Assigned' }),
      Complaint.countDocuments({ ...dateQuery, status: 'In Progress' }),
      Complaint.countDocuments({ ...dateQuery, status: 'Resolved' }),
      Complaint.countDocuments({ ...dateQuery, status: 'Closed' }),
      Customer.countDocuments(dateQuery),
      Bill.find(dateQuery).select('grandTotal paymentStatus'),
      Warranty.countDocuments(dateQuery),
      StockMovement.countDocuments(dateQuery),
    ]);

    const rangeRevenue = rangeBills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);

    // Cumulative / All-Time Counts
    const [
      totalComplaints,
      totalEmployees,
      activeEmployees,
      totalCustomers,
      totalWarranties,
      activeWarranties,
      expiringWarranties,
      expiredWarranties,
      allBills,
      totalStockItems,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'Active' }),
      Customer.countDocuments(),
      Warranty.countDocuments(),
      Warranty.countDocuments({ status: 'Active' }),
      Warranty.countDocuments({ status: 'Expiring Soon' }),
      Warranty.countDocuments({ status: 'Expired' }),
      Bill.find().select('grandTotal'),
      Stock.countDocuments(),
    ]);

    const totalRevenue = allBills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);

    // Division breakdown for the selected date range
    const divisions = ['Battery', 'Rental', 'Showroom', 'Spare Parts', 'Warranty', 'Plant'];
    const divisionBreakdown = await Promise.all(
      divisions.map(async (div) => {
        const count = await Complaint.countDocuments({ ...dateQuery, division: div });
        return { name: div, complaints: count };
      })
    );

    // 7-day Activity Chart
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
      const [cCount, wCount, bCount] = await Promise.all([
        Complaint.countDocuments({ createdAt: { $gte: d, $lt: nextD } }),
        Warranty.countDocuments({ createdAt: { $gte: d, $lt: nextD } }),
        Bill.countDocuments({ createdAt: { $gte: d, $lt: nextD } }),
      ]);

      weeklyActivity.push({
        name: dayName,
        date: d.toISOString().split('T')[0],
        complaints: cCount,
        warranties: wCount,
        bills: bCount,
      });
    }

    // Recent complaints feed
    const recentComplaints = await Complaint.find(dateQuery)
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division mobile photoUrl')
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      data: {
        filter: dateFilter,
        dateRange: {
          startDate: start,
          endDate: end,
        },
        // Active Date Range Stats (Default TODAY)
        todayStats: {
          complaints: rangeComplaints,
          newComplaints: rangeNewComplaints,
          pendingComplaints: rangePendingComplaints,
          assignedComplaints: rangeAssignedComplaints,
          inProgressComplaints: rangeInProgressComplaints,
          resolvedComplaints: rangeResolvedComplaints,
          closedComplaints: rangeClosedComplaints,
          resolvedAndClosed: rangeResolvedComplaints + rangeClosedComplaints,
          customers: rangeCustomers,
          bills: rangeBills.length,
          revenue: rangeRevenue,
          warranties: rangeWarranties,
          stockMovements: rangeStockMovements,
        },
        // Range metrics
        totalComplaints: rangeComplaints,
        newComplaints: rangeNewComplaints,
        pendingComplaints: rangePendingComplaints,
        assignedComplaints: rangeAssignedComplaints,
        inProgressComplaints: rangeInProgressComplaints,
        resolvedComplaints: rangeResolvedComplaints,
        closedComplaints: rangeClosedComplaints,
        totalCustomers: rangeCustomers,
        totalWarranties: rangeWarranties,
        billsCount: rangeBills.length,
        totalRevenue: rangeRevenue,
        stockMovementsCount: rangeStockMovements,

        // All Time Cumulative Overview
        allTimeStats: {
          totalComplaints,
          totalCustomers,
          totalEmployees,
          activeEmployees,
          totalWarranties,
          activeWarranties,
          totalRevenue,
          totalStockItems,
        },

        totalEmployees,
        activeEmployees,
        activeWarranties,
        expiringWarranties,
        expiredWarranties,
        weeklyActivity,
        recentComplaints,
        divisionBreakdown,
        warrantyBreakdown: [
          { name: 'Active', value: activeWarranties, color: '#3b82f6' },
          { name: 'Expiring Soon', value: expiringWarranties, color: '#f59e0b' },
          { name: 'Expired', value: expiredWarranties, color: '#ef4444' },
        ],
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
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
      dateFilter,
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

    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

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

// GET /api/v1/dashboard/employee/:employeeId
export const getEmployeeDashboardStats = async (req: Request, res: Response) => {
  try {
    const rawEmployeeId = req.params.employeeId;
    const employeeId = String(Array.isArray(rawEmployeeId) ? rawEmployeeId[0] : rawEmployeeId || '');
    const { dateFilter = 'today', startDate, endDate } = req.query;

    let employee = null;
    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      employee = await Employee.findById(employeeId);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const { startDate: start, endDate: end } = getDateFilterBounds(
      dateFilter as string,
      startDate as string,
      endDate as string
    );

    const baseQuery: any = { assignedTo: employee._id };
    const dateQuery: any = { ...baseQuery };
    if (start || end) {
      dateQuery.updatedAt = {};
      if (start) dateQuery.updatedAt.$gte = start;
      if (end) dateQuery.updatedAt.$lte = end;
    }

    // Range-filtered metrics
    const [assignedComplaints, pendingComplaints, inProgressComplaints, resolvedComplaints] =
      await Promise.all([
        Complaint.countDocuments(dateQuery),
        Complaint.countDocuments({ ...dateQuery, status: { $in: ['Assigned', 'Pending', 'New'] } }),
        Complaint.countDocuments({ ...dateQuery, status: 'In Progress' }),
        Complaint.countDocuments({ ...dateQuery, status: { $in: ['Resolved', 'Closed'] } }),
      ]);

    // All-time totals
    const totalAllTime = await Complaint.countDocuments(baseQuery);
    const resolvedAllTime = await Complaint.countDocuments({ ...baseQuery, status: { $in: ['Resolved', 'Closed'] } });

    const recentAssignments = await Complaint.find(baseQuery)
      .populate('customer', 'customerId name mobile email address')
      .populate('assignedTo', 'employeeId name designation division photoUrl')
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        filter: dateFilter,
        dateRange: {
          startDate: start,
          endDate: end,
        },
        employee: {
          _id: employee._id,
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
          totalAllTime,
          resolvedAllTime,
        },
        recentAssignments,
      },
    });
  } catch (error: any) {
    console.error('Error fetching employee dashboard data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employee dashboard data', error: error.message });
  }
};


