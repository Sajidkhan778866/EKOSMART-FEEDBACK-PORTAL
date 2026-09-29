import { useState, useEffect, type FormEvent } from 'react';
import {
  ClipboardList,
  Search,
  UserCheck,
  X,
  Loader2,
  AlertCircle,
  Eye,
  Download,
  Clock,
  Archive,
  RefreshCw,
} from 'lucide-react';
import { complaintApi, employeeApi, formApi } from '../api/client';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

interface ComplaintItem {
  _id: string;
  ticketNumber: string;
  division: 'Battery' | 'Rental' | 'Showroom' | 'Spare Parts' | string;
  status: 'New' | 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  complaintType?: string;
  customer?: {
    name: string;
    mobile: string;
    email?: string;
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
}

const Complaints = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  // Date Filters (Default ALL for full records, or TODAY if preferred)
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });

  const [divisionFilter, setDivisionFilter] = useState('');
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([
    'Battery',
    'Rental',
    'Showroom',
    'Spare Parts',
    'Plant',
    'Warranty',
  ]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  // Ticket Dossier Modal
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  // Assignment Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [eligibleEmployees, setEligibleEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintApi.getAll({
        scope: activeTab, // 'active' or 'resolved'
        division: divisionFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    formApi
      .getSections()
      .then((res: any) => {
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAvailableDivisions(res.data.data);
        }
      })
      .catch((e: any) => console.warn(e));
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [activeTab, divisionFilter, statusFilter, dateRange]);

  const handleExportComplaints = async () => {
    try {
      setExporting(true);
      const res = await complaintApi.export({
        scope: activeTab,
        division: divisionFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complaints-${activeTab}-${dateRange.filter.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export complaints:', err);
    } finally {
      setExporting(false);
    }
  };

  const openAssignModal = async (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setSelectedEmployeeId(complaint.assignedTo?._id || '');
    setAssignMessage('');
    try {
      const res = await employeeApi.getEligible(complaint.division);
      if (res.data.success) {
        setEligibleEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch eligible employees:', err);
    }
  };

  const handleAssignSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedEmployeeId) return;

    setAssigning(true);
    try {
      const res = await complaintApi.assign(selectedComplaint._id, selectedEmployeeId);
      if (res.data.success) {
        setAssignMessage('Complaint assigned successfully!');
        setSelectedComplaint(null);
        fetchComplaints();
      }
    } catch (err: any) {
      setAssignMessage(err.response?.data?.message || 'Failed to assign complaint');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await complaintApi.updateStatus(id, newStatus);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Complaint Tracker & History Archive</h1>
          <p className="text-slate-500 text-sm">
            Monitor active service tickets, assign field engineers, and inspect resolved historical records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchComplaints}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition cursor-pointer shadow-xs"
            title="Refresh Complaints"
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            disabled={exporting}
            onClick={handleExportComplaints}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>Export {activeTab === 'active' ? 'Active' : 'Resolved'} (CSV)</span>
          </button>
        </div>
      </div>

      {/* Tabs: Active Complaints vs Resolved & Closed History */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('active');
            setStatusFilter('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'active'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock size={15} className={activeTab === 'active' ? 'text-amber-400' : 'text-slate-400'} />
          <span>Active Complaints Queue</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('resolved');
            setStatusFilter('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'resolved'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Archive size={15} className={activeTab === 'resolved' ? 'text-emerald-400' : 'text-slate-400'} />
          <span>Resolved & Closed History Archive</span>
        </button>
      </div>

      {/* Top Filter Bar: Date Range + Search + Dropdown Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <DateRangeFilter
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        {/* Search and Dropdowns */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search ticket #, customer mobile, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchComplaints()}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>

          <div className="flex gap-2 w-full md:w-auto flex-wrap">
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold cursor-pointer"
            >
              <option value="">All Service Divisions</option>
              {availableDivisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold cursor-pointer"
            >
              <option value="">
                {activeTab === 'active' ? 'All Active Statuses' : 'All Resolved Statuses'}
              </option>
              {activeTab === 'active' ? (
                <>
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                </>
              ) : (
                <>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={36} className="animate-spin text-emerald-600 mb-3" />
            <p className="text-sm font-medium">Loading {activeTab === 'active' ? 'active' : 'historical'} complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            {activeTab === 'active' ? (
              <ClipboardList size={44} className="mx-auto opacity-40 text-slate-400" />
            ) : (
              <Archive size={44} className="mx-auto opacity-40 text-slate-400" />
            )}
            <p className="text-base font-bold text-slate-700">
              {activeTab === 'active' ? 'No Active Complaints' : 'No Resolved Records Found'}
            </p>
            <p className="text-xs text-slate-400">
              {activeTab === 'active'
                ? 'All customer complaints have been resolved or closed.'
                : 'Resolved complaints and historical work orders will be archived here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">Ticket Details</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Division & Category</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Assigned Engineer</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="group flex flex-col text-left cursor-pointer"
                        title="Click to view full problem dossier"
                      >
                        <span className="font-mono font-bold text-slate-800 text-sm group-hover:text-emerald-600 group-hover:underline flex items-center gap-1.5">
                          <span>{c.ticketNumber}</span>
                          <Eye size={13} className="text-slate-400 group-hover:text-emerald-600" />
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Registered: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800 text-sm">{c.customer?.name || 'Walk-in Customer'}</p>
                      <p className="text-xs text-slate-500">{c.customer?.mobile}</p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 inline-block">
                          {c.division}
                        </span>
                        {c.complaintType && (
                          <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">
                            {c.complaintType}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                          c.status === 'Resolved' || c.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : c.status === 'In Progress'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : c.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : c.status === 'Assigned'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 px-6">
                      {c.assignedTo ? (
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.assignedTo.name}</p>
                          <span className="text-[10px] font-mono text-slate-500">{c.assignedTo.employeeId}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="View Full Dossier"
                        >
                          <Eye size={13} />
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => openAssignModal(c)}
                          className="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck size={13} />
                          <span>{c.assignedTo ? 'Reassign' : 'Assign'}</span>
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

      {/* ================= ASSIGNMENT MODAL ================= */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-emerald-600">
              <div>
                <h3 className="font-bold text-base">Assign Complaint</h3>
                <p className="text-slate-400 text-xs font-mono">{selectedComplaint.ticketNumber}</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              {assignMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{assignMessage}</span>
                </div>
              )}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <p>
                  <span className="text-slate-400">Division:</span>{' '}
                  <span className="font-bold text-emerald-700">{selectedComplaint.division}</span>
                </p>
                <p>
                  <span className="text-slate-400">Customer:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {selectedComplaint.customer?.name} ({selectedComplaint.customer?.mobile})
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Eligible {selectedComplaint.division} Engineer
                </label>
                {eligibleEmployees.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-200">
                    No active staff currently authorized for <span className="font-bold">{selectedComplaint.division}</span> division. Please add or update an employee.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose Authorized Employee --</option>
                    {eligibleEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeeId}) - {emp.designation}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning || eligibleEmployees.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {assigning ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TICKET DOSSIER MODAL ================= */}
      {selectedTicketIdOrNumber && (
        <TicketDetailModal
          ticketIdOrNumber={selectedTicketIdOrNumber}
          onClose={() => setSelectedTicketIdOrNumber(null)}
          onUpdated={fetchComplaints}
        />
      )}
    </div>
  );
};

export default Complaints;
