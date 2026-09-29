import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { applyDateFilterToQuery } from '../utils/dateRange';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { customerType, search, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (customerType && customerType !== 'All') query.customerType = customerType;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: customers, count: customers.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, address, city, state, customerType, source } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Name and Mobile are required' });
    }

    const existing = await Customer.findOne({ mobile: mobile.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Customer with this mobile already exists' });
    }

    const customerId = `CUST-${Date.now().toString().slice(-6)}`;
    const customer = await Customer.create({
      customerId,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : undefined,
      address,
      city,
      state,
      customerType: customerType || 'General',
      source,
    });

    res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create customer' });
  }
};

// GET /api/v1/customers/export/csv - Export customer directory to CSV / Excel
export const exportCustomers = async (req: Request, res: Response) => {
  try {
    const { customerType, search, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (customerType && customerType !== 'All') query.customerType = customerType;
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });

    const headers = [
      'Customer ID',
      'Full Name',
      'Mobile Number',
      'Email Address',
      'Address',
      'City',
      'State',
      'Customer Type',
      'Source / Division',
      'Registered Date',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = customers.map((c: any) => [
      escapeCsv(c.customerId || ''),
      escapeCsv(c.name || ''),
      escapeCsv(c.mobile || ''),
      escapeCsv(c.email || ''),
      escapeCsv(c.address || ''),
      escapeCsv(c.city || ''),
      escapeCsv(c.state || ''),
      escapeCsv(c.customerType || 'General'),
      escapeCsv(c.source || 'Showroom/Plant'),
      escapeCsv(c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : ''),
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Customers_Directory_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Failed to export customers:', error);
    res.status(500).json({ success: false, message: 'Failed to export customer directory' });
  }
};
