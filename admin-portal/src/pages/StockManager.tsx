import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ArrowUpRight,
  History,
  AlertTriangle,
  CheckCircle2,
  X,
  Battery,
  Tag,
  MapPin,
  Barcode,
  Camera,
  Sliders,
  Download,
} from 'lucide-react';
import { stockApi } from '../api/client';
import ScannerModal from '../components/ScannerModal';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

export interface IStockCustomField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean' | 'textarea';
  required: boolean;
  visible: boolean;
  order: number;
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

export interface IStockTableColumn {
  key: string;
  label: string;
  visible: boolean;
  order: number;
  widthPercent?: number;
}

export interface IStockConfig {
  key: string;
  categories: string[];
  statuses: string[];
  locations: string[];
  movementTypes: string[];
  customFields: IStockCustomField[];
  tableColumns: IStockTableColumn[];
}

export interface IStockItem {
  _id: string;
  productId: string;
  productName: string;
  category: string;
  modelNumber?: string;
  serialNumber?: string;
  batterySerialNumber?: string;
  quantity: number;
  availableQuantity?: number;
  soldQuantity?: number;
  reservedQuantity?: number;
  totalReceived: number;
  totalSold: number;
  unitPrice: number;
  mrp: number;
  location: string;
  status: string;
  specifications?: Record<string, any>;
  attributes?: Record<string, any>;
  customFields?: Record<string, any>;
  warrantyPeriodMonths: number;
  history?: Array<{
    operation: string;
    quantity: number;
    referenceNumber?: string;
    employeeName?: string;
    notes?: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_CONFIG: IStockConfig = {
  key: 'global_stock_config',
  categories: [
    'Battery',
    'Spare Parts',
    'Scooter',
    'Charger',
    'BMS & Harness',
    'Motor & Controller',
    'Accessory',
    'Raw Material',
  ],
  statuses: ['In Stock', 'Sold', 'Reserved', 'Under Service', 'Defective', 'In Transit'],
  locations: [
    'Kota Central Plant Store',
    'Main Showroom Counter',
    'Rental Dispatch Hub',
    'Service Center Desk',
    'Warehouse A (Kota)',
  ],
  movementTypes: ['Received', 'Sold', 'Issued', 'Returned', 'Transferred', 'Adjustment'],
  customFields: [
    { key: 'voltage', label: 'Battery Voltage (V)', type: 'text', required: false, visible: true, order: 1, placeholder: 'e.g. 48V / 60V / 72V' },
    { key: 'capacity', label: 'Capacity (Ah)', type: 'text', required: false, visible: true, order: 2, placeholder: 'e.g. 28Ah / 30Ah' },
    { key: 'chemistry', label: 'Cell Chemistry', type: 'select', required: false, visible: true, order: 3, options: ['LFP', 'NMC', 'Lead Acid', 'Other'] },
    { key: 'batchNumber', label: 'Manufacturing Batch #', type: 'text', required: false, visible: true, order: 4, placeholder: 'BATCH-2026' },
  ],
  tableColumns: [
    { key: 'productId', label: 'Product ID', visible: true, order: 1 },
    { key: 'productName', label: 'Description', visible: true, order: 2 },
    { key: 'category', label: 'Category', visible: true, order: 3 },
    { key: 'serialNumber', label: 'Serial # / Battery #', visible: true, order: 4 },
    { key: 'quantity', label: 'Qty', visible: true, order: 5 },
    { key: 'unitPrice', label: 'Rate (₹)', visible: true, order: 6 },
    { key: 'location', label: 'Location', visible: true, order: 7 },
    { key: 'status', label: 'Status', visible: true, order: 8 },
  ],
};

const StockManager = () => {
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });
  const [stockList, setStockList] = useState<IStockItem[]>([]);
  const [config, setConfig] = useState<IStockConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [meta, setMeta] = useState({ totalRecords: 0, totalQuantity: 0, inStockCount: 0, soldCount: 0, totalValuation: 0 });

