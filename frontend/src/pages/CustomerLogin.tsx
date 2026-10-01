import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  LogIn,
  KeyRound,
} from 'lucide-react';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const { sendLoginOtp, verifyLoginOtp } = useCustomerAuth();

  const [step, setStep] = useState<1 | 2>(1); // 1: Enter Email, 2: Enter OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Step 1: Send Login OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your registered Email Address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendLoginOtp(email.trim().toLowerCase());
      if (res.success) {
        setSuccessMsg(res.message);
        setDebugOtp(res.debugOtp || (res as any).otp || '123456');
        setStep(2);
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Customer account not found. Please register to create an account.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Login OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyLoginOtp(email.trim().toLowerCase(), otp.trim());
      if (res.success) {
        navigate('/customer/dashboard');
      } else {
        setError(res.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-inner">
          <LogIn size={26} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Portal Login</h1>
        <p className="text-xs text-slate-600 mt-1">
          Access your wallet coins, referral rewards, purchases & warranties via Email OTP.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
          <div>
            <span>{error}</span>
            {error.includes('register') && (
              <div className="mt-2">
                <Link
                  to="/customer/register"
                  className="inline-block px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px] hover:bg-red-700 transition"
                >
                  Create New Account →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2 shadow-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold text-emerald-950">Instant Verification Code (On-Screen OTP)</p>
              <p className="text-[11px] text-emerald-800">
                {successMsg || 'Use the instant 6-digit verification code below to login:'}
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
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={17} />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Login OTP</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex p-2.5 rounded-full bg-emerald-50 text-emerald-600 mb-1">
                <KeyRound size={22} />
              </div>
              <p className="text-xs text-slate-600">
                Enter code sent to <strong className="text-slate-800">{email}</strong>
              </p>
            </div>

            <div>
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
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Access Dashboard</span>
                  <ShieldCheck size={17} />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 transition"
              >
                ← Change email
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
        )}

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
          Don't have an account yet?{' '}
          <Link to="/customer/register" className="text-emerald-700 font-bold hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
