import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Bill } from '../models/Bill';
import { Customer } from '../models/Customer';
import { Stock } from '../models/Stock';
import { StockMovement } from '../models/StockMovement';
import { Warranty } from '../models/Warranty';
import { Content } from '../models/Content';
import { BillTemplate } from '../models/BillTemplate';

// Default Showroom Bill Template
export const defaultBillTemplate = {
  templateName: 'Showroom GST Tax Invoice',
  templateType: 'Showroom' as const,
  description: 'Official showroom retail tax invoice for EV batteries and components',
  isActive: true,
  company: {
    name: 'Ekosmart Battery Solution (EBS)',
    subtitle: 'High Power Lithium-Ion & LFP Technologies',
    logoType: 'preset' as const,
    logoUrl: '',
    address: 'Rang Talab, Near by Star Kids School',
    city: 'Kota',
    state: 'Rajasthan',
    pincode: '324002',
    phone: '+91 8949049003',
    alternatePhone: '+91 9549730483',
    email: 'support@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    cin: 'REG-RJ-2026-EBS',
    showroomName: 'Kota Central Showroom Counter',
    showroomAddress: 'Rang Talab, Kota, Rajasthan - 324002',
  },
  customerFields: [
    { key: 'customerName', label: 'Customer Name', visible: true, required: true, order: 1 },
    { key: 'customerMobile', label: 'Mobile Number', visible: true, required: true, order: 2 },
    { key: 'customerEmail', label: 'Email Address', visible: true, required: false, order: 3 },
    { key: 'customerAddress', label: 'Billing Address', visible: true, required: false, order: 4 },
    { key: 'city', label: 'City', visible: true, required: false, order: 5 },
    { key: 'state', label: 'State', visible: true, required: false, order: 6 },
  ],
  invoiceFields: [
    { key: 'invoiceNumber', label: 'Invoice No', visible: true, required: true, order: 1 },
    { key: 'createdAt', label: 'Invoice Date', visible: true, required: true, order: 2 },
    { key: 'paymentMode', label: 'Payment Mode', visible: true, required: true, order: 3 },
    { key: 'paymentStatus', label: 'Payment Status', visible: true, required: true, order: 4 },
    { key: 'showroom', label: 'Showroom / Counter', visible: true, required: false, order: 5 },
    { key: 'employeeName', label: 'Billed By', visible: true, required: false, order: 6 },
  ],
  productColumns: [
    { key: 'index', label: '#', visible: true, width: '5%', align: 'center' as const, order: 1 },
    { key: 'productName', label: 'Product / Battery Description', visible: true, width: '32%', align: 'left' as const, order: 2 },
    { key: 'category', label: 'Category', visible: true, width: '12%', align: 'left' as const, order: 3 },
    { key: 'serialNumber', label: 'Serial / Battery #', visible: true, width: '15%', align: 'left' as const, order: 4 },
    { key: 'quantity', label: 'Qty', visible: true, width: '8%', align: 'center' as const, order: 5 },
    { key: 'unitPrice', label: 'Rate (₹)', visible: true, width: '10%', align: 'right' as const, order: 6 },
    { key: 'discount', label: 'Discount', visible: true, width: '8%', align: 'right' as const, order: 7 },
    { key: 'taxRate', label: 'GST %', visible: true, width: '8%', align: 'center' as const, order: 8 },
    { key: 'totalAmount', label: 'Amount (₹)', visible: true, width: '12%', align: 'right' as const, order: 9 },
  ],
  warrantyConfig: {
    visible: true,
    title: 'Official EBS Warranty Certificate Included',
    badgeText: 'VERIFIED OFFICIAL WARRANTY',
    showWarrantyNumber: true,
    showStartDate: true,
    showExpiryDate: true,
    showSerialNumber: true,
    termsSummary: 'Guaranteed battery capacity and free technical service support across all authorized service centers.',
  },
  totalsConfig: {
    showSubtotal: true,
    showDiscount: true,
    showTaxBreakup: true,
    showOtherCharges: false,
    showGrandTotal: true,
    showAmountPaid: true,
    showBalance: true,
    showAmountInWords: true,
    currencySymbol: '₹',
  },
  footer: {
    termsAndConditions: '1. Goods once sold are covered under Ekosmart official replacement/repair warranty policy.\n2. Warranty seal must remain intact.\n3. Pan-India technical service assistance available on official helpline.',
    warrantyPolicy: '3 Years Warranty on 48V LFP Packs; 1.5 Years on 60V/72V Packs; 1 Year on Lithium Fast Chargers.',
    returnPolicy: 'Defective verified units will be repaired or replaced by authorized service engineers within standard SLA.',
    supportHelpline: 'Helpline: +91 8949049003 / +91 9549730483 | support@ekosmartdrive.in',
    thankYouMessage: 'Thank you for choosing Ekosmart High Power Lithium Technologies!',
    authorizedSignatoryTitle: 'Authorized Signatory (Kota Central Plant)',
    showAuthorizedSignature: true,
    showCustomerSignature: true,
    showBarcode: true,
    showQrCode: true,
  },
  theme: {
    primaryColor: '#059669',
    accentColor: '#047857',
    fontPreset: 'sans' as const,
    borderStyle: 'solid' as const,
    headerStyle: 'modern' as const,
  },
};

