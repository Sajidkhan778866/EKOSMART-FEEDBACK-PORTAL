import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldCheck,
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
import { complaintApi, warrantyApi, formApi } from '../api/client';
import { TicketDetailModal } from '../components/TicketDetailModal';

export const Reports = () => {
  // Modal State for inspecting ticket problem details
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  // Filters State
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([
    'Battery',
    'Rental',
    'Showroom',
    'Spare Parts',
    'Plant',
  ]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState<'today' | '7days' | '30days' | 'thisMonth' | 'all' | 'custom'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'complaints' | 'warranties'>('all');

  // Pagination / Page Size State
  const [complaintPage, setComplaintPage] = useState(1);
  const [warrantyPage, setWarrantyPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Data State
  const [complaints, setComplaints] = useState<any[]>([]);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch Data with Filters
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const complaintParams: any = {};
      if (selectedDivision !== 'All') complaintParams.division = selectedDivision;
      if (selectedStatus !== 'All') complaintParams.status = selectedStatus;
      if (startDate) complaintParams.startDate = startDate;
      if (endDate) complaintParams.endDate = endDate;
      if (searchQuery.trim()) complaintParams.search = searchQuery.trim();

      const warrantyParams: any = {};
      if (selectedDivision !== 'All') {
        if (selectedDivision === 'Showroom' || selectedDivision === 'Plant') {
          warrantyParams.category = selectedDivision;
        }
      }
      if (selectedStatus !== 'All') warrantyParams.status = selectedStatus;
      if (startDate) warrantyParams.startDate = startDate;
      if (endDate) warrantyParams.endDate = endDate;
      if (searchQuery.trim()) warrantyParams.search = searchQuery.trim();

      const [complaintsRes, warrantiesRes] = await Promise.all([
        complaintApi.getAll(complaintParams).catch(() => ({ data: { data: [] } })),
        warrantyApi.getAll(warrantyParams).catch(() => ({ data: { data: [] } })),
      ]);

      setComplaints(complaintsRes.data?.data || []);
      setWarranties(warrantiesRes.data?.data || []);
      setComplaintPage(1);
      setWarrantyPage(1);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
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
      .catch((e: any) => console.warn('Failed to load dynamic sections in Reports:', e));
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [selectedDivision, selectedStatus, startDate, endDate]);

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

  // Helper to trigger browser download
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

  // Filtered in-memory records (Instant live client-side search across all fields)
  const filteredComplaints = useMemo(() => {
    if (!searchQuery.trim()) return complaints;
    const q = searchQuery.toLowerCase().trim();
    return complaints.filter((c) => {
      const ticketNum = (c.ticketNumber || '').toLowerCase();
      const customerName = (c.customer?.name || '').toLowerCase();
      const customerMobile = (c.customer?.mobile || '').toLowerCase();
      const customerEmail = (c.customer?.email || '').toLowerCase();
      const division = (c.division || '').toLowerCase();
      const complaintType = (c.complaintType || '').toLowerCase();
      const status = (c.status || '').toLowerCase();
      const priority = (c.priority || '').toLowerCase();
      const assigned = (c.assignedTo?.name || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      const formDataStr = c.formData ? JSON.stringify(c.formData).toLowerCase() : '';

      return (
        ticketNum.includes(q) ||
        customerName.includes(q) ||
        customerMobile.includes(q) ||
        customerEmail.includes(q) ||
        division.includes(q) ||
        complaintType.includes(q) ||
        status.includes(q) ||
        priority.includes(q) ||
        assigned.includes(q) ||
        desc.includes(q) ||
        formDataStr.includes(q)
      );
    });
  }, [complaints, searchQuery]);

  const filteredWarranties = useMemo(() => {
    if (!searchQuery.trim()) return warranties;
    const q = searchQuery.toLowerCase().trim();
    return warranties.filter((w) => {
      const warrantyNum = (w.warrantyNumber || '').toLowerCase();
      const serialNum = (w.serialNumber || '').toLowerCase();
      const billNum = (w.billNumber || '').toLowerCase();
      const product = (w.product || '').toLowerCase();
      const category = (w.category || '').toLowerCase();
      const status = (w.status || '').toLowerCase();
      const customerName = (w.customer?.name || '').toLowerCase();
      const customerMobile = (w.customer?.mobile || '').toLowerCase();
      const customerEmail = (w.customer?.email || '').toLowerCase();
      const formDataStr = w.formData ? JSON.stringify(w.formData).toLowerCase() : '';

      return (
        warrantyNum.includes(q) ||
        serialNum.includes(q) ||
        billNum.includes(q) ||
        product.includes(q) ||
        category.includes(q) ||
        status.includes(q) ||
        customerName.includes(q) ||
        customerMobile.includes(q) ||
        customerEmail.includes(q) ||
        formDataStr.includes(q)
      );
    });
  }, [warranties, searchQuery]);

  // 1. Export Complaints CSV (exports filteredComplaints)
  const handleExportComplaintsCsv = () => {
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

      const rows = filteredComplaints.map((c) => {
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
          `"${c.assignedTo?.name || 'Unassigned'}"`,
          `"${c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : ''}"`,
          `"${customDetails}"`,
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const dateSuffix = startDate || endDate ? `${startDate || 'Start'}_to_${endDate || 'End'}` : new Date().toISOString().slice(0, 10);
      const searchSuffix = searchQuery ? `_Search_${encodeURIComponent(searchQuery.slice(0, 15))}` : '';
      triggerCsvDownload(csvContent, `EBS_Complaints_Report_${selectedDivision}_${dateSuffix}${searchSuffix}.csv`);
    } finally {
      setExporting(false);
    }
  };

  // 2. Export Warranties CSV (exports filteredWarranties)
  const handleExportWarrantiesCsv = () => {
    setExporting(true);
    try {
      const headers = [
        'Warranty Number',
        'Category',
        'Product Model',
        'Serial Number',
        'Bill Number',
        'Customer Name',
        'Customer Mobile',
        'Customer Email',
        'Purchase Date',
        'Warranty Expiry Date',
        'Status',
      ];

      const rows = filteredWarranties.map((w) => [
        `"${w.warrantyNumber || ''}"`,
        `"${w.category || ''}"`,
        `"${w.product || ''}"`,
        `"${w.serialNumber || ''}"`,
        `"${w.billNumber || ''}"`,
        `"${w.customer?.name || ''}"`,
        `"${w.customer?.mobile || ''}"`,
        `"${w.customer?.email || ''}"`,
        `"${w.purchaseDate ? new Date(w.purchaseDate).toLocaleDateString('en-IN') : ''}"`,
        `"${w.warrantyExpiryDate ? new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN') : ''}"`,
        `"${w.status || ''}"`,
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');
      const dateSuffix = startDate || endDate ? `${startDate || 'Start'}_to_${endDate || 'End'}` : new Date().toISOString().slice(0, 10);
      const searchSuffix = searchQuery ? `_Search_${encodeURIComponent(searchQuery.slice(0, 15))}` : '';
      triggerCsvDownload(csvContent, `EBS_Warranty_Audit_${dateSuffix}${searchSuffix}.csv`);
    } finally {
      setExporting(false);
    }
  };

  // Export specific Division CSV
  const handleExportDivisionCsv = (divisionName: string) => {
    setExporting(true);
    try {
      const divComplaints = complaints.filter(
        (c) => (c.division || '').toLowerCase() === divisionName.toLowerCase()
      );
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

      const rows = divComplaints.map((c) => {
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
          `"${c.assignedTo?.name || 'Unassigned'}"`,
          `"${c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : ''}"`,
          `"${customDetails}"`,
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const dateSuffix =
        startDate || endDate
          ? `${startDate || 'Start'}_to_${endDate || 'End'}`
          : new Date().toISOString().slice(0, 10);
      triggerCsvDownload(
        csvContent,
        `EBS_${divisionName.replace(/\s+/g, '_')}_Report_${dateSuffix}.csv`
      );
    } finally {
      setExporting(false);
    }
  };

  // 3. Quick Export ALL Filtered Master Report
  const handleQuickExportAll = () => {
    setExporting(true);
    try {
      const reportDate = new Date().toLocaleDateString('en-IN');
      const lines: string[] = [];

      lines.push('EKOSMART BATTERY SOLUTION (EBS) - MASTER OPERATIONAL AUDIT REPORT');
      lines.push(`Generated On: ${reportDate} | Plant: Kota, Rajasthan | Helpline: +91 8949049003`);
      lines.push(
        `Filter Parameters: Division=${selectedDivision}, Status=${selectedStatus}, StartDate=${startDate || 'All'}, EndDate=${endDate || 'All'}, SearchQuery=${searchQuery || 'None'}`
      );
      lines.push(`Total Matching Records: Complaints (${filteredComplaints.length}), Warranties (${filteredWarranties.length})`);
      lines.push('');

      // Section 1: Complaints
      lines.push('--- 1. COMPLAINT RESOLUTION RECORDS ---');
      lines.push('Ticket Number,Division,Complaint Type,Customer Name,Mobile,Status,Priority,Assigned Engineer,Created Date');
      filteredComplaints.forEach((c) => {
        lines.push(
          [
            `"${c.ticketNumber || ''}"`,
            `"${c.division || ''}"`,
            `"${c.complaintType || ''}"`,
            `"${c.customer?.name || ''}"`,
            `"${c.customer?.mobile || ''}"`,
            `"${c.status || ''}"`,
            `"${c.priority || ''}"`,
            `"${c.assignedTo?.name || 'Unassigned'}"`,
            `"${c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : ''}"`,
          ].join(',')
        );
      });
      lines.push('');

      // Section 2: Warranties
      lines.push('--- 2. PRODUCT WARRANTY COVERAGE RECORDS ---');
      lines.push('Warranty Number,Category,Product,Serial No,Bill No,Customer Name,Purchase Date,Expiry Date,Status');
      filteredWarranties.forEach((w) => {
        lines.push(
          [
            `"${w.warrantyNumber || ''}"`,
            `"${w.category || ''}"`,
            `"${w.product || ''}"`,
            `"${w.serialNumber || ''}"`,
            `"${w.billNumber || ''}"`,
            `"${w.customer?.name || ''}"`,
            `"${w.purchaseDate ? new Date(w.purchaseDate).toLocaleDateString('en-IN') : ''}"`,
            `"${w.warrantyExpiryDate ? new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN') : ''}"`,
            `"${w.status || ''}"`,
          ].join(',')
        );
      });

      const fullCsv = lines.join('\n');
      const dateStr = new Date().toISOString().slice(0, 10);
      triggerCsvDownload(fullCsv, `EBS_MASTER_FILTERED_REPORT_${dateStr}.csv`);
    } finally {
      setExporting(false);
    }
  };

  // Pagination slices
  const pagedComplaints = useMemo(() => {
    if (pageSize === 0) return filteredComplaints;
    const start = (complaintPage - 1) * pageSize;
    return filteredComplaints.slice(start, start + pageSize);
  }, [filteredComplaints, complaintPage, pageSize]);

  const pagedWarranties = useMemo(() => {
    if (pageSize === 0) return filteredWarranties;
    const start = (warrantyPage - 1) * pageSize;
    return filteredWarranties.slice(start, start + pageSize);
  }, [filteredWarranties, warrantyPage, pageSize]);

  const totalComplaintPages = pageSize > 0 ? Math.ceil(filteredComplaints.length / pageSize) : 1;
  const totalWarrantyPages = pageSize > 0 ? Math.ceil(filteredWarranties.length / pageSize) : 1;

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
            <span>Analytics & Reports Export</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Data
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Filter by Department / Division, Date Range, and Status for official CSV and Excel downloads.
          </p>
        </div>

        {/* Quick Export Master Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-300 cursor-pointer shadow-xs"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleQuickExportAll}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className="text-yellow-300" />
            <span>Quick Export All Report (Master CSV)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADVANCED FILTER TOOLBAR: DATE RANGE, PRESETS & SEARCH        */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Filter size={16} className="text-emerald-600" />
            <span>Report Filters & Date Range Selection</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Date Presets:</span>
            <button
              type="button"
              onClick={() => handleSetDatePreset('today')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                activePreset === 'today'
                  ? 'bg-emerald-600 text-white shadow-xs'
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
                  ? 'bg-emerald-600 text-white shadow-xs'
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
                  ? 'bg-emerald-600 text-white shadow-xs'
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
                  ? 'bg-emerald-600 text-white shadow-xs'
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
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
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

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Department / Division Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 size={12} className="text-emerald-600" />
              <span>Department / Division</span>
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Departments</option>
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
              <CheckCircle2 size={12} className="text-blue-600" />
              <span>Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Active">Active Warranty</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Search Query & Refresh */}
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
                  setComplaintPage(1);
                  setWarrantyPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchReportData();
                  }
                }}
                placeholder="Ticket / Serial / Mobile / Name"
                className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setComplaintPage(1);
                    setWarrantyPage(1);
                  }}
                  className="absolute right-9 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={fetchReportData}
                title="Refresh Records from Server"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex-shrink-0"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Info Pill */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>
            {selectedDivision !== 'All' && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                Division: {selectedDivision}
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
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
              Showing {filteredComplaints.length} Complaints and {filteredWarranties.length} Warranties
            </span>
          </div>
        )}
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Filtered Complaints</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{filteredComplaints.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Matching current search & dates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Filtered Warranties</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{filteredWarranties.length}</div>
          <span className="text-[10px] text-blue-600 font-semibold">Matching current search & dates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Resolved Complaints</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {filteredComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Resolution complete</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Active Warranties</span>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {filteredWarranties.filter((w) => w.status === 'Active').length}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Under active coverage</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2 MAIN REPORT EXPORT CARDS (WITH LIVE WORKING EXPORTS)        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Complaints Report */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200">
                <FileText size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {filteredComplaints.length} Records Found
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Complaint Resolution Report</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Export filtered service records including ticket IDs, division, complaint type, customer mobile, assigned engineer, issue description, and SLA status.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleExportComplaintsCsv}
              disabled={filteredComplaints.length === 0 || exporting}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition disabled:opacity-40"
            >
              <FileSpreadsheet size={16} />
              <span>Download Complaints CSV ({filteredComplaints.length})</span>
            </button>
          </div>
        </div>

        {/* Card 2: Warranty Report */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-200">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {filteredWarranties.length} Records Found
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Warranty Coverage Audit</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Export registered 48V (3-Year) & 60V/72V (1.5-Year) lithium battery units, showroom sales, serial numbers, invoice dates, and active warranty validity.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleExportWarrantiesCsv}
              disabled={filteredWarranties.length === 0 || exporting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition disabled:opacity-40"
            >
              <Download size={16} />
              <span>Download Warranty CSV ({filteredWarranties.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DYNAMIC SERVICE & DIVISION REPORT CARDS (ALL ADDED SERVICES) */}
      {/* ============================================================ */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Department & Service Division Reports ({availableDivisions.length} Active Services)
              </h3>
              <p className="text-[11px] text-slate-400">
                Live breakdown cards for every configured service division. Filter or export individual division data with one click.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
          {availableDivisions.map((div) => {
            const divComplaints = complaints.filter(
              (c) => (c.division || '').toLowerCase() === div.toLowerCase()
            );
            const resolvedCount = divComplaints.filter(
              (c) => c.status === 'Resolved' || c.status === 'Closed'
            ).length;
            const inProgressCount = divComplaints.filter(
              (c) => c.status === 'In Progress' || c.status === 'Assigned'
            ).length;
            const pendingCount = divComplaints.filter(
              (c) => c.status === 'Pending' || c.status === 'New'
            ).length;
            const isCurrentFilter = selectedDivision.toLowerCase() === div.toLowerCase();

            return (
              <div
                key={div}
                className={`p-4 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
                  isCurrentFilter
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 truncate" title={div}>
                      {div}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {divComplaints.length} Records
                    </span>
                  </div>

                  {/* Status Breakdown Pills */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                      {resolvedCount} Resolved
                    </span>
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold">
                      {inProgressCount} Active
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                      {pendingCount} Pending
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDivision(isCurrentFilter ? 'All' : div);
                      setComplaintPage(1);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                      isCurrentFilter
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isCurrentFilter ? 'Viewing (Reset)' : 'Filter View'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportDivisionCsv(div)}
                    disabled={divComplaints.length === 0 || exporting}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition cursor-pointer border border-slate-200 disabled:opacity-40"
                    title={`Download ${div} CSV`}
                  >
                    <Download size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* LIVE DATA PREVIEW TABLE FOR AUDITING BEFORE EXPORT           */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-slate-700" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">Filtered Records Live Audit Preview</h3>
              <p className="text-[11px] text-slate-400">Click any ticket number to view complete problem dossier & history</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setComplaintPage(1);
                  setWarrantyPage(1);
                }}
                className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={0}>All ({filteredComplaints.length + filteredWarranties.length})</option>
              </select>
            </div>

            {/* Tab Selector */}
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Records ({filteredComplaints.length + filteredWarranties.length})
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'complaints' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Complaints ({filteredComplaints.length})
              </button>
              <button
                onClick={() => setActiveTab('warranties')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'warranties' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Warranties ({filteredWarranties.length})
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Table View */}
        {(activeTab === 'all' || activeTab === 'complaints') && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Complaints List ({filteredComplaints.length} Total Matching)</span>
              {searchQuery && (
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Filtered by search: "{searchQuery}"
                </span>
              )}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ticket Number</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4">Complaint Type</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Assigned Engineer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No complaints matching the selected filters and search query.
                      </td>
                    </tr>
                  ) : (
                    pagedComplaints.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                            className="font-mono font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-1"
                            title="Click to view full ticket dossier"
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
                        <td className="py-3 px-4 text-slate-600">{c.assignedTo?.name || 'Unassigned'}</td>
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

            {/* Pagination Controls for Complaints */}
            {pageSize > 0 && totalComplaintPages > 1 && (
              <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1">
                <span>
                  Showing page {complaintPage} of {totalComplaintPages} ({filteredComplaints.length} records)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={complaintPage <= 1}
                    onClick={() => setComplaintPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="px-2 font-semibold text-slate-700">{complaintPage}</span>
                  <button
                    disabled={complaintPage >= totalComplaintPages}
                    onClick={() => setComplaintPage((p) => Math.min(totalComplaintPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warranties Table View */}
        {(activeTab === 'all' || activeTab === 'warranties') && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Warranties List ({filteredWarranties.length} Total Matching)</span>
              {searchQuery && (
                <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Filtered by search: "{searchQuery}"
                </span>
              )}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Warranty Number</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Bill Number</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWarranties.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No warranties matching the selected filters and search query.
                      </td>
                    </tr>
                  ) : (
                    pagedWarranties.map((w) => (
                      <tr key={w._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{w.warrantyNumber}</td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-[10px]">
                            {w.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{w.product}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{w.serialNumber}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{w.billNumber || '-'}</td>
                        <td className="py-3 px-4 text-slate-700">{w.customer?.name || 'N/A'}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{w.customer?.mobile || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : w.status === 'Expiring Soon'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {w.warrantyExpiryDate ? new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN') : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Warranties */}
            {pageSize > 0 && totalWarrantyPages > 1 && (
              <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1">
                <span>
                  Showing page {warrantyPage} of {totalWarrantyPages} ({filteredWarranties.length} records)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={warrantyPage <= 1}
                    onClick={() => setWarrantyPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="px-2 font-semibold text-slate-700">{warrantyPage}</span>
                  <button
                    disabled={warrantyPage >= totalWarrantyPages}
                    onClick={() => setWarrantyPage((p) => Math.min(totalWarrantyPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Dossier Modal */}
      {selectedTicketIdOrNumber && (
        <TicketDetailModal
          ticketIdOrNumber={selectedTicketIdOrNumber}
          onClose={() => setSelectedTicketIdOrNumber(null)}
          onUpdated={fetchReportData}
        />
      )}
    </div>
  );
};

export default Reports;
