import { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Search,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  ShieldCheck,
  Eye,
  Scan,
  Trash2,
  Download,
  Coins,
  Gift,
  Mail,
  Send,
} from 'lucide-react';
import { billingApi, stockApi, billTemplateApi } from '../api/client';
import ScannerModal from '../components/ScannerModal';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';
import { printElement } from '../utils/print';

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
  purchaseRewardAwarded?: boolean;
  rewardCoinsAwarded?: number;
  referralCodeUsed?: string;
  referralCoinsAwarded?: number;
  softCopyEmailed?: boolean;
  softCopyEmailedAt?: string;
  softCopyRecipient?: string;
  notes?: string;
  createdAt: string;
}

const PAYMENT_MODES = ['UPI', 'Cash', 'Wallet', 'Card', 'Bank Transfer', 'Finance', 'Credit'];

const Billing = () => {
  const [bills, setBills] = useState<IBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [exporting, setExporting] = useState(false);

  // Date Filter
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });

  // Scanner Modal State
  const [showScanner, setShowScanner] = useState(false);
  const [activeScanRowIndex, setActiveScanRowIndex] = useState<number | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<IBill | null>(null);

  // Email Soft Copy Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalBill, setEmailModalBill] = useState<IBill | null>(null);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    customSubject: '',
    customMatter: '',
  });
  const [sendingEmail, setSendingEmail] = useState(false);

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
    referralCode: '',
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
  }, [dateRange]);

  const fetchActiveTemplate = async () => {
    try {
      const res = await billTemplateApi.getActive();
      if (res.data?.success && res.data.data) {
        setActiveTemplate(res.data.data);
      }
    } catch {
      // Fallback
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await billingApi.getAll({
        search: search.trim() || undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.data?.success) {
        setBills(res.data.data || []);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBills = async () => {
    try {
      setExporting(true);
      const res = await billingApi.export({
        search: search.trim() || undefined,
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

  // Open Scanner for a specific row or for top search
  const openScannerForRow = (rowIndex: number) => {
    setActiveScanRowIndex(rowIndex);
    setShowScanner(true);
  };

  const handleScanSuccess = async (scannedSerial: string) => {
    try {
      const res = await stockApi.getBySerial(scannedSerial);
      if (res.data?.success && res.data.data) {
        const stock = res.data.data;
        if (stock.status === 'Sold') {
          showAlert('error', `Warning: Scanned battery (${scannedSerial}) is already recorded as SOLD in inventory!`);
          return;
        }
        if (activeScanRowIndex !== null && activeScanRowIndex < items.length) {
          const updated = [...items];
          updated[activeScanRowIndex] = calculateLineItem({
            ...updated[activeScanRowIndex],
            productId: stock.productId,
            productName: stock.productName,
            category: stock.category,
            productSerial: stock.serialNumber || '',
            batterySerial: stock.batterySerialNumber || '',
            unitPrice: stock.unitPrice || updated[activeScanRowIndex].unitPrice,
            warrantyPeriodMonths: stock.warrantyPeriodMonths || 36,
          });
          setItems(updated);
          showAlert('success', `Scanned and linked: ${stock.productName} (${scannedSerial})`);
        } else {
          // Add as new row
          const newItem = calculateLineItem({
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
          setItems([...items, newItem]);
          showAlert('success', `Scanned item added: ${stock.productName}`);
        }
      } else {
        // Fallback: fill serial number into current row
        if (activeScanRowIndex !== null && activeScanRowIndex < items.length) {
          handleItemChange(activeScanRowIndex, 'batterySerial', scannedSerial);
          showAlert('success', `Scanned serial applied: ${scannedSerial}`);
        }
      }
    } catch {
      // Manual fallback
      if (activeScanRowIndex !== null && activeScanRowIndex < items.length) {
        handleItemChange(activeScanRowIndex, 'batterySerial', scannedSerial);
        showAlert('success', `Barcode applied: ${scannedSerial}`);
      }
    }
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
      showAlert('error', 'Please fill in product details and valid unit prices for all items.');
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

  const viewInvoice = (bill: IBill) => {
    setSelectedBill(bill);
    setShowInvoiceModal(true);
  };

  const openEmailModal = (bill: IBill) => {
    setEmailModalBill(bill);
    const defaultSubject = (activeTemplate?.softBillEmailConfig?.emailSubject || 'Official EKOSMART GST Tax Invoice & Soft Copy - {{invoiceNumber}}')
      .replace('{{invoiceNumber}}', bill.invoiceNumber);
    const defaultMatter = activeTemplate?.softBillEmailConfig?.emailMatter ||
      `Dear {{customerName}},\n\nThank you for choosing EKOSMART Clean Energy & Green Mobility. Please find attached below your official Soft Copy GST Tax Invoice, Warranty Certificate registration, and exclusive Customer Referral Code.\n\nYour Unique Referral Code is: {{referralCode}}\nShare this code with your friends and family so they receive +500 Welcome Coins, and you earn +100 Referral Coins on their qualifying purchase!`;

    setEmailForm({
      recipientEmail: bill.customerEmail || '',
      customSubject: defaultSubject,
      customMatter: defaultMatter,
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalBill) return;
    if (!emailForm.recipientEmail || !emailForm.recipientEmail.includes('@')) {
      showAlert('error', 'Please enter a valid recipient email address.');
      return;
    }

    try {
      setSendingEmail(true);
      const res = await billingApi.sendEmail(emailModalBill._id, emailForm);
      if (res.data?.success) {
        showAlert('success', `Soft copy invoice and referral code emailed successfully to ${emailForm.recipientEmail}`);
        setShowEmailModal(false);
        fetchBills();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to send soft copy email');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Receipt size={16} />
            <span>Staff Point of Sale & Billing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Showroom Billing Counter</h1>
          <p className="text-xs text-slate-300 mt-1">
            Create customer invoices, scan battery serials via camera, and auto-issue official warranties.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <button
            type="button"
            onClick={handleExportBills}
            disabled={exporting}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            <span>{exporting ? 'Exporting...' : 'Export Excel / CSV'}</span>
          </button>
          <button
            onClick={fetchBills}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/40 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>New Customer Bill</span>
          </button>
        </div>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBills()}
            placeholder="Search recent bills by invoice #, customer name, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-indigo-500" />
            <span className="text-xs font-medium">Loading recent invoices...</span>
          </div>
        ) : bills.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Receipt size={36} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Billing Invoices Found</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Click "New Customer Bill" above to generate your first showroom invoice.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items / Pack #</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Referral & Soft Copy</th>
                  <th className="p-4">Warranty</th>
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
                    <td className="p-4 font-black text-slate-900">₹{bill.grandTotal.toLocaleString('en-IN')}</td>
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
                      <div className="flex flex-col gap-1">
                        {bill.referralCodeUsed ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono w-fit">
                            <Gift size={11} className="text-emerald-600" />
                            <span>Ref: {bill.referralCodeUsed}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-medium">Direct Sale</span>
                        )}

                        {bill.softCopyEmailed ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg text-[10px] font-semibold w-fit">
                            <Mail size={10} className="text-blue-600" />
                            <span>Soft Copy Emailed</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openEmailModal(bill)}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-semibold w-fit cursor-pointer transition"
                          >
                            <Mail size={10} className="text-slate-500" />
                            <span>Email Soft Bill</span>
                          </button>
                        )}
                      </div>
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
                          onClick={() => openEmailModal(bill)}
                          title="Email Soft Copy Invoice & Referral"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          onClick={() => viewInvoice(bill)}
                          title="View / Print Tax Invoice"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          <Eye size={16} />
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

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
                <Receipt size={22} className="text-indigo-600" />
                <span>Showroom Billing Counter</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
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
                    <label className="block text-slate-600 font-bold mb-1">Customer City</label>
                    <input
                      type="text"
                      value={customerForm.city}
                      onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                      placeholder="Kota, Rajasthan"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 flex items-center gap-1">
                      <Gift size={12} className="text-indigo-600" />
                      <span>Referral Code (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={customerForm.referralCode}
                      onChange={(e) => setCustomerForm({ ...customerForm, referralCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. EKO7A9B"
                      className="w-full p-2 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono uppercase text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center">
                    <div className="w-full p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl flex items-center justify-between gap-2 text-amber-900 text-[11px]">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-600 flex-shrink-0" />
                        <div>
                          <span className="font-bold">Customer Wallet Reward:</span>{' '}
                          <span className="font-black text-amber-950">+500 Purchase Coins</span> will be credited automatically.
                        </div>
                      </div>
                      {customerForm.referralCode && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md font-mono text-[10px] font-bold">
                          Referral Linked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt size={14} className="text-slate-500" />
                    <span>Product Line Items</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Item Row</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-5">
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
                          <label className="block text-slate-600 font-bold mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-bold"
                          />
                        </div>

                        <div className="sm:col-span-3">
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

                      {/* Barcode & Serial Scanner Integration */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-[11px] items-center">
                        <div className="sm:col-span-2 flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-slate-500 font-semibold mb-0.5">
                              Battery / Product Serial #
                            </label>
                            <input
                              type="text"
                              value={item.batterySerial || item.productSerial || ''}
                              onChange={(e) => handleItemChange(idx, 'batterySerial', e.target.value)}
                              placeholder="e.g. BAT-LFP-6030-9941"
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => openScannerForRow(idx)}
                            className="mt-4 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            <Scan size={14} />
                            <span>Scan</span>
                          </button>
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

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
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
                  </select>
                </div>
              </div>

              {/* Invoice Calculations Summary */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Discount</span>
                    <span className="font-mono text-emerald-400">-₹{discountTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>GST Tax (18%)</span>
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
                  {saving ? 'Creating Bill...' : 'Create Invoice & Warranty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & PRINT INVOICE MODAL */}
      {showInvoiceModal && selectedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 print:hidden">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Receipt size={18} className="text-indigo-600" />
                <span>Invoice Slip: {selectedBill.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printElement('invoice-printable', `EKOSMART_Invoice_${selectedBill.invoiceNumber}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
                  title="Print official invoice or choose 'Save as PDF' in the print dialog"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Soft-Coded Printable Area */}
            <div
              id="invoice-printable"
              className="mt-4 p-5 sm:p-6 border-2 rounded-2xl bg-white space-y-4 text-xs font-sans"
              style={{
                borderColor: activeTemplate?.theme?.primaryColor || '#4f46e5',
              }}
            >
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
                    {activeTemplate?.companyProfile?.tagline || 'Showroom Tax Invoice & Warranty Slip'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {activeTemplate?.companyProfile?.address || 'Kota Industrial Area | GSTIN: 08AABCE1234F1Z5'}
                  </p>
                  {activeTemplate?.companyProfile?.gstin && (
                    <p className="text-[10px] text-slate-700 font-mono font-bold mt-0.5">
                      GSTIN: {activeTemplate.companyProfile.gstin}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className="inline-block px-2.5 py-1 rounded-lg text-white font-mono font-bold text-xs"
                    style={{ backgroundColor: activeTemplate?.theme?.primaryColor || '#4f46e5' }}
                  >
                    {selectedBill.invoiceNumber}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(selectedBill.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Customer</div>
                  <div className="font-bold text-slate-800">{selectedBill.customerName}</div>
                  <div className="text-slate-600 font-mono">{selectedBill.customerMobile}</div>
                  {selectedBill.customerAddress && (
                    <div className="text-slate-500 text-[10px] mt-0.5">{selectedBill.customerAddress}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Payment Mode</div>
                  <div className="font-bold text-emerald-700">
                    {selectedBill.paymentMode} ({selectedBill.paymentStatus})
                  </div>
                  <div className="text-slate-500 text-[10px]">{selectedBill.showroom}</div>
                </div>
              </div>

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

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <div className="text-[10px] text-slate-400">
                  {selectedBill.warrantyGenerated && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> Official Warranty Active
                    </span>
                  )}
                </div>
                <div
                  className="text-right font-black text-base"
                  style={{ color: activeTemplate?.theme?.primaryColor || '#4f46e5' }}
                >
                  Grand Total: ₹{selectedBill.grandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Customer Wallet Reward Stamp */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-amber-900 text-[11px]">
                <div className="flex items-center gap-2">
                  <Coins size={16} className="text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Customer Reward Coins Credited:</span>{' '}
                    <span className="font-black text-amber-950">+{selectedBill.rewardCoinsAwarded || (selectedBill.purchaseRewardAwarded ? 500 : 500)} Coins</span> into customer digital wallet.
                  </div>
                </div>
                {selectedBill.referralCodeUsed && (
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                    <Gift size={11} /> Ref: {selectedBill.referralCodeUsed}
                  </div>
                )}
              </div>

              {/* Footer Note */}
              <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 text-center">
                {activeTemplate?.footer?.footerNote ||
                  'Thank you for choosing EKOSMART Clean Energy & Green Mobility!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL SOFT COPY & REFERRAL CODE MODAL */}
      {showEmailModal && emailModalBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-black text-base">
                <Mail size={20} className="text-emerald-600" />
                <span>Email Soft Copy Invoice & Referral Code</span>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="py-4 space-y-4 text-xs">
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Selected Invoice</div>
                  <div className="text-sm font-black text-emerald-950 font-mono">{emailModalBill.invoiceNumber}</div>
                  <div className="text-[11px] text-emerald-700">{emailModalBill.customerName} ({emailModalBill.customerMobile})</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Amount</div>
                  <div className="text-base font-black text-emerald-900 font-mono">₹{emailModalBill.grandTotal.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Email Address *</label>
                <input
                  type="email"
                  required
                  value={emailForm.recipientEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                  placeholder="e.g. customer@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Subject Line</label>
                <input
                  type="text"
                  required
                  value={emailForm.customSubject}
                  onChange={(e) => setEmailForm({ ...emailForm, customSubject: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Custom Message / Matter (Soft-Coded)</label>
                <textarea
                  rows={5}
                  value={emailForm.customMatter}
                  onChange={(e) => setEmailForm({ ...emailForm, customMatter: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Tokens like <code className="text-emerald-700">{"{{customerName}}"}</code> and <code className="text-emerald-700">{"{{referralCode}}"}</code> will be auto-replaced before dispatch.
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{sendingEmail ? 'Dispatching Soft Bill...' : 'Send Soft Copy Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCANNER MODAL */}
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default Billing;
