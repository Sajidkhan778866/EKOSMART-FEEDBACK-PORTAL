import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Stock, IStock } from '../models/Stock';
import { StockMovement } from '../models/StockMovement';
import { StockConfig } from '../models/StockConfig';
import { applyDateFilterToQuery } from '../utils/dateRange';

// GET /api/v1/stock/config - Get soft-coded stock configuration
export const getStockConfig = async (req: Request, res: Response) => {
  try {
    let config = await StockConfig.findOne({ key: 'global_stock_config' });
    if (!config) {
      config = await StockConfig.create({ key: 'global_stock_config' });
    }
    res.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Failed to fetch stock config:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stock configuration', error: error.message });
  }
};

// PUT /api/v1/stock/config - Update soft-coded stock configuration
export const updateStockConfig = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    let config = await StockConfig.findOneAndUpdate(
      { key: 'global_stock_config' },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, message: 'Stock configuration updated successfully', data: config });
  } catch (error: any) {
    console.error('Failed to update stock config:', error);
    res.status(500).json({ success: false, message: 'Failed to update stock configuration', error: error.message });
  }
};

// GET /api/v1/stock - List stock with filters and date range
export const getAllStock = async (req: Request, res: Response) => {
  try {
    const { category, location, status, search, dateFilter, startDate, endDate, limit, page } = req.query;
    const query: any = {};

    if (category && category !== 'All') query.category = category;
    if (location && location !== 'All') query.location = location;
    if (status && status !== 'All') query.status = status;

    // Apply standard date filter on createdAt / updatedAt
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const searchStr = (search as string).trim();
      query.$or = [
        { productName: { $regex: searchStr, $options: 'i' } },
        { productId: { $regex: searchStr, $options: 'i' } },
        { modelNumber: { $regex: searchStr, $options: 'i' } },
        { serialNumber: { $regex: searchStr, $options: 'i' } },
        { batterySerialNumber: { $regex: searchStr, $options: 'i' } },
      ];
    }

    const items = await Stock.find(query).sort({ updatedAt: -1, createdAt: -1 });

    // Summary statistics
    const totalQuantity = items.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const inStockCount = items.filter((i) => i.status === 'In Stock').length;
    const soldCount = items.filter((i) => i.status === 'Sold').length;
    const reservedCount = items.filter((i) => i.status === 'Reserved').length;
    const totalValuation = items.reduce((acc, curr) => acc + ((curr.quantity || 0) * (curr.unitPrice || 0)), 0);

    res.json({
      success: true,
      data: items,
      meta: {
        totalRecords: items.length,
        totalQuantity,
        inStockCount,
        soldCount,
        reservedCount,
        totalValuation,
      },
    });
  } catch (error: any) {
    console.error('Failed to get stock:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stock list', error: error.message });
  }
};

// GET /api/v1/stock/:id - Get stock details
export const getStockById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || '');
    let stock = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      stock = await Stock.findById(id);
    }
    if (!stock) {
      stock = await Stock.findOne({ $or: [{ productId: id }, { serialNumber: id }, { batterySerialNumber: id }] });
    }

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found' });
    }

    res.json({ success: true, data: stock });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stock item', error: error.message });
  }
};

// GET /api/v1/stock/serial/:serial - Scanner lookup
export const getStockBySerial = async (req: Request, res: Response) => {
  try {
    const serial = String(req.params.serial || '').trim();
    if (!serial) {
      return res.status(400).json({ success: false, message: 'Serial number is required' });
    }

    const escaped = serial.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stock = await Stock.findOne({
      $or: [
        { serialNumber: { $regex: `^${escaped}$`, $options: 'i' } },
        { batterySerialNumber: { $regex: `^${escaped}$`, $options: 'i' } },
        { productId: { $regex: `^${escaped}$`, $options: 'i' } },
      ],
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: `No active stock item matched serial: "${serial}". You can manually register or proceed.`,
      });
    }

    res.json({
      success: true,
      data: stock,
      message: 'Serial verified and matched with current inventory.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to verify serial number', error: error.message });
  }
};

