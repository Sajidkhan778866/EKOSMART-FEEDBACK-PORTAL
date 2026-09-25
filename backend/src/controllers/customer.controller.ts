import { Request, Response } from 'express';
import { Customer } from '../models/Customer';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { customerType, search } = req.query;
    const query: any = {};

    if (customerType) query.customerType = customerType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
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
