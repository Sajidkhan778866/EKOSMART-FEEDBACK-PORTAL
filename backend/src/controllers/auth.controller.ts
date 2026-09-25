import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import bcrypt from 'bcrypt';
import { isDbConnected } from '../config/db';
import { ensureDefaultSeedData } from '../utils/autoSeed';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'ekosmart_default_secret_key_2026', {
    expiresIn: '30d',
  });
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = (email || '').toString().trim();
    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let user = await User.findOne({ 
      email: { $regex: `^${escapedEmail}$`, $options: 'i' } 
    }).select('+password');

    // If admin doesn't exist yet (e.g. fresh DB before seed completes), run seed and re-check
    if (!user) {
      await ensureDefaultSeedData();
      user = await User.findOne({ 
        email: { $regex: `^${escapedEmail}$`, $options: 'i' } 
      }).select('+password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'This admin account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token,
      },
    });
  } catch (error: any) {
    console.error('[AdminLogin] Error:', error);
    const healthy = isDbConnected();
    return res.status(healthy ? 500 : 503).json({
      success: false,
      message: healthy
        ? (error.message || 'Internal server error occurred during login.')
        : 'Database is currently connecting. Please wait a moment and try again.',
    });
  }
};

export const employeeLogin = async (req: Request, res: Response) => {
  const { employeeId, password } = req.body;

  try {
    const cleanId = (employeeId || '').toString().trim();
    if (!cleanId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Employee ID and password.',
      });
    }

    const escapedId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let employee = await Employee.findOne({
      $or: [
        { employeeId: { $regex: `^${escapedId}$`, $options: 'i' } },
        { email: { $regex: `^${escapedId}$`, $options: 'i' } },
      ],
    }).select('+password');

    // If demo employee not found in fresh DB, trigger seed and re-check
    if (!employee) {
      await ensureDefaultSeedData();
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
        message: 'This employee account has been deactivated. Please contact administrator.',
      });
    }

    const isMatch =
      (await bcrypt.compare(password, employee.password)) ||
      employee.password === password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee ID or password. Please check your credentials.',
      });
    }

    const token = generateToken(employee._id.toString(), employee.role);

    return res.json({
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
        token,
      },
    });
  } catch (error: any) {
    console.error('[EmployeeLogin] Error:', error);
    const healthy = isDbConnected();
    return res.status(healthy ? 500 : 503).json({
      success: false,
      message: healthy
        ? (error.message || 'Internal server error occurred during login.')
        : 'Database is currently connecting. Please wait a moment and try again.',
    });
  }
};
