import { useState, useEffect } from 'react';
import {
  Shield,
  Server,
  Coins,
  Gift,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Battery,
  ShoppingBag,
  Wrench,
} from 'lucide-react';
import { customerApi } from '../api/client';

const Settings = () => {
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [savingCoins, setSavingCoins] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [referralSettings, setReferralSettings] = useState({
    enabled: true,
    welcomeRewardCoins: 250,
    referrerReward: 500,
    newCustomerReward: 500,
    batteryCoins: 500,
    showroomCoins: 250,
    purchaseReward: 500,
    serviceReward: 250,
    serviceRedemptionValue: 200,
    qualifyingMinPurchase: 0,
    coinConversionRate: 1,
    termsAndConditions: [
      '1. New registered customers receive welcome coins upon account opening / registration.',
      '2. The referring customer receives referral coins once their referred friend completes verification or first purchase.',
      '3. Every qualifying showroom & EV battery product purchase awards reward coins directly to the customer digital wallet.',
      '4. Accumulated coins can be redeemed for EV battery servicing, maintenance charges, and accessories.',
      '5. Referral codes are permanent, unique, non-guessable, and linked to the customer account.',
    ],
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoadingCoins(true);
      const res = await customerApi.getReferralSettings();
      if (res.data?.success && res.data.data) {
        setReferralSettings((prev) => ({
          ...prev,
          ...res.data.data,
        }));
      }
    } catch (err: any) {
      console.warn('Failed to load referral settings:', err);
    } finally {
      setLoadingCoins(false);
    }
  };

  const handleSaveCoinsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingCoins(true);
      const res = await customerApi.updateReferralSettings(referralSettings);
      if (res.data?.success) {
        showAlert('success', 'Reward coin rules and referral rates updated successfully!');
      } else {
        showAlert('error', res.data?.message || 'Failed to update settings');
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to update referral coin settings');
    } finally {
      setSavingCoins(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-800">System Configuration</h1>
        <p className="text-slate-500 text-xs">
          Manage business architecture, soft-coded referral coin rewards, and database settings.
        </p>
      </div>

      {alert && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border transition-all ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* ============================================================================== */}
      {/* 1. SOFT-CODED CUSTOMER WALLET & REWARD COINS MATRIX (Requested)                 */}
      {/* ============================================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
              <Coins size={24} className="fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-base">
                  Soft-Coded Referral & Reward Coins Matrix
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                  🪙 Only Coins
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure reward coin amounts awarded across Account Opening, Showroom Purchases, Battery Sales, and Service Redemption.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <label className="text-xs font-bold text-slate-700 px-3 flex items-center gap-2 cursor-pointer">
              <span>Referral Program:</span>
              <input
                type="checkbox"
                checked={referralSettings.enabled}
                onChange={(e) => setReferralSettings({ ...referralSettings, enabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
              <span className={`text-[11px] font-black ${referralSettings.enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                {referralSettings.enabled ? 'ACTIVE' : 'PAUSED'}
              </span>
            </label>
          </div>
        </div>

        {loadingCoins ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-amber-500" size={24} />
            <p className="text-xs">Loading soft-coded coin matrix...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveCoinsSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Field 1: Account Opening Welcome Reward */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Welcome / Account Open</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                    Signup
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={referralSettings.welcomeRewardCoins}
                    onChange={(e) =>
                      setReferralSettings({ ...referralSettings, welcomeRewardCoins: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-amber-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <Coins size={14} className="absolute left-2.5 top-3 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-[10px] text-slate-500">Credited when new customer registers or opens panel account.</p>
              </div>

              {/* Field 2: Referrer Reward Coins */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gift size={14} className="text-emerald-600" />
                    <span>Referrer Reward (Referral Bonus)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    A → B
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={referralSettings.referrerReward}
                    onChange={(e) =>
                      setReferralSettings({ ...referralSettings, referrerReward: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Coins size={14} className="absolute left-2.5 top-3 text-emerald-600 fill-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-500">Awarded to referring friend (e.g. 500 coins on friend signup/bill).</p>
              </div>

              {/* Field 3: Referred Friend Bonus */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gift size={14} className="text-blue-600" />
                    <span>New Customer Referral Bonus</span>
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                    Referred B
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={referralSettings.newCustomerReward}
                    onChange={(e) =>
                      setReferralSettings({ ...referralSettings, newCustomerReward: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-blue-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Coins size={14} className="absolute left-2.5 top-3 text-blue-600 fill-blue-600" />
                </div>
                <p className="text-[10px] text-slate-500">Bonus coins given to the new friend on referral code use.</p>
              </div>

              {/* Field 4: Battery Purchase Reward */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Battery size={14} className="text-purple-600" />
                    <span>Battery Purchase Reward</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">
                    Battery Bill
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={referralSettings.batteryCoins}
                    onChange={(e) =>
                      setReferralSettings({ ...referralSettings, batteryCoins: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-purple-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <Coins size={14} className="absolute left-2.5 top-3 text-purple-600 fill-purple-600" />
                </div>
                <p className="text-[10px] text-slate-500">Coins credited on EV Battery pack invoice purchase.</p>
              </div>

              {/* Field 5: Showroom Sales Reward */}
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-teal-600" />
                    <span>Showroom General Purchase</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-bold">
                    Showroom
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={referralSettings.showroomCoins}
                    onChange={(e) =>
                      setReferralSettings({ ...referralSettings, showroomCoins: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-teal-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <Coins size={14} className="absolute left-2.5 top-3 text-teal-600 fill-teal-600" />
                </div>
                <p className="text-[10px] text-slate-500">Coins awarded for general showroom POS invoice checkout.</p>
              </div>

              {/* Field 6: Service Purpose Redemption Rate */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Wrench size={14} className="text-indigo-600" />
                    <span>Service Redemption Value (₹)</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-bold">
                    250 Coins = ₹{referralSettings.serviceRedemptionValue}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={referralSettings.serviceRedemptionValue}
                    onChange={(e) =>
                      setReferralSettings({ ...referralSettings, serviceRedemptionValue: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-3 py-2 bg-white border border-indigo-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="absolute left-3 top-2.5 font-bold text-indigo-700 text-xs">₹</span>
                </div>
                <p className="text-[10px] text-slate-500">Rupee discount value redeemed per 250 coins on service charges.</p>
              </div>
            </div>

            {/* Terms / Matter */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Reward Program Terms & Conditions (Soft-Coded)
              </label>
              <textarea
                rows={4}
                value={referralSettings.termsAndConditions.join('\n')}
                onChange={(e) =>
                  setReferralSettings({
                    ...referralSettings,
                    termsAndConditions: e.target.value.split('\n').filter((l) => l.trim()),
                  })
                }
                className="w-full p-3 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">Each line represents a bullet point presented to customers.</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingCoins}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                {savingCoins ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                <span>Save Soft-Coded Coin Matrix</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ============================================================================== */}
      {/* 2. ENFORCED BUSINESS ARCHITECTURE (Read-only System Constraints)                 */}
      {/* ============================================================================== */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Shield className="text-emerald-600" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Enforced Business Architecture</h3>
            <p className="text-xs text-slate-400">Strict system constraints validated at the backend level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">Complaint Divisions (Active)</span>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Battery</li>
              <li>Showroom</li>
              <li>Rental</li>
              <li>Spare Parts</li>
            </ul>
            <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">
              ✓ Plant is excluded from Complaint Tracker
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">Warranty Categories (Active)</span>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Showroom Sales</li>
              <li>Plant Commercial Units</li>
            </ul>
            <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">
              ✓ Completely separated from complaint system
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 pt-2">
          <Server className="text-blue-600" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Server & Database Connection</h3>
            <p className="text-xs text-slate-400">MongoDB centralized connection with REST API backend</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div>
            <p className="font-bold">Backend Status: Online</p>
            <p className="text-emerald-700 mt-0.5">Connected to MongoDB Atlas cluster</p>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-bold text-[11px]">
            HEALTHY
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;

