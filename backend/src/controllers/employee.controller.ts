import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Employee } from '../models/Employee';
import { Complaint } from '../models/Complaint';
import { generateBarcodeSVG } from '../utils/barcode';

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
    const { id } = req.params;
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

    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
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
    res.status(500).json({ success: false, message: error.message || 'Failed to update employee' });
  }
};

export const toggleEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
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
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
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
