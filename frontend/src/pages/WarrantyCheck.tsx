import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, ShieldCheck, AlertCircle, ExternalLink, PlusCircle } from 'lucide-react';
import { API_BASE } from '../config/api';

const WarrantyCheck = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await axios.get(`${API_BASE}/warranty/public/check?identifier=${encodeURIComponent(identifier.trim())}`);
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'No active warranty records found matching your search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Check Warranty Validity</h1>
          <p className="text-sm text-slate-500">Search by Warranty Number, Product Serial Number, Bill Number, or Mobile</p>
        </div>
        <a
          href="/warranty/register"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <PlusCircle size={14} />
          <span>Register New Warranty</span>
          <ExternalLink size={12} className="text-emerald-500" />
        </a>
      </div>

      <form onSubmit={handleCheck} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="relative">
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter Warranty No, Serial No, Bill No, or Mobile..."
            className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search size={20} className="absolute left-4 top-4 text-slate-400" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-green-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
          <span>CHECK WARRANTY STATUS</span>
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((w, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Warranty Number</span>
                  <h3 className="text-lg font-black font-mono text-green-700">{w.warrantyNumber}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs ${
                    w.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : w.status === 'Expiring Soon'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {w.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Product</span>
                  <span className="font-semibold text-slate-800">{w.product}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Category</span>
                  <span className="font-semibold text-slate-800">{w.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Serial Number</span>
                  <span className="font-mono text-slate-700">{w.serialNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Purchase Date</span>
                  <span className="font-semibold text-slate-800">{new Date(w.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Expiry Date</span>
                  <span className="font-semibold text-slate-800">{new Date(w.warrantyExpiryDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Days Remaining</span>
                  <span className="font-bold text-green-700">{w.remainingDays} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarrantyCheck;
