import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Employee } from '../models/Employee';
import { Complaint } from '../models/Complaint';
import { PayrollRecord } from '../models/PayrollRecord';
import { generateBarcodeSVG } from '../utils/barcode';
import { applyDateFilterToQuery } from '../utils/dateRange';

// Normalize helper for division, permissions, warrantyAccess, certificates
const parseJsonOrValue = (val: any, fallback: any = null) => {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      name,
      email,
      mobile,
      address,
      department,
      section,
      division,
      designation,
      role,
      password,
      permissions,
      certificates,
      issuedItems,
      warrantyAccess,
      status,
    } = req.body;

    // 1. Basic validation
    if (!employeeId || !name || !email || !mobile || !department || !role || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Employee ID, Name, Email, Mobile, Department, Role, Password).',
      });
    }

    // 2. Normalize divisions
    let divisionArray: string[] = [];
    const parsedDiv = parseJsonOrValue(division, []);
    if (Array.isArray(parsedDiv)) {
      divisionArray = parsedDiv.map((d: any) => String(d).trim()).filter(Boolean);
    } else if (typeof division === 'string') {
      divisionArray = division.split(',').map((d) => d.trim()).filter(Boolean);
    }

    // 3. Normalize warrantyAccess
    const rawWarranty = parseJsonOrValue(warrantyAccess, {});
    const parsedWarranty = {
      enabled: Boolean(rawWarranty?.enabled),
      accessType: rawWarranty?.accessType || (rawWarranty?.enabled ? 'Custom' : 'Disabled'),
      divisionScope: Array.isArray(rawWarranty?.divisionScope) ? rawWarranty.divisionScope : ['All'],
      permissions: {
        registration: Boolean(rawWarranty?.permissions?.registration),
        verification: Boolean(rawWarranty?.permissions?.verification),
        claim: Boolean(rawWarranty?.permissions?.claim),
        claimApproval: Boolean(rawWarranty?.permissions?.claimApproval),
        check: Boolean(rawWarranty?.permissions?.check),
        customerRecords: Boolean(rawWarranty?.permissions?.customerRecords),
        voidWarranty: Boolean(rawWarranty?.permissions?.voidWarranty),
      },
    };

    // 4. Normalize permissions
    let permissionsArray: string[] = [];
    const parsedPerms = parseJsonOrValue(permissions, []);
    if (Array.isArray(parsedPerms)) {
      permissionsArray = parsedPerms.map((p: any) => String(p).trim()).filter(Boolean);
    }

    // 5. Normalize certificates
    let certificatesArray: any[] = [];
    const parsedCerts = parseJsonOrValue(certificates, []);
    if (Array.isArray(parsedCerts)) {
      certificatesArray = parsedCerts.filter((c: any) => c && c.title);
    }

    // 5b. Normalize issuedItems / givings
    let issuedItemsArray: any[] = [];
    const rawItems = issuedItems !== undefined ? issuedItems : (req.body as any).givings;
    const parsedItems = parseJsonOrValue(rawItems, []);
    if (Array.isArray(parsedItems)) {
      issuedItemsArray = parsedItems
        .filter((i: any) => i && (i.name || i.title))
        .map((i: any) => ({
          id: i.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: String(i.name || i.title).trim(),
          category: i.category ? String(i.category).trim() : 'Diagnostic Tool',
          serialNumber: i.serialNumber ? String(i.serialNumber).trim() : '',
          assetTag: i.assetTag ? String(i.assetTag).trim() : '',
          issueDate: i.issueDate ? String(i.issueDate).trim() : '',
          returnDate: i.returnDate ? String(i.returnDate).trim() : 'Returnable',
          condition: i.condition || 'Good',
          status: i.status || 'Issued',
          issuedBy: i.issuedBy || 'Admin',
          notes: i.notes ? String(i.notes).trim() : '',
        }));
    }

    // 6. Check duplicate Employee ID
    const existingId = await Employee.findOne({ employeeId: employeeId.trim() });
    if (existingId) {
      return res.status(409).json({
        success: false,
        message: `Employee ID "${employeeId}" already exists. Please choose a unique ID.`,
      });
    }

    // 7. Check duplicate Email
    const existingEmail = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Email "${email}" is already registered.`,
      });
    }

    // 8. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 9. Process photo
    let photoUrl = '';
    if (req.file) {
      if (req.file.buffer) {
        photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      } else if (req.file.filename) {
        photoUrl = `/uploads/employees/${req.file.filename}`;
      }
    } else if (req.body.photoUrl) {
      photoUrl = req.body.photoUrl;
    }

    // 10. Generate Barcode

    const barcode = generateBarcodeSVG(employeeId.trim());

    // 11. Create employee
    const employee = await Employee.create({
      employeeId: employeeId.trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      address: address ? address.trim() : '',
      department: department.trim(),
      section: section ? section.trim() : '',
      division: divisionArray.length > 0 ? divisionArray : [department.trim()],
      designation: designation ? designation.trim() : 'Staff',
      role: role.trim(),
      password: hashedPassword,
      plainPassword: password.trim(),
      photoUrl: photoUrl || undefined,
      barcode,
      permissions: permissionsArray,
      certificates: certificatesArray,
      issuedItems: issuedItemsArray,
      warrantyAccess: parsedWarranty,
      status: status === 'Inactive' ? 'Inactive' : 'Active',
    });

    // 12. Return safe employee data
    const safeEmployee = employee.toObject();
    delete safeEmployee.password;

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: safeEmployee,
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create employee',
    });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { department, division, status, search } = req.query;
    const query: any = {};

    if (department && department !== 'All') query.department = department;
    if (division && division !== 'All') query.division = division;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
    });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employee' });
  }
};

export const getEligibleEmployees = async (req: Request, res: Response) => {
  try {
    const { division } = req.params;
    const employees = await Employee.find({
      status: 'Active',
      $or: [
        { division: division },
        { department: division },
        { role: 'Admin' },
      ],
    }).select('employeeId name email mobile department designation role division photoUrl warrantyAccess certificates');

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch eligible employees' });
  }
};

// GET /api/v1/admin/employees/:id/tasks (Assigned Task List Dossier)
export const getEmployeeTasks = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Find all complaints assigned to this employee
    const tasks = await Complaint.find({ assignedTo: employee._id })
      .populate('customer', 'name mobile email address city pincode')
      .sort({ updatedAt: -1, createdAt: -1 });

    // Calculate Task Metrics
    const total = tasks.length;
    const pending = tasks.filter((t) => ['New', 'Pending', 'Assigned'].includes(t.status)).length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const resolved = tasks.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length;
    const urgent = tasks.filter((t) => ['Urgent', 'High'].includes(t.priority)).length;

    res.json({
      success: true,
      data: {
        employee: {
          _id: employee._id,
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          mobile: employee.mobile,
          department: employee.department,
          designation: employee.designation,
          division: employee.division,
          photoUrl: employee.photoUrl,
          certificates: employee.certificates || [],
          issuedItems: employee.issuedItems || [],
          warrantyAccess: employee.warrantyAccess,
        },
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          urgent,
        },
        tasks,
      },
    });
  } catch (error: any) {
    console.error('Error fetching employee tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned tasks for employee',
    });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updates = { ...req.body };

    // Handle password update only if provided
    if (updates.password && updates.password.trim()) {
      const rawPass = updates.password.trim();
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(rawPass, salt);
      updates.plainPassword = rawPass;
    } else {
      delete updates.password;
    }

    // Handle photo file
    if (req.file) {
      if (req.file.buffer) {
        updates.photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      } else if (req.file.filename) {
        updates.photoUrl = `/uploads/employees/${req.file.filename}`;
      }
    }


    // Handle division parsing
    if (updates.division !== undefined) {
      const parsed = parseJsonOrValue(updates.division, []);
      updates.division = Array.isArray(parsed) ? parsed : updates.division.split(',').map((d: string) => d.trim()).filter(Boolean);
    }

    // Handle certificates parsing
    if (updates.certificates !== undefined) {
      const parsedCerts = parseJsonOrValue(updates.certificates, []);
      updates.certificates = Array.isArray(parsedCerts) ? parsedCerts.filter((c: any) => c && c.title) : [];
    }

    // Handle issuedItems / givings parsing
    if (updates.issuedItems !== undefined || (updates as any).givings !== undefined) {
      const rawItems = updates.issuedItems !== undefined ? updates.issuedItems : (updates as any).givings;
      const parsedItems = parseJsonOrValue(rawItems, []);
      updates.issuedItems = Array.isArray(parsedItems)
        ? parsedItems
            .filter((i: any) => i && (i.name || i.title))
            .map((i: any) => ({
              id: i.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name: String(i.name || i.title).trim(),
              category: i.category ? String(i.category).trim() : 'Diagnostic Tool',
              serialNumber: i.serialNumber ? String(i.serialNumber).trim() : '',
              assetTag: i.assetTag ? String(i.assetTag).trim() : '',
              issueDate: i.issueDate ? String(i.issueDate).trim() : '',
              returnDate: i.returnDate ? String(i.returnDate).trim() : 'Returnable',
              condition: i.condition || 'Good',
              status: i.status || 'Issued',
              issuedBy: i.issuedBy || 'Admin',
              notes: i.notes ? String(i.notes).trim() : '',
            }))
        : [];
    }

    // Handle warranty access parsing
    if (updates.warrantyAccess !== undefined) {
      const rawWarranty = parseJsonOrValue(updates.warrantyAccess, {});
      updates.warrantyAccess = {
        enabled: Boolean(rawWarranty?.enabled),
        accessType: rawWarranty?.accessType || (rawWarranty?.enabled ? 'Custom' : 'Disabled'),
        divisionScope: Array.isArray(rawWarranty?.divisionScope) ? rawWarranty.divisionScope : ['All'],
        permissions: {
          registration: Boolean(rawWarranty?.permissions?.registration),
          verification: Boolean(rawWarranty?.permissions?.verification),
          claim: Boolean(rawWarranty?.permissions?.claim),
          claimApproval: Boolean(rawWarranty?.permissions?.claimApproval),
          check: Boolean(rawWarranty?.permissions?.check),
          customerRecords: Boolean(rawWarranty?.permissions?.customerRecords),
          voidWarranty: Boolean(rawWarranty?.permissions?.voidWarranty),
        },
      };
    }

    // Handle permissions parsing
    if (updates.permissions !== undefined) {
      updates.permissions = parseJsonOrValue(updates.permissions, updates.permissions);
    }

    // Update barcode if employeeId changed
    if (updates.employeeId) {
      updates.barcode = generateBarcodeSVG(updates.employeeId.trim());
    }

    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
    }
    if (!employee) {
      employee = await Employee.findOneAndUpdate(
        { $or: [{ employeeId: id }, { email: id }] },
        updates,
        { new: true }
      );
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const safeEmployee = employee.toObject();
    delete safeEmployee.password;

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: safeEmployee,
    });
  } catch (error: any) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update employee' });
  }
};

export const toggleEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ $or: [{ employeeId: id }, { email: id }] });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.status = employee.status === 'Active' ? 'Inactive' : 'Active';
    await employee.save();

    res.json({
      success: true,
      message: `Employee ${employee.status === 'Active' ? 'activated' : 'deactivated'} successfully`,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle employee status' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findByIdAndDelete(id);
    }
    if (!employee) {
      employee = await Employee.findOneAndDelete({ $or: [{ employeeId: id }, { email: id }] });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete employee' });
  }
};

// Excel / CSV Export Endpoint
export const exportEmployees = async (req: Request, res: Response) => {
  try {
    const { department, division, status, search } = req.query;
    const query: any = {};

    if (department && department !== 'All') query.department = department;
    if (division && division !== 'All') query.division = division;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    // Format CSV lines
    const headers = [
      'Employee ID',
      'Employee Name',
      'Email',
      'Mobile',
      'Department',
      'Section',
      'Designation',
      'Role',
      'Status',
      'Certificates Count',
      'Certificates Details',
      'Equipment & Assets Given Count',
      'Equipment & Assets Given Details',
      'Warranty Access Tier',
      'Warranty Scope',
      'Warranty Permissions',
      'Address',
      'Date Added',
      'Last Updated',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = employees.map((emp) => {
      const warrantyTier = emp.warrantyAccess?.enabled ? (emp.warrantyAccess?.accessType || 'Authorized') : 'Disabled';
      const scope = emp.warrantyAccess?.divisionScope?.join('; ') || 'All';
      const perms: string[] = [];
      if (emp.warrantyAccess?.permissions?.registration) perms.push('Registration');
      if (emp.warrantyAccess?.permissions?.verification) perms.push('Verification');
      if (emp.warrantyAccess?.permissions?.claim) perms.push('Claim Filing');
      if (emp.warrantyAccess?.permissions?.claimApproval) perms.push('Claim Approval');
      if (emp.warrantyAccess?.permissions?.check) perms.push('Serial Check');
      if (emp.warrantyAccess?.permissions?.customerRecords) perms.push('Customer Records');
      if (emp.warrantyAccess?.permissions?.voidWarranty) perms.push('Voiding');

      const certs = emp.certificates || [];
      const certTitles = certs.map((c) => `${c.title} (${c.verificationStatus || 'Verified'})`).join('; ');

      const items = emp.issuedItems || [];
      const itemTitles = items.map((i) => `${i.name} [${i.category || 'Asset'}${i.serialNumber ? ` - ${i.serialNumber}` : ''}] (${i.condition || 'Good'})`).join('; ');

      return [
        escapeCsv(emp.employeeId),
        escapeCsv(emp.name),
        escapeCsv(emp.email),
        escapeCsv(emp.mobile),
        escapeCsv(emp.department),
        escapeCsv(emp.section || ''),
        escapeCsv(emp.designation || ''),
        escapeCsv(emp.role),
        escapeCsv(emp.status),
        escapeCsv(certs.length),
        escapeCsv(certTitles || 'None'),
        escapeCsv(items.length),
        escapeCsv(itemTitles || 'None'),
        escapeCsv(warrantyTier),
        escapeCsv(scope),
        escapeCsv(perms.join(', ') || 'None'),
        escapeCsv(emp.address || ''),
        escapeCsv(emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ''),
        escapeCsv(emp.updatedAt ? new Date(emp.updatedAt).toLocaleDateString() : ''),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Employees_Export_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Error exporting employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export employee list',
    });
  }
};

// Number to Words Converter for Indian Rupee Payslips
export const convertNumberToWords = (num: number): string => {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 === 0 ? '' : 'and ' + inWords(n % 100));
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
  };

  const integerPart = Math.floor(Math.abs(num));
  const words = inWords(integerPart).trim();
  return words ? `${words} Rupees Only` : 'Zero Rupees Only';
};

// ============================================================================
// SALARY & PAYSLIP CONTROLLERS (INDIVIDUAL & SOFT-CODED)
// ============================================================================

// GET /api/v1/employees/:id/salary - Get individual employee's salary structure
export const getEmployeeSalary = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const defaultSalaryStructure = {
      basicSalary: 25000,
      allowances: [
        { key: 'hra', label: 'House Rent Allowance (HRA)', amount: 10000 },
        { key: 'conveyance', label: 'Conveyance Allowance', amount: 3000 },
        { key: 'special', label: 'Special / Performance Allowance', amount: 5000 },
      ],
      deductions: [
        { key: 'pf', label: 'Provident Fund (EPF 12%)', amount: 1800 },
        { key: 'esi', label: 'ESI Contribution', amount: 500 },
        { key: 'pt', label: 'Professional Tax (PT)', amount: 200 },
      ],
      bonuses: [],
      bankDetails: {
        bankName: 'HDFC Bank Ltd',
        accountNumber: '',
        ifscCode: 'HDFC0001234',
        branch: 'Kota Industrial Area',
        upiId: '',
        pan: '',
        uan: '',
        pfNumber: '',
        esicNumber: '',
      },
      effectiveDate: employee.createdAt || new Date(),
    };

    const salaryStructure = employee.salaryStructure || defaultSalaryStructure;

    // Fetch recent payslips for this employee
    const recentPayslips = await PayrollRecord.find({
      $or: [{ employee: employee._id }, { employeeId: employee.employeeId }],
    }).sort({ payYear: -1, payMonth: -1 }).limit(12);

    res.json({
      success: true,
      data: {
        employee: {
          _id: employee._id,
          employeeId: employee.employeeId,
          name: employee.name,
          department: employee.department,
          designation: employee.designation,
          division: employee.division,
          mobile: employee.mobile,
          email: employee.email,
        },
        salaryStructure,
        recentPayslips,
      },
    });
  } catch (error: any) {
    console.error('Error fetching employee salary:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch salary details', error: error.message });
  }
};

// PUT /api/v1/employees/:id/salary - Update employee's salary structure (Admin only)
export const updateEmployeeSalary = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { salaryStructure } = req.body;

    if (!salaryStructure) {
      return res.status(400).json({ success: false, message: 'Salary structure payload is required.' });
    }

    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.salaryStructure = {
      basicSalary: Number(salaryStructure.basicSalary) || 0,
      allowances: Array.isArray(salaryStructure.allowances) ? salaryStructure.allowances : [],
      deductions: Array.isArray(salaryStructure.deductions) ? salaryStructure.deductions : [],
      bonuses: Array.isArray(salaryStructure.bonuses) ? salaryStructure.bonuses : [],
      bankDetails: salaryStructure.bankDetails || {},
      effectiveDate: salaryStructure.effectiveDate ? new Date(salaryStructure.effectiveDate) : new Date(),
      notes: salaryStructure.notes || '',
    };

    await employee.save();

    res.json({
      success: true,
      message: `Salary structure for ${employee.name} updated successfully.`,
      data: employee.salaryStructure,
    });
  } catch (error: any) {
    console.error('Error updating employee salary:', error);
    res.status(500).json({ success: false, message: 'Failed to update salary structure', error: error.message });
  }
};

// POST /api/v1/employees/:id/generate-payslip - Generate official monthly payslip (Admin)
export const generateEmployeePayslip = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const {
      payMonth, // 1 - 12
      payYear, // e.g. 2026
      payPeriod, // e.g. "September 2026"
      totalWorkingDays,
      paidDays,
      leaveDays,
      basicSalary,
      allowances,
      deductions,
      bonuses,
      otherEarnings,
      paymentMode,
      paymentStatus,
      bankDetails,
      authorizedBy,
      notes,
      isPublishedToEmployee,
    } = req.body;

    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const monthNum = Number(payMonth) || new Date().getMonth() + 1;
    const yearNum = Number(payYear) || new Date().getFullYear();
    const periodStr = payPeriod || `${new Date(yearNum, monthNum - 1).toLocaleString('default', { month: 'long' })} ${yearNum}`;

    const base = Number(basicSalary) !== undefined ? Number(basicSalary) : (employee.salaryStructure?.basicSalary || 25000);
    const allowList = Array.isArray(allowances) ? allowances : (employee.salaryStructure?.allowances || []);
    const dedList = Array.isArray(deductions) ? deductions : (employee.salaryStructure?.deductions || []);
    const bonusList = Array.isArray(bonuses) ? bonuses : (employee.salaryStructure?.bonuses || []);
    const otherList = Array.isArray(otherEarnings) ? otherEarnings : [];

    const totalAllowances = allowList.reduce((acc: number, a: any) => acc + (Number(a.amount) || 0), 0);
    const totalBonuses = bonusList.reduce((acc: number, b: any) => acc + (Number(b.amount) || 0), 0);
    const totalOther = otherList.reduce((acc: number, o: any) => acc + (Number(o.amount) || 0), 0);
    const grossEarnings = base + totalAllowances + totalBonuses + totalOther;

    const totalDeductions = dedList.reduce((acc: number, d: any) => acc + (Number(d.amount) || 0), 0);
    const netSalary = Math.max(0, grossEarnings - totalDeductions);
    const amountInWords = convertNumberToWords(netSalary);

    // Generate unique payslip number
    const dateCode = `${yearNum}${monthNum.toString().padStart(2, '0')}`;
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const payslipNumber = `EBS-PAY-${employee.employeeId}-${dateCode}-${randSuffix}`;

    const adminUser = (req as any).user;
    const adminName = adminUser?.name || 'Admin';

    // Create persistent historical payroll record
    const payslip = await PayrollRecord.create({
      payslipNumber,
      employeeId: employee.employeeId,
      employee: employee._id,
      employeeName: employee.name,
      department: employee.department || 'Technical',
      designation: employee.designation || 'Staff',
      division: (employee.division && employee.division[0]) || employee.department || 'Kota Plant',
      payPeriod: periodStr,
      payMonth: monthNum,
      payYear: yearNum,
      payDate: new Date(),
      effectiveDate: new Date(),
      totalWorkingDays: Number(totalWorkingDays) || 30,
      paidDays: Number(paidDays) !== undefined ? Number(paidDays) : 30,
      leaveDays: Number(leaveDays) || 0,
      basicSalary: base,
      allowances: allowList,
      deductions: dedList,
      bonuses: bonusList,
      otherEarnings: otherList,
      grossEarnings,
      totalDeductions,
      netSalary,
      amountInWords,
      paymentMode: paymentMode || 'Bank Transfer',
      paymentStatus: paymentStatus || 'Paid',
      bankDetails: bankDetails || employee.salaryStructure?.bankDetails || {},
      authorizedBy: authorizedBy || 'HR & Finance Director',
      notes: notes || '',
      isPublishedToEmployee: isPublishedToEmployee !== false,
      history: [
        {
          action: 'Created & Published',
          updatedBy: adminName,
          updatedAt: new Date(),
          remarks: `Payslip generated for ${periodStr}`,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: `Payslip generated successfully for ${employee.name} (${periodStr}).`,
      data: payslip,
    });
  } catch (error: any) {
    console.error('Error generating payslip:', error);
    res.status(500).json({ success: false, message: 'Failed to generate payslip', error: error.message });
  }
};

// GET /api/v1/employees/:id/payslips - Get payslip history for a single employee (Admin)
export const getEmployeePayslips = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const { dateFilter, startDate, endDate, year } = req.query;
    const query: any = {
      $or: [{ employee: employee._id }, { employeeId: employee.employeeId }],
    };

    if (year) query.payYear = Number(year);
    applyDateFilterToQuery(query, 'payDate', dateFilter as string, startDate as string, endDate as string);

    const payslips = await PayrollRecord.find(query).sort({ payYear: -1, payMonth: -1, createdAt: -1 });

    res.json({
      success: true,
      data: payslips,
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch payslips', error: error.message });
  }
};

// GET /api/v1/employees/payslips/all - List all payslips across employees (Admin)
export const getAllPayslips = async (req: Request, res: Response) => {
  try {
    const { department, paymentStatus, search, dateFilter, startDate, endDate, year, limit } = req.query;
    const query: any = {};

    if (department && department !== 'All') query.department = department;
    if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;
    if (year) query.payYear = Number(year);

    applyDateFilterToQuery(query, 'payDate', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { employeeName: { $regex: s, $options: 'i' } },
        { employeeId: { $regex: s, $options: 'i' } },
        { payslipNumber: { $regex: s, $options: 'i' } },
        { payPeriod: { $regex: s, $options: 'i' } },
      ];
    }

    const max = Math.min(200, Number(limit) || 100);
    const payslips = await PayrollRecord.find(query).sort({ createdAt: -1 }).limit(max);

    const totalDisbursed = payslips.reduce((acc, p) => acc + (p.netSalary || 0), 0);

    res.json({
      success: true,
      data: payslips,
      meta: {
        totalRecords: payslips.length,
        totalDisbursed,
      },
    });
  } catch (error: any) {
    console.error('Failed to get all payslips:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve payslip list', error: error.message });
  }
};

// GET /api/v1/employees/me/payslips - Employee self-service: View own payslips only
export const getMyPayslips = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }

    // Resolve employee
    let employee = null;
    if (user.employeeId) {
      employee = await Employee.findOne({ employeeId: user.employeeId });
    }
    if (!employee && user.id && mongoose.Types.ObjectId.isValid(user.id)) {
      employee = await Employee.findById(user.id);
    }
    if (!employee && user.email) {
      employee = await Employee.findOne({ email: user.email });
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const { dateFilter, startDate, endDate, year } = req.query;
    const query: any = {
      $or: [{ employee: employee._id }, { employeeId: employee.employeeId }],
      isPublishedToEmployee: true,
    };

    if (year) query.payYear = Number(year);
    applyDateFilterToQuery(query, 'payDate', dateFilter as string, startDate as string, endDate as string);

    const payslips = await PayrollRecord.find(query).sort({ payYear: -1, payMonth: -1, createdAt: -1 });

    res.json({
      success: true,
      data: payslips,
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        department: employee.department,
        designation: employee.designation,
        division: employee.division,
      },
    });
  } catch (error: any) {
    console.error('Error fetching my payslips:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve your salary slips', error: error.message });
  }
};

// GET /api/v1/employees/me/payslips/:id - Get specific payslip with authorization
export const getMyPayslipById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const payslipId = String(req.params.id);

    let payslip = null;
    if (mongoose.Types.ObjectId.isValid(payslipId)) {
      payslip = await PayrollRecord.findById(payslipId);
    }
    if (!payslip) {
      payslip = await PayrollRecord.findOne({ payslipNumber: payslipId });
    }

    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip record not found' });
    }

    // Role check: If not Admin, ensure the payslip belongs to this employee
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'MANAGER'].includes(userRole);

    if (!isAdmin) {
      const matchEmpId = user.employeeId && user.employeeId === payslip.employeeId;
      const matchObjId = user.id && user.id === payslip.employee?.toString();
      if (!matchEmpId && !matchObjId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own salary slips.',
        });
      }
    }

    res.json({ success: true, data: payslip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch payslip details', error: error.message });
  }
};

// DELETE /api/v1/employees/payslips/:payslipId - Delete a payslip (Admin only)
export const deletePayslip = async (req: Request, res: Response) => {
  try {
    const rawPayslipId = req.params.payslipId;
    const payslipId = String(Array.isArray(rawPayslipId) ? rawPayslipId[0] : rawPayslipId || '');
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(payslipId)) {
      deleted = await PayrollRecord.findByIdAndDelete(payslipId);
    }
    if (!deleted) {
      deleted = await PayrollRecord.findOneAndDelete({ payslipNumber: payslipId });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Payslip not found' });
    }

    res.json({ success: true, message: 'Payslip record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete payslip', error: error.message });
  }
};

