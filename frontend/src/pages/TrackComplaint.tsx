import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config/api';

const TrackComplaint = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!ticketNumber) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.get(`${API_BASE}/complaints/public/track/${ticketNumber.trim()}`);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'No complaint found with this ticket number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800">Track Complaint Status</h1>
        <p className="text-sm text-slate-500">Enter your ticket reference number to see real-time updates</p>
      </div>

      <form onSubmit={handleTrack} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="relative">
          <input
            type="text"
            required
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="e.g. SHR-20260912-0001, BAT-20260912-0001"
            className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
          />
          <Search size={20} className="absolute left-4 top-4 text-slate-400" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-green-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          <span>TRACK TICKET</span>
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Ticket Number</span>
              <h3 className="text-xl font-black font-mono text-green-700">{result.ticketNumber}</h3>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-xs">
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">Division</span>
              <span className="font-semibold text-slate-800">{result.division}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">Registered On</span>
              <span className="font-semibold text-slate-800">{new Date(result.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">Customer Name</span>
              <span className="font-semibold text-slate-800">{result.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">Assigned Engineer</span>
              <span className="font-semibold text-slate-800">{result.assignedEngineer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;
