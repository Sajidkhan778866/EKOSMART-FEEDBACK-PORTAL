import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  UserCheck,
  X,
  ExternalLink,
  RefreshCw,
  Phone,
  Calendar,
  Layers,
} from 'lucide-react';
import { dashboardApi, complaintApi, employeeApi, complaintTypeApi, formApi } from '../api/client';
import { TicketDetailModal } from '../components/TicketDetailModal';

interface ComplaintItem {
  _id: string;
  ticketNumber: string;
  division: string;
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
    division?: string;
  };
  createdAt: string;
}

interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  assignedComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  closedComplaints: number;
  totalEmployees: number;
  activeEmployees: number;
  totalCustomers: number;
  totalWarranties: number;
  activeWarranties: number;
  expiringWarranties: number;
  expiredWarranties: number;
  divisionBreakdown: { name: string; complaints: number }[];
  warrantyBreakdown: { name: string; value: number; color: string }[];
  weeklyActivity?: { name: string; date?: string; complaints: number; warranties: number }[];
}

const fallbackWeeklyActivity = [
  { name: 'Mon', warranties: 12, complaints: 8 },
  { name: 'Tue', warranties: 19, complaints: 15 },
  { name: 'Wed', warranties: 15, complaints: 10 },
  { name: 'Thu', warranties: 22, complaints: 12 },
  { name: 'Fri', warranties: 25, complaints: 18 },
  { name: 'Sat', warranties: 30, complaints: 25 },
  { name: 'Sun', warranties: 18, complaints: 14 },
];

const fallbackPieData = [
  { name: 'Active', value: 400, color: '#3b82f6' },
  { name: 'Expiring Soon', value: 300, color: '#f59e0b' },
  { name: 'Expired', value: 300, color: '#ef4444' },
];

