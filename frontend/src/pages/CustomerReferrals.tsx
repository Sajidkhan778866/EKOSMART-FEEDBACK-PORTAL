import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  Gift,
  Copy,
  Share2,
  Users,
  Coins,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../config/api';

export default function CustomerReferrals() {
  const { customer, token } = useCustomerAuth();
  const navigate = useNavigate();

  const [referralData, setReferralData] = useState<any>(null);
  const [referralSettings, setReferralSettings] = useState<any>({
    referrerReward: 500,
    newCustomerReward: 500,
    batteryCoins: 500,
    showroomCoins: 250,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferrals = async () => {
    if (!token) {
      navigate('/customer/login');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/customers/me/referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setReferralData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }

    try {
      const pubRes = await axios.get(`${API_BASE}/content/public`);
      if (pubRes.data?.success && pubRes.data.data?.referralSettings) {
        setReferralSettings(pubRes.data.data.referralSettings);
      }
    } catch (err) {
      console.warn('Failed to fetch referral settings in referral page:', err);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [token]);

  const code = referralData?.referralCode || customer?.referralCode || 'EKO7X92P';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const text = `Join Ekosmart using my referral code ${code} to earn reward coins on your showroom purchase! ${window.location.origin}/customer/register?ref=${code}`;
    if (navigator.share) {
      navigator.share({ title: 'Ekosmart Referral Program', text, url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const history = referralData?.history || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-100 text-purple-600">
              <Gift size={26} />
            </span>
            <span>My Referrals</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Invite friends to Ekosmart and earn rewards for every successful registration.
          </p>
        </div>
        <button
          onClick={fetchReferrals}
          disabled={loading}
          className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Share Referral Code Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Invite Friends & Earn Rewards</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Share Your Referral Code
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              When a friend purchases with your code, they receive <strong className="text-emerald-400">+{referralSettings.newCustomerReward || 500} Coins</strong> and you receive <strong className="text-amber-400">+{referralSettings.referrerReward || 500} Coins</strong> in your wallet!
            </p>
          </div>

          <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 min-w-[280px] space-y-3 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              MY REFERRAL CODE
            </span>
            <div className="text-2xl font-mono font-black text-white tracking-widest bg-slate-900 py-3 px-4 rounded-2xl border border-slate-700">
              {code}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} />
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 size={13} />
                <span>SHARE</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-slate-400 block mb-1">Total Referrals</span>
            <strong className="text-2xl font-black text-white">
              {referralData?.totalReferrals || 0}
            </strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-slate-400 block mb-1">Successful Referrals</span>
            <strong className="text-2xl font-black text-emerald-400">
              {referralData?.successfulReferrals || 0}
            </strong>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-slate-400 block mb-1">Coins Earned</span>
            <strong className="text-2xl font-black text-amber-400">
              +{referralData?.coinsEarned || 0} Coins
            </strong>
          </div>
        </div>
      </div>

      {/* How it Works Diagram */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">How the Ekosmart Referral Program Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-slate-800">Share Your Code</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Send your unique code ({code}) to friends, family or colleagues purchasing EV batteries.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-slate-800">Friend Purchases</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Your friend enters your code during account creation & makes a showroom purchase.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-slate-800">Both Earn Coins</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Friend gets +{referralSettings.newCustomerReward || 500} Coins and you get +{referralSettings.referrerReward || 500} Coins credited upon qualifying purchase!
            </p>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Referral History</h3>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Users size={24} />
            </div>
            <p className="font-semibold text-slate-700">No referrals yet.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Share your unique referral code with friends and family to start receiving referral coins!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2">Customer Referred</th>
                  <th className="py-3 px-2">Reward Earned</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-2 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">
                        {item.referredCustomer?.[0] || 'F'}
                      </div>
                      <span>{item.referredCustomer || 'Referred Customer'}</span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl text-xs inline-flex items-center gap-1">
                        <Coins size={12} />
                        <span>+{item.rewardCoins || 100} Coins</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-500 text-[11px]">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {item.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
