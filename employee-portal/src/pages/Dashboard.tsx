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

  const [filterTab, setFilterTab] = useState<'active' | 'inProgress' | 'closed' | 'all'>('active');

  const employee = data?.employee || user;
  const stats = data?.stats || {
    assignedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalAllTime: 0,
    resolvedAllTime: 0,
    unresolvedAllTime: 0,
    inProgressAllTime: 0,
    todayTotal: 0,
    activeQueueCount: 0,
    closedQueueCount: 0,
  };

  const allTickets: any[] = data?.allTimeAssignments || data?.recentAssignments || [];
  
  const unresolvedAllTimeCount = (st: any, all: any[]) =>
    st.unresolvedAllTime ??
    all.filter((c: any) => ['New', 'Pending', 'Assigned', 'In Progress'].includes(c.status)).length;
  
  // 1. Active Queue: Today's complaints + All Unresolved complaints
  const activeTickets: any[] = (data?.activeAssignments && data.activeAssignments.length > 0)
    ? data.activeAssignments
    : allTickets.filter((c: any) => {
        const isUnresolved = ['New', 'Pending', 'Assigned', 'In Progress'].includes(c.status);
        const isToday = new Date(c.updatedAt || c.createdAt).toDateString() === new Date().toDateString();
        return isUnresolved || isToday;
      });

  // 2. Closed / Resolved complaints (Shown on clicking only)
  const closedTickets: any[] = (data?.closedAssignments && data.closedAssignments.length > 0)
    ? data.closedAssignments
    : allTickets.filter((c: any) => ['Resolved', 'Closed', 'Rejected'].includes(c.status));

  // 3. In Progress complaints
  const inProgressTickets: any[] = allTickets.filter((c: any) => c.status === 'In Progress');

  const displayedTickets =
    filterTab === 'active'
      ? activeTickets
      : filterTab === 'inProgress'
      ? inProgressTickets
      : filterTab === 'closed'
      ? closedTickets
      : allTickets;

  return (
    <div className="space-y-6 max-w-7xl pb-12">
      {/* Top Filter Bar: Date Range (Defaults to TODAY) */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Metrics Scope ({PRESET_LABELS[dateRange.filter] || 'Period'}):
          </span>
          <DateRangeFilter
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
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

      {/* KPI Cards (Interactive Quick Toggles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today & Active Queue */}
        <div
          onClick={() => {
            setFilterTab('active');
            const el = document.getElementById('assigned-table-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`p-5 rounded-3xl shadow-sm border transition cursor-pointer ${
            filterTab === 'active'
              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white border-slate-100 hover:shadow-md'
          } flex items-center gap-4 border-t-4 border-t-slate-700`}
        >
          <div className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl">
            <ClipboardList size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              Today & Unresolved
            </h3>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{activeTickets.length}</p>
            <span className="text-[10px] text-slate-500">
              Active Queue ({unresolvedAllTimeCount(stats, allTickets)} Unresolved)
            </span>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div
          onClick={() => {
            setFilterTab('inProgress');
            const el = document.getElementById('assigned-table-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`p-5 rounded-3xl shadow-sm border transition cursor-pointer ${
            filterTab === 'inProgress'
              ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-white border-slate-100 hover:shadow-md'
          } flex items-center gap-4 border-t-4 border-t-amber-500`}
        >
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">In Progress</h3>
            <p className="text-2xl font-black text-amber-700 mt-0.5">{inProgressTickets.length}</p>
            <span className="text-[10px] text-amber-600 font-semibold">
              Active investigations
            </span>
          </div>
        </div>

        {/* Card 3: Closed / Resolved (Click to Show Closed History) */}
        <div
          onClick={() => {
            setFilterTab('closed');
            const el = document.getElementById('assigned-table-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`p-5 rounded-3xl shadow-sm border transition cursor-pointer ${
            filterTab === 'closed'
              ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-500/20 shadow-md'
              : 'bg-white border-slate-100 hover:shadow-md'
          } flex items-center gap-4 border-t-4 border-t-emerald-500`}
        >
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              Resolved & Closed
            </h3>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{closedTickets.length}</p>
            <span className="text-[10px] text-emerald-700 font-bold underline">
              Click to view {closedTickets.length} closed
            </span>
          </div>
        </div>

        {/* Card 4: Official Remuneration */}
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
            setFilterTab('active');
            const el = document.getElementById('assigned-table-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition flex items-center gap-3 shadow-2xs text-left cursor-pointer"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <ClipboardList size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Active Queue</h4>
            <p className="text-[10px] text-slate-400">{activeTickets.length} Today & Unresolved</p>
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Service Work Orders Queue</h2>
            <p className="text-xs text-slate-400">
              {filterTab === 'active'
                ? "Today's work orders & all unresolved tickets requiring action"
                : filterTab === 'closed'
                ? "Completed & resolved customer service dossiers"
                : filterTab === 'inProgress'
                ? "Active investigations currently underway"
                : "Complete assigned history"}
            </p>
          </div>

          {/* Interactive Queue Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'active'
                  ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡ Today & Unresolved</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterTab === 'active' ? 'bg-emerald-100 text-emerald-800 font-black' : 'bg-slate-200 text-slate-700'}`}>
                {activeTickets.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('inProgress')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'inProgress'
                  ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⏳ In Progress</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterTab === 'inProgress' ? 'bg-amber-100 text-amber-800 font-black' : 'bg-slate-200 text-slate-700'}`}>
                {inProgressTickets.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('closed')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'closed'
                  ? 'bg-white text-purple-800 shadow-xs ring-1 ring-purple-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>✅ Closed / Resolved</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterTab === 'closed' ? 'bg-purple-100 text-purple-800 font-black' : 'bg-slate-200 text-slate-700'}`}>
                {closedTickets.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-400/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📋 All ({allTickets.length})</span>
            </button>
          </div>
        </div>

        {/* Empty state when active is 0 */}
        {displayedTickets.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <UserCheck size={36} className="mx-auto text-emerald-600 opacity-80" />
            <div>
              <p className="text-sm font-bold text-slate-800">
                {filterTab === 'active'
                  ? '🎉 All caught up! No unresolved complaints pending for Today.'
                  : `No tickets found in "${filterTab}" queue.`}
              </p>
              {filterTab === 'active' && closedTickets.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  You have <strong>{closedTickets.length} resolved / closed tickets</strong> in your work history.
                </p>
              )}
            </div>
            {closedTickets.length > 0 && filterTab !== 'closed' && (
              <button
                type="button"
                onClick={() => setFilterTab('closed')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <CheckCircle size={14} />
                <span>View Closed & Resolved History ({closedTickets.length} Tickets)</span>
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
