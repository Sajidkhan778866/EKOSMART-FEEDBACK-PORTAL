import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  Wallet,
  Gift,
  ShoppingBag,
  ShieldCheck,
  ClipboardList,
  User,
  Copy,
  Share2,
  ChevronRight,
  Coins,
  TrendingUp,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../config/api';

export default function CustomerDashboard() {
  const { customer, token, logout, refreshProfile } = useCustomerAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [walletSummary, setWalletSummary] = useState<any>(null);
  const [referralSummary, setReferralSummary] = useState<any>(null);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/customer/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [walletRes, refRes, purRes] = await Promise.all([
          axios.get(`${API_BASE}/customers/me/wallet?limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/customers/me/referrals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/customers/me/purchases`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (walletRes.data.success) setWalletSummary(walletRes.data.data);
        if (refRes.data.success) setReferralSummary(refRes.data.data);
        if (purRes.data.success) setRecentPurchases(purRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleCopyCode = () => {
    if (customer?.referralCode) {
      navigator.clipboard.writeText(customer.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = () => {
    if (customer?.referralCode) {
      const shareText = `Use my Ekosmart referral code ${customer.referralCode} on registration to receive 500 bonus coins! ${window.location.origin}/customer/register?ref=${customer.referralCode}`;
      if (navigator.share) {
        navigator.share({
          title: 'Ekosmart EV Battery Solution Referral',
          text: shareText,
          url: window.location.origin,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Customer Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{customer?.name}</h1>
            <p className="text-xs text-slate-300 font-mono flex items-center gap-2">
              <span>Customer ID: <strong className="text-emerald-400">{customer?.customerId}</strong></span>
              <span>•</span>
              <span>{customer?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshProfile()}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition flex items-center gap-2 border border-red-500/30 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Highlights: Wallet & Referral Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Wallet Balance Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-3xl p-6 border-2 border-amber-300/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md">
                <Coins size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Ekosmart Wallet</span>
                <h3 className="text-3xl font-black text-amber-600 tracking-tight">
                  {walletSummary?.walletBalance ?? customer?.walletBalance ?? 0}{' '}
                  <span className="text-sm font-semibold text-amber-700">Coins</span>
                </h3>
              </div>
            </div>
            <Link
              to="/customer/wallet"
              className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
              title="View Wallet"
            >
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-200/60 text-xs">
            <div>
              <span className="text-slate-500 block">Total Earned</span>
              <strong className="text-emerald-700 text-sm font-bold">
                +{walletSummary?.totalEarnedCoins ?? customer?.totalEarnedCoins ?? 0} Coins
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Total Used</span>
              <strong className="text-slate-700 text-sm font-bold">
                {walletSummary?.totalSpentCoins ?? customer?.totalSpentCoins ?? 0} Coins
              </strong>
            </div>
          </div>

          <Link
            to="/customer/wallet"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-2xl shadow transition text-center flex items-center justify-center gap-1.5"
          >
            <Wallet size={15} />
            <span>View Full Wallet & Transactions</span>
          </Link>
        </div>

        {/* 2. Referral Code Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gift size={15} />
                <span>My Referral Program</span>
              </span>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                Earn 100 Coins / Friend
              </span>
            </div>

            <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Your Unique Code</span>
                <span className="text-xl font-mono font-black text-white tracking-wider">
                  {customer?.referralCode || 'EKO7X92P'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Total Friends Referred</span>
              <strong className="text-emerald-400 text-sm font-bold">
                {referralSummary?.totalReferrals ?? customer?.stats?.referralCount ?? 0}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Referral Coins Won</span>
              <strong className="text-amber-400 text-sm font-bold">
                +{referralSummary?.coinsEarned ?? 0} Coins
              </strong>
            </div>
          </div>

          <Link
            to="/customer/referrals"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-2xl border border-slate-700 transition text-center flex items-center justify-center gap-1.5"
          >
            <Gift size={15} />
            <span>View Referral History & Details</span>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Action Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3 tracking-wide">Customer Services & Modules</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/customer/wallet"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Coins size={22} />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">My Wallet</span>
          </Link>

          <Link
            to="/customer/referrals"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Gift size={22} />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">My Referrals</span>
          </Link>

          <Link
            to="/customer/purchases"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <ShoppingBag size={22} />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">My Purchases</span>
          </Link>

          <Link
            to="/warranty/check"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">My Warranty</span>
          </Link>

          <Link
            to="/complaint/track"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <ClipboardList size={22} />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">My Complaints</span>
          </Link>

          <Link
            to="/customer/profile"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
              <User size={22} />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">My Profile</span>
          </Link>
        </div>
      </div>

      {/* Recent Purchases & Wallet History Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={17} className="text-blue-600" />
              <span>Recent Purchases & Bills</span>
            </h3>
            <Link to="/customer/purchases" className="text-xs font-bold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p>No showroom purchases recorded yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Your invoices will appear here automatically when billing at Ekosmart showrooms.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPurchases.map((bill) => (
                <div
                  key={bill._id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{bill.invoiceNumber}</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(bill.createdAt).toLocaleDateString('en-GB')} • {bill.items?.length || 1} Item(s)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 block">₹{bill.grandTotal?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {bill.paymentStatus || 'Paid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Wallet Coins Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={17} className="text-amber-500" />
              <span>Recent Wallet Activity</span>
            </h3>
            <Link to="/customer/wallet" className="text-xs font-bold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          {(!walletSummary?.transactions || walletSummary.transactions.length === 0) ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p>No wallet transactions yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Refer friends or make purchases to start earning bonus coins!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletSummary.transactions.slice(0, 4).map((tx: any) => (
                <div
                  key={tx._id || tx.transactionId}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block">{tx.category || tx.description}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('en-GB')} • {tx.transactionId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-black text-sm block ${
                        tx.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'Credit' ? '+' : '-'}{tx.amount} Coins
                    </span>
                    <span className="text-[10px] text-slate-400">Bal: {tx.balanceAfter}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
