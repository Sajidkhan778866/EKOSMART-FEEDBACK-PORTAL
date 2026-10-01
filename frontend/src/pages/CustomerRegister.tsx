import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  User,
  Mail,
  Phone,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Coins,
  Copy,
  Share2,
  Sparkles,
} from 'lucide-react';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendRegisterOtp, verifyRegisterOtp } = useCustomerAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info Form, 2: OTP Entry, 3: Success Screen
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    referralCode: '',
    address: '',
    city: 'Kota',
    state: 'Rajasthan',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [newCustomerInfo, setNewCustomerInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Auto-detect referral code from URL params (?ref=..., ?referral=..., ?code=...)
  useEffect(() => {
    const refParam = searchParams.get('ref') || searchParams.get('referral') || searchParams.get('code');
    if (refParam && refParam.trim()) {
      setFormData((prev) => ({
        ...prev,
        referralCode: refParam.trim().toUpperCase(),
      }));
    }
  }, [searchParams]);

  // Step 1: Send Registration OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setError('Please fill in your Full Name, Email Address, and Mobile Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendRegisterOtp({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        referralCode: formData.referralCode.trim().toUpperCase() || undefined,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setDebugOtp(res.debugOtp || (res as any).otp || '123456');
        setStep(2);
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request OTP. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Create Account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.trim().length < 4) {
      setError('Please enter the verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyRegisterOtp({
        email: formData.email.trim().toLowerCase(),
        otp: otp.trim(),
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        referralCode: formData.referralCode.trim().toUpperCase() || undefined,
        address: formData.address,
        city: formData.city,
        state: formData.state,
      });

      if (res.success) {
        setNewCustomerInfo(res.data);
        setStep(3);
      } else {
        setError(res.message || 'Verification failed. Invalid OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (newCustomerInfo?.referralCode) {
      navigator.clipboard.writeText(newCustomerInfo.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = () => {
    if (newCustomerInfo?.referralCode) {
      const shareText = `Use my Ekosmart referral code ${newCustomerInfo.referralCode} to get 500 bonus coins on signup! Visit: ${window.location.origin}/customer/register?ref=${newCustomerInfo.referralCode}`;
      if (navigator.share) {
        navigator.share({
          title: 'Join Ekosmart EV & Batteries',
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
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Header Card */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-inner">
          <Gift size={28} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Customer Account</h1>
        <p className="text-sm text-slate-600 mt-1">
          Join Ekosmart to earn wallet coins, track orders, warranty & referrals.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && step === 2 && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {/* STEP 1: Registration Form */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (For OTP Verification) *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
                <input
                  type="email"
                  required
                  placeholder="rajesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Referral Code (Optional)
                </label>
                {formData.referralCode && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> Referral Code Linked
                  </span>
                )}
              </div>
              <div className="relative">
                <Gift className="absolute left-3.5 top-3.5 text-amber-500" size={17} />
                <input
                  type="text"
                  placeholder="e.g. EKO7X92P (Enter referral code)"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-2xl text-sm uppercase tracking-wider font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {formData.referralCode
                  ? 'Referral code linked! Purchase coins & rewards activate on your showroom purchase.'
                  : 'Have a friend\'s referral code? Enter it to link friend rewards on purchase.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={17} />
                    <span>Generating OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Generate OTP & Proceed</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/customer/login" className="text-emerald-700 font-bold hover:underline">
              Customer Login
            </Link>
          </div>
        </div>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="text-center mb-5">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-2">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Verify Email Address</h2>
            <p className="text-xs text-slate-600 mt-1">
              We sent a 6-digit code to <strong className="text-slate-800">{formData.email}</strong>
            </p>
          </div>

          <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2 shadow-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-950">Instant Verification Code (On-Screen OTP)</p>
                <p className="text-[11px] text-emerald-800">
                  {successMsg || `Instant code generated for ${formData.email}:`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-200">
              <span className="text-xs text-emerald-950 font-bold">
                Your Code: <strong className="font-mono text-emerald-900 text-base tracking-widest bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 shadow-inner">{debugOtp || '123456'}</strong>
              </span>
              <button
                type="button"
                onClick={() => setOtp(debugOtp || '123456')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>Auto-fill Code</span>
                <span>⚡</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.6em] text-2xl font-mono py-3.5 bg-slate-50 border-2 border-emerald-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={17} />
                  <span>Verifying & Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Verify OTP & Create Account</span>
                  <CheckCircle2 size={17} />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 transition"
              >
                ← Edit details
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Resend OTP</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Welcome & Success Screen */}
      {step === 3 && newCustomerInfo && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200 text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-500 text-white shadow-lg animate-bounce">
            <Sparkles size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Welcome to Ekosmart!</h2>
            <p className="text-sm text-slate-600 mt-1">
              Your account for <strong className="text-slate-800">{newCustomerInfo.name}</strong> is verified and active.
            </p>
          </div>

          {/* Coins Welcome Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xs">
                <Coins size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">Showroom Purchase Rewards</p>
                <p className="text-sm font-bold text-emerald-800">
                  Coins will be credited automatically whenever you purchase at our showroom counter!
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-600/20 text-emerald-900 font-bold px-3 py-1 rounded-full shrink-0">Connected</span>
          </div>

          {/* Generated Referral Code Card */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Your Unique Referral Code</p>
            <div className="text-2xl font-mono font-black text-white tracking-widest bg-slate-800 py-3 px-4 rounded-2xl border border-slate-700">
              {newCustomerInfo.referralCode}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} />
                <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 size={14} />
                <span>Share Code</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Share your code with friends. You will earn reward coins when friends make qualifying showroom purchases!
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/dashboard')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to Customer Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
