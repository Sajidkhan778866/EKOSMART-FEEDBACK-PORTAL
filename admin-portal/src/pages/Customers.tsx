import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Loader2,
  Download,
  Gift,
  Coins,
  Share2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Phone,
  Mail,
  ShoppingBag,
  ShieldCheck,
  ClipboardList,
  Save,
  Check,
  Copy,
} from 'lucide-react';
import { customerApi } from '../api/client';
import { DateRangeFilter, type DateRangeState } from '../components/DateRangeFilter';

interface CustomerItem {
  _id: string;
  customerId: string;
  name: string;
  mobile: string;
  email?: string;
  customerType?: string;
  referralCode?: string;
  referredBy?: { _id: string; name: string; mobile: string; referralCode?: string };
  walletBalance: number;
  totalEarnedCoins: number;
  totalSpentCoins: number;
  isVerified?: boolean;
  status?: string;
  createdAt: string;
}

export default function Customers() {
  const [activeTab, setActiveTab] = useState<'directory' | 'referrals' | 'wallet'>('directory');

  // Customer Directory State
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState<DateRangeState>({ filter: 'all' });

  // Selected Customer Dossier Modal State
  const [dossierCustomer, setDossierCustomer] = useState<any | null>(null);

  // Add Customer Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: 'Kota',
    state: 'Rajasthan',
    customerType: 'Retail',
    initialCoins: 0,
    referralCodeUsed: '',
  });

  // Adjust Wallet Modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedForAdjust, setSelectedForAdjust] = useState<CustomerItem | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    amount: 100,
    type: 'credit' as 'credit' | 'debit',
    description: 'Admin Promotion',
    notes: '',
  });
  const [adjusting, setAdjusting] = useState(false);

  // Referral Settings State
  const [referralSettings, setReferralSettings] = useState({
    newCustomerReward: 500,
    referrerReward: 100,
    purchaseReward: 500,
    minPurchaseAmount: 1000,
    isEnabled: true,
    termsAndConditions: '1 coin = ₹1 credit. Welcome bonus awarded on first registration.',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Referrals List State
  const [referralsList, setReferralsList] = useState<any[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  // Wallet Transactions List State
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Toast / Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getAll({
        search: search || undefined,
        customerType: typeFilter !== 'All' ? typeFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      showAlert('error', err.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Referral Settings & List
  const fetchReferralData = async () => {
    try {
      setLoadingReferrals(true);
      const [settingsRes, referralsRes] = await Promise.all([
        customerApi.getReferralSettings().catch(() => null),
        customerApi.getAllReferrals({
          dateFilter: dateRange.filter,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }).catch(() => null),
      ]);

      if (settingsRes?.data?.success && settingsRes.data.data) {
        setReferralSettings(settingsRes.data.data);
      }
      if (referralsRes?.data?.success && referralsRes.data.data) {
        setReferralsList(referralsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load referral data:', err);
    } finally {
      setLoadingReferrals(false);
    }
  };

  // Fetch Wallet Transactions
  const fetchWalletTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const res = await customerApi.getAllWalletTransactions({
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        search: search || undefined,
      });
      if (res.data.success) {
        setWalletTransactions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load wallet transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'directory') {
      fetchCustomers();
    } else if (activeTab === 'referrals') {
      fetchReferralData();
    } else if (activeTab === 'wallet') {
      fetchWalletTransactions();
    }
  }, [activeTab, dateRange, typeFilter]);

  // Open Dossier
  const handleOpenDossier = async (customerId: string) => {
    try {
      const res = await customerApi.getById(customerId);
      if (res.data.success) {
        setDossierCustomer(res.data.data);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to load customer dossier');
    }
  };

  // Save Referral Settings
  const handleSaveReferralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await customerApi.updateReferralSettings(referralSettings);
      if (res.data.success) {
        setSettingsSuccess(true);
        showAlert('success', 'Referral & Wallet reward parameters updated successfully');
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to update referral settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Adjust Wallet
  const handleAdjustWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForAdjust) return;
    try {
      setAdjusting(true);
      const res = await customerApi.adjustWallet(selectedForAdjust._id, adjustForm);
      if (res.data.success) {
        showAlert('success', `Wallet updated! New balance: ${res.data.data.walletBalance} coins`);
        setShowAdjustModal(false);
        fetchCustomers();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to adjust customer wallet');
    } finally {
      setAdjusting(false);
    }
  };

  // Add Customer Submit
  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddingCustomer(true);
      const res = await customerApi.create(newCustomerForm);
      if (res.data.success) {
        showAlert('success', `Customer ${res.data.data.name} added with code ${res.data.data.referralCode}!`);
        setShowAddModal(false);
        setNewCustomerForm({
          name: '',
          mobile: '',
          email: '',
          address: '',
          city: 'Kota',
          state: 'Rajasthan',
          customerType: 'Retail',
          initialCoins: 0,
          referralCodeUsed: '',
        });
        fetchCustomers();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to create customer');
    } finally {
      setAddingCustomer(false);
    }
  };

  // Export handlers
  const handleExportCustomers = async () => {
    try {
      setExporting(true);
      const res = await customerApi.export({
        search: search || undefined,
        customerType: typeFilter !== 'All' ? typeFilter : undefined,
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart-customers-${dateRange.filter}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export customers:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportReferrals = async () => {
    try {
      setExporting(true);
      const res = await customerApi.exportReferrals({
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart-referrals-${dateRange.filter}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export referrals:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportWallet = async () => {
    try {
      setExporting(true);
      const res = await customerApi.exportWalletTransactions({
        dateFilter: dateRange.filter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ekosmart-wallet-transactions-${dateRange.filter}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export wallet transactions:', err);
    } finally {
      setExporting(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Alert toast */}
      {alert && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg transition animate-in fade-in ${
            alert.type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-700/20' : 'bg-red-600 text-white shadow-red-700/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="opacity-80 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Customer & Referral Hub</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage customer dossiers, unique referral codes, coin wallets, and soft-coded reward settings.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'directory' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>Customer Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'referrals' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift size={14} />
            <span>Referral Program</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'wallet' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins size={14} />
            <span>Wallet Logs</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CUSTOMER DIRECTORY                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <DateRangeFilter value={dateRange} onChange={setDateRange} />

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="All">All Customer Types</option>
                  <option value="Retail">Retail</option>
                  <option value="Showroom">Showroom Buyer</option>
                  <option value="Dealer">Dealer / Distributor</option>
                  <option value="Commercial">Commercial / Fleet</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCustomers}
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download size={13} className={exporting ? 'animate-bounce' : ''} />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>

            <div className="relative max-w-md pt-1">
              <input
                type="text"
                placeholder="Search Name, Mobile, Referral Code, Customer ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <Search size={16} className="absolute left-3 top-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={36} />
              </div>
            ) : customers.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Users size={48} className="mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-slate-700">No customer records found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your date range or search query</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-5">Customer ID</th>
                      <th className="py-3.5 px-5">Name & Contact</th>
                      <th className="py-3.5 px-5">Referral Code</th>
                      <th className="py-3.5 px-5">Referred By</th>
                      <th className="py-3.5 px-5">Wallet Coins</th>
                      <th className="py-3.5 px-5">Joined Date</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-5 font-mono font-bold text-emerald-700">{c.customerId}</td>
                        <td className="py-3.5 px-5">
                          <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                          <div className="flex items-center gap-3 text-slate-500 mt-0.5 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Phone size={11} />
                              {c.mobile}
                            </span>
                            {c.email && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Mail size={11} />
                                {c.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-mono font-bold text-xs">
                            <Gift size={12} className="text-amber-600" />
                            <span>{c.referralCode || 'N/A'}</span>
                            {c.referralCode && (
                              <button
                                onClick={() => copyCode(c.referralCode!)}
                                className="ml-1 text-amber-600 hover:text-amber-800"
                                title="Copy code"
                              >
                                {copiedCode === c.referralCode ? <Check size={11} /> : <Copy size={11} />}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600">
                          {c.referredBy ? (
                            <div>
                              <p className="font-semibold text-slate-700">{c.referredBy.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{c.referredBy.referralCode}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Direct / None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-black text-xs">
                            <Coins size={13} className="text-amber-500 fill-amber-500" />
                            <span>{c.walletBalance || 0} Coins</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedForAdjust(c);
                                setShowAdjustModal(true);
                              }}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Credit / Debit Wallet Coins"
                            >
                              <Coins size={12} />
                              <span>Adjust</span>
                            </button>
                            <button
                              onClick={() => handleOpenDossier(c._id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="View Customer Dossier"
                            >
                              <Eye size={12} />
                              <span>Dossier</span>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REFERRAL PROGRAM MANAGEMENT                                        */}
      {/* ========================================================================= */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Referral Program Soft-Coded Configuration */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-emerald-600" />
                  <h2 className="text-lg font-black text-slate-800">Soft-Coded Referral & Wallet Reward Rules</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust welcome coins, referrer incentives, and showroom bill bonuses dynamically in real-time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={referralSettings.isEnabled}
                    onChange={(e) => setReferralSettings({ ...referralSettings, isEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {referralSettings.isEnabled ? 'Program Active' : 'Program Paused'}
                  </span>
                </label>
              </div>
            </div>

            <form onSubmit={handleSaveReferralSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Gift size={16} />
                    <span>Welcome Bonus (Customer B)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Coins awarded instantly to new user upon OTP registration</p>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={referralSettings.newCustomerReward}
                      onChange={(e) => setReferralSettings({ ...referralSettings, newCustomerReward: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-emerald-300 rounded-xl font-black text-sm text-emerald-800"
                    />
                    <Coins size={14} className="absolute left-2.5 top-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <Share2 size={16} />
                    <span>Referrer Bonus (Customer A)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Coins awarded to referring friend upon B's successful registration</p>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={referralSettings.referrerReward}
                      onChange={(e) => setReferralSettings({ ...referralSettings, referrerReward: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-amber-300 rounded-xl font-black text-sm text-amber-800"
                    />
                    <Coins size={14} className="absolute left-2.5 top-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 font-bold">
                    <ShoppingBag size={16} />
                    <span>Purchase Bill Bonus</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Coins credited automatically when counter bill is generated</p>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={referralSettings.purchaseReward}
                      onChange={(e) => setReferralSettings({ ...referralSettings, purchaseReward: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-blue-300 rounded-xl font-black text-sm text-blue-800"
                    />
                    <Coins size={14} className="absolute left-2.5 top-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save size={14} />
                  <span>{savingSettings ? 'Saving...' : settingsSuccess ? 'Saved!' : 'Save Reward Parameters'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Referrals Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-black text-slate-800">Referred Customers Log</h3>
                <p className="text-xs text-slate-500">Complete auditable record of who referred whom and coins awarded.</p>
              </div>
              <button
                type="button"
                onClick={handleExportReferrals}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Download size={13} className={exporting ? 'animate-bounce' : ''} />
                <span>Export Referrals CSV</span>
              </button>
            </div>

            {loadingReferrals ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
              </div>
            ) : referralsList.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Gift size={36} className="mx-auto mb-2 opacity-40" />
                <p className="font-semibold text-slate-600">No referral transactions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Referral ID</th>
                      <th className="py-3 px-4">Referrer (User A)</th>
                      <th className="py-3 px-4">Referred Friend (User B)</th>
                      <th className="py-3 px-4">Referrer Award</th>
                      <th className="py-3 px-4">Welcome Award</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referralsList.map((ref) => (
                      <tr key={ref._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{ref.referralId}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{ref.referrer?.name || 'N/A'}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{ref.referrerCodeUsed || ref.referrer?.referralCode}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{ref.referredCustomer?.name || 'N/A'}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{ref.referredCustomer?.mobile}</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700">+{ref.referrerCoinsAwarded || 0} Coins</td>
                        <td className="py-3 px-4 font-bold text-amber-700">+{ref.referredCoinsAwarded || 0} Coins</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                            {ref.status || 'Completed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(ref.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WALLET TRANSACTIONS LOG                                            */}
      {/* ========================================================================= */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <button
              type="button"
              onClick={handleExportWallet}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Download size={13} className={exporting ? 'animate-bounce' : ''} />
              <span>Export Wallet CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {loadingTransactions ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
              </div>
            ) : walletTransactions.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Coins size={40} className="mx-auto mb-2 opacity-40" />
                <p className="font-semibold text-slate-700">No wallet transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-5">Transaction ID</th>
                      <th className="py-3.5 px-5">Customer</th>
                      <th className="py-3.5 px-5">Category & Purpose</th>
                      <th className="py-3.5 px-5">Amount</th>
                      <th className="py-3.5 px-5">Balance Post-Tx</th>
                      <th className="py-3.5 px-5">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {walletTransactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-5 font-mono font-bold text-slate-600">{tx.transactionId}</td>
                        <td className="py-3.5 px-5">
                          <p className="font-bold text-slate-800">{tx.customer?.name || 'Customer'}</p>
                          <p className="text-[11px] text-slate-400">{tx.customer?.mobile}</p>
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] mb-1 ${
                              tx.category === 'Welcome Reward'
                                ? 'bg-amber-100 text-amber-800'
                                : tx.category === 'Referrer Reward'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.category === 'Purchase Reward'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {tx.category || tx.description}
                          </span>
                          {tx.notes && <p className="text-[11px] text-slate-500">{tx.notes}</p>}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1 font-black text-sm ${
                              tx.type === 'credit' ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {tx.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            {tx.type === 'credit' ? '+' : '-'}
                            {tx.amount} Coins
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono font-bold text-slate-700">
                          {tx.balanceAfter} Coins
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">
                          {new Date(tx.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CUSTOMER DOSSIER MODAL                                                 */}
      {/* ========================================================================= */}
      {dossierCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs font-mono">
                    {dossierCustomer.customer?.customerId}
                  </span>
                  <h3 className="text-xl font-black text-slate-800">{dossierCustomer.customer?.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive Customer Profile, Wallet & Service History</p>
              </div>
              <button
                onClick={() => setDossierCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Wallet Balance</span>
                <div className="flex items-center gap-1.5 mt-1 font-black text-2xl text-emerald-900">
                  <Coins size={20} className="text-amber-500 fill-amber-500" />
                  <span>{dossierCustomer.customer?.walletBalance || 0}</span>
                </div>
                <span className="text-[10px] text-emerald-700 mt-1 block">
                  Total Earned: {dossierCustomer.customer?.totalEarnedCoins || 0} Coins
                </span>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Referral Code</span>
                <div className="mt-1 font-mono font-black text-xl text-amber-900 flex items-center justify-between">
                  <span>{dossierCustomer.customer?.referralCode}</span>
                  <button
                    onClick={() => copyCode(dossierCustomer.customer?.referralCode)}
                    className="p-1 text-amber-700 hover:text-amber-900"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <span className="text-[10px] text-amber-700 mt-1 block">
                  Referred {dossierCustomer.referrals?.length || 0} friends
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Contact Details</span>
                <p className="text-xs font-bold text-slate-800 mt-1">{dossierCustomer.customer?.mobile}</p>
                <p className="text-[11px] text-slate-500">{dossierCustomer.customer?.email || 'No email registered'}</p>
              </div>
            </div>

            {/* Purchases / Bills Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShoppingBag size={14} className="text-emerald-600" />
                <span>Showroom & Plant Invoices ({dossierCustomer.purchases?.length || 0})</span>
              </div>
              {dossierCustomer.purchases?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No counter purchases found.</p>
              ) : (
                <div className="space-y-2">
                  {dossierCustomer.purchases?.map((b: any) => (
                    <div key={b._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 font-mono">{b.invoiceNumber}</p>
                        <p className="text-[11px] text-slate-500">
                          {b.items?.map((i: any) => i.productName).join(', ') || 'Vehicle & Spares'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {b.purchaseRewardAwarded ? '+500 Coins Rewarded' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Warranties Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Registered Warranties ({dossierCustomer.warranties?.length || 0})</span>
              </div>
              {dossierCustomer.warranties?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No active product warranties registered.</p>
              ) : (
                <div className="space-y-2">
                  {dossierCustomer.warranties?.map((w: any) => (
                    <div key={w._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{w.product || 'Lithium Battery Pack'}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Serial: {w.serialNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                          {w.status || 'Active'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Exp: {new Date(w.warrantyExpiryDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Complaints Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ClipboardList size={14} className="text-emerald-600" />
                <span>Service Tickets & Complaints ({dossierCustomer.complaints?.length || 0})</span>
              </div>
              {dossierCustomer.complaints?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No service complaints filed.</p>
              ) : (
                <div className="space-y-2">
                  {dossierCustomer.complaints?.map((c: any) => (
                    <div key={c._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 font-mono">{c.ticketNumber}</p>
                        <p className="text-[11px] text-slate-500">{c.complaintType} - {c.division}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-md text-[10px]">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADJUST WALLET MODAL                                                    */}
      {/* ========================================================================= */}
      {showAdjustModal && selectedForAdjust && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800">Adjust Customer Coin Wallet</h3>
                <p className="text-xs text-slate-500">Customer: {selectedForAdjust.name}</p>
              </div>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustWalletSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                <span className="text-slate-600 font-bold">Current Balance:</span>
                <span className="font-black text-sm text-emerald-800">{selectedForAdjust.walletBalance} Coins</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'credit' })}
                    className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      adjustForm.type === 'credit'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowDownLeft size={14} />
                    <span>Credit (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'debit' })}
                    className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      adjustForm.type === 'debit'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpRight size={14} />
                    <span>Debit (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coins Amount</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustForm.amount}
                  onChange={(e) => setAdjustForm({ ...adjustForm, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category / Reason</label>
                <input
                  type="text"
                  required
                  value={adjustForm.description}
                  onChange={(e) => setAdjustForm({ ...adjustForm, description: e.target.value })}
                  placeholder="e.g. Festival Promotional Bonus / Showroom Redemption"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={adjustForm.notes}
                  onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })}
                  placeholder="Internal audit notes..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Coins size={14} />
                  <span>{adjusting ? 'Adjusting...' : 'Confirm Adjustment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADD CUSTOMER MODAL                                                     */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-800">Add New Customer</h3>
                <p className="text-xs text-slate-500">Auto-generates unique EKO referral code & initializes wallet</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newCustomerForm.mobile}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    placeholder="customer@email.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Category</label>
                  <select
                    value={newCustomerForm.customerType}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customerType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Retail">Retail</option>
                    <option value="Showroom">Showroom Buyer</option>
                    <option value="Dealer">Dealer / Distributor</option>
                    <option value="Commercial">Commercial / Fleet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Wallet Coins</label>
                  <input
                    type="number"
                    min={0}
                    value={newCustomerForm.initialCoins}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, initialCoins: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Referred By Code (Optional)</label>
                <input
                  type="text"
                  value={newCustomerForm.referralCodeUsed}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, referralCodeUsed: e.target.value.toUpperCase() })}
                  placeholder="e.g. EKO7788"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  placeholder="Address, Shop No, Landmark"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCustomer}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus size={15} />
                  <span>{addingCustomer ? 'Registering...' : 'Save Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
