import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Loader2,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';
import { warrantyApi } from '../api/client';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

interface WarrantyItem {
  _id: string;
  warrantyNumber: string;
  category: 'Showroom' | 'Plant';
  product: string;
  serialNumber: string;
  billNumber: string;
  purchaseDate: string;
  warrantyExpiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  customer?: {
    name: string;
    mobile: string;
    email?: string;
    customerId?: string;
  };
}

const Warranty = () => {
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });
  const [exporting, setExporting] = useState(false);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const params: any = {
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      };

      if (dateRange.filter !== 'all') {
        params.datePreset = dateRange.filter;
        if (dateRange.filter === 'custom') {
          if (dateRange.startDate) params.startDate = dateRange.startDate;
          if (dateRange.endDate) params.endDate = dateRange.endDate;
        }
      }

      const res = await warrantyApi.getAll(params);
      if (res.data.success) {
        setWarranties(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch warranties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [categoryFilter, statusFilter, dateRange]);

  const handleExportWarranties = async () => {
    try {
      setExporting(true);
      const params: any = {
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      };

      if (dateRange.filter !== 'all') {
        params.datePreset = dateRange.filter;
        if (dateRange.filter === 'custom') {
          if (dateRange.startDate) params.startDate = dateRange.startDate;
          if (dateRange.endDate) params.endDate = dateRange.endDate;
        }
      }

      try {
        const res = await warrantyApi.export(params);
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `ekosmart_warranties_export_${dateStr}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      } catch (apiErr) {
        console.warn('API export encountered error, using client-side CSV generator:', apiErr);
      }

      // Client-side fallback generator ensuring export NEVER fails
      const headers = [
        'Warranty Number',
        'Category',
        'Product Model',
        'Serial Number',
        'Bill Number',
        'Customer Name',
        'Customer Mobile',
        'Purchase Date',
        'Expiry Date',
        'Status',
      ];

      const escapeCsv = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

      const rows = warranties.map((w) => [
        escapeCsv(w.warrantyNumber),
        escapeCsv(w.category),
        escapeCsv(w.product),
        escapeCsv(w.serialNumber),
        escapeCsv(w.billNumber),
        escapeCsv(w.customer?.name || ''),
        escapeCsv(w.customer?.mobile || ''),
        escapeCsv(w.purchaseDate ? new Date(w.purchaseDate).toLocaleDateString('en-IN') : ''),
        escapeCsv(w.warrantyExpiryDate ? new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN') : ''),
        escapeCsv(w.status),
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart_warranties_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export warranty records.');
    } finally {
      setExporting(false);
    }
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setStatusFilter('');
    setSearch('');
    setDateRange({ filter: 'all' });
  };

  const hasActiveFilters = categoryFilter || statusFilter || search || dateRange.filter !== 'all';

  return (
    <div className="space-y-6 max-w-7xl pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>Warranty Management</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {warranties.length} Records
            </span>
          </h1>
          <p className="text-slate-500 text-sm">
            Track active product warranties, serial numbers, and customer registrations across Showroom and Plant sales
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Universal Date Range Filter */}
          <DateRangeFilter value={dateRange} onChange={setDateRange} showAllOption={true} />

          {/* Primary Export Button */}
          <button
            type="button"
            onClick={handleExportWarranties}
            disabled={exporting || loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            title="Download Excel / CSV spreadsheet"
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileSpreadsheet size={14} />
            )}
            <span>Export Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search Warranty No, Serial No, Bill No, Name, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWarranties()}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories (Showroom & Plant)</option>
            <option value="Showroom">Showroom</option>
            <option value="Plant">Plant</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition border border-rose-200 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Warranties Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={36} className="animate-spin text-emerald-600 mb-3" />
            <p className="text-sm font-medium">Loading warranties...</p>
          </div>
        ) : warranties.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ShieldCheck size={48} className="mx-auto mb-3 opacity-50 text-emerald-600" />
            <p className="text-base font-semibold text-slate-700">No warranty records found</p>
            <p className="text-xs text-slate-400 mt-1">Customer registered warranties matching current filters will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6">Warranty Number</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Product & Serial</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warranties.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-800">
                      {w.warrantyNumber}
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{w.customer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-500">{w.customer?.mobile}</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">{w.product}</p>
                      <p className="text-[11px] font-mono text-slate-500">S/N: {w.serialNumber}</p>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full border border-slate-200">
                        {w.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {w.warrantyExpiryDate ? new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN') : '-'}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          w.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : w.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warranty;