  // Scanner State
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'search' | 'add_serial' | 'add_battery' | 'edit_serial' | 'edit_battery'>('search');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<IStockItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    productId: '',
    productName: '',
    category: 'Battery',
    modelNumber: '',
    serialNumber: '',
    batterySerialNumber: '',
    quantity: 1,
    unitPrice: 0,
    mrp: 0,
    location: 'Kota Central Plant Store',
    status: 'In Stock',
    warrantyPeriodMonths: 36,
    customFields: {},
    notes: '',
  });

  // Movement Form State
  const [movementData, setMovementData] = useState({
    movementType: 'Received',
    quantity: 1,
    sourceLocation: '',
    destinationLocation: '',
    notes: '',
  });

  // Soft-coded Schema Config Editor State
  const [editingConfig, setEditingConfig] = useState<IStockConfig>(DEFAULT_CONFIG);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState('');
  const [newLocationInput, setNewLocationInput] = useState('');
  const [newCustomField, setNewCustomField] = useState<IStockCustomField>({
    key: '',
    label: '',
    type: 'text',
    required: false,
    visible: true,
    order: 1,
    placeholder: '',
    options: [],
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStockConfig();
  }, []);

  useEffect(() => {
    fetchStock();
  }, [categoryFilter, locationFilter, statusFilter, dateRange]);

  const fetchStockConfig = async () => {
    try {
      const res = await stockApi.getConfig();
      if (res.data?.success && res.data.data) {
        setConfig(res.data.data);
        setEditingConfig(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load stock config, using defaults:', err);
    }
  };

  const fetchStock = async (overrideSearch?: string) => {
    try {
      setLoading(true);
      const querySearch = typeof overrideSearch === 'string' ? overrideSearch : search;
      const res = await stockApi.getAll({
        search: querySearch.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        location: locationFilter !== 'All' ? locationFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.data?.success) {
        setStockList(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportStock = async () => {
    try {
      setExporting(true);
      const res = await stockApi.export({
        search: search.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        location: locationFilter !== 'All' ? locationFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart-stock-inventory-${dateRange.filter.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showAlert('success', 'Stock inventory exported to Excel/CSV successfully');
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to export inventory');
    } finally {
      setExporting(false);
    }
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const openScannerFor = (target: 'search' | 'add_serial' | 'add_battery' | 'edit_serial' | 'edit_battery') => {
    setScannerTarget(target);
    setShowScanner(true);
  };

  const handleScanSuccess = (scannedText: string) => {
    const clean = scannedText.trim();
    if (!clean) return;

    if (scannerTarget === 'search') {
      setSearch(clean);
      fetchStock(clean);
      showAlert('success', `Scanned & Filtered: ${clean}`);
    } else if (scannerTarget === 'add_serial' || scannerTarget === 'edit_serial') {
      setFormData((prev: any) => ({ ...prev, serialNumber: clean }));
      showAlert('success', `Product Serial Scanned: ${clean}`);
    } else if (scannerTarget === 'add_battery' || scannerTarget === 'edit_battery') {
      setFormData((prev: any) => ({ ...prev, batterySerialNumber: clean }));
      showAlert('success', `Battery Pack Serial Scanned: ${clean}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStock();
  };

  const openAddModal = () => {
    const defaultLocation = config.locations[0] || 'Kota Central Plant Store';
    const defaultCategory = config.categories[0] || 'Battery';
    setFormData({
      productId: '',
      productName: '',
      category: defaultCategory,
      modelNumber: '',
      serialNumber: '',
      batterySerialNumber: '',
      quantity: 1,
      unitPrice: 25000,
      mrp: 28000,
      location: defaultLocation,
      status: 'In Stock',
      warrantyPeriodMonths: 36,
      customFields: {},
      notes: '',
    });
    setShowAddModal(true);
  };

  const openEditModal = (item: IStockItem) => {
    setSelectedStock(item);
    setFormData({
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      modelNumber: item.modelNumber || '',
      serialNumber: item.serialNumber || '',
      batterySerialNumber: item.batterySerialNumber || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      mrp: item.mrp,
      location: item.location,
      status: item.status,
      warrantyPeriodMonths: item.warrantyPeriodMonths,
      customFields: item.customFields || {},
      notes: '',
    });
    setShowEditModal(true);
  };

  const openMovementModal = (item: IStockItem) => {
    setSelectedStock(item);
    setMovementData({
      movementType: config.movementTypes[0] || 'Received',
      quantity: 1,
      sourceLocation: item.location,
      destinationLocation: item.location,
      notes: '',
    });
    setShowMovementModal(true);
  };

  const openHistoryModal = (item: IStockItem) => {
    setSelectedStock(item);
    setShowHistoryModal(true);
  };

  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await stockApi.create(formData);
      if (res.data?.success) {
        showAlert('success', 'Product / Battery added to inventory successfully');
        setShowAddModal(false);
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to add stock item');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    try {
      setSaving(true);
      const res = await stockApi.update(selectedStock._id, formData);
      if (res.data?.success) {
        showAlert('success', 'Stock details updated successfully');
        setShowEditModal(false);
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const handleRecordMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    try {
      setSaving(true);
      const res = await stockApi.recordMovement({
        stockId: selectedStock._id,
        ...movementData,
      });
      if (res.data?.success) {
        showAlert('success', `Stock operation "${movementData.movementType}" recorded successfully`);
        setShowMovementModal(false);
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to record stock movement');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStock = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from stock? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await stockApi.delete(id);
      if (res.data?.success) {
        showAlert('success', 'Stock item deleted successfully');
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to delete stock item');
    }
  };

  // Schema Config Editor Handlers
  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      const res = await stockApi.updateConfig(editingConfig);
      if (res.data?.success) {
        setConfig(res.data.data);
        showAlert('success', 'Stock configuration saved & updated live!');
        setShowConfigModal(false);
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    const val = newCategoryInput.trim();
    if (!val || editingConfig.categories.includes(val)) return;
    setEditingConfig({ ...editingConfig, categories: [...editingConfig.categories, val] });
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (cat: string) => {
    setEditingConfig({ ...editingConfig, categories: editingConfig.categories.filter((c) => c !== cat) });
  };

  const handleAddStatus = () => {
    const val = newStatusInput.trim();
    if (!val || editingConfig.statuses.includes(val)) return;
    setEditingConfig({ ...editingConfig, statuses: [...editingConfig.statuses, val] });
    setNewStatusInput('');
  };

  const handleRemoveStatus = (st: string) => {
    setEditingConfig({ ...editingConfig, statuses: editingConfig.statuses.filter((s) => s !== st) });
  };

  const handleAddLocation = () => {
    const val = newLocationInput.trim();
    if (!val || editingConfig.locations.includes(val)) return;
    setEditingConfig({ ...editingConfig, locations: [...editingConfig.locations, val] });
    setNewLocationInput('');
  };

  const handleRemoveLocation = (loc: string) => {
    setEditingConfig({ ...editingConfig, locations: editingConfig.locations.filter((l) => l !== loc) });
  };

  const handleAddCustomField = () => {
    const key = newCustomField.key.trim().replace(/\s+/g, '_').toLowerCase();
    const label = newCustomField.label.trim();
    if (!key || !label) return;

    const updated = [
      ...editingConfig.customFields.filter((f) => f.key !== key),
      { ...newCustomField, key, label, order: editingConfig.customFields.length + 1 },
    ];
    setEditingConfig({ ...editingConfig, customFields: updated });
    setNewCustomField({
      key: '',
      label: '',
      type: 'text',
      required: false,
      visible: true,
      order: updated.length + 1,
      placeholder: '',
      options: [],
    });
  };

  const handleRemoveCustomField = (key: string) => {
    setEditingConfig({
      ...editingConfig,
      customFields: editingConfig.customFields.filter((f) => f.key !== key),
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md transition animate-in fade-in ${
            alertMsg.type === 'success'
              ? 'bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-red-500 text-white shadow-red-600/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="opacity-80 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
              <Package size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Soft-Coded Stock & Inventory Control
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic product catalogs, battery serialization, scanner verification, and live movement auditing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Filter */}
          <DateRangeFilter value={dateRange} onChange={setDateRange} />

          {/* Soft-Coded Schema Settings Modal Trigger */}
          <button
            onClick={() => {
              setEditingConfig(config);
              setShowConfigModal(true);
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-200 cursor-pointer"
            title="Configure Categories, Statuses, Locations & Custom Fields"
          >
            <Sliders size={14} className="text-slate-600" />
            <span>Schema & Custom Fields</span>
          </button>

          {/* Barcode Scanner Button */}
          <button
            onClick={() => openScannerFor('search')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Camera size={14} />
            <span>Scan Barcode</span>
          </button>

          {/* Export Excel / CSV Button */}
          <button
            type="button"
            onClick={handleExportStock}
            disabled={exporting}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            <span>{exporting ? 'Exporting...' : 'Export Excel / CSV'}</span>
          </button>

          {/* Add Stock Item */}
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Package size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inventory</span>
            <p className="text-xl font-black text-slate-800">{meta.totalQuantity} units</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Available In Stock</span>
            <p className="text-xl font-black text-emerald-700">{meta.inStockCount} items</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sold Units</span>
            <p className="text-xl font-black text-purple-700">{meta.soldCount} units</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
            <Tag size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stock Valuation</span>
            <p className="text-xl font-black text-teal-700">₹{(meta.totalValuation || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Product Name, ID, Serial Number, or Battery Serial..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchStock('');
                }}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Dynamic Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories ({config.categories.length})</option>
              {config.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Dynamic Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Locations</option>
              {config.locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Dynamic Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              {config.statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchStock()}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="Refresh List"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} />
            </button>
          </div>
        </form>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-4">Product ID & Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Serials (Unit / Battery)</th>
                <th className="p-4">Available Qty</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="animate-spin text-emerald-600" size={18} />
                      <span>Loading stock records...</span>
                    </div>
                  </td>
                </tr>
              ) : stockList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    <Package className="mx-auto mb-2 text-slate-300" size={32} />
                    <p className="font-bold text-slate-700">No stock items found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or click "Add Stock Item".</p>
                  </td>
                </tr>
              ) : (
                stockList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="font-mono text-[11px] text-emerald-700 font-bold">{item.productId}</div>
                      <div className="font-extrabold text-slate-800 text-sm mt-0.5">{item.productName}</div>
                      {item.modelNumber && (
                        <div className="text-[10px] text-slate-400 font-medium">Model: {item.modelNumber}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      {item.serialNumber ? (
                        <div className="text-slate-700 font-bold flex items-center gap-1">
                          <Barcode size={12} className="text-slate-400" />
                          <span>Unit: {item.serialNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No Serial</span>
                      )}
                      {item.batterySerialNumber && (
                        <div className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <Battery size={12} className="text-emerald-500" />
                          <span>Bat: {item.batterySerialNumber}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-extrabold text-slate-800 text-sm">{item.quantity} units</div>
                      <span className="text-[10px] text-slate-400">Sold: {item.totalSold || 0}</span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">₹{(item.unitPrice || 0).toLocaleString('en-IN')}</div>
                      {item.mrp > item.unitPrice && (
                        <div className="text-[10px] text-slate-400 line-through">MRP ₹{item.mrp.toLocaleString('en-IN')}</div>
                      )}
                    </td>

                    <td className="p-4 text-slate-600 flex items-center gap-1 mt-3">
                      <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[140px]" title={item.location}>
                        {item.location}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'Sold'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : item.status === 'Reserved'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openMovementModal(item)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Record Stock Movement (Sell, Issue, Return, Transfer)"
                        >
                          <ArrowUpRight size={13} />
                          <span>Operate</span>
                        </button>

                        <button
                          onClick={() => openHistoryModal(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                          title="View History Audit Trail"
                        >
                          <History size={13} />
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          onClick={() => handleDeleteStock(item._id, item.productName)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition cursor-pointer"
                          title="Delete Stock Item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SOFT-CODED CONFIGURATION & SCHEMA MANAGER MODAL                        */}
      {/* ========================================================================= */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Soft-Coded Inventory Schema Configuration</h3>
                <p className="text-xs text-slate-500">
                  Configure categories, statuses, plant locations, and dynamic product fields without code changes.
                </p>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Categories Manager */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                1. Product Categories ({editingConfig.categories.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {editingConfig.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-emerald-500 hover:text-emerald-800 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Add new product category (e.g. Inverter Battery, Smart Display)..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Add Category
                </button>
              </div>
            </div>

            {/* Locations Manager */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                2. Plant / Warehouse / Showroom Locations ({editingConfig.locations.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {editingConfig.locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold border border-blue-200"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="text-blue-500 hover:text-blue-800 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                  placeholder="Add new warehouse or showroom location..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Add Location
                </button>
              </div>
            </div>

            {/* Statuses & Movement Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  3. Stock Statuses
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {editingConfig.statuses.map((st) => (
                    <span key={st} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1">
                      <span>{st}</span>
                      <button onClick={() => handleRemoveStatus(st)} className="text-slate-400 hover:text-slate-600">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStatusInput}
                    onChange={(e) => setNewStatusInput(e.target.value)}
                    placeholder="New status..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                  <button onClick={handleAddStatus} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  4. Movement Operation Types
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {editingConfig.movementTypes.map((mt) => (
                    <span key={mt} className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-bold">
                      {mt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Dynamic Fields Manager */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                5. Dynamic Custom Product Fields ({editingConfig.customFields.length})
              </label>

              <div className="space-y-2">
                {editingConfig.customFields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{field.label}</span>
                      <span className="ml-2 font-mono text-slate-400">({field.key})</span>
                      <span className="ml-2 px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px] font-bold uppercase">
                        {field.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(field.key)}
                      className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Field Form */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Add New Custom Field</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newCustomField.label}
                    onChange={(e) => setNewCustomField({ ...newCustomField, label: e.target.value, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="Field Label (e.g. BMS Protocol)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={newCustomField.key}
                    onChange={(e) => setNewCustomField({ ...newCustomField, key: e.target.value })}
                    placeholder="Field Key (e.g. bms_protocol)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <select
                    value={newCustomField.type}
                    onChange={(e: any) => setNewCustomField({ ...newCustomField, type: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="text">Text Field</option>
                    <option value="number">Number Field</option>
                    <option value="select">Dropdown Select</option>
                    <option value="date">Date Picker</option>
                    <option value="boolean">Checkbox</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  disabled={!newCustomField.label || !newCustomField.key}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Add Custom Field to Schema
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                {saving ? 'Saving Schema...' : 'Save & Apply Live'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADD STOCK ITEM MODAL (DYNAMIC CUSTOM FIELDS)                           */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Add New Inventory / Stock Item</h3>
                <p className="text-xs text-slate-500">Register new EV battery, spare part, or scooter into warehouse.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Description / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. 48V 30Ah Lithium Iron Phosphate Battery"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {config.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Product Serial Number</label>
                    <button
                      type="button"
                      onClick={() => openScannerFor('add_serial')}
                      className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera size={11} />
                      <span>Scan</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. PRD-BAT-4830-9921"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Battery Pack Serial Number</label>
                    <button
                      type="button"
                      onClick={() => openScannerFor('add_battery')}
                      className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera size={11} />
                      <span>Scan</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.batterySerialNumber}
                    onChange={(e) => setFormData({ ...formData, batterySerialNumber: e.target.value })}
                    placeholder="e.g. EBS-BAT-48V30-KOTA-012"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Selling Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage / Showroom Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    {config.locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    {config.statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warranty Period (Months)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.warrantyPeriodMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyPeriodMonths: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Custom Fields Section */}
              {config.customFields && config.customFields.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Dynamic Custom Product Specifications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.customFields.map((f) => (
                      <div key={f.key}>
                        <label className="block font-bold text-slate-700 mb-1">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        {f.type === 'select' ? (
                          <select
                            required={f.required}
                            value={formData.customFields?.[f.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customFields: { ...formData.customFields, [f.key]: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          >
                            <option value="">-- Choose {f.label} --</option>
                            {f.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={f.type === 'number' ? 'number' : 'text'}
                            required={f.required}
                            value={formData.customFields?.[f.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customFields: { ...formData.customFields, [f.key]: e.target.value },
                              })
                            }
                            placeholder={f.placeholder || f.label}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {saving ? 'Adding to Stock...' : 'Confirm & Add to Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EDIT STOCK ITEM MODAL                                                  */}
      {/* ========================================================================= */}
      {showEditModal && selectedStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Edit Inventory Record</h3>
                <p className="text-xs text-slate-500">Update unit parameters, price, serials, and specifications.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {config.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Battery Serial Number</label>
                  <input
                    type="text"
                    value={formData.batterySerialNumber}
                    onChange={(e) => setFormData({ ...formData, batterySerialNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {config.locations.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {config.statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STOCK MOVEMENT OPERATION MODAL                                         */}
      {/* ========================================================================= */}
      {showMovementModal && selectedStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800">Record Stock Operation</h3>
                <p className="text-xs text-slate-500">
                  {selectedStock.productName} (Avail: {selectedStock.quantity})
                </p>
              </div>
              <button onClick={() => setShowMovementModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordMovement} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Operation / Movement Type</label>
                <select
                  value={movementData.movementType}
                  onChange={(e) => setMovementData({ ...movementData, movementType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  {config.movementTypes.map((mt) => (
                    <option key={mt} value={mt}>
                      {mt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={['Sold', 'Issued', 'Transferred'].includes(movementData.movementType) ? selectedStock.quantity : 999}
                  required
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({ ...movementData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              {movementData.movementType === 'Transferred' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Location</label>
                  <select
                    value={movementData.destinationLocation}
                    onChange={(e) => setMovementData({ ...movementData, destinationLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {config.locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operation Notes</label>
                <input
                  type="text"
                  value={movementData.notes}
                  onChange={(e) => setMovementData({ ...movementData, notes: e.target.value })}
                  placeholder="e.g. Dispatched to Showroom Counter for customer sale"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  {saving ? 'Processing...' : 'Confirm Operation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HISTORY AUDIT TRAIL MODAL                                              */}
      {/* ========================================================================= */}
      {showHistoryModal && selectedStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800">Movement History & Audit Log</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedStock.productId} • {selectedStock.productName}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {!selectedStock.history || selectedStock.history.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-6">No historical operations logged for this item.</p>
              ) : (
                selectedStock.history.map((h, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        {h.operation} ({h.quantity} units)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(h.date).toLocaleString()}
                      </span>
                    </div>
                    {h.referenceNumber && (
                      <p className="text-[11px] font-mono text-emerald-700">Ref: {h.referenceNumber}</p>
                    )}
                    {h.employeeName && (
                      <p className="text-[11px] text-slate-500">Performed by: {h.employeeName}</p>
                    )}
                    {h.notes && <p className="text-[11px] text-slate-600 italic">"{h.notes}"</p>}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SCANNER MODAL                                                          */}
      {/* ========================================================================= */}
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
        title={
          scannerTarget === 'search'
            ? 'Scan Serial Number or Barcode to Filter Inventory'
            : 'Scan Product / Battery Pack Barcode'
        }
      />
    </div>
  );
};

export default StockManager;
