import { useState, useEffect } from 'react';
import {
  X,
  ClipboardList,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Activity,
  UserCheck,
} from 'lucide-react';
import { complaintApi, employeeApi } from '../api/client';

interface TicketDetailModalProps {
  ticketIdOrNumber: string;
  onClose: () => void;
  onUpdated?: () => void;
}

export const TicketDetailModal = ({
  ticketIdOrNumber,
  onClose,
  onUpdated,
}: TicketDetailModalProps) => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Status & remarks update state
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Reassignment state
  const [showReassign, setShowReassign] = useState(false);
  const [eligibleEmployees, setEligibleEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await complaintApi.getById(ticketIdOrNumber);
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setTicket(data);
        setStatus(data.status || 'Pending');
        setPriority(data.priority || 'Medium');
        setAdminRemarks(data.remarks?.admin || '');
        setResolutionDetails(data.remarks?.resolutionDetails || '');
      } else {
        setError('Complaint details could not be loaded.');
      }
    } catch (err: any) {
      console.error('Failed to fetch ticket:', err);
      setError(err.response?.data?.message || 'Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketIdOrNumber) {
      fetchTicketDetails();
    }
  }, [ticketIdOrNumber]);

  const handleCopyTicket = () => {
    if (ticket?.ticketNumber) {
      navigator.clipboard.writeText(ticket.ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenReassign = async () => {
    setShowReassign(true);
    try {
      const res = await employeeApi.getEligible(ticket.division);
      if (res.data.success) {
        setEligibleEmployees(res.data.data);
        setSelectedEmployeeId(ticket.assignedTo?._id || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveReassign = async () => {
    if (!selectedEmployeeId || !ticket) return;
    setAssigning(true);
    try {
      const res = await complaintApi.assign(ticket._id, selectedEmployeeId);
      if (res.data.success) {
        setUpdateMsg('Engineer assigned successfully!');
        setShowReassign(false);
        fetchTicketDetails();
        if (onUpdated) onUpdated();
      }
    } catch (err: any) {
      setUpdateMsg(err.response?.data?.message || 'Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const handleSaveStatusAndRemarks = async () => {
    if (!ticket) return;
    setUpdating(true);
    setUpdateMsg('');
    try {
      const res = await complaintApi.updateStatus(ticket._id, status, priority, {
        adminRemarks,
        resolutionDetails,
      });
      if (res.data.success) {
        setUpdateMsg('Status & remarks saved successfully!');
        fetchTicketDetails();
        if (onUpdated) onUpdated();
        setTimeout(() => setUpdateMsg(''), 3000);
      }
    } catch (err: any) {
      setUpdateMsg(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Assigned':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (pr: string) => {
    switch (pr) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-medium';
      case 'Low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 font-medium';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {ticket?.division || 'Service Ticket'}
              </span>
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <span>{ticket?.ticketNumber || ticketIdOrNumber}</span>
                <button
                  onClick={handleCopyTicket}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Copy Ticket ID"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </h2>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-2">
              <span>Created: {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</span>
              <span>•</span>
              <span className="text-slate-300 font-semibold">{ticket?.complaintType || 'General Problem'}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={36} className="animate-spin text-green-600 mb-3" />
              <p className="text-sm font-semibold">Loading complete ticket dossier...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 space-y-3">
              <AlertCircle size={40} className="mx-auto" />
              <p className="font-semibold text-sm">{error}</p>
              <button
                onClick={fetchTicketDetails}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Notification Banner */}
              {updateMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>{updateMsg}</span>
                </div>
              )}

              {/* Top Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Priority</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border inline-block ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Division</span>
                  <span className="text-xs font-bold text-slate-800">{ticket.division}</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Complaint Type</span>
                  <span className="text-xs font-semibold text-slate-700 truncate block" title={ticket.complaintType}>
                    {ticket.complaintType || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Customer & Assigned Engineer Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                    <User size={16} className="text-green-600" />
                    <span>Customer Information</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Customer Name:</span>
                      <span className="font-bold text-slate-800">{ticket.customer?.name || 'Walk-in Customer'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Mobile Number:</span>
                      <a
                        href={`tel:${ticket.customer?.mobile}`}
                        className="font-mono font-bold text-green-700 hover:underline flex items-center gap-1"
                      >
                        <Phone size={12} />
                        <span>{ticket.customer?.mobile || 'N/A'}</span>
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Email Address:</span>
                      <span className="font-mono text-slate-700">{ticket.customer?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Address:</span>
                      <span className="font-medium text-slate-800 text-right max-w-[60%]">
                        {ticket.customer?.address || ticket.formData?.address || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Engineer Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <UserCheck size={16} className="text-indigo-600" />
                        <span>Assigned Technician / Engineer</span>
                      </div>
                      <button
                        onClick={handleOpenReassign}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      >
                        {ticket.assignedTo ? 'Reassign' : '+ Assign Now'}
                      </button>
                    </div>

                    {ticket.assignedTo ? (
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Engineer Name:</span>
                          <span className="font-bold text-slate-800">{ticket.assignedTo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Employee ID:</span>
                          <span className="font-mono font-bold text-indigo-700">{ticket.assignedTo.employeeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Designation:</span>
                          <span className="text-slate-700">{ticket.assignedTo.designation}</span>
                        </div>
                        {ticket.assignedTo.mobile && (
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Direct Phone:</span>
                            <span className="font-mono text-slate-800">{ticket.assignedTo.mobile}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-slate-400 text-xs">
                        <p>No engineer currently assigned to this ticket.</p>
                      </div>
                    )}
                  </div>

                  {showReassign && (
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 mt-3 space-y-2">
                      <label className="block text-[11px] font-bold text-indigo-900 uppercase">Select Available Engineer</label>
                      <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-indigo-200 rounded-lg font-medium text-slate-800"
                      >
                        <option value="">-- Choose Authorized Employee --</option>
                        {eligibleEmployees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} ({emp.employeeId} - {emp.designation})
                          </option>
                        ))}
                      </select>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowReassign(false)}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!selectedEmployeeId || assigning}
                          onClick={handleSaveReassign}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                        >
                          {assigning ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Problem Description & Dynamic Form Fields */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                  <ClipboardList size={16} className="text-amber-500" />
                  <span>Problem Description & Submitted Data</span>
                </div>

                {/* Primary Description */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Problem Summary / Description
                  </span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    {ticket.description || ticket.formData?.complaintDescription || 'No description provided.'}
                  </div>
                </div>

                {/* All Dynamic Submitted Fields Rendered Automatically */}
                {ticket.formData && Object.keys(ticket.formData).length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Dynamic Form Submissions ({Object.keys(ticket.formData).filter((k) => !['complaintDescription'].includes(k)).length} Fields)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(ticket.formData).map(([key, value]) => {
                        if (key === 'complaintDescription') return null;
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase());

                        return (
                          <div
                            key={key}
                            className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col justify-between"
                          >
                            <span className="text-[10px] uppercase font-bold text-slate-400 truncate">{formattedKey}</span>
                            <span className="text-xs font-semibold text-slate-800 mt-0.5 break-words font-mono">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline & Progress Log */}
              {ticket.timeline && ticket.timeline.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                    <Activity size={16} className="text-blue-600" />
                    <span>Complaint Action Timeline</span>
                  </div>
                  <div className="space-y-2.5">
                    {ticket.timeline.map((entry: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0"></div>
                        <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">{entry.status}</span>
                            <span className="text-[10px] text-slate-400">
                              {entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{entry.note}</p>
                          {entry.updatedBy && (
                            <span className="text-[10px] text-slate-400 font-mono block mt-1">By: {entry.updatedBy}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update & Remarks Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>Update Status, Priority & Administrative Remarks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Update Ticket Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-xs bg-white text-slate-800 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="New">New</option>
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Update Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-xs bg-white text-slate-800 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Admin Internal Remarks</label>
                    <textarea
                      rows={2}
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      placeholder="Add administrative notes regarding customer call or inspection..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Resolution & Handover Details</label>
                    <textarea
                      rows={2}
                      value={resolutionDetails}
                      onChange={(e) => setResolutionDetails(e.target.value)}
                      placeholder="Explain resolution (e.g. Cell replaced under warranty, testing passed)..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={handleSaveStatusAndRemarks}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>{updating ? 'Saving Updates...' : 'Save Ticket Updates'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
