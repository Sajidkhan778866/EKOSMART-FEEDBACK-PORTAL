import { useState, useEffect, type FormEvent } from 'react';
import {
  ClipboardList,
  Search,
  UserCheck,
  X,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { complaintApi, employeeApi, formApi } from '../api/client';
import { TicketDetailModal } from '../components/TicketDetailModal';

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
}

const Complaints = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
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
        division: divisionFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error(err);
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
  }, [divisionFilter, statusFilter]);

  const openAssignModal = async (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setSelectedEmployeeId(complaint.assignedTo?._id || '');
    setAssignMessage('');
    try {
      // Fetch ONLY employees eligible for this complaint's division
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Complaint Tracker</h1>
          <p className="text-slate-500 text-sm">Monitor, assign, and resolve customer service tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search ticket number, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700"
          >
            <option value="">All Divisions</option>
            {availableDivisions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={36} className="animate-spin text-green-600 mb-3" />
            <p className="text-sm font-medium">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ClipboardList size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-base font-semibold text-slate-700">No complaints found</p>
            <p className="text-xs text-slate-400 mt-1">New customer complaints will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Ticket Number</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Division / Type</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Assigned Engineer</th>
                  <th className="py-4 px-6 text-right">Actions</th>
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
                        <span className="font-mono font-bold text-slate-800 text-sm group-hover:text-green-600 group-hover:underline flex items-center gap-1.5">
                          <span>{c.ticketNumber}</span>
                          <Eye size={13} className="text-slate-400 group-hover:text-green-600" />
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800 text-sm">{c.customer?.name || 'Walk-in Customer'}</p>
                      <p className="text-xs text-slate-500">{c.customer?.mobile}</p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="font-semibold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full border border-slate-200 inline-block">
                          {c.division}
                        </span>
                        {c.complaintType && (
                          <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
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
                            ? 'bg-red-100 text-red-800 border-red-300'
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
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openAssignModal(c)}
                          className="bg-slate-100 hover:bg-green-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck size={14} />
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
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-green-600">
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
                <p><span className="text-slate-400">Division:</span> <span className="font-bold text-green-700">{selectedComplaint.division}</span></p>
                <p><span className="text-slate-400">Customer:</span> <span className="font-semibold text-slate-800">{selectedComplaint.customer?.name} ({selectedComplaint.customer?.mobile})</span></p>
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
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning || eligibleEmployees.length === 0}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50"
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