// POST /api/v1/stock - Create new stock entry
export const createStock = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      productName,
      category,
      modelNumber,
      serialNumber,
      batterySerialNumber,
      quantity,
      unitPrice,
      mrp,
      location,
      status,
      specifications,
      attributes,
      customFields,
      purchaseInfo,
      warrantyInfo,
      warrantyPeriodMonths,
      notes,
    } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ success: false, message: 'Product Name and Category are required.' });
    }

    // Auto-generate productId if not provided
    const pid =
      (productId || '').trim() ||
      `PRD-${category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Check unique serial if serialized
    const cleanSerial = (serialNumber || '').trim();
    const cleanBatSerial = (batterySerialNumber || '').trim();

    if (cleanSerial) {
      const existing = await Stock.findOne({ serialNumber: cleanSerial });
      if (existing) {
        return res.status(400).json({ success: false, message: `Product serial number "${cleanSerial}" already exists.` });
      }
    }

    if (cleanBatSerial) {
      const existing = await Stock.findOne({ batterySerialNumber: cleanBatSerial });
      if (existing) {
        return res.status(400).json({ success: false, message: `Battery serial number "${cleanBatSerial}" already exists.` });
      }
    }

    const qty = Number(quantity) || 1;
    const employeeUser = (req as any).user;

    const initialHistory = {
      operation: 'Received' as const,
      quantity: qty,
      referenceNumber: `REC-${Date.now().toString().slice(-6)}`,
      employeeName: employeeUser?.name || 'Admin',
      employeeId: employeeUser?.employeeId || employeeUser?.id || '',
      notes: notes || 'Initial stock received into inventory',
      date: new Date(),
    };

    const newStock = await Stock.create({
      productId: pid,
      productName: productName.trim(),
      category,
      modelNumber: modelNumber ? modelNumber.trim() : '',
      serialNumber: cleanSerial,
      batterySerialNumber: cleanBatSerial,
      quantity: qty,
      availableQuantity: qty,
      totalReceived: qty,
      totalSold: 0,
      reservedQuantity: 0,
      unitPrice: Number(unitPrice) || 0,
      mrp: Number(mrp) || Number(unitPrice) || 0,
      location: location || 'Kota Central Plant Store',
      status: status || 'In Stock',
      specifications: specifications || {},
      attributes: attributes || {},
      customFields: customFields || {},
      purchaseInfo: purchaseInfo || {},
      warrantyPeriodMonths: Number(warrantyPeriodMonths) || (category === 'Battery' ? 36 : 12),
      warrantyInfo: warrantyInfo || { warrantyPeriodMonths: Number(warrantyPeriodMonths) || (category === 'Battery' ? 36 : 12) },
      history: [initialHistory],
    });

    // Record audit movement
    await StockMovement.create({
      movementType: 'Received',
      productId: newStock.productId,
      productName: newStock.productName,
      category: newStock.category,
      serialNumber: newStock.serialNumber,
      batterySerialNumber: newStock.batterySerialNumber,
      quantity: qty,
      sourceLocation: 'Supplier / Factory Production',
      destinationLocation: newStock.location,
      performedBy: {
        employeeId: employeeUser?.employeeId || employeeUser?.id,
        name: employeeUser?.name || 'Staff Member',
        role: employeeUser?.role || 'Admin',
      },
      referenceType: 'Manual',
      referenceId: initialHistory.referenceNumber,
      notes: notes || 'Stock received into inventory',
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Stock item added successfully',
      data: newStock,
    });
  } catch (error: any) {
    console.error('Failed to create stock:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create stock item' });
  }
};

// PUT /api/v1/stock/:id - Update stock
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.history; // Protect history from raw overwrite

    const stock = await Stock.findByIdAndUpdate(id, updates, { new: true });
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found' });
    }

    res.json({ success: true, message: 'Stock updated successfully', data: stock });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update stock', error: error.message });
  }
};

// POST /api/v1/stock/movement - Record stock operation (Issue, Sell, Return, Transfer, Adjust)
export const recordStockMovement = async (req: Request, res: Response) => {
  try {
    const {
      stockId,
      movementType, // 'Received' | 'Sold' | 'Issued' | 'Returned' | 'Transferred' | 'Adjustment'
      quantity,
      sourceLocation,
      destinationLocation,
      referenceType,
      referenceId,
      notes,
    } = req.body;

    if (!stockId || !movementType || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock ID, Operation Type, and Quantity are required.',
      });
    }

    const qty = Math.max(1, Number(quantity));
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    // Validation for operations that reduce stock
    if (['Sold', 'Issued', 'Transferred'].includes(movementType)) {
      if (stock.quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${stock.quantity}, Requested: ${qty}`,
        });
      }
      stock.quantity -= qty;
      if (movementType === 'Sold') {
        stock.totalSold += qty;
        if (stock.quantity === 0) stock.status = 'Sold';
      }
      if (movementType === 'Transferred' && destinationLocation) {
        stock.location = destinationLocation;
      }
    } else if (movementType === 'Received' || movementType === 'Returned') {
      stock.quantity += qty;
      stock.status = 'In Stock';
      if (movementType === 'Received') stock.totalReceived += qty;
    } else if (movementType === 'Adjustment') {
      stock.quantity = qty;
      stock.status = stock.quantity > 0 ? 'In Stock' : 'Sold';
    }

    const employeeUser = (req as any).user;
    const historyEntry = {
      operation: movementType,
      quantity: qty,
      referenceNumber: referenceId || `MOV-${Date.now().toString().slice(-6)}`,
      employeeName: employeeUser?.name || 'Authorized Staff',
      employeeId: employeeUser?.employeeId || employeeUser?.id || '',
      notes: notes || `Stock ${movementType.toLowerCase()} operation`,
      date: new Date(),
    };

    stock.history.unshift(historyEntry);
    await stock.save();

    // Create Audit Movement Record
    const movement = await StockMovement.create({
      movementType,
      productId: stock.productId,
      productName: stock.productName,
      category: stock.category,
      serialNumber: stock.serialNumber,
      batterySerialNumber: stock.batterySerialNumber,
      quantity: qty,
      sourceLocation: sourceLocation || stock.location,
      destinationLocation: destinationLocation || stock.location,
      performedBy: {
        employeeId: employeeUser?.employeeId || employeeUser?.id,
        name: employeeUser?.name || 'Staff Member',
        role: employeeUser?.role || 'Staff',
      },
      referenceType: referenceType || 'Manual',
      referenceId: historyEntry.referenceNumber,
      notes: notes || '',
    });

    res.json({
      success: true,
      message: `Stock ${movementType} recorded successfully.`,
      data: { stock, movement },
    });
  } catch (error: any) {
    console.error('Failed to record stock movement:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to record stock movement' });
  }
};