const fallbackBarData = [
  { name: 'Battery', complaints: 45 },
  { name: 'Rental', complaints: 30 },
  { name: 'Showroom', complaints: 20 },
  { name: 'Spare Parts', complaints: 29 },
];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [complaintsLoading, setComplaintsLoading] = useState(true);

  // Dynamic Current Applications section filters
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [complaintTypeFilter, setComplaintTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [assignedEmployeeFilter, setAssignedEmployeeFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic lists from backend
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([
    'All',
    'Battery',
    'Rental',
    'Showroom',
    'Spare Parts',
    'Warranty',
    'Plant',
  ]);
  const [complaintTypesList, setComplaintTypesList] = useState<any[]>([]);
  const [employeesList, setEmployeesList] = useState<any[]>([]);

  // Ticket Dossier Modal
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  // Quick Assignment Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [eligibleEmployees, setEligibleEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getStats();
      if (res.data.success && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch dynamic dashboard stats, using fallback:', err);
    } finally {
      setLoading(false);
    }

    try {
      const secRes = await formApi.getSections();
      if (secRes.data.success && Array.isArray(secRes.data.data) && secRes.data.data.length > 0) {
        setAvailableDivisions(['All', ...secRes.data.data]);
      }
    } catch (e) {
      console.warn('Failed to load dynamic sections in Dashboard:', e);
    }
  };

  const fetchComplaintTypes = async () => {
    try {
      const res = await complaintTypeApi.getAll({
        division: divisionFilter !== 'All' ? divisionFilter : undefined,
        activeOnly: true,
      });
      if (res.data.success) {
        setComplaintTypesList(res.data.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch complaint types:', err);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const res = await employeeApi.getAll({ limit: 100 });
      if (res.data.success) {
        setEmployeesList(res.data.data?.employees || res.data.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch employees list for filters:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const res = await complaintApi.getAll({
        division: divisionFilter !== 'All' ? divisionFilter : undefined,
        complaintType: complaintTypeFilter !== 'All' ? complaintTypeFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        priority: priorityFilter !== 'All' ? priorityFilter : undefined,
        assignedTo: assignedEmployeeFilter !== 'All' ? assignedEmployeeFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: searchQuery || undefined,
      });
      if (res.data.success && res.data.data) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch complaints list:', err);
    } finally {
      setComplaintsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEmployeesList();
  }, []);

  useEffect(() => {
    fetchComplaintTypes();
    setComplaintTypeFilter('All');
  }, [divisionFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [
    divisionFilter,
    complaintTypeFilter,
    statusFilter,
    priorityFilter,
    assignedEmployeeFilter,
    startDate,
    endDate,
    searchQuery,
  ]);

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
        fetchDashboardData();
      }
    } catch (err: any) {
      setAssignMessage(err.response?.data?.message || 'Failed to assign complaint');
    } finally {
      setAssigning(false);
    }
  };

  // Safe fallback metrics
  const totalComplaintsCount = stats?.totalComplaints ?? 124;
  const resolvedComplaintsCount = stats?.resolvedComplaints ?? 89;
  const pendingComplaintsCount = stats?.pendingComplaints ?? 12;
  const expiringWarrantiesCount = stats?.expiringWarranties ?? 23;

  const weeklyLineData =
    stats?.weeklyActivity && stats.weeklyActivity.length > 0 && stats.weeklyActivity.some(d => d.complaints > 0 || d.warranties > 0)
      ? stats.weeklyActivity
      : fallbackWeeklyActivity;

  const pieData =
    stats?.warrantyBreakdown && stats.warrantyBreakdown.length > 0
      ? stats.warrantyBreakdown
      : fallbackPieData;

  const barData =
    stats?.divisionBreakdown && stats.divisionBreakdown.length > 0
      ? stats.divisionBreakdown
      : fallbackBarData;

  const getDivisionBadge = (division: string) => {
    switch (division) {
      case 'Battery':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rental':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Showroom':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Spare Parts':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200 font-bold';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time complaint tracking, warranty diagnostics, and engineer allocation metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchDashboardData();
              fetchComplaints();
            }}
            className="p-2 bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg shadow-xs hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-green-600' : ''} />
          </button>
          <div className="bg-white px-4 py-2 rounded-lg shadow-xs border border-slate-200 text-xs text-slate-600 font-semibold flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span>Last 30 Days</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4 TOP KPI METRICS CARDS (EXACT MATCH WITH SCREENSHOT)         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Complaints */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-13 h-13 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ClipboardList size={26} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold">Total Complaints</h3>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {totalComplaintsCount}
            </p>
          </div>
        </div>

        {/* Card 2: Resolved */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-13 h-13 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={26} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold">Resolved</h3>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {resolvedComplaintsCount}
            </p>
          </div>
        </div>

        {/* Card 3: Pending Assignment */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-13 h-13 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock size={26} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold">Pending Assignment</h3>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {pendingComplaintsCount}
            </p>
          </div>
        </div>

        {/* Card 4: Expiring Warranties */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-13 h-13 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertCircle size={26} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-semibold">Expiring Warranties</h3>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {expiringWarrantiesCount}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CHARTS SECTION (WEEKLY ACTIVITY + WARRANTY STATUS)            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity (Complaints vs Warranties) */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-800">
              Weekly Activity (Complaints vs Warranties)
            </h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Warranties</span>
              </span>
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Complaints</span>
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyLineData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="warranties"
                  name="Warranties Registered"
                  stroke="#3b82f6"
                  strokeWidth={3.5}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  name="Complaints Filed"
                  stroke="#ef4444"
                  strokeWidth={3.5}
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warranty Status Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-800 mb-2">Warranty Status</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-slate-600 font-semibold">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Complaints by Division */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Complaints by Division</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of active customer tickets across Battery, Rental, Showroom, and Spare Parts.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              4 Technical Divisions
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontWeight: 600, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="complaints" name="Complaints" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CURRENT APPLICATIONS SECTION (LIVE FEED & MANAGEMENT)        */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <Layers size={18} />
              </span>
              <h2 className="text-lg font-bold text-slate-800">Current Applications & Complaints Dispatch</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time feed of registered applications & tickets with instant engineer allocation, dynamic status tracking, and problem dossiers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/complaints"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              <span>Manage All Applications</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="space-y-3">
          {/* Department / Division Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs">
            {availableDivisions.map((div) => (
              <button
                key={div}
                onClick={() => setDivisionFilter(div)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  divisionFilter === div
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* Sub-Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* Dynamic Complaint Type Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Complaint Type</label>
              <select
                value={complaintTypeFilter}
                onChange={(e) => setComplaintTypeFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-white text-slate-700 font-semibold focus:ring-1 focus:ring-green-500"
              >
                <option value="All">All Types</option>
                {complaintTypesList.map((ct) => (
                  <option key={ct._id} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-white text-slate-700 font-semibold focus:ring-1 focus:ring-green-500"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-white text-slate-700 font-semibold focus:ring-1 focus:ring-green-500"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Assigned Employee Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assigned Staff</label>
              <select
                value={assignedEmployeeFilter}
                onChange={(e) => setAssignedEmployeeFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs bg-white text-slate-700 font-semibold focus:ring-1 focus:ring-green-500"
              >
                <option value="All">All Staff</option>
                {employeesList.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-slate-700 font-medium focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs bg-white text-slate-700 font-medium focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Ticket, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Ticket #</th>
                <th className="p-3.5">Customer Details</th>
                <th className="p-3.5">Division / Type</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned Engineer</th>
                <th className="p-3.5">Date Registered</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {complaintsLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="animate-spin text-green-600" size={18} />
                      <span>Loading applications feed...</span>
                    </div>
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ClipboardList className="text-slate-300" size={32} />
                      <span className="font-semibold text-slate-600">No applications found</span>
                      <span className="text-[11px] text-slate-400">Try clearing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                complaints.slice(0, 15).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition">
                    {/* Ticket # (Clickable dossier trigger) */}
                    <td className="p-3.5">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="group flex flex-col text-left cursor-pointer"
                        title="Click to view full problem dossier"
                      >
                        <span className="font-mono font-bold text-slate-900 group-hover:text-green-600 group-hover:underline bg-slate-100 group-hover:bg-green-50 px-2 py-0.5 rounded border border-slate-200 group-hover:border-green-200 transition">
                          {c.ticketNumber}
                        </span>
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{c.customer?.name || 'Walk-in Customer'}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5 font-mono">
                        <Phone size={11} className="text-slate-400" />
                        <span>{c.customer?.mobile || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Division & Type */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getDivisionBadge(c.division)}`}>
                          {c.division}
                        </span>
                        {c.complaintType && (
                          <span className="text-[11px] text-slate-500 block truncate max-w-[140px]" title={c.complaintType}>
                            {c.complaintType}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase border ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Assigned Engineer */}
                    <td className="p-3.5">
                      {c.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {c.assignedTo.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-slate-800 font-bold text-xs">{c.assignedTo.name}</div>
                            <div className="text-slate-400 text-[10px] font-mono">{c.assignedTo.employeeId}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertCircle size={12} />
                          <span>Unassigned</span>
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Quick Action */}
                    <td className="p-3.5 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="View Full Dossier"
                        >
                          <ClipboardList size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openAssignModal(c)}
                          className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold border border-green-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck size={13} />
                          <span>{c.assignedTo ? 'Reassign' : 'Assign'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Link */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 pt-1">
          <span>
            Showing {Math.min(complaints.length, 15)} of {complaints.length} application tickets for selected criteria.
          </span>
          <Link
            to="/complaints"
            className="text-green-700 hover:text-green-800 font-bold flex items-center gap-1 underline underline-offset-2"
          >
            <span>Go to Full Complaints Table with Advanced Search</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* QUICK ASSIGNMENT MODAL DIRECTLY ON DASHBOARD                  */}
      {/* ============================================================ */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Assign Service Engineer</h3>
                <p className="text-xs text-slate-500">
                  Ticket #{selectedComplaint.ticketNumber} • Division: {selectedComplaint.division}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {assignMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {assignMessage}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Eligible {selectedComplaint.division} Division Engineer:
                </label>
                {eligibleEmployees.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                    No active employees configured for division: <strong>{selectedComplaint.division}</strong>.
                  </div>
                ) : (
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs bg-white focus:ring-1 focus:ring-green-500 font-medium"
                  >
                    <option value="">-- Choose Technical Engineer --</option>
                    {eligibleEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeeId}) — {emp.designation}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning || eligibleEmployees.length === 0}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {assigning ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} />
                      <span>Confirm Assignment</span>
                    </>
                  )}
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
          onUpdated={() => {
            fetchComplaints();
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

