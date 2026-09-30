import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Warranty } from '../models/Warranty';
import { Customer } from '../models/Customer';
import { Employee } from '../models/Employee';

export const generateWarrantyNumber = async (category: 'Showroom' | 'Plant'): Promise<string> => {
  const prefix = category === 'Showroom' ? 'WAR-SHR' : 'WAR-PLT';
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  const count = await Warranty.countDocuments({ category });
  const seq = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${dateStr}-${seq}`;
};

export const verifyWarrantyStaff = async (req: Request, res: Response) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Employee ID and Password to verify warranty authorization.',
      });
    }

    const cleanId = String(employeeId).trim();
    const escapedId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let employee = await Employee.findOne({
      $or: [
        { employeeId: { $regex: `^${escapedId}$`, $options: 'i' } },
        { email: { $regex: `^${escapedId}$`, $options: 'i' } },
      ],
    }).select('+password');

    // If demo employee not found in fresh DB, trigger seed and re-check
    if (!employee) {
      const { ensureDefaultSeedData } = await import('../utils/autoSeed');
      await ensureDefaultSeedData().catch(() => {});
      employee = await Employee.findOne({
        $or: [
          { employeeId: { $regex: `^${escapedId}$`, $options: 'i' } },
          { email: { $regex: `^${escapedId}$`, $options: 'i' } },
        ],
      }).select('+password');
    }

    if (!employee || !employee.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee ID or password. Please check your credentials.',
      });
    }

    if (employee.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'This employee account is deactivated. Please contact your system administrator.',
      });
    }

    const isMatch =
      (await bcrypt.compare(password, employee.password)) ||
      employee.password === password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.',
      });
    }

    // Check Warranty Access in Admin Portal
    const wAccess = employee.warrantyAccess;
    const isEnabled = Boolean(wAccess?.enabled);
    const hasRegPerm = Boolean(wAccess?.permissions?.registration);
    const isAuthorizedTier = ['Registrar', 'Manager', 'Full Access', 'Inspector'].includes(wAccess?.accessType || '');
    const hasGeneralPerm =
      employee.permissions?.includes('warranty:manage') ||
      employee.permissions?.includes('warranty:register') ||
      employee.permissions?.includes('billing:create') ||
      employee.permissions?.includes('*') ||
      employee.role === 'Admin' ||
      employee.role === 'SuperAdmin' ||
      employee.role === 'Staff' ||
      employee.role === 'Technician';

    if (!isEnabled && !hasRegPerm && !isAuthorizedTier && !hasGeneralPerm) {
      return res.status(403).json({
        success: false,
        authorized: false,
        accessTier: wAccess?.accessType || 'Disabled',
        message: `Access Denied: Staff member "${employee.name}" (${employee.employeeId}) does not have Warranty Registration privileges enabled in Admin Portal. Access Tier: "${wAccess?.accessType || 'Disabled'}".`,
      });
    }

    return res.json({
      success: true,
      authorized: true,
      data: {
        _id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        department: employee.department,
        designation: employee.designation,
        division: employee.division,
        role: employee.role,
        warrantyAccess: employee.warrantyAccess,
      },
    });
  } catch (err: any) {
    console.error('verifyWarrantyStaff error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error during staff verification.' });
  }
};

export const registerPublicWarranty = async (req: Request, res: Response) => {
  try {
    const {
      category,
      customerName,
      customerMobile,
      customerEmail,
      product,
      serialNumber,
      billNumber,
      billUrls,
      billDocuments,
      purchaseDate,
      durationMonths,
      formData,
      registeredBy,
    } = req.body;

    if (!category || !customerName || !customerMobile || !product || !serialNumber || !billNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Category (Showroom/Plant), Customer Name, Mobile, Product, Serial No, and Bill No.',
      });
    }

    if (!['Showroom', 'Plant'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid warranty category. Must be Showroom or Plant.',
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
        customerType: category,
      });
    }

    // 2. Dates calculation
    const pDate = new Date(purchaseDate || Date.now());
    const startDate = new Date(pDate);
    const months = parseInt(durationMonths) || 24; // Default 24 months
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    // 3. Generate Warranty Number
    const warrantyNumber = await generateWarrantyNumber(category);

    const now = new Date();
    let status: 'Active' | 'Expiring Soon' | 'Expired' = 'Active';
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      status = 'Expired';
    } else if (daysUntilExpiry <= 30) {
      status = 'Expiring Soon';
    }

    const billList = Array.isArray(billUrls) ? billUrls : [];
    const formattedDocs = Array.isArray(billDocuments) && billDocuments.length > 0
      ? billDocuments
      : billList.map((url: string, i: number) => ({
          pageNumber: i + 1,
          url,
          name: `Invoice Page ${i + 1}`,
          fileType: url.startsWith('data:application/pdf') ? 'pdf' : 'image',
        }));

    const warranty = await Warranty.create({
      warrantyNumber,
      category,
      customer: customer._id,
      product: product.trim(),
      serialNumber: serialNumber.trim(),
      billNumber: billNumber.trim(),
      billUrls: billList,
      billDocuments: formattedDocs,
      purchaseDate: pDate,
      warrantyStartDate: startDate,
      warrantyExpiryDate: expiryDate,
      status,
      formData: formData || {},
      registeredBy: registeredBy || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Warranty registered successfully!',
      data: {
        warrantyNumber: warranty.warrantyNumber,
        product: warranty.product,
        category: warranty.category,
        expiryDate: warranty.warrantyExpiryDate,
        status: warranty.status,
        registeredBy: warranty.registeredBy,
      },
    });
  } catch (error: any) {
    console.error('Warranty register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to register warranty' });
  }
};

export const checkPublicWarranty = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.query;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide a search identifier.' });
    }

    const searchStr = (identifier as string).trim();
    
    // Search by warrantyNumber, serialNumber, billNumber, or customer mobile
    const customer = await Customer.findOne({ mobile: searchStr });
    
    const query: any = {
      $or: [
        { warrantyNumber: { $regex: searchStr, $options: 'i' } },
        { serialNumber: { $regex: searchStr, $options: 'i' } },
        { billNumber: { $regex: searchStr, $options: 'i' } },
      ],
    };

    if (customer) {
      query.$or.push({ customer: customer._id });
    }

    const warranties = await Warranty.find(query)
      .populate('customer', 'name mobile')
      .sort({ createdAt: -1 });

    if (warranties.length === 0) {
      return res.status(404).json({ success: false, message: 'No warranty record found matching your query.' });
    }

    const results = warranties.map((w) => {
      const now = new Date();
      const expiry = new Date(w.warrantyExpiryDate);
      const remainingDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let computedStatus = w.status;
      if (remainingDays < 0) computedStatus = 'Expired';
      else if (remainingDays <= 30) computedStatus = 'Expiring Soon';
      else computedStatus = 'Active';

      return {
        warrantyNumber: w.warrantyNumber,
        category: w.category,
        product: w.product,
        serialNumber: w.serialNumber,
        purchaseDate: w.purchaseDate,
        warrantyStartDate: w.warrantyStartDate,
        warrantyExpiryDate: w.warrantyExpiryDate,
        status: computedStatus,
        remainingDays: Math.max(0, remainingDays),
        customerName: (w.customer as any)?.name,
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking warranty' });
  }
};

export const getAdminWarranties = async (req: Request, res: Response) => {
  try {
    const { category, status, search, startDate, endDate } = req.query;
    const query: any = {};

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) {
        query.purchaseDate.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const e = new Date(endDate as string);
        e.setHours(23, 59, 59, 999);
        query.purchaseDate.$lte = e;
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
        { warrantyNumber: { $regex: searchStr, $options: 'i' } },
        { serialNumber: { $regex: searchStr, $options: 'i' } },
        { billNumber: { $regex: searchStr, $options: 'i' } },
        { product: { $regex: searchStr, $options: 'i' } },
        { category: { $regex: searchStr, $options: 'i' } },
        { status: { $regex: searchStr, $options: 'i' } },
      ];

      if (customerIds.length > 0) {
        searchConditions.push({ customer: { $in: customerIds } });
      }

      query.$or = searchConditions;
    }

    const warranties = await Warranty.find(query)
      .populate('customer', 'customerId name mobile email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: warranties });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch warranties' });
  }
};

export const exportWarranties = async (req: Request, res: Response) => {
  try {
    const { category, status, search, startDate, endDate, datePreset } = req.query;
    const query: any = {};

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    // Date range filtering
    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) {
        query.purchaseDate.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const e = new Date(endDate as string);
        e.setHours(23, 59, 59, 999);
        query.purchaseDate.$lte = e;
      }
    } else if (datePreset) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (datePreset === 'today') {
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        query.purchaseDate = { $gte: startOfDay, $lte: endOfDay };
      } else if (datePreset === 'yesterday') {
        const yStart = new Date(startOfDay);
        yStart.setDate(yStart.getDate() - 1);
        const yEnd = new Date(yStart);
        yEnd.setHours(23, 59, 59, 999);
        query.purchaseDate = { $gte: yStart, $lte: yEnd };
      } else if (datePreset === 'last7days' || datePreset === '7days') {
        const past = new Date(startOfDay);
        past.setDate(past.getDate() - 7);
        query.purchaseDate = { $gte: past };
      } else if (datePreset === 'last30days' || datePreset === '30days') {
        const past = new Date(startOfDay);
        past.setDate(past.getDate() - 30);
        query.purchaseDate = { $gte: past };
      } else if (datePreset === 'thismonth' || datePreset === 'thisMonth') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        query.purchaseDate = { $gte: firstDay };
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
        { warrantyNumber: { $regex: searchStr, $options: 'i' } },
        { serialNumber: { $regex: searchStr, $options: 'i' } },
        { billNumber: { $regex: searchStr, $options: 'i' } },
        { product: { $regex: searchStr, $options: 'i' } },
        { category: { $regex: searchStr, $options: 'i' } },
        { status: { $regex: searchStr, $options: 'i' } },
      ];

      if (customerIds.length > 0) {
        searchConditions.push({ customer: { $in: customerIds } });
      }

      query.$or = searchConditions;
    }

    const warranties = await Warranty.find(query)
      .populate('customer', 'customerId name mobile email')
      .sort({ createdAt: -1 });

    const headers = [
      'Warranty Number',
      'Category',
      'Product Model',
      'Serial Number',
      'Bill Number',
      'Customer ID',
      'Customer Name',
      'Customer Mobile',
      'Customer Email',
      'Purchase Date',
      'Warranty Start Date',
      'Warranty Expiry Date',
      'Status',
      'Registered By',
      'Created Date',
    ];

    const escapeCsv = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = warranties.map((w: any) => [
      escapeCsv(w.warrantyNumber),
      escapeCsv(w.category),
      escapeCsv(w.product),
      escapeCsv(w.serialNumber),
      escapeCsv(w.billNumber),
      escapeCsv(w.customer?.customerId || ''),
      escapeCsv(w.customer?.name || ''),
      escapeCsv(w.customer?.mobile || ''),
      escapeCsv(w.customer?.email || ''),
      escapeCsv(w.purchaseDate ? new Date(w.purchaseDate).toLocaleDateString('en-IN') : ''),
      escapeCsv(w.warrantyStartDate ? new Date(w.warrantyStartDate).toLocaleDateString('en-IN') : ''),
      escapeCsv(w.warrantyExpiryDate ? new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN') : ''),
      escapeCsv(w.status || 'Active'),
      escapeCsv(w.registeredBy || 'Direct / System'),
      escapeCsv(w.createdAt ? new Date(w.createdAt).toLocaleDateString('en-IN') : ''),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const timestamp = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ekosmart_warranties_export_${timestamp}.csv"`);
    return res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Export warranties error:', error);
    res.status(500).json({ success: false, message: 'Failed to export warranties' });
  }
};
