import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  RefreshCw,
  Battery,
  Bike,
  Wrench,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  ArrowUpRight,
  X,
  Camera,
  Image as ImageIcon,
  Upload,
  Barcode,
  Download,
  Scan,
  Layers,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ZoomIn,
  ZoomOut,
  FilePlus,
} from 'lucide-react';
import { stockApi, resolveImageUrl } from '../api/client';
import ScannerModal from '../components/ScannerModal';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

export interface IStockItem {
  _id: string;
  productId: string;
  productName: string;
  category: string;
  modelNumber?: string;
  serialNumber?: string;
  batterySerialNumber?: string;
  quantity: number;
  unitPrice: number;
  purchasePrice?: number;
  mrp: number;
  gstRate?: number;
  location: string;
  status: string;
  warrantyPeriodMonths: number;
  images?: string[];
  photoUrl?: string;
  billUrls?: string[];
  billPages?: Array<{
    pageNumber: number;
    url: string;
    name?: string;
    fileType?: string;
  }>;
  purchaseInfo?: {
    supplier?: string;
    purchaseDate?: string;
    invoiceNumber?: string;
    purchaseCost?: number;
    billUrls?: string[];
  };
  description?: string;
}

const CATEGORIES = [
  'All',
  'Battery',
  'EV Scooter',
  'Spare Parts',
  'Charger',
  'BMS & Harness',
  'Motor & Controller',
  'Accessories',
  'Raw Material',
];

const LOCATIONS = [
  'Kota Central Plant Store',
  'Main Showroom Counter',
  'Rental Dispatch Hub',
  'Service Center Desk',
  'Warehouse A (Kota)',
];

const STATUSES = ['In Stock', 'Sold', 'Reserved', 'Under Service', 'Defective', 'In Transit'];

