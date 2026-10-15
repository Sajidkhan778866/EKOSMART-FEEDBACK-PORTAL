import { useState, useEffect, type FC } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
} from 'lucide-react';
import { leaveApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface LeaveManagementModalProps {
  isOpen?: boolean;
  employeeId?: string;
  employeeName?: string;
  onClose: () => void;
  onLeaveApplied?: () => void;
}

export const LeaveManagementModal: FC<LeaveManagementModalProps> = ({
  isOpen = true,
  employeeId,
  employeeName,
  onClose,
  onLeaveApplied,
}) => {
  const { user } = useAuth();
  const effectiveEmpId = employeeId || user?.employeeId;
  const effectiveEmpName = employeeName || user?.name || 'Staff Member';
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');

  // Form State
  const [leaveType, setLeaveType] = useState('Casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDaySession, setHalfDaySession] = useState<'first_half' | 'second_half'>('first_half');
  const [reason, setReason] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.mobile || '');

  // Live Auto-Calculation State
  const [calendarDays, setCalendarDays] = useState<number>(0);
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [weeklyOffs, setWeeklyOffs] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Submission & History State
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [summary, setSummary] = useState<{ approvedWorkingDays: number; pendingCount: number }>({
    approvedWorkingDays: 0,
    pendingCount: 0,
  });

  // Automatic recalculation immediately when either date changes or half-day toggles
  useEffect(() => {
    if (!startDate || !endDate) {
      setCalendarDays(0);
      setWorkingDays(0);
      setWeeklyOffs(0);
      setValidationError(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setValidationError('Please select valid calendar dates.');
      setCalendarDays(0);
      setWorkingDays(0);
      return;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end.getTime() < start.getTime()) {
      setValidationError('End date cannot be earlier than start date.');
      setCalendarDays(0);
      setWorkingDays(0);
      setWeeklyOffs(0);
      return;
    }

    setValidationError(null);

    if (isHalfDay) {
      setCalendarDays(0.5);
      setWorkingDays(0.5);
      setWeeklyOffs(0);
      return;
    }

    let calCount = 0;
    let workCount = 0;
    let offCount = 0;

    const curr = new Date(start);
    while (curr.getTime() <= end.getTime()) {
      calCount++;
      if (curr.getDay() === 0) {
        // Sunday = standard weekly off
        offCount++;
      } else {
        workCount++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    setCalendarDays(calCount);
    setWorkingDays(workCount);
    setWeeklyOffs(offCount);
  }, [startDate, endDate, isHalfDay]);

  const loadMyLeaves = async () => {
    try {
      setLoadingHistory(true);
      const res = await leaveApi.getMyLeaves(user?.employeeId);
      if (res.data?.success) {
        setMyLeaves(res.data.data || []);
        if (res.data.summary) {
          setSummary({
            approvedWorkingDays: res.data.summary.approvedWorkingDays || 0,
            pendingCount: res.data.summary.pendingCount || 0,
          });
        }
      }
    } catch (err) {
      console.error('Error loading leaves:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMyLeaves();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError || !startDate || !endDate || !reason.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitSuccess(null);
      const payload = {
        employeeId: effectiveEmpId,
        employeeName: effectiveEmpName,
        leaveType,
        startDate,
        endDate,
        isHalfDay,
        halfDaySession: isHalfDay ? halfDaySession : undefined,
        reason: reason.trim(),
        contactPhone,
      };

      const res = await leaveApi.apply(payload);
      if (res.data?.success) {
        setSubmitSuccess(res.data.message || 'Leave request submitted successfully.');
        setReason('');
        setStartDate('');
        setEndDate('');
        setIsHalfDay(false);
        await loadMyLeaves();
        onLeaveApplied?.();
        setTimeout(() => {
          setActiveTab('history');
          setSubmitSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      setValidationError(err.response?.data?.message || 'Failed to submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">Leave Management & Attendance</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatic calculation of working days & leave submission
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('apply')}
            className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'apply'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send size={14} />
            <span>Apply For Leave</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock size={14} />
            <span>Leave History ({myLeaves.length})</span>
          </button>
        </div>

        {/* Tab 1: Apply For Leave */}
        {activeTab === 'apply' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Leave Type & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Category *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Casual">Casual Leave (CL)</option>
                  <option value="Sick">Sick / Medical Leave (SL)</option>
                  <option value="Earned">Earned / Privilege Leave (EL)</option>
                  <option value="Emergency">Emergency Family Leave</option>
                  <option value="Compensatory">Compensatory Off (Comp-Off)</option>
                  <option value="Unpaid">Leave Without Pay (LWP)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Mobile Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Date Pickers with Automatic Recalculation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-600" />
                  <span>Start Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-600" />
                  <span>End Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Half-Day Option */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHalfDay}
                  onChange={(e) => {
                    setIsHalfDay(e.target.checked);
                    if (e.target.checked && startDate) {
                      setEndDate(startDate);
                    }
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Half-Day Leave (0.5 Day)</span>
              </label>

              {isHalfDay && (
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500">Session:</label>
                  <select
                    value={halfDaySession}
                    onChange={(e) => setHalfDaySession(e.target.value as any)}
                    className="border border-slate-300 rounded-lg p-1 text-xs font-semibold bg-white"
                  >
                    <option value="first_half">First Half (Morning Session)</option>
                    <option value="second_half">Second Half (Afternoon Session)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Live Automatic Duration Calculation Display */}
            {startDate && endDate && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Calculated Leave Duration (Verified)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">Sundays excluded automatically</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                    <p className="text-2xl font-black text-emerald-700">{workingDays}</p>
                    <p className="text-[11px] font-bold text-emerald-900 mt-0.5">Working Days</p>
                    <p className="text-[10px] text-slate-400">Leave applied</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                    <p className="text-2xl font-black text-slate-700">{calendarDays}</p>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">Calendar Days</p>
                    <p className="text-[10px] text-slate-400">Elapsed period</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                    <p className="text-2xl font-black text-amber-600">{weeklyOffs}</p>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">Weekly Offs</p>
                    <p className="text-[10px] text-slate-400">Non-working days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Leave *</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please state the specific reason for your leave request (e.g. personal emergency, health checkup, family function)..."
                className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !!validationError || !startDate || !endDate || !reason.trim()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Validating & Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Leave Application ({workingDays || 0} Working Days)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Leave History */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Approved Leaves</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">{summary.approvedWorkingDays} Days</p>
                <span className="text-[10px] text-emerald-600">Total approved working days</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Pending Requests</span>
                <p className="text-2xl font-black text-amber-700 mt-1">{summary.pendingCount}</p>
                <span className="text-[10px] text-amber-600">Awaiting management approval</span>
              </div>
            </div>

            {/* History Table */}
            {loadingHistory ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin text-emerald-600 mb-2" size={24} />
                <p className="text-xs font-semibold">Loading leave records...</p>
              </div>
            ) : myLeaves.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No leave requests found</p>
                <p className="text-[11px] text-slate-400">You have not submitted any leave applications yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {myLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{leave.leaveType} Leave</span>
                        {leave.isHalfDay && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            Half Day ({leave.halfDaySession === 'second_half' ? 'Afternoon' : 'Morning'})
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-mono font-semibold">
                        <Calendar size={13} className="text-slate-400" />
                        <span>
                          {new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {' → '}
                          {new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-700 font-mono">
                        {leave.workingDays} Working Day{leave.workingDays > 1 ? 's' : ''} ({leave.calendarDays} Cal)
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/70">
                      {leave.reason}
                    </p>

                    {leave.approvalRemarks && (
                      <p className="text-[11px] text-slate-500 italic">
                        <strong>Management Remarks:</strong> {leave.approvalRemarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
