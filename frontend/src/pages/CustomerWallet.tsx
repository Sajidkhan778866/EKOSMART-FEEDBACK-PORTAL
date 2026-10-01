import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  Coins,
  Gift,
  Copy,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  RefreshCw,
  Sparkles,
  Award,
  Wrench,
  CheckCircle2,
  X,
  Ticket,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../config/api';

export default function CustomerWallet() {
  const { customer, token, refreshProfile } = useCustomerAuth();
  const navigate = useNavigate();

  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Service Redemption Modal
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [eligibleServices, setEligibleServices] = useState<any[]>([]);
  const [redeeming, setRedeeming] = useState(false);
  const [voucherResult, setVoucherResult] = useState<any | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchWallet = async () => {
    if (!token) {
      navigate('/customer/login');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/customers/me/wallet?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setWalletData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleServices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/customers/eligible-services`);
      if (res.data.success) {
        setEligibleServices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load eligible services:', err);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchEligibleServices();
  }, [token]);

  const handleCopyCode = () => {
    const code = walletData?.referralCode || customer?.referralCode;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = () => {
    const code = walletData?.referralCode || customer?.referralCode;
    if (code) {
      const text = `Join Ekosmart using my referral code ${code} to get 500 bonus coins on signup! ${window.location.origin}/customer/register?ref=${code}`;
      if (navigator.share) {
        navigator.share({ title: 'Ekosmart Bonus Coins', text, url: window.location.origin }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleRedeemServiceSubmit = async (service: any) => {
    const currentBal = walletData?.walletBalance ?? customer?.walletBalance ?? 0;
    if (currentBal < service.coinCost) {
      showAlert('error', `Insufficient coins. You need ${service.coinCost} coins, but have ${currentBal} coins.`);
      return;
    }

    try {
      setRedeeming(true);
      const res = await axios.post(
        `${API_BASE}/customers/me/wallet/redeem-service`,
        { serviceId: service.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setVoucherResult(res.data.data);
        fetchWallet();
        refreshProfile();
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to redeem service coins');
    } finally {
      setRedeeming(false);
    }
  };

  const transactions = walletData?.transactions || [];
  const filteredTransactions = transactions.filter((tx: any) => {
    const matchCat = categoryFilter === 'All' || tx.category === categoryFilter;
    const matchSearch =
      !searchTerm ||
      (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.transactionId && tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
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

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-600">
              <Coins size={26} />
            </span>
            <span>Customer Wallet</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Database-backed service reward coins balance and auditable transaction history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Wrench size={15} />
            <span>Redeem for Services</span>
          </button>
          <button
            onClick={fetchWallet}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Wallet Showcase Card */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-semibold backdrop-blur-sm">
              <Sparkles size={13} />
              <span>Current Available Balance</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                {walletData?.walletBalance ?? customer?.walletBalance ?? 0}
              </h2>
              <span className="text-lg font-bold text-amber-200 uppercase">COINS</span>
            </div>
            <p className="text-xs text-amber-100 font-mono pt-1">
              Account: {customer?.customerId} • {customer?.name}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowRedeemModal(true)}
                className="px-4 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-black shadow-md hover:bg-amber-50 transition inline-flex items-center gap-1.5"
              >
                <Ticket size={14} className="text-amber-600" />
                <span>Use Coins for Free Services</span>
              </button>
            </div>
          </div>

          {/* Referral Code Mini Card */}
          <div className="bg-slate-950/40 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-white min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Gift size={13} />
                <span>My Referral Code</span>
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">100 Coins / Invite</span>
            </div>

            <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="text-xl font-mono font-black tracking-widest text-emerald-300">
                {walletData?.referralCode || customer?.referralCode || 'EKO7X92P'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Copy size={13} />
                <span>{copied ? 'Copied!' : 'COPY'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Share2 size={13} />
                <span>SHARE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-amber-200 block">Total Earned Coins</span>
            <strong className="text-lg font-black text-white">
              +{walletData?.totalEarnedCoins ?? customer?.totalEarnedCoins ?? 0} Coins
            </strong>
          </div>
          <div>
            <span className="text-amber-200 block">Total Spent / Redeemed</span>
            <strong className="text-lg font-black text-white">
              {walletData?.totalSpentCoins ?? customer?.totalSpentCoins ?? 0} Coins
            </strong>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-amber-200 block">Service Eligibility</span>
            <strong className="text-lg font-black text-emerald-300">Active (Service-Only)</strong>
          </div>
        </div>
      </div>

      {/* How to Earn Coins Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 inline-block">
            <Gift size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Welcome Reward</h4>
          <p className="text-lg font-black text-emerald-600">+500 Coins</p>
          <p className="text-[11px] text-slate-500 leading-tight">
            Earned immediately upon entering a valid referral code during signup.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700 inline-block">
            <Award size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Referrer Reward</h4>
          <p className="text-lg font-black text-purple-600">+100 Coins / Friend</p>
          <p className="text-[11px] text-slate-500 leading-tight">
            Earned each time a friend verifies their email with your referral code.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 inline-block">
            <Coins size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Showroom Purchase</h4>
          <p className="text-lg font-black text-amber-600">+500 Coins</p>
          <p className="text-[11px] text-slate-500 leading-tight">
            Automatically credited on every qualifying showroom bill and battery purchase.
          </p>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Wallet Transaction Ledger</h3>
            <p className="text-xs text-slate-500">Every credit and redemption is auditable on the blockchain-ready ledger.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 font-medium"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Welcome Reward">Welcome Reward</option>
              <option value="Referral Reward">Referral Reward</option>
              <option value="Referrer Reward">Referrer Reward</option>
              <option value="Purchase Reward">Purchase Reward</option>
              <option value="Service Redemption">Service Redemption</option>
              <option value="Admin Adjustment">Admin Adjustment</option>
            </select>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-slate-100 text-slate-400">
              <Coins size={24} />
            </div>
            <p className="font-semibold text-slate-700">No transaction records found.</p>
            <p className="text-[11px] text-slate-400">
              Your showroom purchase rewards and referral earnings will be listed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-3">Type & Category</th>
                  <th className="py-3 px-3">Description / Reason</th>
                  <th className="py-3 px-3">Reference / Voucher</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3 text-right">Coins</th>
                  <th className="py-3 px-3 text-right">Balance Post-Tx</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx: any) => (
                  <tr key={tx._id || tx.transactionId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`p-1.5 rounded-xl ${
                            tx.type === 'Credit'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {tx.type === 'Credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 block">{tx.category || tx.type}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{tx.transactionId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium max-w-xs">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {tx.reference || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`font-black text-sm ${
                          tx.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {tx.type === 'Credit' ? '+' : '-'}
                        {tx.amount}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700">
                      {tx.balanceAfter}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. SERVICE COIN REDEMPTION MODAL                                         */}
      {/* ========================================================================= */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Wrench size={18} />
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Redeem Coins for Eligible Services</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reward coins can be redeemed exclusively for authorized battery & vehicle workshop services.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRedeemModal(false);
                  setVoucherResult(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Balance Banner */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Your Wallet Balance</span>
                <p className="text-2xl font-black text-emerald-950 flex items-center gap-1.5 mt-0.5">
                  <Coins size={22} className="text-amber-500 fill-amber-500" />
                  <span>{walletData?.walletBalance ?? customer?.walletBalance ?? 0} Coins</span>
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full font-bold text-xs">
                1 Coin = ₹1 Service Credit
              </span>
            </div>

            {/* Voucher Success Notification */}
            {voucherResult && (
              <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl text-white shadow-lg space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-200 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 size={16} />
                  <span>Service Voucher Generated!</span>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/20 text-center space-y-1">
                  <span className="text-xs text-emerald-200 font-medium">Present this voucher code at any Ekosmart Service Center</span>
                  <div className="text-2xl font-mono font-black text-amber-300 tracking-widest pt-1">
                    {voucherResult.voucherCode}
                  </div>
                </div>
                <div className="text-xs text-emerald-100 flex justify-between items-center pt-1">
                  <span>Service: <strong>{voucherResult.serviceName}</strong></span>
                  <span>Coins Redeemed: <strong>-{voucherResult.coinsRedeemed}</strong></span>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select an Authorized Service:
              </label>

              <div className="grid grid-cols-1 gap-3">
                {eligibleServices.map((srv: any) => {
                  const currentCoins = walletData?.walletBalance ?? customer?.walletBalance ?? 0;
                  const canAfford = currentCoins >= srv.coinCost;

                  return (
                    <div
                      key={srv.id}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                        canAfford ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{srv.name}</h4>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-black text-[10px] flex items-center gap-1">
                            <Coins size={11} className="fill-amber-500 text-amber-500" />
                            <span>{srv.coinCost} Coins</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{srv.description}</p>
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford || redeeming}
                        onClick={() => handleRedeemServiceSubmit(srv)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Ticket size={13} />
                        <span>{canAfford ? 'Redeem Voucher' : 'Need More Coins'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowRedeemModal(false);
                  setVoucherResult(null);
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
