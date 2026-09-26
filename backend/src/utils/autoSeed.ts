import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import { ComplaintForm } from '../models/ComplaintForm';
import { WarrantyForm } from '../models/WarrantyForm';
import { Content } from '../models/Content';
import { defaultServiceCards } from '../controllers/content.controller';
import { generateBarcodeSVG } from './barcode';

let isSeeding = false;
let seedCompleted = false;

/**
 * Ensures all default admin accounts, demo employee accounts, form schemas,
 * and CMS content exist in the database (critical for fresh Vercel / MongoDB Atlas deployments).
 * Completely safe and idempotent — never deletes or overwrites existing production data.
 */
export const ensureDefaultSeedData = async (): Promise<void> => {
  if (isSeeding || seedCompleted) {
    return;
  }

  isSeeding = true;

  try {
    // 1. Ensure SuperAdmin exists
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ekosmart.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({
      email: { $regex: `^${adminEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });

    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'SuperAdmin',
        status: 'Active',
      });
      console.log(`[AutoSeed] Default SuperAdmin created: ${adminEmail}`);
    }

    // 2. Ensure Demo Employees exist
    const demoEmployees = [
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
        status: 'Active' as const,
        warrantyAccess: {
          enabled: true,
          accessType: 'Full Access' as const,
          divisionScope: ['All'],
          permissions: {
            registration: true,
            verification: true,
            claim: true,
            claimApproval: true,
            check: true,
            customerRecords: true,
            voidWarranty: true,
          },
        },
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
        status: 'Active' as const,
        warrantyAccess: {
          enabled: true,
          accessType: 'Registrar' as const,
          divisionScope: ['Rental', 'Spare Parts'],
          permissions: {
            registration: true,
            verification: false,
            claim: false,
            claimApproval: false,
            check: true,
            customerRecords: true,
            voidWarranty: false,
          },
        },
      },
    ];

    for (const emp of demoEmployees) {
      const existingEmp = await Employee.findOne({
        $or: [
          { employeeId: { $regex: `^${emp.employeeId}$`, $options: 'i' } },
          { email: { $regex: `^${emp.email}$`, $options: 'i' } },
        ],
      });

      if (!existingEmp) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(emp.password, salt);
        const barcode = generateBarcodeSVG(emp.employeeId);

        await Employee.create({
          ...emp,
          password: hashedPassword,
          plainPassword: emp.password,
          barcode,
        });
        console.log(`[AutoSeed] Default Employee created: ${emp.employeeId} (${emp.name})`);
      } else if (!existingEmp.plainPassword) {
        existingEmp.plainPassword = emp.password;
        await existingEmp.save();
      }
    }

    // Backfill any other employees that lack plainPassword
    try {
      await Employee.updateMany(
        { $or: [{ plainPassword: { $exists: false } }, { plainPassword: '' }, { plainPassword: null }] },
        { $set: { plainPassword: 'employee123' } }
      );
    } catch {
      // Ignore
    }

    // 3. Ensure Default Complaint Forms exist
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
        console.log(`[AutoSeed] Complaint Form created for: ${item.division}`);
      }
    }

    // 4. Ensure Default Warranty Forms exist
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
        console.log(`[AutoSeed] Warranty Form created for: ${item.category}`);
      }
    }

    // 5. Ensure Default CMS exists
    let content = await Content.findOne({ key: 'global_cms' });
    if (!content) {
      await Content.create({
        key: 'global_cms',
        serviceCards: defaultServiceCards,
      });
      console.log('[AutoSeed] Global CMS default service cards created.');
    }

    seedCompleted = true;
  } catch (error: any) {
    console.error('[AutoSeed] Error during auto-seeding:', error.message || error);
  } finally {
    isSeeding = false;
  }
};
