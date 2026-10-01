import { useState, useEffect } from 'react';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Coins,
  Receipt,
  Sparkles,
  RefreshCw,
  Gift,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function CustomerLoginModal({
  isOpen,
  onClose,
  title = 'Welcome to Ekosmart',
  message = 'Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards.',
}: CustomerLoginModalProps) {
  const { sendLoginOtp, verifyLoginOtp, isAuthenticated } = useCustomerAuth();

  const [step, setStep] = useState<1 | 2>(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Reset modal state when closed or opened
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setEmail('');
        setOtp('');
        setError('');
        setSuccessMsg('');
        setDebugOtp(null);
        setVerifiedSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  // If already authenticated while modal is open, auto close
  useEffect(() => {
    if (isAuthenticated && isOpen && !verifiedSuccess) {
      onClose();
    }
  }, [isAuthenticated, isOpen, verifiedSuccess, onClose]);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Email Address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendLoginOtp(cleanEmail);
      if (res.success) {
        setSuccessMsg(res.message || 'OTP sent successfully!');
        setDebugOtp(res.debugOtp || (res as any).otp || '123456');
        setResendCooldown(30);
        setStep(2);
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyLoginOtp(email.trim().toLowerCase(), cleanOtp);
      if (res.success) {
        setVerifiedSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(res.message || 'Invalid OTP code. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await sendLoginOtp(email.trim().toLowerCase());
      if (res.success) {
        setSuccessMsg('A new OTP has been sent to your email.');
        setDebugOtp(res.debugOtp || (res as any).otp || '123456');
        setResendCooldown(30);
      } else {
        setError(res.message || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-emerald-400" />
            <span>Ekosmart Customer Portal</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{message}</p>

          {/* Quick Perks Pill Row */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <Coins size={14} className="text-amber-400 shrink-0" />
              <span>Coins on Showroom Purchases</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <Receipt size={14} className="text-emerald-400 shrink-0" />
              <span>Showroom Bills Linked</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>3-Year Battery Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <Gift size={14} className="text-amber-400 shrink-0" />
              <span>Friend Referral Rewards</span>
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8">
          {verifiedSuccess ? (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Welcome to Ekosmart!</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                You are now successfully logged in. Your showroom bills and warranty certificates are synchronized.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold">
                <Coins size={16} className="text-amber-500" />
                <span>Earn Coins on Every Showroom Purchase</span>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {step === 2 && (
                <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2 animate-in fade-in shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-950">Instant Verification Code (On-Screen OTP)</p>
                      <p className="text-[11px] text-emerald-800">
                        {successMsg || `Instant code generated for ${email}:`}
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

              {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="e.g. rahul.sharma@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Instant 6-digit code will appear on-screen. Coins are awarded on showroom purchases.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={17} />
                        <span>Sending OTP Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with Email OTP</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail size={15} className="text-emerald-600" />
                      <span className="font-semibold text-slate-900">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-emerald-700 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={17} />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={17} />
                        <span>Verify & Access Account</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Didn't receive code?</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleResendOtp}
                      className="font-bold text-emerald-700 hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}

              {/* Dismiss / Browse as guest button */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Continue browsing without login →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