// GET /api/v1/stock/movements/audit - List audit movements
export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const { movementType, productId, dateFilter, startDate, endDate, limit } = req.query;
    const query: any = {};
    if (movementType && movementType !== 'All') query.movementType = movementType;
    if (productId) query.productId = productId;

    // Apply date range filter
    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    const max = Math.min(200, Number(limit) || 100);
    const movements = await StockMovement.find(query).sort({ createdAt: -1 }).limit(max);

    res.json({ success: true, data: movements, count: movements.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch stock movements', error: error.message });
  }
};

// DELETE /api/v1/stock/:id - Delete stock
export const deleteStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByIdAndDelete(id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock item not found' });
    }
    res.json({ success: true, message: 'Stock item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete stock item', error: error.message });
  }
};

// GET /api/v1/stock/export/csv - Export stock inventory to CSV / Excel
export const exportStock = async (req: Request, res: Response) => {
  try {
    const { search, category, location, status, dateFilter, startDate, endDate } = req.query;
    const query: any = {};

    if (category && category !== 'All') query.category = category;
    if (location && location !== 'All') query.location = location;
    if (status && status !== 'All') query.status = status;

    applyDateFilterToQuery(query, 'createdAt', dateFilter as string, startDate as string, endDate as string);

    if (search) {
      const s = (search as string).trim();
      query.$or = [
        { productId: { $regex: s, $options: 'i' } },
        { productName: { $regex: s, $options: 'i' } },
        { serialNumber: { $regex: s, $options: 'i' } },
        { batterySerialNumber: { $regex: s, $options: 'i' } },
      ];
    }

    const items = await Stock.find(query).sort({ createdAt: -1 });

    const headers = [
      'Product ID',
      'Product Name',
      'Category',
      'Unit Serial Number',
      'Battery Serial Number',
      'Available Qty',
      'Total Received',
      'Total Sold',
      'Unit Price (INR)',
      'Total Valuation (INR)',
      'Location',
      'Status',
      'Warranty Months',
      'Date Registered',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = items.map((item: any) => {
      const price = Number(item.unitPrice || item.price || 0);
      const qty = Number(item.quantity || 0);
      const val = price * qty;

      return [
        escapeCsv(item.productId || ''),
        escapeCsv(item.productName || ''),
        escapeCsv(item.category || ''),
        escapeCsv(item.serialNumber || ''),
        escapeCsv(item.batterySerialNumber || ''),
        escapeCsv(qty),
        escapeCsv(item.totalReceived || qty),
        escapeCsv(item.totalSold || 0),
        escapeCsv(price),
        escapeCsv(val),
        escapeCsv(item.location || ''),
        escapeCsv(item.status || 'In Stock'),
        escapeCsv(item.warrantyPeriodMonths || 36),
        escapeCsv(item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : ''),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const filename = `Ekosmart_Stock_Inventory_Export_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Failed to export stock inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to export stock inventory' });
  }
};
