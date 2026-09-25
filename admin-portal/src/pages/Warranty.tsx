import { useState, useEffect } from 'react';
import { ShieldCheck, Search, Loader2 } from 'lucide-react';
import { warrantyApi } from '../api/client';

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
  };
}

const Warranty = () => {
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const res = await warrantyApi.getAll({
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      if (res.data.success) {
        setWarranties(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Warranty Management</h1>
        <p className="text-slate-500 text-sm">Track active product warranties across Showroom and Plant sales</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search Warranty No, Serial No, Bill No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700"
          >
            <option value="">All Categories (Showroom & Plant)</option>
            <option value="Showroom">Showroom</option>
            <option value="Plant">Plant</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Warranties Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={36} className="animate-spin text-green-600 mb-3" />
            <p className="text-sm font-medium">Loading warranties...</p>
          </div>
        ) : warranties.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ShieldCheck size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-base font-semibold text-slate-700">No warranty records found</p>
            <p className="text-xs text-slate-400 mt-1">Customer registered warranties will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                    <td className="py-4 px-6 font-mono font-bold text-slate-800 text-sm">
                      {w.warrantyNumber}
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800 text-sm">{w.customer?.name || 'Customer'}</p>
                      <p className="text-xs text-slate-500">{w.customer?.mobile}</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{w.product}</p>
                      <p className="text-xs font-mono text-slate-500">S/N: {w.serialNumber}</p>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full border border-slate-200">
                        {w.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm text-slate-700 font-medium">
                      {new Date(w.warrantyExpiryDate).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          w.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
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
