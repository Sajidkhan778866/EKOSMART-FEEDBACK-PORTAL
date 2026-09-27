import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  RefreshCw,
  Scan,
  Battery,
  Bike,
  Wrench,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { stockApi } from '../api/client';
import ScannerModal from '../components/ScannerModal';

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
  mrp: number;
  location: string;
  status: 'In Stock' | 'Sold' | 'Reserved' | 'Damaged' | 'In Transit';
  warrantyPeriodMonths: number;
}

const CATEGORIES = ['All', 'Battery', 'EV Scooter', 'Spare Parts', 'Charger', 'Accessories'];

const Stock = () => {
  const [stockList, setStockList] = useState<IStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [meta, setMeta] = useState({ totalRecords: 0, totalQuantity: 0, inStockCount: 0 });

  // Scanner State
  const [showScanner, setShowScanner] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStock();
  }, [categoryFilter]);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await stockApi.getAll({
        search: search.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
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

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleScanSuccess = async (scannedSerial: string) => {
    setSearch(scannedSerial);
    try {
      const res = await stockApi.getBySerial(scannedSerial);
      if (res.data?.success && res.data.data) {
        showAlert('success', `Found matched item: ${res.data.data.productName} (${scannedSerial})`);
        setStockList([res.data.data]);
      } else {
        showAlert('error', `No stock found with serial: ${scannedSerial}`);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || `No stock matched serial "${scannedSerial}"`);
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
            Check real-time stock levels, available batteries, and scan item barcodes using your mobile camera.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowScanner(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer"
          >
            <Scan size={16} />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={fetchStock}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
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
          {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Units in Store</span>
            <Layers size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">{meta.totalQuantity}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{meta.totalRecords} Catalog Items</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Ready for Sale</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{meta.inStockCount}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">In Stock</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStock()}
            placeholder="Search by Product Name, Serial #, Battery Pack #, or Model..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Cards / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-emerald-500" />
            <span className="text-xs font-medium">Checking inventory levels...</span>
          </div>
        ) : stockList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Package size={36} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Stock Items Found</p>
            <p className="text-xs text-slate-400 max-w-sm">Try searching with a different serial or category filter.</p>
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
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
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
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.category === 'Battery' && <Battery size={12} className="text-emerald-500" />}
                        {item.category === 'EV Scooter' && <Bike size={12} className="text-blue-500" />}
                        {item.category === 'Spare Parts' && <Wrench size={12} className="text-amber-500" />}
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-700">
                      {item.batterySerialNumber || item.serialNumber || (
                        <span className="text-slate-400 italic">Non-serialized</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-black text-slate-900 text-sm">{item.quantity} units</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{item.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Camera Barcode Scanner Modal */}
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default Stock;
