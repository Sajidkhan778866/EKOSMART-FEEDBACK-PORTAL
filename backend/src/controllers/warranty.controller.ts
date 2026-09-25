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

    const employee = await Employee.findOne({ employeeId: employeeId.trim() }).select('+password');

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

    const isMatch = await bcrypt.compare(password, employee.password);
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
    const isAuthorizedTier = ['Registrar', 'Manager', 'Full Access'].includes(wAccess?.accessType || '');

    if (!isEnabled || (!hasRegPerm && !isAuthorizedTier)) {
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

    const warranty = await Warranty.create({
      warrantyNumber,
      category,
      customer: customer._id,
      product: product.trim(),
      serialNumber: serialNumber.trim(),
      billNumber: billNumber.trim(),
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
