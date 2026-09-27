import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Bill } from '../models/Bill';
import { Customer } from '../models/Customer';
import { Stock } from '../models/Stock';
import { StockMovement } from '../models/StockMovement';
import { Warranty } from '../models/Warranty';
import { Content } from '../models/Content';

// Generate unique invoice number
const generateInvoiceNumber = async (prefix = 'EKO-INV'): Promise<string> => {
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
      // Update customer address/email if provided
      if (customerAddress && !customer.address) customer.address = customerAddress.trim();
      if (customerEmail && !customer.email) customer.email = customerEmail.trim();
      await customer.save();
    }

    // 2. Fetch soft-coded invoice prefix if configured
    let invoicePrefix = 'EKO-INV';
    try {
      const cmsContent = await Content.findOne({ key: 'global_cms' });
      if (cmsContent?.billingConfig?.invoicePrefix) {
        invoicePrefix = cmsContent.billingConfig.invoicePrefix;
      }
    } catch {
      // fallback to default
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
        warrantyPeriodMonths: Number(item.warrantyPeriodMonths) || 36,
      };
    });

    const employeeUser = (req as any).user;
    const employeeId = employeeUser?.employeeId || employeeUser?.id || '';
    const employeeName = employeeUser?.name || 'Authorized Billing Staff';

    // 4. Stock deduction & movements
    for (const item of processedItems) {
      // Look up stock by serial, batterySerial, or productId
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
        const deductQty = Math.min(stock.quantity, item.quantity);
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

        // Record stock movement
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
            category: item.category,
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
