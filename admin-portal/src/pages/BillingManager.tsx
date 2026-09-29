import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Printer,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  User,
  ShieldCheck,
  Receipt,
  Eye,
  Scan,
  Camera,
  Settings2,
  Download,
} from 'lucide-react';
import { billingApi, stockApi, billTemplateApi } from '../api/client';
import ScannerModal from '../components/ScannerModal';
import BillTemplateDesigner, { type IBillTemplate, normalizeTemplate } from '../components/BillTemplateDesigner';
import ErrorBoundary from '../components/ErrorBoundary';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

export interface IBillLineItem {
  productId: string;
  productName: string;
  category: string;
  productSerial?: string;
  batterySerial?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  warrantyPeriodMonths: number;
}

export interface IBill {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  items: IBillLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paymentMode: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  showroom: string;
  employeeName?: string;
  warrantyGenerated: boolean;
  warrantyIds?: string[];
  notes?: string;
  createdAt: string;
}

const PAYMENT_MODES = ['UPI', 'Cash', 'Card', 'Bank Transfer', 'Finance', 'Credit'];
const SHOWROOMS = ['Main Showroom Counter', 'Kota Plant Store Counter', 'Service Center Desk'];

const BillingManager = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'designer'>('invoices');
  const [bills, setBills] = useState<IBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [meta, setMeta] = useState({ totalRecords: 0, totalRevenue: 0 });

  // Date Filter
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });

  // Soft-Coded Active Template State for Invoices
  const [activeTemplate, setActiveTemplate] = useState<IBillTemplate | null>(null);

  // Scanner Modal State
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'top_lookup' | number>('top_lookup');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<IBill | null>(null);

  // Serial Quick Lookup in Invoice Form
  const [serialLookup, setSerialLookup] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMsg, setLookupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Invoice Form
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    customerMobile: '',
    customerEmail: '',
    customerAddress: '',
    city: 'Kota',
    state: 'Rajasthan',
    paymentMode: 'UPI',
    paymentStatus: 'Paid' as 'Paid' | 'Pending' | 'Partial',
    showroom: 'Main Showroom Counter',
    notes: '',
  });

  const [items, setItems] = useState<IBillLineItem[]>([
    {
      productId: 'BAT-6030',
      productName: '60V 30Ah LFP EV Battery Pack',
      category: 'Battery',
      productSerial: '',
      batterySerial: '',
      quantity: 1,
      unitPrice: 26000,
      discount: 1000,
      taxRate: 18,
      taxAmount: 4500,
      totalAmount: 29500,
      warrantyPeriodMonths: 36,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchBills();
    fetchActiveTemplate();
  }, [paymentStatusFilter, dateRange]);

  const fetchActiveTemplate = async () => {
    try {
      const res = await billTemplateApi.getActive();
      if (res.data?.success && res.data.data) {
        setActiveTemplate(normalizeTemplate(res.data.data));
      } else {
        setActiveTemplate(normalizeTemplate());
      }
    } catch {
      setActiveTemplate(normalizeTemplate());
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await billingApi.getAll({
        search: search.trim() || undefined,
        paymentStatus: paymentStatusFilter !== 'All' ? paymentStatusFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.data?.success) {
        setBills(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportBills = async () => {
    try {
      setExporting(true);
      const res = await billingApi.export({
        search: search.trim() || undefined,
        paymentStatus: paymentStatusFilter !== 'All' ? paymentStatusFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart-invoices-${dateRange.filter.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showAlert('success', 'Invoices exported to Excel/CSV successfully');
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to export invoices');
    } finally {
      setExporting(false);
    }
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const calculateLineItem = (item: IBillLineItem): IBillLineItem => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = Number(item.taxRate) || 0;

    const gross = qty * unitPrice - discount;
    const taxAmount = Math.max(0, (gross * taxRate) / 100);
    const totalAmount = Math.max(0, gross + taxAmount);

    return {
      ...item,
      quantity: qty,
      unitPrice,
      discount,
      taxRate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  };

  const handleItemChange = (index: number, field: keyof IBillLineItem, value: any) => {
    const updated = [...items];
    updated[index] = calculateLineItem({
      ...updated[index],
      [field]: value,
    });
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      calculateLineItem({
        productId: `PRD-${Date.now().toString().slice(-4)}`,
        productName: '',
        category: 'Battery',
        productSerial: '',
        batterySerial: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 18,
        taxAmount: 0,
        totalAmount: 0,
        warrantyPeriodMonths: 36,
      }),
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Open Barcode Scanner
  const openScanner = (target: 'top_lookup' | number) => {
    setScannerTarget(target);
    setShowScanner(true);
  };

  const handleScanSuccess = async (scannedCode: string) => {
    if (scannerTarget === 'top_lookup') {
      setSerialLookup(scannedCode);
      lookupSerialCode(scannedCode);
    } else if (typeof scannerTarget === 'number' && scannerTarget < items.length) {
      const idx = scannerTarget;
      try {
        const res = await stockApi.getBySerial(scannedCode);
        if (res.data?.success && res.data.data) {
          const stock = res.data.data;
          const updated = [...items];
          updated[idx] = calculateLineItem({
            ...updated[idx],
            productId: stock.productId,
            productName: stock.productName,
            category: stock.category,
            productSerial: stock.serialNumber || '',
            batterySerial: stock.batterySerialNumber || scannedCode,
            unitPrice: stock.unitPrice || updated[idx].unitPrice,
            warrantyPeriodMonths: stock.warrantyPeriodMonths || 36,
          });
          setItems(updated);
          showAlert('success', `Scanned and linked: ${stock.productName}`);
        } else {
          handleItemChange(idx, 'batterySerial', scannedCode);
          showAlert('success', `Scanned serial applied: ${scannedCode}`);
        }
      } catch {
        handleItemChange(idx, 'batterySerial', scannedCode);
        showAlert('success', `Barcode applied: ${scannedCode}`);
      }
    }
  };

  // Quick lookup stock by serial
  const lookupSerialCode = async (serial: string) => {
    if (!serial.trim()) return;
    try {
      setLookupLoading(true);
      setLookupMsg(null);
      const res = await stockApi.getBySerial(serial.trim());
      if (res.data?.success && res.data.data) {
        const stock = res.data.data;
        if (stock.status === 'Sold') {
          setLookupMsg({
            type: 'error',
            text: `Warning: Battery (${stock.serialNumber || stock.batterySerialNumber || serial}) is already marked as SOLD in inventory!`,
          });
          return;
        }

        const newItem: IBillLineItem = calculateLineItem({
          productId: stock.productId,
          productName: stock.productName,
          category: stock.category,
          productSerial: stock.serialNumber || '',
          batterySerial: stock.batterySerialNumber || '',
          quantity: 1,
          unitPrice: stock.unitPrice || 0,
          discount: 0,
          taxRate: 18,
          taxAmount: 0,
          totalAmount: 0,
          warrantyPeriodMonths: stock.warrantyPeriodMonths || 36,
        });

        if (items.length === 1 && !items[0].productName) {
          setItems([newItem]);
        } else {
          setItems([...items, newItem]);
        }

        setLookupMsg({
          type: 'success',
          text: `Verified & Added: ${stock.productName} (In Stock: ${stock.quantity})`,
        });
        setSerialLookup('');
      }
    } catch (err: any) {
      setLookupMsg({
        type: 'error',
        text: err.response?.data?.message || 'No matching serial found in inventory',
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleLookupSerial = (e: React.FormEvent) => {
    e.preventDefault();
    lookupSerialCode(serialLookup);
  };

  // Compute Grand Totals
  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const discountTotal = items.reduce((acc, it) => acc + it.discount, 0);
  const taxTotal = items.reduce((acc, it) => acc + it.taxAmount, 0);
  const grandTotal = items.reduce((acc, it) => acc + it.totalAmount, 0);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.customerName || !customerForm.customerMobile) {
      showAlert('error', 'Customer name and 10-digit mobile number are required.');
      return;
    }
    if (items.some((i) => !i.productName || i.unitPrice <= 0)) {
      showAlert('error', 'Please fill in product details and unit prices for all items.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...customerForm,
        items,
      };
      const res = await billingApi.create(payload);
      if (res.data?.success) {
        showAlert('success', 'Showroom Invoice & Warranty created successfully!');
        setShowCreateModal(false);
        fetchBills();
        if (res.data.data) {
          setSelectedBill(res.data.data);
          setShowInvoiceModal(true);
        }
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBill = async (id: string, invNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invNumber}?`)) return;
    try {
      const res = await billingApi.delete(id);
      if (res.data?.success) {
        showAlert('success', 'Invoice deleted');
        fetchBills();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to delete invoice');
    }
  };

  const viewInvoice = (bill: IBill) => {
    setSelectedBill(bill);
    setShowInvoiceModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Receipt size={16} />
            <span>Point of Sale & Soft-Coded Billing Engine</span>
          </div>
          <h1 className="text-2xl font-black">Showroom Billing & Invoice Hub</h1>
          <p className="text-xs text-slate-300 mt-1">
            Generate GST tax invoices, scan battery barcodes with camera, and customize bill templates in real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchBills}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportBills}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-900/40 cursor-pointer"
          >
            <Download size={15} className={exporting ? 'animate-bounce' : ''} />
            <span>{exporting ? 'Exporting...' : 'Export Excel / CSV'}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/40 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>New Showroom Bill</span>
          </button>
        </div>
      </div>

      {/* Main Top Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-xs gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Receipt size={16} />
          <span>Showroom Invoices & POS History</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('designer');
            fetchActiveTemplate();
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'designer'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings2 size={16} />
          <span>Soft-Coded Bill Template Designer</span>
        </button>
      </div>

      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-md ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* TAB 1: INVOICES & POS LIST */}
      {activeTab === 'invoices' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Total Sales Revenue</span>
                <Receipt size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                ₹{meta.totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Verified Showroom Invoices</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Invoices Issued</span>
                <FileText size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-800 mt-2">{meta.totalRecords}</div>
              <div className="text-[11px] text-blue-600/80 mt-0.5">GST Compliant Bills</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Paid Invoices</span>
                <CheckCircle2 size={16} className="text-teal-500" />
              </div>
              <div className="text-2xl font-black text-teal-600 mt-2">
                {bills.filter((b) => b.paymentStatus === 'Paid').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Fully Settled</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Warranties Generated</span>
                <ShieldCheck size={16} className="text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-indigo-600 mt-2">
                {bills.filter((b) => b.warrantyGenerated).length}
              </div>
              <div className="text-[11px] text-indigo-600/80 mt-0.5">Linked Customer Records</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <DateRangeFilter
                value={dateRange}
                onChange={setDateRange}
              />
              <button
                type="button"
                onClick={handleExportBills}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Download size={13} className={exporting ? 'animate-bounce' : ''} />
                <span>{exporting ? 'Exporting...' : 'Export Invoices (Excel / CSV)'}</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center pt-1 border-t border-slate-100">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchBills()}
                  placeholder="Search by Invoice Number, Customer Name, or Phone..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <CreditCard size={14} className="text-slate-500" />
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Payment Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bills Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-indigo-500" />
                <span className="text-xs font-medium">Loading showroom invoices...</span>
              </div>
            ) : bills.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <Receipt size={36} className="text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No Billing Invoices Found</p>
                <p className="text-xs text-slate-400 max-w-sm">
                  No bills match your query. Click "New Showroom Bill" to create a new customer invoice.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Create New Invoice
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-4">Invoice #</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items / Description</th>
                      <th className="p-4">Grand Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Warranty Link</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <div className="font-bold text-indigo-600 font-mono text-xs">{bill.invoiceNumber}</div>
                          <div className="text-[10px] text-slate-400">{bill.showroom}</div>
                        </td>
                        <td className="p-4 text-slate-600">
                          <div>{new Date(bill.createdAt).toLocaleDateString('en-IN')}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(bill.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{bill.customerName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{bill.customerMobile}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-700">
                            {bill.items[0]?.productName || 'Line Item'}
                            {bill.items.length > 1 && (
                              <span className="text-[11px] text-indigo-600 font-bold ml-1">
                                +{bill.items.length - 1} more
                              </span>
                            )}
                          </div>
                          {bill.items[0]?.batterySerial && (
                            <div className="text-[10px] text-emerald-700 font-mono">
                              Bat: {bill.items[0].batterySerial}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-black text-slate-900 text-sm">₹{bill.grandTotal.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-400">GST: ₹{bill.taxTotal.toLocaleString('en-IN')}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bill.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {bill.paymentMode} • {bill.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          {bill.warrantyGenerated ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              <ShieldCheck size={12} />
                              <span>Generated</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => viewInvoice(bill)}
                              title="View / Print Tax Invoice"
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBill(bill._id, bill.invoiceNumber)}
                              title="Delete Invoice"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 size={16} />
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
        </>
      )}

      {/* TAB 2: SOFT-CODED BILL TEMPLATE DESIGNER */}
      {activeTab === 'designer' && (
        <ErrorBoundary fallbackTitle="Soft-Coded Bill Template Designer">
          <BillTemplateDesigner />
        </ErrorBoundary>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
                <Receipt size={22} className="text-indigo-600" />
                <span>Create Showroom Tax Invoice</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
              {/* Quick Serial Scanner / Lookup Bar */}
              <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold">
                    <Scan size={16} className="text-indigo-600" />
                    <span>Quick Serial Scanner / Inventory Lookup</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openScanner('top_lookup')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                  >
                    <Camera size={12} />
                    <span>Camera Scan</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={serialLookup}
                    onChange={(e) => setSerialLookup(e.target.value)}
                    placeholder="Scan Barcode or type Battery / Product Serial number..."
                    className="flex-1 p-2 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleLookupSerial}
                    disabled={lookupLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5"
                  >
                    {lookupLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                    <span>Auto-Fill from Stock</span>
                  </button>
                </div>
                {lookupMsg && (
                  <div
                    className={`text-[11px] font-semibold ${
                      lookupMsg.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {lookupMsg.text}
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-slate-500" />
                  <span>Customer Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerForm.customerName}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Mobile Phone (10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      value={customerForm.customerMobile}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerMobile: e.target.value })}
                      placeholder="9876543210"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerForm.customerEmail}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerEmail: e.target.value })}
                      placeholder="customer@gmail.com"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-bold mb-1">Customer Address</label>
                    <input
                      type="text"
                      value={customerForm.customerAddress}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerAddress: e.target.value })}
                      placeholder="Plot No. 12, Industrial Area, Kota"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">City & State</label>
                    <input
                      type="text"
                      value={customerForm.city}
                      onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                      placeholder="Kota, Rajasthan"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt size={14} className="text-slate-500" />
                    <span>Invoice Line Items</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-4">
                          <label className="block text-slate-600 font-bold mb-1">Product Description *</label>
                          <input
                            type="text"
                            required
                            value={item.productName}
                            onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                            placeholder="e.g. 60V 30Ah LFP Battery Pack"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-600 font-bold mb-1">Category</label>
                          <select
                            value={item.category}
                            onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                          >
                            <option value="Battery">Battery</option>
                            <option value="EV Scooter">EV Scooter</option>
                            <option value="Spare Parts">Spare Parts</option>
                            <option value="Charger">Charger</option>
                            <option value="Accessories">Accessories</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-600 font-bold mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-600 font-bold mb-1">Unit Price (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold">Total (Incl GST)</div>
                            <div className="text-sm font-black text-slate-800">
                              ₹{item.totalAmount.toLocaleString('en-IN')}
                            </div>
                          </div>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemRow(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Serial Numbers and Tax details */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-[11px] items-center">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1">
                            <label className="block text-slate-500 font-semibold mb-0.5">Battery Serial #</label>
                            <input
                              type="text"
                              value={item.batterySerial}
                              onChange={(e) => handleItemChange(idx, 'batterySerial', e.target.value)}
                              placeholder="e.g. BAT-LFP-6030"
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => openScanner(idx)}
                            title="Scan Barcode via Camera"
                            className="mt-3.5 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition shadow-xs"
                          >
                            <Camera size={14} />
                          </button>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-0.5">Product Serial #</label>
                          <input
                            type="text"
                            value={item.productSerial}
                            onChange={(e) => handleItemChange(idx, 'productSerial', e.target.value)}
                            placeholder="e.g. EBS-PRD-0012"
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-0.5">Discount (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.discount}
                            onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-0.5">Warranty (Months)</label>
                          <input
                            type="number"
                            value={item.warrantyPeriodMonths}
                            onChange={(e) => handleItemChange(idx, 'warrantyPeriodMonths', e.target.value)}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details & Showroom */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={customerForm.paymentMode}
                    onChange={(e) => setCustomerForm({ ...customerForm, paymentMode: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {PAYMENT_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Status</label>
                  <select
                    value={customerForm.paymentStatus}
                    onChange={(e) => setCustomerForm({ ...customerForm, paymentStatus: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Paid">Paid (Full Settlement)</option>
                    <option value="Pending">Pending (Unpaid)</option>
                    <option value="Partial">Partial Settlement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Showroom Location</label>
                  <select
                    value={customerForm.showroom}
                    onChange={(e) => setCustomerForm({ ...customerForm, showroom: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {SHOWROOMS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Invoice Calculations Summary */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Discount</span>
                  <span className="font-mono text-emerald-400">-₹{discountTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST Tax Total (18%)</span>
                  <span className="font-mono">₹{taxTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Grand Total Payable</span>
                  <span className="text-emerald-400 text-lg font-mono">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 cursor-pointer transition"
                >
                  {saving ? 'Generating...' : 'Confirm & Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & PRINT INVOICE SLIP MODAL (USING SOFT-CODED BILL TEMPLATE) */}
      {showInvoiceModal && selectedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 print:hidden">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Receipt size={18} className="text-indigo-600" />
                <span>Invoice Slip: {selectedBill.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Soft-Coded Printable Slip */}
            <div
              id="invoice-printable"
              className="mt-4 p-5 sm:p-6 border-2 rounded-2xl bg-white space-y-4 text-xs font-sans"
              style={{
                borderColor: activeTemplate?.theme?.primaryColor || '#4f46e5',
              }}
            >
              {/* Header */}
              <div
                className="flex justify-between items-start border-b-2 pb-3"
                style={{ borderColor: activeTemplate?.theme?.primaryColor || '#4f46e5' }}
              >
                <div>
                  <h2
                    className="text-base font-black"
                    style={{ color: activeTemplate?.theme?.primaryColor || '#4f46e5' }}
                  >
                    {activeTemplate?.companyProfile?.businessName || 'EKOSMART EV BATTERY SOLUTION'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {activeTemplate?.companyProfile?.tagline || 'Official EV Battery & Scooter Showroom Counter'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-sm">
                    {activeTemplate?.companyProfile?.address || 'Kota Industrial Area, Rajasthan'}
                  </p>
                  {activeTemplate?.companyProfile?.gstin && (
                    <p className="text-[10px] text-slate-700 font-mono font-bold mt-0.5">
                      GSTIN: {activeTemplate.companyProfile.gstin}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className="inline-block px-2.5 py-1 rounded-lg text-white font-mono font-bold text-xs shadow-xs"
                    style={{ backgroundColor: activeTemplate?.theme?.primaryColor || '#4f46e5' }}
                  >
                    {selectedBill.invoiceNumber}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Date: {new Date(selectedBill.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Billed To</div>
                  <div className="font-bold text-slate-800">{selectedBill.customerName}</div>
                  <div className="text-slate-600 font-mono">{selectedBill.customerMobile}</div>
                  {selectedBill.customerAddress && (
                    <div className="text-slate-500 text-[10px] mt-0.5">{selectedBill.customerAddress}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Payment Info</div>
                  <div className="font-bold text-emerald-700">
                    {selectedBill.paymentMode} ({selectedBill.paymentStatus})
                  </div>
                  <div className="text-slate-500 text-[10px]">{selectedBill.showroom}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                    <th className="py-2">Item</th>
                    <th className="py-2">Serial Number</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBill.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-semibold text-slate-800">
                        {it.productName}
                        <div className="text-[10px] text-slate-400">Warranty: {it.warrantyPeriodMonths} Months</div>
                      </td>
                      <td className="py-2 font-mono text-emerald-700 font-semibold text-[11px]">
                        {it.batterySerial || it.productSerial || '-'}
                      </td>
                      <td className="py-2 text-center font-bold">{it.quantity}</td>
                      <td className="py-2 text-right">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right font-bold">₹{it.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-slate-200 pt-3 flex justify-end">
                <div className="w-52 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedBill.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedBill.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{selectedBill.discountTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST Tax:</span>
                    <span className="font-mono">₹{selectedBill.taxTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div
                    className="flex justify-between font-black text-sm pt-1 border-t"
                    style={{ color: activeTemplate?.theme?.primaryColor || '#4f46e5' }}
                  >
                    <span>Grand Total:</span>
                    <span className="font-mono font-black">₹{selectedBill.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Warranty Stamp */}
              {selectedBill.warrantyGenerated && (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800 text-[11px]">
                  <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Official Warranty Registered:</span> This invoice serves as verified proof
                    for claim at all authorized Ekosmart service depots.
                  </div>
                </div>
              )}

              {/* Footer Terms */}
              <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 text-center">
                {activeTemplate?.footer?.footerNote ||
                  'Thank you for choosing Ekosmart. For queries contact helpline: +91 8949049003 | www.ekosmartevs.com'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCANNER MODAL */}
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
        title="Scan Battery / Product Barcode"
        subtitle="Point camera at the barcode on the battery pack or product carton"
      />
    </div>
  );
};

export default BillingManager;
