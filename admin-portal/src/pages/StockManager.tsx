import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  AlertTriangle,
  CheckCircle2,
  X,
  Layers,
  Battery,
  Bike,
  Wrench,
  Tag,
  MapPin,
  Barcode,
} from 'lucide-react';
import { stockApi } from '../api/client';

export interface IStockItem {
  _id: string;
  productId: string;
  productName: string;
  category: string;
  modelNumber?: string;
  serialNumber?: string;
  batterySerialNumber?: string;
  quantity: number;
  totalReceived: number;
  totalSold: number;
  unitPrice: number;
  mrp: number;
  location: string;
  status: 'In Stock' | 'Sold' | 'Reserved' | 'Damaged' | 'In Transit';
  specifications?: Record<string, any>;
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

const CATEGORIES = ['All', 'Battery', 'EV Scooter', 'Spare Parts', 'Charger', 'Controller', 'Motor', 'Accessories'];
const LOCATIONS = ['All', 'Kota Central Plant Store', 'Main Showroom Counter', 'Service Center Depot', 'Factory Transit'];
const STATUSES = ['All', 'In Stock', 'Sold', 'Reserved', 'Damaged', 'In Transit'];

const StockManager = () => {
  const [stockList, setStockList] = useState<IStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [meta, setMeta] = useState({ totalRecords: 0, totalQuantity: 0, inStockCount: 0, soldCount: 0 });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<IStockItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
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
    notes: '',
  });

  // Movement Form State
  const [movementData, setMovementData] = useState({
    movementType: 'Received' as 'Received' | 'Sold' | 'Issued' | 'Returned' | 'Transferred' | 'Adjustment',
    quantity: 1,
    sourceLocation: '',
    destinationLocation: '',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStock();
  }, [categoryFilter, locationFilter, statusFilter]);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await stockApi.getAll({
        search: search.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        location: locationFilter !== 'All' ? locationFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
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

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStock();
  };

  const openAddModal = () => {
    setFormData({
      productId: '',
      productName: '',
      category: 'Battery',
      modelNumber: '',
      serialNumber: '',
      batterySerialNumber: '',
      quantity: 1,
      unitPrice: 25000,
      mrp: 28000,
      location: 'Kota Central Plant Store',
      status: 'In Stock',
      warrantyPeriodMonths: 36,
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
      notes: '',
    });
    setShowEditModal(true);
  };

  const openMovementModal = (item: IStockItem) => {
    setSelectedStock(item);
    setMovementData({
      movementType: 'Received',
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
        showAlert('success', 'Product/Battery added to inventory successfully');
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
      showAlert('error', err.response?.data?.message || 'Failed to update stock item');
    } finally {
      setSaving(false);
    }
  };

  const handleStockMovement = async (e: React.FormEvent) => {
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
    if (!window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;
    try {
      const res = await stockApi.delete(id);
      if (res.data?.success) {
        showAlert('success', 'Item deleted from inventory');
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Package size={16} />
            <span>Inventory & Asset Management</span>
          </div>
          <h1 className="text-2xl font-black">Stock & Serial Inventory</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track EV batteries, serial barcodes, real-time stock levels, and showroom transfers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStock}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-md ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Units</span>
            <Layers size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">{meta.totalQuantity}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{meta.totalRecords} Product Catalog Entries</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>In Stock Units</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{meta.inStockCount}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Ready for Showroom Billing</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Sold / Delivered</span>
            <ArrowUpRight size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{meta.soldCount}</div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Linked with Warranties</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Batteries</span>
            <Battery size={16} className="text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">
            {stockList.filter((s) => s.category === 'Battery').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Serialized Lithium Packs</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product Name, Serial Barcode, Battery Pack #, or Model..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter size={14} className="text-slate-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <MapPin size={14} className="text-slate-500" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  Location: {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Tag size={14} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-emerald-500" />
            <span className="text-xs font-medium">Loading inventory records...</span>
          </div>
        ) : stockList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Package size={36} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Inventory Items Found</p>
            <p className="text-xs text-slate-400 max-w-sm">
              There are no stock entries matching the current filter criteria. Click "Add New Item" to register your first
              stock.
            </p>
            <button
              onClick={openAddModal}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Add Inventory Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Serial / Barcode</th>
                  <th className="p-4">Qty & Stock</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">{item.productName}</div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                        <span className="font-mono">{item.productId}</span>
                        {item.modelNumber && <span>• Model: {item.modelNumber}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.category === 'Battery' && <Battery size={12} className="text-emerald-500" />}
                        {item.category === 'EV Scooter' && <Bike size={12} className="text-blue-500" />}
                        {item.category === 'Spare Parts' && <Wrench size={12} className="text-amber-500" />}
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        {item.serialNumber ? (
                          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                            <Barcode size={12} className="text-slate-400" />
                            <span>{item.serialNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Non-serialized</span>
                        )}
                        {item.batterySerialNumber && (
                          <div className="text-[10px] text-emerald-700 font-mono">
                            Bat: {item.batterySerialNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-black text-slate-800 text-sm">{item.quantity} units</div>
                      <div className="text-[10px] text-slate-400">
                        Rec: {item.totalReceived} | Sold: {item.totalSold}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">₹{item.unitPrice.toLocaleString('en-IN')}</div>
                      {item.mrp > item.unitPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          MRP: ₹{item.mrp.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{item.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'Sold'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.status === 'Reserved'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openMovementModal(item)}
                          title="Record Stock Movement / Transfer"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        >
                          <ArrowDownLeft size={16} />
                        </button>
                        <button
                          onClick={() => openHistoryModal(item)}
                          title="View Movement Audit Trail"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        >
                          <History size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Details"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStock(item._id, item.productName)}
                          title="Delete Item"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
                <Package size={20} className="text-emerald-600" />
                <span>Add Inventory Stock Item</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStock} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. 60V 30Ah LFP EV Battery Pack"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. EBS-BAT-2026-00124"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Battery Cell / Pack Serial</label>
                  <input
                    type="text"
                    value={formData.batterySerialNumber}
                    onChange={(e) => setFormData({ ...formData, batterySerialNumber: e.target.value })}
                    placeholder="e.g. LFP-6030-9941"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Storage Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {LOCATIONS.filter((l) => l !== 'All').map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Warranty Period (Months)</label>
                  <input
                    type="number"
                    value={formData.warrantyPeriodMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyPeriodMonths: parseInt(e.target.value) || 0 })}
                    placeholder="36"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Batch Remarks</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Factory Batch #4, tested 100% capacity"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 cursor-pointer"
                >
                  {saving ? 'Adding...' : 'Save to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
                <Edit2 size={20} className="text-blue-600" />
                <span>Edit Stock Item: {selectedStock.productName}</span>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {STATUSES.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Battery Serial Number</label>
                  <input
                    type="text"
                    value={formData.batterySerialNumber}
                    onChange={(e) => setFormData({ ...formData, batterySerialNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {LOCATIONS.filter((l) => l !== 'All').map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 cursor-pointer"
                >
                  {saving ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVEMENT / OPERATION MODAL */}
      {showMovementModal && selectedStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-slate-800 font-black text-base">Record Stock Operation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStock.productName} (Current Qty: {selectedStock.quantity})
                </p>
              </div>
              <button
                onClick={() => setShowMovementModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStockMovement} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Operation Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Received', 'Sold', 'Issued', 'Returned', 'Transferred', 'Adjustment'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMovementData({ ...movementData, movementType: type })}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        movementData.movementType === type
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {movementData.movementType === 'Adjustment' ? 'Set New Qty' : 'Quantity'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={movementData.quantity}
                    onChange={(e) => setMovementData({ ...movementData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {movementData.movementType === 'Transferred' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Destination Location</label>
                    <select
                      value={movementData.destinationLocation}
                      onChange={(e) => setMovementData({ ...movementData, destinationLocation: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {LOCATIONS.filter((l) => l !== 'All').map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Operation Remarks / Reference</label>
                <textarea
                  rows={2}
                  value={movementData.notes}
                  onChange={(e) => setMovementData({ ...movementData, notes: e.target.value })}
                  placeholder="e.g. Transferred 2 units to Showroom Counter #1"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  {saving ? 'Recording...' : 'Submit Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY AUDIT TRAIL MODAL */}
      {showHistoryModal && selectedStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-slate-800 font-black text-base flex items-center gap-2">
                  <History size={18} className="text-blue-600" />
                  <span>Stock Movement Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStock.productName} ({selectedStock.productId})</p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {!selectedStock.history || selectedStock.history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No historical movements logged.</div>
              ) : (
                selectedStock.history.map((h, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl text-white font-bold text-xs ${
                        h.operation === 'Received' || h.operation === 'Returned'
                          ? 'bg-emerald-500'
                          : h.operation === 'Sold'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                    >
                      {h.operation === 'Received' && <ArrowDownLeft size={16} />}
                      {h.operation === 'Sold' && <ArrowUpRight size={16} />}
                      {h.operation !== 'Received' && h.operation !== 'Sold' && <RefreshCw size={16} />}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{h.operation} • {h.quantity} units</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(h.date).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{h.notes || 'Routine stock operation'}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        By: <span className="font-semibold text-slate-600">{h.employeeName || 'System Admin'}</span>
                        {h.referenceNumber && <span> • Ref: #{h.referenceNumber}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManager;
