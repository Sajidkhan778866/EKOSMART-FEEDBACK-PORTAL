import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Loader2,
  AlertCircle,
  Eye,
  Clock,
  CheckCircle,
  RotateCcw,
  Building2,
  Filter,
} from 'lucide-react';
import { complaintApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

interface ComplaintItem {
  _id: string;
  ticketNumber: string;
  division: string;
  status: 'New' | 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | string;
  complaintType?: string;
  description?: string;
  customer?: {
    name: string;
    mobile: string;
    email?: string;
    address?: string;
  };
  assignedTo?: {
    _id: string;
    employeeId: string;
    name: string;
    designation: string;
  };
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  formData?: any;
}

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'inProgress' | 'resolved' | 'all'>('active');

  // Date Filter (defaults to 'all' so full operational queue is visible, with quick Today filter)
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });

  const [divisionFilter, setDivisionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Selected Ticket for Details & Status Sync
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  // Authorized divisions from logged-in employee profile
  const authorizedDivisions = (Array.isArray(user?.division) && user.division.length > 0)
    ? user.division
    : user?.department ? [user.department] : ['Battery', 'Rental', 'Showroom', 'Spare Parts'];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params: any = {
        employeeId: user?.employeeId,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        search: search.trim() || undefined,
      };

      if (divisionFilter && divisionFilter !== 'All') {
        params.division = divisionFilter;
      }

      if (statusFilter && statusFilter !== 'All') {
        params.status = statusFilter;
      } else if (activeTab === 'active') {
        params.scope = 'active';
      } else if (activeTab === 'inProgress') {
        params.status = 'In Progress';
      } else if (activeTab === 'resolved') {
        params.scope = 'resolved';
      }

      const res = await complaintApi.getAll(params);
      if (res.data?.success) {
        setComplaints(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employee complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user, activeTab, divisionFilter, statusFilter, dateRange]);

  // Tab counts
  const activeCount = complaints.filter((c) => ['New', 'Pending', 'Assigned', 'In Progress'].includes(c.status)).length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Assigned':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200 font-bold';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl pb-12">
      {/* Top Banner with Authorization Scope */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
              <ClipboardList size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">Authorized Operations & Complaints Queue</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Service tickets strictly filtered to your authorized department & divisions.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Building2 size={13} className="text-emerald-400" />
              <span>Department:</span>
              <strong className="text-white">{user?.department || 'Operations'}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-semibold">Authorized Divisions:</span>
            {authorizedDivisions.map((div: string) => (
              <span
                key={div}
                className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
              >
                {div}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={fetchComplaints}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/10 cursor-pointer shadow-sm"
        >
          <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Scope Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
            activeTab === 'active'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Active Queue</span>
            <ClipboardList size={16} />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-1">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Unresolved & Today</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inProgress')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
            activeTab === 'inProgress'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Clock size={16} />
          </div>
          <p className="text-2xl font-black text-amber-800 mt-1">{inProgressCount}</p>
          <span className="text-[11px] text-slate-400">Being serviced</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resolved')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
            activeTab === 'resolved'
              ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle size={16} />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-1">{resolvedCount}</p>
          <span className="text-[11px] text-slate-400">Completed dossiers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
            activeTab === 'all'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider">All Records</span>
            <Filter size={16} />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-1">{complaints.length}</p>
          <span className="text-[11px] text-slate-400">Complete archive</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by ticket #, customer, mobile, or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchComplaints();
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Division Filter (Restricted to Authorized Divisions) */}
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-medium text-slate-700"
          >
            <option value="">All Authorized Divisions</option>
            {authorizedDivisions.map((div: string) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                fetchComplaints();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin text-emerald-600 mb-2" size={30} />
            <p className="text-xs font-semibold">Loading synchronized complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <AlertCircle size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No complaints found</p>
            <p className="text-xs text-slate-400">
              There are no active or matching complaints for your authorized scope.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ticket Number</th>
                  <th className="py-3.5 px-4">Division</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Issue Summary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/60 transition group cursor-pointer"
                    onClick={() => setSelectedTicketIdOrNumber(item.ticketNumber || item._id)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {item.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200 text-[11px]">
                        {item.division}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{item.customer?.name || 'Walk-in Customer'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.customer?.mobile}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-700 truncate">{item.complaintType || 'General Issue'}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.description || item.formData?.complaintDescription || 'No description provided'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-medium">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketIdOrNumber(item.ticketNumber || item._id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Eye size={13} />
                        <span>View / Action</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Action Modal (Synchronized Status Updates) */}
      {selectedTicketIdOrNumber && (
        <TicketDetailModal
          ticketIdOrNumber={selectedTicketIdOrNumber}
          onClose={() => {
            setSelectedTicketIdOrNumber(null);
            fetchComplaints();
          }}
        />
      )}
    </div>
  );
};

export default Complaints;
