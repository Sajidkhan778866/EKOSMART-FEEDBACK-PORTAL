import { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  Calendar,
  Building2,
  CheckCircle2,
  Search,
  RefreshCw,
  Printer,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Eye,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../api/client';
import { TicketDetailModal } from '../components/TicketDetailModal';

export const Reports = () => {
  const { user } = useAuth();
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  // Filters State
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([
    'Battery',
    'Rental',
    'Showroom',
    'Spare Parts',
  ]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState<'today' | '7days' | '30days' | 'thisMonth' | 'all' | 'custom'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Data State
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/forms/public/sections`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setAvailableDivisions(
            Array.from(new Set(['Battery', 'Rental', 'Showroom', 'Spare Parts', ...res.data.data]))
          );
        }
      })
      .catch((e) => console.warn('Failed to load sections in employee reports:', e));
  }, []);

  // Fetch Complaints assigned or relevant to this employee
  const fetchEmployeeReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedDivision !== 'All') params.division = selectedDivision;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await axios.get(`${API_BASE_URL}/complaints/admin`, { params });
      if (res.data.success) {
        const allComplaints = res.data.data || [];
        // Filter by assignedTo matching current user, or user's authorized divisions
        const userDivisions = Array.isArray(user?.division)
          ? user.division
          : typeof user?.division === 'string'
          ? [user.division]
          : ['Battery', 'Showroom', 'Rental', 'Spare Parts'];
        const userEmpId = user?.employeeId;

        const filtered = allComplaints.filter((c: any) => {
          const isAssignedToMe = c.assignedTo?.employeeId === userEmpId || c.assignedTo?._id === user?._id;
          const isInMyDivision = userDivisions.includes(c.division);
          return isAssignedToMe || isInMyDivision;
        });

        setComplaints(filtered);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Failed to load employee reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeReports();
  }, [selectedDivision, selectedStatus, startDate, endDate, user]);

  // Quick Preset Handlers
  const handleSetDatePreset = (preset: 'today' | '7days' | '30days' | 'thisMonth' | 'all') => {
    setActivePreset(preset);
    const today = new Date();
    const toYMD = (d: Date) => d.toISOString().slice(0, 10);

    if (preset === 'today') {
      const dStr = toYMD(today);
      setStartDate(dStr);
      setEndDate(dStr);
    } else if (preset === '7days') {
      const past = new Date(today);
      past.setDate(past.getDate() - 7);
      setStartDate(toYMD(past));
      setEndDate(toYMD(today));
    } else if (preset === '30days') {
      const past = new Date(today);
      past.setDate(past.getDate() - 30);
      setStartDate(toYMD(past));
      setEndDate(toYMD(today));
    } else if (preset === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(toYMD(firstDay));
      setEndDate(toYMD(today));
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', val: string) => {
    setActivePreset('custom');
    if (type === 'start') setStartDate(val);
    if (type === 'end') setEndDate(val);
  };

  const handleResetFilters = () => {
    setSelectedDivision('All');
    setSelectedStatus('All');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setActivePreset('all');
  };

  const triggerCsvDownload = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered in-memory records (Search across all complaint attributes)
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return complaints;
    const q = searchQuery.toLowerCase().trim();
    return complaints.filter((c) => {
      const tNum = (c.ticketNumber || '').toLowerCase();
      const cName = (c.customer?.name || '').toLowerCase();
      const cMobile = (c.customer?.mobile || '').toLowerCase();
      const cEmail = (c.customer?.email || '').toLowerCase();
      const div = (c.division || '').toLowerCase();
      const cType = (c.complaintType || '').toLowerCase();
      const status = (c.status || '').toLowerCase();
      const priority = (c.priority || '').toLowerCase();
      const assigned = (c.assignedTo?.name || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      const formDataStr = c.formData ? JSON.stringify(c.formData).toLowerCase() : '';

      return (
        tNum.includes(q) ||
        cName.includes(q) ||
        cMobile.includes(q) ||
        cEmail.includes(q) ||
        div.includes(q) ||
        cType.includes(q) ||
        status.includes(q) ||
        priority.includes(q) ||
        assigned.includes(q) ||
        desc.includes(q) ||
        formDataStr.includes(q)
      );
    });
  }, [complaints, searchQuery]);

  // Export Filtered Tickets CSV
  const handleExportCsv = () => {
    setExporting(true);
    try {
      const headers = [
        'Ticket Number',
        'Division',
        'Complaint Type',
        'Customer Name',
        'Customer Mobile',
        'Customer Email',
        'Status',
        'Priority',
        'Assigned Engineer',
        'Created Date',
        'Custom Details',
      ];

      const rows = filteredRecords.map((c) => {
        const customDetails = c.formData ? JSON.stringify(c.formData).replace(/"/g, '""') : '';
        return [
          `"${c.ticketNumber || ''}"`,
          `"${c.division || ''}"`,
          `"${c.complaintType || ''}"`,
          `"${c.customer?.name || ''}"`,
          `"${c.customer?.mobile || ''}"`,
          `"${c.customer?.email || ''}"`,
          `"${c.status || ''}"`,
          `"${c.priority || ''}"`,
          `"${c.assignedTo?.name || user?.name || 'Unassigned'}"`,
          `"${c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : ''}"`,
          `"${customDetails}"`,
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const dateSuffix = startDate || endDate ? `${startDate || 'Start'}_to_${endDate || 'End'}` : new Date().toISOString().slice(0, 10);
      const searchSuffix = searchQuery ? `_Search_${encodeURIComponent(searchQuery.slice(0, 15))}` : '';
      triggerCsvDownload(csvContent, `Employee_Service_Report_${user?.employeeId || 'STAFF'}_${dateSuffix}${searchSuffix}.csv`);
    } finally {
      setExporting(false);
    }
  };

  // Pagination slice
  const pagedRecords = useMemo(() => {
    if (pageSize === 0) return filteredRecords;
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = pageSize > 0 ? Math.ceil(filteredRecords.length / pageSize) : 1;

  const hasActiveFilters =
    selectedDivision !== 'All' ||
    selectedStatus !== 'All' ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    Boolean(searchQuery.trim());

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>Staff Service Reports & Export</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {user?.employeeId || 'EMP-001'}
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Filter assigned service inspection logs by Division, Date Range, and Status for official CSV and PDF downloads.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-300 cursor-pointer shadow-xs"
          >
            <Printer size={15} />
            <span>Print Workload</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={filteredRecords.length === 0 || exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className="text-yellow-300" />
            <span>Quick Export My Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Filter size={16} className="text-indigo-600" />
            <span>Division & Date Range Filters</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handleSetDatePreset('today')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                activePreset === 'today'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleSetDatePreset('7days')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                activePreset === '7days'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => handleSetDatePreset('30days')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                activePreset === '30days'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => handleSetDatePreset('thisMonth')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                activePreset === 'thisMonth'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => handleSetDatePreset('all')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                activePreset === 'all'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
              }`}
            >
              All Time
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-2 flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition cursor-pointer border border-rose-200"
                title="Reset all filters to default"
              >
                <RotateCcw size={11} />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Division Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 size={12} className="text-indigo-600" />
              <span>Division</span>
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All My Divisions</option>
              {availableDivisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-purple-600" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-purple-600" />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Search size={12} className="text-teal-600" />
              <span>Search in Filtered Data</span>
            </label>
            <div className="relative flex gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchEmployeeReports();
                  }
                }}
                placeholder="Ticket / Name / Mobile"
                className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-9 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={fetchEmployeeReports}
                title="Refresh Records from Server"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex-shrink-0"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin text-indigo-600' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Info Pill */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>
            {selectedDivision !== 'All' && (
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                Division: {selectedDivision}
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                Status: {selectedStatus}
              </span>
            )}
            {(startDate || endDate) && (
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                Date: {startDate || 'From Beginning'} &rarr; {endDate || 'Today'}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-semibold text-[10px] flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-amber-900 cursor-pointer">
                  <X size={11} />
                </button>
              </span>
            )}
            <span className="text-slate-500 text-[11px] ml-auto font-semibold">
              Showing {filteredRecords.length} Matching Tickets
            </span>
          </div>
        )}
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Filtered Tickets</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{filteredRecords.length}</div>
          <span className="text-[10px] text-indigo-600 font-semibold">In current dataset</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Pending Inspection</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {filteredRecords.filter((c) => c.status === 'Pending' || c.status === 'Assigned').length}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Requires action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">In Progress</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {filteredRecords.filter((c) => c.status === 'In Progress').length}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Under lab diagnostics</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Resolved Tickets</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {filteredRecords.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Successfully closed</span>
        </div>
      </div>

      {/* Live Data Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-slate-700" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">Assigned Service Tickets Live Audit</h3>
              <p className="text-[11px] text-slate-400">Click any ticket number to view complete problem dossier & history</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={0}>All ({filteredRecords.length})</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={filteredRecords.length === 0 || exporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer disabled:opacity-40"
            >
              <FileSpreadsheet size={14} />
              <span>Download CSV ({filteredRecords.length})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Ticket Number</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Complaint Type</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Assigned Engineer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No service tickets found matching the selected filters and search query.
                  </td>
                </tr>
              ) : (
                pagedRecords.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="font-mono font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer flex items-center gap-1"
                        title="Click to view problem details"
                      >
                        <span>{c.ticketNumber}</span>
                        <Eye size={12} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">
                        {c.division}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{c.complaintType || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{c.customer?.name || 'N/A'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.customer?.mobile || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{c.assignedTo?.name || user?.name || 'Assigned'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'Resolved' || c.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pageSize > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1">
            <span>
              Showing page {currentPage} of {totalPages} ({filteredRecords.length} records)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-semibold text-slate-700">{currentPage}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Dossier Modal */}
      {selectedTicketIdOrNumber && (
        <TicketDetailModal
          ticketIdOrNumber={selectedTicketIdOrNumber}
          onClose={() => setSelectedTicketIdOrNumber(null)}
          onUpdated={fetchEmployeeReports}
        />
      )}
    </div>
  );
};

export default Reports;
