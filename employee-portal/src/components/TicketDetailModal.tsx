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
} from 'lucide-react';
import { complaintApi } from '../api/client';

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
  const [employeeRemarks, setEmployeeRemarks] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await complaintApi.getById(ticketIdOrNumber);
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setTicket(data);
        setStatus(data.status || 'Pending');
        setEmployeeRemarks(data.remarks?.employee || '');
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

  const handleSaveStatusAndRemarks = async () => {
    if (!ticket) return;
    setUpdating(true);
    setUpdateMsg('');
    try {
      const res = await complaintApi.updateStatus(ticket._id, status, ticket.priority, {
        employeeRemarks,
        resolutionDetails,
      });
      if (res.data.success) {
        setUpdateMsg('Service report & status updated!');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-indigo-950 text-white p-6 flex justify-between items-start shrink-0 border-b border-indigo-900">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {ticket?.division || 'Assigned Ticket'}
              </span>
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <span>{ticket?.ticketNumber || ticketIdOrNumber}</span>
                <button
                  onClick={handleCopyTicket}
                  className="p-1 rounded-lg hover:bg-indigo-900 text-indigo-300 hover:text-white transition"
                  title="Copy Ticket ID"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </h2>
            </div>
            <p className="text-indigo-300 text-xs">
              Complaint Type: <b className="text-white">{ticket?.complaintType || 'General Problem'}</b>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-indigo-900 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={36} className="animate-spin text-indigo-600 mb-3" />
              <p className="text-sm font-semibold">Loading ticket problem dossier...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 space-y-3">
              <AlertCircle size={40} className="mx-auto" />
              <p className="font-semibold text-sm">{error}</p>
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

              {/* Status Header Badge */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Current Status</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>

              {/* Customer Info Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                  <User size={16} className="text-indigo-600" />
                  <span>Customer Contact Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Name:</span>
                    <span className="font-bold text-slate-800">{ticket.customer?.name || 'Walk-in Customer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Mobile Phone:</span>
                    <a href={`tel:${ticket.customer?.mobile}`} className="font-mono font-bold text-indigo-700 hover:underline flex items-center gap-1">
                      <Phone size={12} />
                      <span>{ticket.customer?.mobile || 'N/A'}</span>
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium block">Service Address:</span>
                    <span className="font-medium text-slate-800">{ticket.customer?.address || ticket.formData?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Complete Problem Description & Dynamic Form Fields */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                  <ClipboardList size={16} className="text-amber-500" />
                  <span>Problem Description & Submitted Data</span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Problem Summary / Description
                  </span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    {ticket.description || ticket.formData?.complaintDescription || 'No description provided.'}
                  </div>
                </div>

                {/* Dynamic Form Fields */}
                {ticket.formData && Object.keys(ticket.formData).length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Technical Submission Fields
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(ticket.formData).map(([key, value]) => {
                        if (key === 'complaintDescription') return null;
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase());

                        return (
                          <div key={key} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">{formattedKey}</span>
                            <span className="text-xs font-semibold text-slate-800 font-mono mt-0.5 block break-words">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Technician Update Status & Remarks */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2.5">
                  <CheckCircle2 size={16} className="text-indigo-600" />
                  <span>Update Job Progress & Service Report</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Update Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Assigned">Assigned (Received)</option>
                      <option value="In Progress">In Progress (Diagnosing)</option>
                      <option value="Resolved">Resolved (Work Done)</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Technician Remarks</label>
                    <textarea
                      rows={2}
                      value={employeeRemarks}
                      onChange={(e) => setEmployeeRemarks(e.target.value)}
                      placeholder="Add technician inspection notes..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Resolution & Replacement Details</label>
                    <textarea
                      rows={2}
                      value={resolutionDetails}
                      onChange={(e) => setResolutionDetails(e.target.value)}
                      placeholder="e.g. Verified BMS cell balance, replaced cell #4 under warranty..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={handleSaveStatusAndRemarks}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>{updating ? 'Saving...' : 'Update Ticket'}</span>
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
