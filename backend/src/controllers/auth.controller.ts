import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import bcrypt from 'bcrypt';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = (email || '').toString().trim();
    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({ 
      email: { $regex: `^${escapedEmail}$`, $options: 'i' } 
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString(), user.role),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('adminLogin error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const employeeLogin = async (req: Request, res: Response) => {
  const { employeeId, password } = req.body;

  try {
    const cleanId = (employeeId || '').toString().trim();
    if (!cleanId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide employee ID and password' });
    }

    const escapedId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const employee = await Employee.findOne({
      $or: [
        { employeeId: { $regex: `^${escapedId}$`, $options: 'i' } },
        { email: { $regex: `^${escapedId}$`, $options: 'i' } },
      ]
    }).select('+password');
    
    if (!employee || !employee.password) {
       return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your Employee ID and password.' });
    }

    if (employee.status === 'Inactive') {
       return res.status(403).json({ success: false, message: 'This employee account has been deactivated. Please contact administrator.' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (isMatch) {
      res.json({
        success: true,
        data: {
          _id: employee._id,
          name: employee.name,
          employeeId: employee.employeeId,
          email: employee.email,
          mobile: employee.mobile,
          department: employee.department,
          designation: employee.designation,
          division: employee.division,
          role: employee.role,
          status: employee.status,
          warrantyAccess: employee.warrantyAccess,
          token: generateToken(employee._id.toString(), employee.role),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check your Employee ID and password.' });
    }
  } catch (error: any) {
    console.error('employeeLogin error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