// Generate unique invoice number
const generateInvoiceNumber = async (prefix = 'EBS-INV'): Promise<string> => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await Bill.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });
  const seq = (countToday + 1).toString().padStart(4, '0');
  const candidate = `${prefix}-${dateStr}-${seq}`;
  const existing = await Bill.findOne({ invoiceNumber: candidate });
  if (existing) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${dateStr}-${seq}-${randomSuffix}`;
  }
  return candidate;
};

// ==============================================================================
// 1. BILL TEMPLATE CONTROLLERS
// ==============================================================================

// GET /api/v1/billing/template - Get active bill template
export const getActiveBillTemplate = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const query: any = { isActive: true };
    if (type) {
      query.templateType = type;
    }

    let template = await BillTemplate.findOne(query);
    if (!template) {
      template = await BillTemplate.findOne({ isActive: true });
    }
    if (!template) {
      template = await BillTemplate.findOne();
    }

    if (!template) {
      // Return built-in default template
      return res.json({
        success: true,
        data: defaultBillTemplate,
        isDefault: true,
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    console.error('Failed to get active bill template:', error);
    res.json({
      success: true,
      data: defaultBillTemplate,
      isDefault: true,
    });
  }
};

// GET /api/v1/billing/templates - List all templates (Admin)
export const getAllBillTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await BillTemplate.find().sort({ isActive: -1, updatedAt: -1 });
    if (templates.length === 0) {
      // Seed default template if none exist
      const created = await BillTemplate.create(defaultBillTemplate);
      return res.json({ success: true, data: [created] });
    }
    res.json({ success: true, data: templates });
  } catch (error: any) {
    console.error('Failed to get bill templates:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve templates', error: error.message });
  }
};

// GET /api/v1/billing/templates/:id - Get template by ID
export const getBillTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await BillTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Bill template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch template', error: error.message });
  }
};

// POST /api/v1/billing/templates - Create new bill template (Admin)
export const createBillTemplate = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.templateName) {
      return res.status(400).json({ success: false, message: 'Template name is required' });
    }

    // If marked as active, deactivate other templates of same type
    if (payload.isActive) {
      await BillTemplate.updateMany(
        { templateType: payload.templateType || 'Showroom' },
        { $set: { isActive: false } }
      );
    }

    const newTemplate = await BillTemplate.create({
      ...defaultBillTemplate,
      ...payload,
    });

    res.status(201).json({
      success: true,
      message: 'Bill template created successfully',
      data: newTemplate,
    });
  } catch (error: any) {
    console.error('Failed to create bill template:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create template' });
  }
};

// PUT /api/v1/billing/templates/:id - Update bill template (Admin)
export const updateBillTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (payload.isActive) {
      const existing = await BillTemplate.findById(id);
      if (existing) {
        await BillTemplate.updateMany(
          { templateType: existing.templateType, _id: { $ne: id } },
          { $set: { isActive: false } }
        );
      }
    }

    const updated = await BillTemplate.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Bill template not found' });
    }

    res.json({
      success: true,
      message: 'Bill template updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Failed to update bill template:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update template' });
  }
};

// PATCH /api/v1/billing/templates/:id/activate - Activate template
export const activateBillTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await BillTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    await BillTemplate.updateMany(
      { templateType: template.templateType },
      { $set: { isActive: false } }
    );

    template.isActive = true;
    await template.save();

    res.json({
      success: true,
      message: `Template "${template.templateName}" set as active`,
      data: template,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to activate template', error: error.message });
  }
};

// DELETE /api/v1/billing/templates/:id - Delete template
export const deleteBillTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await BillTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const count = await BillTemplate.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only remaining template' });
    }

    await BillTemplate.findByIdAndDelete(id);

    // If deleted template was active, activate another
    if (template.isActive) {
      const next = await BillTemplate.findOne();
      if (next) {
        next.isActive = true;
        await next.save();
      }
    }

    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete template', error: error.message });
  }
};

// ==============================================================================
// 2. INVOICE & BILL GENERATION CONTROLLERS
// ==============================================================================

// GET /api/v1/billing - List bills
export const getAllBills = async (req: Request, res: Response) => {
  try {
    const { search, paymentStatus, showroom, page, limit } = req.query;
    const query: any = {};

    if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;
    if (showroom && showroom !== 'All') query.showroom = showroom;

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { invoiceNumber: { $regex: s, $options: 'i' } },
        { customerName: { $regex: s, $options: 'i' } },
        { customerMobile: { $regex: s, $options: 'i' } },
      ];
    }

    const max = Math.min(200, Number(limit) || 100);
    const bills = await Bill.find(query).sort({ createdAt: -1 }).limit(max);

    const totalRevenue = bills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);

    res.json({
      success: true,
      data: bills,
      meta: {
        totalRecords: bills.length,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Failed to get bills:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bills', error: error.message });
  }
};

// GET /api/v1/billing/:id - Get bill details
export const getBillById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || '');
    let bill = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      bill = await Bill.findById(id).populate('customer');
    }
    if (!bill) {
      bill = await Bill.findOne({ invoiceNumber: id }).populate('customer');
    }

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: bill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve invoice', error: error.message });
  }
};

// POST /api/v1/billing - Create new invoice
export const createBill = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerMobile,
      customerEmail,
      customerAddress,
      city,
      state,
      items,
      paymentMode,
      paymentStatus,
      showroom,
      notes,
    } = req.body;

    if (!customerName || !customerMobile) {
      return res.status(400).json({ success: false, message: 'Customer Name and Mobile are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invoice must contain at least one line item.' });
    }

    // 1. Find or create Customer
    let customer = await Customer.findOne({ mobile: customerMobile.trim() });
    if (!customer) {
      const count = await Customer.countDocuments();
      const customerId = `CUST-${(count + 1).toString().padStart(5, '0')}`;
      customer = await Customer.create({
        customerId,
        name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail ? customerEmail.trim() : '',
        address: customerAddress ? customerAddress.trim() : '',
        city: city || 'Kota',
        state: state || 'Rajasthan',
        customerType: 'Showroom',
        source: 'Showroom Billing Counter',
      });
    } else {
      if (customerAddress && !customer.address) customer.address = customerAddress.trim();
      if (customerEmail && !customer.email) customer.email = customerEmail.trim();
      await customer.save();
    }

    // 2. Fetch soft-coded invoice prefix from active template or CMS
    let invoicePrefix = 'EBS-INV';
    try {
      const activeTemplate = await BillTemplate.findOne({ isActive: true });
      if (activeTemplate?.company?.name) {
        // Can derive prefix or use CMS billingConfig
      }
      const cmsContent = await Content.findOne({ key: 'global_cms' });
      if (cmsContent?.billingConfig?.invoicePrefix) {
        invoicePrefix = cmsContent.billingConfig.invoicePrefix;
      }
    } catch {
      // fallback
    }

    const invoiceNumber = await generateInvoiceNumber(invoicePrefix);

    // 3. Process line items and compute totals
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    const processedItems = items.map((item: any) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const taxRate = Number(item.taxRate) !== undefined ? Number(item.taxRate) : 18;

      const lineGross = qty * unitPrice - discount;
      const lineTax = (lineGross * taxRate) / 100;
      const lineTotal = lineGross + lineTax;

      subtotal += qty * unitPrice;
      discountTotal += discount;
      taxTotal += lineTax;
      grandTotal += lineTotal;

      return {
        productId: item.productId || `PRD-${Date.now().toString().slice(-4)}`,
        productName: item.productName || 'EV Battery / Accessory',
        category: item.category || 'Battery',
        productSerial: (item.productSerial || item.serialNumber || '').trim(),
        batterySerial: (item.batterySerial || item.batterySerialNumber || '').trim(),
        quantity: qty,
        unitPrice,
        discount,
        taxRate,
        taxAmount: Math.round(lineTax * 100) / 100,
        totalAmount: Math.round(lineTotal * 100) / 100,
        warrantyPeriodMonths: Number(item.warrantyPeriodMonths) !== undefined ? Number(item.warrantyPeriodMonths) : 36,
      };
    });

    const employeeUser = (req as any).user;
    const employeeId = employeeUser?.employeeId || employeeUser?.id || '';
    const employeeName = employeeUser?.name || 'Authorized Billing Staff';

    // 4. Stock deduction & movements
    for (const item of processedItems) {
      let stock = null;
      if (item.productSerial) {
        stock = await Stock.findOne({ serialNumber: item.productSerial });
      }
      if (!stock && item.batterySerial) {
        stock = await Stock.findOne({ batterySerialNumber: item.batterySerial });
      }
      if (!stock && item.productId) {
        stock = await Stock.findOne({ productId: item.productId });
      }

      if (stock) {
        stock.quantity = Math.max(0, stock.quantity - item.quantity);
        stock.totalSold = (stock.totalSold || 0) + item.quantity;
        if (stock.quantity === 0) {
          stock.status = 'Sold';
        }
        stock.history.unshift({
          operation: 'Sold',
          quantity: item.quantity,
          referenceNumber: invoiceNumber,
          employeeName,
          employeeId,
          notes: `Billed to ${customerName} (${customerMobile})`,
          date: new Date(),
        });
        await stock.save();

        await StockMovement.create({
          movementType: 'Sold',
          productId: stock.productId,
          productName: stock.productName,
          category: stock.category,
          serialNumber: item.productSerial || stock.serialNumber,
          batterySerialNumber: item.batterySerial || stock.batterySerialNumber,
          quantity: item.quantity,
          sourceLocation: stock.location || showroom || 'Showroom Store',
          destinationLocation: `Customer: ${customerName}`,
          performedBy: {
            employeeId,
            name: employeeName,
            role: employeeUser?.role || 'Staff',
          },
          referenceType: 'Bill',
          referenceId: invoiceNumber,
          notes: `Showroom Bill created`,
        }).catch(() => {});
      }
    }

    // 5. Automatic Warranty Generation for serialized/warrantied items
    const warrantyIds: string[] = [];
    const purchaseDate = new Date();

    for (const item of processedItems) {
      if (item.warrantyPeriodMonths > 0) {
        const warrantyPrefix = item.category === 'Battery' ? 'WRN-BAT' : 'WRN-EV';
        const serialTag = item.batterySerial || item.productSerial || Date.now().toString().slice(-6);
        const warrantyNumber = `${warrantyPrefix}-${Date.now().toString().slice(-4)}-${serialTag.slice(-4)}`;

        const startDate = new Date(purchaseDate);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + item.warrantyPeriodMonths);

        try {
          const warranty = await Warranty.create({
            warrantyNumber,
            category: item.category === 'Battery' ? 'Showroom' : 'Plant',
            customer: customer._id,
            product: item.productName,
            serialNumber: item.batterySerial || item.productSerial || `AUTO-${invoiceNumber}`,
            billNumber: invoiceNumber,
            purchaseDate,
            warrantyStartDate: startDate,
            warrantyExpiryDate: expiryDate,
            status: 'Active',
            formData: {
              invoiceNumber,
              showroom: showroom || 'Main Showroom',
              unitPrice: item.unitPrice,
              warrantyMonths: item.warrantyPeriodMonths,
            },
            registeredBy: {
              employeeId,
              name: employeeName,
              role: employeeUser?.role || 'Staff',
            },
          });
          warrantyIds.push(warranty.warrantyNumber);
        } catch (err: any) {
          console.warn('Auto-warranty creation notice:', err.message);
        }
      }
    }

    // 6. Create and Save Bill
    const newBill = await Bill.create({
      invoiceNumber,
      customer: customer._id,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : '',
      customerAddress: customerAddress ? customerAddress.trim() : '',
      items: processedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(discountTotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      paymentMode: paymentMode || 'UPI',
      paymentStatus: paymentStatus || 'Paid',
      showroom: showroom || 'Kota Showroom Counter',
      employeeId,
      employeeName,
      notes: notes || '',
      warrantyGenerated: warrantyIds.length > 0,
      warrantyIds,
    });

    res.status(201).json({
      success: true,
      message: 'Showroom Bill and Invoices generated successfully.',
      data: newBill,
      warrantiesGenerated: warrantyIds,
    });
  } catch (error: any) {
    console.error('Failed to create bill:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate showroom bill' });
  }
};

// DELETE /api/v1/billing/:id - Delete bill (admin only)
export const deleteBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndDelete(id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete invoice', error: error.message });
  }
};