const Stock = () => {
  const [stockList, setStockList] = useState<IStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [meta, setMeta] = useState({ totalRecords: 0, totalQuantity: 0, inStockCount: 0 });

  // Date Filter
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });

  // Scanner State
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'search' | 'add_serial' | 'add_battery' | 'edit_serial' | 'edit_battery'>('search');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<IStockItem | null>(null);

  // Bill Viewer Modal State
  const [showBillViewerModal, setShowBillViewerModal] = useState(false);
  const [viewerPages, setViewerPages] = useState<Array<{ pageNumber: number; url: string; name?: string; fileType?: string }>>([]);
  const [viewerTitle, setViewerTitle] = useState('');
  const [activeViewerPageIndex, setActiveViewerPageIndex] = useState(0);
  const [viewerZoom, setViewerZoom] = useState(1);

  // Form State
  const [formData, setFormData] = useState<any>({
    productId: '',
    productName: '',
    category: 'Battery',
    modelNumber: '',
    serialNumber: '',
    batterySerialNumber: '',
    quantity: 1,
    unitPrice: 22000,
    purchasePrice: 18000,
    mrp: 25000,
    gstRate: 18,
    location: 'Kota Central Plant Store',
    status: 'In Stock',
    warrantyPeriodMonths: 36,
    images: [],
    photoUrl: '',
    billUrls: [],
    billPages: [],
    description: '',
    notes: '',
  });

  const [imageInput, setImageInput] = useState('');
  const [billInput, setBillInput] = useState('');

  // Movement Form
  const [movementData, setMovementData] = useState({
    movementType: 'Received',
    quantity: 1,
    sourceLocation: '',
    destinationLocation: '',
    notes: '',
  });

  useEffect(() => {
    fetchStock();
  }, [categoryFilter, dateRange]);

  const fetchStock = async (overrideSearch?: string) => {
    try {
      setLoading(true);
      const querySearch = typeof overrideSearch === 'string' ? overrideSearch : search;
      const res = await stockApi.getAll({
        search: querySearch.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.data?.success) {
        setStockList(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  const handleExportStock = async () => {
    try {
      setExporting(true);
      const res = await stockApi.export({
        search: search.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart-stock-${dateRange.filter.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
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

  const handleScanSuccess = async (scannedSerial: string) => {
    const clean = scannedSerial.trim();
    if (!clean) return;

    if (scannerTarget === 'search') {
      setSearch(clean);
      try {
        const res = await stockApi.getBySerial(clean);
        if (res.data?.success && res.data.data) {
          showAlert('success', `Found matching item: ${res.data.data.productName} (${clean})`);
          setStockList([res.data.data]);
        } else {
          showAlert('error', `No stock found with serial: ${clean}`);
        }
      } catch (err: any) {
        showAlert('error', err.response?.data?.message || `No stock matched serial "${clean}"`);
      }
    } else if (scannerTarget === 'add_serial' || scannerTarget === 'edit_serial') {
      setFormData((prev: any) => ({ ...prev, serialNumber: clean }));
      showAlert('success', `Unit Serial Scanned: ${clean}`);
    } else if (scannerTarget === 'add_battery' || scannerTarget === 'edit_battery') {
      setFormData((prev: any) => ({ ...prev, batterySerialNumber: clean }));
      showAlert('success', `Battery Pack Serial Scanned: ${clean}`);
    }
  };

  // Image handlers
  const addImageUrlToForm = () => {
    if (!imageInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      images: [...(prev.images || []), imageInput.trim()],
      photoUrl: prev.photoUrl || imageInput.trim(),
    }));
    setImageInput('');
  };

  const removeImageFromForm = (idx: number) => {
    setFormData((prev: any) => {
      const filtered = (prev.images || []).filter((_: any, i: number) => i !== idx);
      return {
        ...prev,
        images: filtered,
        photoUrl: filtered[0] || '',
      };
    });
  };

  const handleStockImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        if (base64) {
          setFormData((prev: any) => ({
            ...prev,
            images: [...(prev.images || []), base64],
            photoUrl: prev.photoUrl || base64,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Multi-Page Bill Handlers
  const addBillUrlToForm = () => {
    if (!billInput.trim()) return;
    const url = billInput.trim();
    setFormData((prev: any) => {
      const updatedUrls = [...(prev.billUrls || []), url];
      const updatedPages = [
        ...(prev.billPages || []),
        {
          pageNumber: (prev.billPages?.length || 0) + 1,
          url,
          name: `Bill Page ${(prev.billPages?.length || 0) + 1}`,
          fileType: url.toLowerCase().endsWith('.pdf') || url.startsWith('data:application/pdf') ? 'pdf' : 'image',
        },
      ];
      return {
        ...prev,
        billUrls: updatedUrls,
        billPages: updatedPages,
      };
    });
    setBillInput('');
  };

  const removeBillPage = (idx: number) => {
    setFormData((prev: any) => {
      const filteredPages = (prev.billPages || [])
        .filter((_: any, i: number) => i !== idx)
        .map((page: any, newIdx: number) => ({
          ...page,
          pageNumber: newIdx + 1,
          name: `Bill Page ${newIdx + 1}`,
        }));
      const filteredUrls = filteredPages.map((p: any) => p.url);
      return {
        ...prev,
        billUrls: filteredUrls,
        billPages: filteredPages,
      };
    });
  };

  const moveBillPage = (idx: number, direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const pages = [...(prev.billPages || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= pages.length) return prev;
      const temp = pages[idx];
      pages[idx] = pages[targetIdx];
      pages[targetIdx] = temp;
      const reindexed = pages.map((p, i) => ({
        ...p,
        pageNumber: i + 1,
        name: `Bill Page ${i + 1}`,
      }));
      return {
        ...prev,
        billUrls: reindexed.map((p) => p.url),
        billPages: reindexed,
      };
    });
  };

  const handleBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        if (base64) {
          setFormData((prev: any) => {
            const isPdf = file.type === 'application/pdf' || base64.startsWith('data:application/pdf');
            const newPage = {
              pageNumber: (prev.billPages?.length || 0) + 1,
              url: base64,
              name: file.name || `Bill Page ${(prev.billPages?.length || 0) + 1}`,
              fileType: isPdf ? 'pdf' : 'image',
            };
            const updatedPages = [...(prev.billPages || []), newPage];
            const updatedUrls = [...(prev.billUrls || []), base64];
            return {
              ...prev,
              billUrls: updatedUrls,
              billPages: updatedPages,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const openBillViewer = (item: IStockItem | any, title?: string) => {
    const pages = item.billPages && item.billPages.length > 0
      ? item.billPages
      : (item.billUrls || item.purchaseInfo?.billUrls || []).map((url: string, i: number) => ({
          pageNumber: i + 1,
          url,
          name: `Bill Page ${i + 1}`,
          fileType: url.startsWith('data:application/pdf') || url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
        }));

    if (pages.length === 0) {
      showAlert('error', 'No bill document pages attached to this stock record.');
      return;
    }
    setViewerPages(pages);
    setViewerTitle(title || item.productName || 'Stock Purchase Bill');
    setActiveViewerPageIndex(0);
    setViewerZoom(1);
    setShowBillViewerModal(true);
  };

  // Modal Openers
  const openAddModal = () => {
    setFormData({
      productId: '',
      productName: '',
      category: 'Battery',
      modelNumber: '',
      serialNumber: '',
      batterySerialNumber: '',
      quantity: 1,
      unitPrice: 22000,
      purchasePrice: 18000,
      mrp: 25000,
      gstRate: 18,
      location: 'Kota Central Plant Store',
      status: 'In Stock',
      warrantyPeriodMonths: 36,
      images: [],
      photoUrl: '',
      billUrls: [],
      billPages: [],
      description: '',
      notes: '',
    });
    setImageInput('');
    setBillInput('');
    setShowAddModal(true);
  };

  const openEditModal = (item: IStockItem) => {
    setSelectedStock(item);
    const existingBillUrls = item.billUrls || item.purchaseInfo?.billUrls || [];
    const existingBillPages = item.billPages && item.billPages.length > 0
      ? item.billPages
      : existingBillUrls.map((url: string, i: number) => ({
          pageNumber: i + 1,
          url,
          name: `Bill Page ${i + 1}`,
          fileType: url.startsWith('data:application/pdf') ? 'pdf' : 'image',
        }));

    setFormData({
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      modelNumber: item.modelNumber || '',
      serialNumber: item.serialNumber || '',
      batterySerialNumber: item.batterySerialNumber || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      purchasePrice: item.purchasePrice || 0,
      mrp: item.mrp || 0,
      gstRate: item.gstRate || 18,
      location: item.location,
      status: item.status,
      warrantyPeriodMonths: item.warrantyPeriodMonths,
      images: item.images || (item.photoUrl ? [item.photoUrl] : []),
      photoUrl: item.photoUrl || (item.images?.[0] || ''),
      billUrls: existingBillUrls,
      billPages: existingBillPages,
      description: item.description || '',
      notes: '',
    });
    setImageInput('');
    setBillInput('');
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

  // Create Stock Submit
  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await stockApi.create(formData);
      if (res.data?.success) {
        showAlert('success', `Product "${formData.productName}" added to inventory successfully!`);
        setShowAddModal(false);
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to add stock item');
    } finally {
      setSaving(false);
    }
  };

  // Update Stock Submit
  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    try {
      setSaving(true);
      const res = await stockApi.update(selectedStock._id, formData);
      if (res.data?.success) {
        showAlert('success', 'Stock record updated successfully');
        setShowEditModal(false);
        fetchStock();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  // Record Movement Submit
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

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Package size={16} />
            <span>Store & Inventory Explorer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Stock & Serial Lookup</h1>
          <p className="text-xs text-slate-300 mt-1">
            Add new inventory units, check real-time stock levels, and scan item barcodes using your mobile camera.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40 transition cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>+ Add Stock Item</span>
          </button>

          <button
            onClick={() => openScannerFor('search')}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Scan size={14} />
            <span>Scan Barcode</span>
          </button>

          <button
            type="button"
            onClick={handleExportStock}
            disabled={exporting}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => fetchStock()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Refresh Inventory"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Units in Store</span>
            <Layers size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">{meta.totalQuantity}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{meta.totalRecords} Catalog Items</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Ready for Sale</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{meta.inStockCount}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">In Stock</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Battery Packs</span>
            <Battery size={16} className="text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">
            {stockList.filter((s) => s.category === 'Battery').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">LFP / Li-ion Models</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStock()}
            placeholder="Search by Product Name, Serial #, Battery Pack #, or Model..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
            title="Add New Stock Item"
          >
            <Plus size={15} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Category Pill Tabs (Showroom, Battery, Spare Parts) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Division:</span>
          {['All', 'Battery', 'EV Scooter', 'Spare Parts', 'Charger'].map((cat) => {
            const isSelected = categoryFilter === cat;
            const count = cat === 'All'
              ? stockList.length
              : stockList.filter((s) => (s.category || '').toLowerCase() === cat.toLowerCase()).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat === 'Battery' ? '🔋' : cat === 'EV Scooter' ? '🛵' : cat === 'Spare Parts' ? '⚙️' : cat === 'Charger' ? '⚡' : '📦'}</span>
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 font-bold'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-bold text-slate-500">
          {stockList.filter((s) => categoryFilter === 'All' || (s.category || '').toLowerCase() === categoryFilter.toLowerCase()).length} of {stockList.length} Units
        </span>
      </div>

      {/* Stock Cards / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-emerald-500" />
            <span className="text-xs font-medium">Checking inventory levels...</span>
          </div>
        ) : stockList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Package size={36} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Stock Items Found</p>
            <p className="text-xs text-slate-400 max-w-sm">Click "Add Stock Item" above to add new inventory.</p>
            <button
              onClick={openAddModal}
              className="mt-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add First Stock Item</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Serial / Barcode</th>
                  <th className="p-4">Available Qty</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={resolveImageUrl(item.images[0])}
                            alt={item.productName}
                            className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-xs flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : item.photoUrl ? (
                          <img
                            src={resolveImageUrl(item.photoUrl)}
                            alt={item.productName}
                            className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-xs flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 flex-shrink-0">
                            <Package size={18} />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{item.productName}</div>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                            <span className="font-mono">{item.productId}</span>
                            {item.modelNumber && <span>• Model: {item.modelNumber}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.category === 'Battery' && <Battery size={12} className="text-emerald-500" />}
                        {item.category === 'EV Scooter' && <Bike size={12} className="text-blue-500" />}
                        {item.category === 'Spare Parts' && <Wrench size={12} className="text-amber-500" />}
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-700">
                      {item.serialNumber && (
                        <div className="flex items-center gap-1 font-bold text-slate-700">
                          <Barcode size={12} className="text-slate-400" />
                          <span>Unit: {item.serialNumber}</span>
                        </div>
                      )}
                      {item.batterySerialNumber && (
                        <div className="flex items-center gap-1 font-bold text-emerald-700 mt-0.5">
                          <Battery size={12} className="text-emerald-500" />
                          <span>Bat: {item.batterySerialNumber}</span>
                        </div>
                      )}
                      {!item.serialNumber && !item.batterySerialNumber && (
                        <span className="text-slate-400 italic text-[10px]">Non-serialized</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-black text-slate-900 text-sm">{item.quantity} units</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      <div>₹{(item.unitPrice || 0).toLocaleString('en-IN')}</div>
                      {item.mrp > item.unitPrice && (
                        <div className="text-[10px] text-slate-400 line-through">MRP ₹{item.mrp.toLocaleString('en-IN')}</div>
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
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
                        {((item.billPages && item.billPages.length > 0) || (item.billUrls && item.billUrls.length > 0) || (item.purchaseInfo?.billUrls && item.purchaseInfo.billUrls.length > 0)) && (
                          <button
                            onClick={() => openBillViewer(item, `${item.productName} — Supplier Purchase Bill`)}
                            className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title="View Attached Multi-Page Supplier Bill"
                          >
                            <FileText size={13} />
                            <span>Bill ({item.billPages?.length || item.billUrls?.length || item.purchaseInfo?.billUrls?.length || 1}p)</span>
                          </button>
                        )}
                        <button
                          onClick={() => openMovementModal(item)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Record Stock Operation"
                        >
                          <ArrowUpRight size={13} />
                          <span>Operate</span>
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                          title="Edit Stock Details"
                        >
                          <Edit2 size={13} />
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

      {/* ========================================================================= */}
      {/* 1. ADD STOCK ITEM MODAL                                                   */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Add New Inventory / Stock Item</h3>
                <p className="text-xs text-slate-500">Register EV battery pack, vehicle, or spare parts into store.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Description / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. 48V 28Ah Lithium Iron Phosphate Battery Pack"
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
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model / Variant</label>
                  <input
                    type="text"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    placeholder="e.g. EKO-BAT-4828"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Product / Chassis Serial #</label>
                    <button
                      type="button"
                      onClick={() => openScannerFor('add_serial')}
                      className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera size={11} />
                      <span>Scan Barcode</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. CHS-2026-0099"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Battery Pack Serial #</label>
                    <button
                      type="button"
                      onClick={() => openScannerFor('add_battery')}
                      className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera size={11} />
                      <span>Scan Barcode</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.batterySerialNumber}
                    onChange={(e) => setFormData({ ...formData, batterySerialNumber: e.target.value })}
                    placeholder="e.g. JA127790084"
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
                  <label className="block font-bold text-slate-700 mb-1">Selling Rate / Unit Price (₹) *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (MRP ₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
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
                    {LOCATIONS.map((loc) => (
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
                    {STATUSES.map((st) => (
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

              {/* Product Photos Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <label className="block font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-emerald-600" />
                    <span>Product Images (Multi-Image Upload & Preview)</span>
                  </div>
                </label>

                {formData.images && formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                    {formData.images.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-white">
                        <img src={resolveImageUrl(imgUrl)} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageFromForm(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter Image URL (https://...)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={addImageUrlToForm}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add URL
                  </button>
                  <label className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1">
                    <Upload size={13} />
                    <span>Upload File</span>
                    <input type="file" multiple accept="image/*" onChange={handleStockImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Purchase Bill / Supplier Invoice (Multi-Page Support) */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-600" />
                      <span>Purchase Bill / Invoice (Upload 1 or More Pages)</span>
                    </div>
                  </label>
                  <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 font-bold px-2 py-0.5 rounded-full">
                    {formData.billPages?.length || 0} Page(s) Uploaded
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload multiple pages of supplier tax invoice, delivery challan, or purchase bill (Images or PDFs).
                </p>

                {formData.billPages && formData.billPages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-blue-50/40 rounded-2xl border border-blue-200/80">
                    {formData.billPages.map((page: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative group bg-white p-2 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md">
                            Page {idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => moveBillPage(idx, 'up')}
                                className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                                title="Move Left"
                              >
                                <ChevronLeft size={12} />
                              </button>
                            )}
                            {idx < (formData.billPages.length - 1) && (
                              <button
                                type="button"
                                onClick={() => moveBillPage(idx, 'down')}
                                className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                                title="Move Right"
                              >
                                <ChevronRight size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeBillPage(idx)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded"
                              title="Delete Page"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <div
                          onClick={() => {
                            setViewerPages(formData.billPages);
                            setViewerTitle(`${formData.productName || 'New Item'} — Purchase Bill`);
                            setActiveViewerPageIndex(idx);
                            setViewerZoom(1);
                            setShowBillViewerModal(true);
                          }}
                          className="w-full h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer relative group/preview"
                        >
                          {page.fileType === 'pdf' || page.url.startsWith('data:application/pdf') ? (
                            <div className="text-center p-2">
                              <FileText size={28} className="text-red-500 mx-auto" />
                              <span className="text-[9px] font-mono text-slate-600 block truncate max-w-[80px] mt-1">PDF Doc</span>
                            </div>
                          ) : (
                            <img src={resolveImageUrl(page.url)} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover/preview:opacity-100 flex items-center justify-center gap-1 transition text-[10px] font-bold">
                            <Eye size={12} />
                            <span>Preview</span>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 truncate font-mono block">
                          {page.name || `Page ${idx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={billInput}
                    onChange={(e) => setBillInput(e.target.value)}
                    placeholder="Enter Bill Page URL (https://...)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={addBillUrlToForm}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add Page URL</span>
                  </button>
                  <label className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1">
                    <FilePlus size={13} />
                    <span>Upload Bill Page(s)</span>
                    <input type="file" multiple accept="image/*,application/pdf" onChange={handleBillUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description & Notes</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 48V 28Ah LFP battery pack with smart BMS and 3-year official warranty..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={15} />
                  <span>{saving ? 'Adding to Stock...' : 'Confirm & Add to Stock'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT STOCK ITEM MODAL                                                  */}
      {/* ========================================================================= */}
      {showEditModal && selectedStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Edit Inventory Record</h3>
                <p className="text-xs text-slate-500">Update unit parameters, price, serials, and images.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Description / Name</label>
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
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model / Variant</label>
                  <input
                    type="text"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Product / Chassis Serial #</label>
                    <button
                      type="button"
                      onClick={() => openScannerFor('edit_serial')}
                      className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera size={11} />
                      <span>Scan Barcode</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Battery Pack Serial #</label>
                    <button
                      type="button"
                      onClick={() => openScannerFor('edit_battery')}
                      className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera size={11} />
                      <span>Scan Barcode</span>
                    </button>
                  </div>
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
                  <label className="block font-bold text-slate-700 mb-1">Selling Rate / Unit Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (MRP ₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
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
                    {LOCATIONS.map((l) => (
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
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Photos Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <label className="block font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-emerald-600" />
                    <span>Product Images (Multi-Image Support)</span>
                  </div>
                </label>

                {formData.images && formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                    {formData.images.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-white">
                        <img src={resolveImageUrl(imgUrl)} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageFromForm(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter Image URL (https://...)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={addImageUrlToForm}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add URL
                  </button>
                  <label className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1">
                    <Upload size={13} />
                    <span>Upload File</span>
                    <input type="file" multiple accept="image/*" onChange={handleStockImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Purchase Bill / Supplier Invoice (Multi-Page Support) */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-600" />
                      <span>Purchase Bill / Invoice (Upload 1 or More Pages)</span>
                    </div>
                  </label>
                  <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 font-bold px-2 py-0.5 rounded-full">
                    {formData.billPages?.length || 0} Page(s) Uploaded
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload multiple pages of supplier tax invoice, delivery challan, or purchase bill (Images or PDFs).
                </p>

                {formData.billPages && formData.billPages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-blue-50/40 rounded-2xl border border-blue-200/80">
                    {formData.billPages.map((page: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative group bg-white p-2 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md">
                            Page {idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => moveBillPage(idx, 'up')}
                                className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                                title="Move Left"
                              >
                                <ChevronLeft size={12} />
                              </button>
                            )}
                            {idx < (formData.billPages.length - 1) && (
                              <button
                                type="button"
                                onClick={() => moveBillPage(idx, 'down')}
                                className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                                title="Move Right"
                              >
                                <ChevronRight size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeBillPage(idx)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded"
                              title="Delete Page"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <div
                          onClick={() => {
                            setViewerPages(formData.billPages);
                            setViewerTitle(`${formData.productName || selectedStock?.productName} — Purchase Bill`);
                            setActiveViewerPageIndex(idx);
                            setViewerZoom(1);
                            setShowBillViewerModal(true);
                          }}
                          className="w-full h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer relative group/preview"
                        >
                          {page.fileType === 'pdf' || page.url.startsWith('data:application/pdf') ? (
                            <div className="text-center p-2">
                              <FileText size={28} className="text-red-500 mx-auto" />
                              <span className="text-[9px] font-mono text-slate-600 block truncate max-w-[80px] mt-1">PDF Doc</span>
                            </div>
                          ) : (
                            <img src={resolveImageUrl(page.url)} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover/preview:opacity-100 flex items-center justify-center gap-1 transition text-[10px] font-bold">
                            <Eye size={12} />
                            <span>Preview</span>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 truncate font-mono block">
                          {page.name || `Page ${idx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={billInput}
                    onChange={(e) => setBillInput(e.target.value)}
                    placeholder="Enter Bill Page URL (https://...)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={addBillUrlToForm}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add Page URL</span>
                  </button>
                  <label className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1">
                    <FilePlus size={13} />
                    <span>Upload Bill Page(s)</span>
                    <input type="file" multiple accept="image/*,application/pdf" onChange={handleBillUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description & Notes</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 48V 28Ah LFP battery pack with smart BMS..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Edit2 size={15} />
                  <span>{saving ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RECORD STOCK MOVEMENT MODAL                                            */}
      {/* ========================================================================= */}
      {showMovementModal && selectedStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800">Record Stock Movement</h3>
                <p className="text-xs text-slate-500">
                  Item: {selectedStock.productName} ({selectedStock.productId})
                </p>
              </div>
              <button onClick={() => setShowMovementModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordMovement} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Movement / Operation Type</label>
                <select
                  value={movementData.movementType}
                  onChange={(e) => setMovementData({ ...movementData, movementType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  {['Received', 'Sold', 'Issued', 'Returned', 'Transferred', 'Adjustment'].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity (Current: {selectedStock.quantity})</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({ ...movementData, quantity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source / Current Location</label>
                <input
                  type="text"
                  value={movementData.sourceLocation}
                  onChange={(e) => setMovementData({ ...movementData, sourceLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination / Target Location</label>
                <input
                  type="text"
                  value={movementData.destinationLocation}
                  onChange={(e) => setMovementData({ ...movementData, destinationLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operation Notes</label>
                <textarea
                  rows={2}
                  value={movementData.notes}
                  onChange={(e) => setMovementData({ ...movementData, notes: e.target.value })}
                  placeholder="Notes, dispatch invoice, or transfer reference..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <ArrowUpRight size={15} />
                  <span>{saving ? 'Recording...' : 'Confirm Operation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Camera Barcode Scanner Modal */}
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* ========================================================================= */}
      {/* 4. MULTI-PAGE BILL VIEWER MODAL                                           */}
      {/* ========================================================================= */}
      {showBillViewerModal && viewerPages.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{viewerTitle}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Page {activeViewerPageIndex + 1} of {viewerPages.length} • {viewerPages[activeViewerPageIndex]?.name || 'Document Page'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    onClick={() => setViewerZoom((z) => Math.max(0.5, z - 0.25))}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="font-mono text-[10px] text-slate-300 px-1 font-bold">{Math.round(viewerZoom * 100)}%</span>
                  <button
                    onClick={() => setViewerZoom((z) => Math.min(3, z + 0.25))}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                <a
                  href={resolveImageUrl(viewerPages[activeViewerPageIndex]?.url || '')}
                  target="_blank"
                  rel="noreferrer"
                  download={`bill-page-${activeViewerPageIndex + 1}`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  title="Open Original / Download"
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">Open</span>
                </a>

                <button
                  onClick={() => setShowBillViewerModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Canvas Body */}
            <div className="flex-1 bg-slate-950 p-4 overflow-auto flex items-center justify-center min-h-[400px]">
              {viewerPages[activeViewerPageIndex]?.fileType === 'pdf' ||
              viewerPages[activeViewerPageIndex]?.url?.startsWith('data:application/pdf') ? (
                <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
                  <iframe
                    src={viewerPages[activeViewerPageIndex]?.url}
                    title="PDF Document"
                    className="w-full h-[550px] rounded-xl border border-slate-800 bg-white"
                  />
                </div>
              ) : (
                <div
                  className="transition-transform duration-200 flex items-center justify-center"
                  style={{ transform: `scale(${viewerZoom})` }}
                >
                  <img
                    src={resolveImageUrl(viewerPages[activeViewerPageIndex]?.url || '')}
                    alt={`Page ${activeViewerPageIndex + 1}`}
                    className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-slate-800 bg-slate-900"
                  />
                </div>
              )}
            </div>

            {/* Footer Navigation Strip */}
            <div className="p-3 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeViewerPageIndex === 0}
                  onClick={() => setActiveViewerPageIndex((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Previous Page</span>
                </button>
                <button
                  disabled={activeViewerPageIndex === viewerPages.length - 1}
                  onClick={() => setActiveViewerPageIndex((p) => Math.min(viewerPages.length - 1, p + 1))}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Page</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
                {viewerPages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveViewerPageIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                      activeViewerPageIndex === idx
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Page {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
