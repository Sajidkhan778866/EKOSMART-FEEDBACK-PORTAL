import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import connectDB from '../config/db';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import { ComplaintForm } from '../models/ComplaintForm';
import { WarrantyForm } from '../models/WarrantyForm';
import { Content } from '../models/Content';
import { defaultServiceCards } from '../controllers/content.controller';
import { generateBarcodeSVG } from './barcode';

dotenv.config();

const seed = async () => {
  await connectDB();
  console.log('Database connected for seeding...');

  // 1. Seed Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ekosmart.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
  
  let admin = await User.findOne({ email: adminEmail }).select('+password');
  if (!admin) {
    admin = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'SuperAdmin',
      status: 'Active',
    });
    console.log('Admin user seeded: admin@ekosmart.com / admin123');
  } else {
    admin.password = adminPassword;
    await admin.save();
    console.log('Admin password refreshed: admin@ekosmart.com / admin123');
  }

  // 2. Seed Default Forms for Complaint Divisions
  const defaultDivisions = [
    {
      division: 'Showroom',
      fields: [
        { name: 'customerName', label: 'Customer Full Name', type: 'Text', required: true, order: 1, isActive: true },
        { name: 'customerMobile', label: 'Mobile Number', type: 'Mobile', required: true, order: 2, isActive: true },
        { name: 'customerEmail', label: 'Email Address', type: 'Email', required: false, order: 3, isActive: true },
        { name: 'vehicleModel', label: 'EkoRide Vehicle Model', type: 'Dropdown', options: ['EkoRide City', 'EkoRide Pro', 'EkoRide Delivery', 'EkoRide Eco'], required: true, order: 4, isActive: true },
        { name: 'chassisNumber', label: 'Chassis / Frame Number', type: 'Text', required: true, order: 5, isActive: true },
        { name: 'issueDescription', label: 'Detailed Description of Issue', type: 'Textarea', required: true, order: 6, isActive: true },
      ],
    },
    {
      division: 'Battery',
      fields: [
        { name: 'customerName', label: 'Customer Full Name', type: 'Text', required: true, order: 1, isActive: true },
        { name: 'customerMobile', label: 'Mobile Number', type: 'Mobile', required: true, order: 2, isActive: true },
        { name: 'batterySerial', label: 'Battery Serial Number', type: 'Serial Number', required: true, order: 3, isActive: true },
        { name: 'batteryCapacity', label: 'Battery Type / Ah', type: 'Dropdown', options: ['48V 24Ah Lithium', '60V 30Ah Lithium', '72V 40Ah Lithium', '12V Lead Acid'], required: true, order: 4, isActive: true },
        { name: 'issueType', label: 'Issue Category', type: 'Dropdown', options: ['Not Charging', 'Low Mileage / Range', 'Sudden Cutoff', 'Swelling / Heating', 'Other'], required: true, order: 5, isActive: true },
        { name: 'issueDescription', label: 'Issue Details', type: 'Textarea', required: true, order: 6, isActive: true },
      ],
    },
    {
      division: 'Rental',
      fields: [
        { name: 'customerName', label: 'Renter Name', type: 'Text', required: true, order: 1, isActive: true },
        { name: 'customerMobile', label: 'Registered Mobile', type: 'Mobile', required: true, order: 2, isActive: true },
        { name: 'agreementNumber', label: 'Rental Agreement Number', type: 'Text', required: true, order: 3, isActive: true },
        { name: 'vehicleNumber', label: 'Assigned Vehicle Reg No', type: 'Text', required: true, order: 4, isActive: true },
        { name: 'issueDescription', label: 'Breakdown / Maintenance Details', type: 'Textarea', required: true, order: 5, isActive: true },
      ],
    },
    {
      division: 'Spare Parts',
      fields: [
        { name: 'customerName', label: 'Customer Name / Dealer', type: 'Text', required: true, order: 1, isActive: true },
        { name: 'customerMobile', label: 'Contact Number', type: 'Mobile', required: true, order: 2, isActive: true },
        { name: 'partNumber', label: 'Part Number / SKU', type: 'Text', required: true, order: 3, isActive: true },
        { name: 'partName', label: 'Part Description', type: 'Text', required: true, order: 4, isActive: true },
        { name: 'defectReason', label: 'Reason for Replacement / Defect', type: 'Textarea', required: true, order: 5, isActive: true },
      ],
    },
  ];

  for (const item of defaultDivisions) {
    const existingForm = await ComplaintForm.findOne({ division: item.division as any });
    if (!existingForm) {
      await ComplaintForm.create({
        division: item.division as any,
        fields: item.fields as any,
        version: 1,
        isActive: true,
      });
      console.log(`Complaint Form seeded for: ${item.division}`);
    }
  }

  // 3. Seed Warranty Forms for Showroom & Plant
  const defaultWarrantyForms = [
    {
      category: 'Showroom',
      fields: [
        { name: 'customerName', label: 'Customer Full Name', type: 'Text', required: true, order: 1, isActive: true },
        { name: 'customerMobile', label: 'Mobile Number', type: 'Mobile', required: true, order: 2, isActive: true },
        { name: 'product', label: 'Vehicle / Product Model', type: 'Text', required: true, order: 3, isActive: true },
        { name: 'serialNumber', label: 'Product / VIN Serial No', type: 'Serial Number', required: true, order: 4, isActive: true },
        { name: 'billNumber', label: 'Invoice / Bill Number', type: 'Text', required: true, order: 5, isActive: true },
        { name: 'purchaseDate', label: 'Date of Purchase', type: 'Date', required: true, order: 6, isActive: true },
      ],
    },
    {
      category: 'Plant',
      fields: [
        { name: 'customerName', label: 'Plant Client / Enterprise Name', type: 'Text', required: true, order: 1, isActive: true },
        { name: 'customerMobile', label: 'Authorized Person Mobile', type: 'Mobile', required: true, order: 2, isActive: true },
        { name: 'product', label: 'Industrial Battery / Inverter Unit', type: 'Text', required: true, order: 3, isActive: true },
        { name: 'serialNumber', label: 'Plant Unit Serial Number', type: 'Serial Number', required: true, order: 4, isActive: true },
        { name: 'billNumber', label: 'Commercial Invoice No', type: 'Text', required: true, order: 5, isActive: true },
        { name: 'purchaseDate', label: 'Commissioning Date', type: 'Date', required: true, order: 6, isActive: true },
      ],
    },
  ];

  for (const item of defaultWarrantyForms) {
    const existingForm = await WarrantyForm.findOne({ category: item.category as any });
    if (!existingForm) {
      await WarrantyForm.create({
        category: item.category as any,
        fields: item.fields as any,
        version: 1,
        isActive: true,
      });
      console.log(`Warranty Form seeded for: ${item.category}`);
    }
  }

  // 4. Seed initial employees for testing
  const initialEmployees = [
    {
      employeeId: 'TEST-EMP-001',
      name: 'Rajesh Sharma',
      email: 'rajesh.tech@ekosmart.com',
      mobile: '9876543210',
      department: 'Technical',
      division: ['Battery', 'Showroom'],
      designation: 'Senior Service Engineer',
      role: 'Technician',
      password: 'employee123',
    },
    {
      employeeId: 'EMP-REN-002',
      name: 'Amit Patel',
      email: 'amit.rental@ekosmart.com',
      mobile: '9876543211',
      department: 'Operations',
      division: ['Rental', 'Spare Parts'],
      designation: 'Field Operations Specialist',
      role: 'Staff',
      password: 'employee123',
    },
  ];

  for (const emp of initialEmployees) {
    const existing = await Employee.findOne({ employeeId: emp.employeeId });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(emp.password, salt);
      const barcode = generateBarcodeSVG(emp.employeeId);

      await Employee.create({
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        mobile: emp.mobile,
        department: emp.department,
        division: emp.division,
        designation: emp.designation,
        role: emp.role,
        password: hashedPassword,
        barcode,
        status: 'Active',
      });
      console.log(`Employee seeded: ${emp.employeeId} (${emp.name})`);
    }
  }

  // 5. Seed Default Content / CMS
  let content = await Content.findOne({ key: 'global_cms' });
  if (!content) {
    await Content.create({
      key: 'global_cms',
      serviceCards: defaultServiceCards,
    });
    console.log('Global CMS content seeded with 6 default flash cards.');
  } else if (!content.serviceCards || content.serviceCards.length === 0) {
    content.serviceCards = defaultServiceCards;
    await content.save();
    console.log('Global CMS service cards refreshed.');
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
