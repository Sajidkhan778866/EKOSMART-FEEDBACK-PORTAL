import { useState, useEffect } from 'react';
import { Users, Search, Loader2 } from 'lucide-react';
import { customerApi } from '../api/client';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getAll({ search });
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Customer Directory</h1>
        <p className="text-slate-500 text-sm">Customers registered via Showroom, Plant sales, or Service tickets</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search Customer Name, Mobile, Customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-green-600" size={36} />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users size={48} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">No customer records yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Customer ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Mobile & Email</th>
                  <th className="py-4 px-6">Customer Type</th>
                  <th className="py-4 px-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-green-700">{c.customerId}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800 text-sm">{c.name}</td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <p>{c.mobile}</p>
                      <p className="text-slate-400">{c.email || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                        {c.customerType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
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

export default Customers;
