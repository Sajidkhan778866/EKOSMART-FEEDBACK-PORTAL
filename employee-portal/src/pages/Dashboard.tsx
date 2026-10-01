import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  UserCheck,
  Loader2,
  QrCode,
  Eye,
  FileSpreadsheet,
  Package,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { empAuthApi, resolveImageUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { IdCardModal } from '../components/IdCardModal';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { DateRangeFilter, PRESET_LABELS, type DateRangeState } from '../components/DateRangeFilter';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIdCard, setShowIdCard] = useState(false);
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  // Date Filter (Default: TODAY as requested)
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'today' });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const empId = user?.employeeId || 'TEST-EMP-001';
      const params = {
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
      const res = await empAuthApi.getDashboard(empId, params);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load employee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user, dateRange]);

  if (loading && !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin text-emerald-600 mb-3" size={36} />
        <p className="text-sm font-medium">Loading your operations workspace...</p>
      </div>
    );
  }

  const [viewTab, setViewTab] = useState<'period' | 'all'>('all');

  const employee = data?.employee || user;
  const stats = data?.stats || {
    assignedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalAllTime: 0,
    resolvedAllTime: 0,
    pendingAllTime: 0,
    inProgressAllTime: 0,
  };

  const periodTickets = data?.periodAssignments || [];
  const allTimeTickets = data?.allTimeAssignments || data?.recentAssignments || [];
  const displayedTickets = viewTab === 'period' ? periodTickets : allTimeTickets;

  const dateLabel = PRESET_LABELS[dateRange.filter] || 'Period';

  return (
    <div className="space-y-6 max-w-7xl pb-12">
      {/* Top Filter Bar: Date Range (Defaults to TODAY) */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Metrics Scope:</span>
          <DateRangeFilter
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
              if (newRange.filter === 'all') setViewTab('all');
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          {dateRange.filter !== 'all' && (
            <button
              type="button"
              onClick={() => setDateRange({ filter: 'all' })}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              View All-Time
            </button>
          )}
          <button
            type="button"
            onClick={fetchDashboard}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-emerald-600">
        <div className="flex items-center gap-4">
          {employee?.photoUrl ? (
            <img
              src={resolveImageUrl(employee.photoUrl)}
              alt={employee.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl flex items-center justify-center border-2 border-emerald-500">
              {employee?.name?.slice(0, 2).toUpperCase() || 'EM'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-800">{employee?.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {employee?.designation} • {employee?.department}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {employee?.division?.map((div: string) => (
                <span
                  key={div}
                  className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md border border-emerald-200"
                >
                  {div}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee ID</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">{employee?.employeeId}</span>
          </div>

          <button
            onClick={() => setShowIdCard(true)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer"
            title="View & Download Official ID Badge"
          >
            <QrCode size={16} />
            <span>Digital ID Badge</span>
          </button>

          <Link
            to="/salary"
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-emerald-950/20 cursor-pointer"
            title="View & Print Official Monthly Salary Slip"
          >
            <FileSpreadsheet size={16} />
            <span>My Salary Slip</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Filtered by Selected Date Preset) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setViewTab(dateRange.filter === 'all' ? 'all' : 'period')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-slate-700 cursor-pointer hover:shadow-md transition"
        >
          <div className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl">
            <ClipboardList size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              {dateRange.filter === 'today' ? "Today's Work Orders" : 'Assigned in Period'}
            </h3>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{stats.assignedComplaints}</p>
            <span className="text-[10px] text-slate-400">
              Total in queue: <strong className="text-slate-700">{stats.totalAllTime || allTimeTickets.length}</strong>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-amber-500">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">In Progress</h3>
            <p className="text-2xl font-black text-amber-700 mt-0.5">{stats.inProgressComplaints}</p>
            <span className="text-[10px] text-amber-600 font-semibold">
              Active: {stats.inProgressAllTime ?? stats.inProgressComplaints}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-emerald-500">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              {dateRange.filter === 'today' ? 'Resolved Today' : 'Resolved in Period'}
            </h3>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{stats.resolvedComplaints}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">
              All-Time: {stats.resolvedAllTime || stats.resolvedComplaints} closed
            </span>
          </div>
        </div>

        <Link
          to="/salary"
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-teal-500 hover:shadow-md transition group cursor-pointer"
        >
          <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl group-hover:scale-110 transition">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Official Remuneration</h3>
            <p className="text-xs font-bold text-teal-700 mt-1 flex items-center gap-1">
              <span>View Salary Statement</span>
              <Eye size={13} />
            </p>
            <span className="text-[10px] text-slate-400">Soft-coded payroll record</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/stock"
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition flex items-center gap-3 shadow-2xs"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Inventory & Stock</h4>
            <p className="text-[10px] text-slate-400">Barcode scan & check</p>
          </div>
        </Link>

        <Link
          to="/billing"
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition flex items-center gap-3 shadow-2xs"
        >
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Receipt size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Showroom POS</h4>
            <p className="text-[10px] text-slate-400">Generate sales invoice</p>
          </div>
        </Link>

        <button
          onClick={() => {
            setViewTab('all');
            const el = document.getElementById('assigned-table-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition flex items-center gap-3 shadow-2xs text-left cursor-pointer"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <ClipboardList size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Tickets Queue</h4>
            <p className="text-[10px] text-slate-400">{allTimeTickets.length} Assigned Service Logs</p>
          </div>
        </button>

        <Link
          to="/salary"
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition flex items-center gap-3 shadow-2xs"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Salary Slip</h4>
            <p className="text-[10px] text-slate-400">Monthly payslips & print</p>
          </div>
        </Link>
      </div>

      {/* Assigned Tickets Table */}
      <div id="assigned-table-section" className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Assigned Service Work Orders</h2>
            <p className="text-xs text-slate-400">Customer tickets assigned to your engineer queue</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewTab('period')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewTab === 'period'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dateLabel} ({periodTickets.length})
              </button>
              <button
                type="button"
                onClick={() => setViewTab('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewTab === 'all'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All-Time ({allTimeTickets.length})
              </button>
            </div>

            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
              {displayedTickets.length} Listed
            </span>
          </div>
        </div>

        {/* Informative alert when period has 0 but all-time has items */}
        {viewTab === 'period' && periodTickets.length === 0 && allTimeTickets.length > 0 && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-3">
            <span>
              ℹ️ No new work orders logged for <strong>{dateLabel}</strong>. You have <strong>{allTimeTickets.length} service tickets</strong> in your overall all-time queue.
            </span>
            <button
              onClick={() => setViewTab('all')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition"
            >
              View All {allTimeTickets.length} Tickets
            </button>
          </div>
        )}

        {displayedTickets.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <UserCheck size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No service tickets found for {viewTab === 'period' ? dateLabel : 'All-Time'}.</p>
            {viewTab === 'period' && allTimeTickets.length > 0 && (
              <button
                onClick={() => setViewTab('all')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Show All {allTimeTickets.length} Assigned Tickets
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Division</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned / Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedTickets.map((c: any) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="font-mono font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-1"
                        title="Click to view full problem dossier & update progress"
                      >
                        <span>{c.ticketNumber}</span>
                        <Eye size={12} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{c.customer?.name || 'Walk-in Customer'}</p>
                      <p className="text-[11px] text-slate-500">{c.customer?.mobile}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                        {c.division}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ['Resolved', 'Closed'].includes(c.status)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : c.status === 'In Progress'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(c.updatedAt || c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Inspect & Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ID Card Modal */}
      {showIdCard && <IdCardModal employee={employee} onClose={() => setShowIdCard(false)} />}

      {/* Ticket Dossier & Update Modal */}
      {selectedTicketIdOrNumber && (
        <TicketDetailModal
          ticketIdOrNumber={selectedTicketIdOrNumber}
          onClose={() => setSelectedTicketIdOrNumber(null)}
          onUpdated={fetchDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;
