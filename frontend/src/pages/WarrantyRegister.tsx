import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  Lock,
  UserCheck,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { API_BASE } from '../config/api';

interface StaffData {
  _id: string;
  employeeId: string;
  name: string;
  email?: string;
  mobile?: string;
  department?: string;
  designation?: string;
  division?: string[];
  role?: string;
  warrantyAccess?: {
    enabled: boolean;
    accessType?: string;
    permissions?: {
      registration?: boolean;
      verification?: boolean;
      claim?: boolean;
      claimApproval?: boolean;
      check?: boolean;
      customerRecords?: boolean;
    };
  };
}

const WarrantyRegister = () => {
  // Staff Authorization State
  const [authEmployee, setAuthEmployee] = useState<StaffData | null>(null);
  const [authEmployeeId, setAuthEmployeeId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Warranty Form State
  const [category, setCategory] = useState<'Showroom' | 'Plant'>('Showroom');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [product, setProduct] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [durationMonths, setDurationMonths] = useState('24');

  const [submitting, setSubmitting] = useState(false);
  const [registeredNumber, setRegisteredNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check existing session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ebs_warranty_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.employeeId) {
          setAuthEmployee(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached staff session:', e);
    }
  }, []);

  const handleStaffVerification = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmployeeId.trim() || !authPassword) {
      setAuthError('Please enter both Employee ID and Password.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/warranty/public/verify-staff`, {
        employeeId: authEmployeeId.trim(),
        password: authPassword,
      });

      if (res.data.success && res.data.authorized && res.data.data) {
        const staff: StaffData = res.data.data;
        setAuthEmployee(staff);
        sessionStorage.setItem('ebs_warranty_staff', JSON.stringify(staff));
        setAuthError('');
        setAuthPassword('');
      } else {
        setAuthError(res.data.message || 'Staff verification failed.');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Authentication failed. Please verify your Employee ID, password, and Admin Warranty privileges.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStaffLogout = () => {
    setAuthEmployee(null);
    sessionStorage.removeItem('ebs_warranty_staff');
    setAuthEmployeeId('');
    setAuthPassword('');
    setAuthError('');
  };

  const handleWarrantySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRegisteredNumber(null);

    if (!authEmployee) {
      setErrorMessage('Staff authorization required to complete registration.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/warranty/public/register`, {
        category,
        customerName,
        customerMobile,
        customerEmail,
        product,
        serialNumber,
        billNumber,
        purchaseDate,
        durationMonths,
        registeredBy: {
          employeeId: authEmployee.employeeId,
          name: authEmployee.name,
          role: authEmployee.role || authEmployee.designation,
        },
      });

      if (res.data.success) {
        setRegisteredNumber(res.data.data.warrantyNumber);
        // Reset inputs
        setCustomerName('');
        setCustomerMobile('');
        setCustomerEmail('');
        setProduct('');
        setSerialNumber('');
        setBillNumber('');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to register warranty.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="text-emerald-600" size={32} />
            <span>Product Warranty Registration</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Official warranty registration gateway for vehicles, lithium batteries & industrial plant units
          </p>
        </div>
        <a
          href="/warranty/check"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition shadow-2xs self-start sm:self-auto"
        >
          <Search size={14} />
          <span>Public Warranty Checker</span>
          <ExternalLink size={12} className="text-emerald-500" />
        </a>
      </div>

      {/* STEP 1: IF NOT AUTHORIZED, SHOW EMPLOYEE VERIFICATION GATE */}
      {!authEmployee ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Gate Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold">Authorized Staff & Engineer Verification</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Enter your Employee ID and password to access the official warranty registration desk.
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                PORTAL GATEWAY
              </span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-medium animate-in fade-in">
                <ShieldAlert size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-rose-900">Authentication / Authorization Error</p>
                  <p>{authError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleStaffVerification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-emerald-600" />
                  <span>Employee ID / Staff Code</span>
                </label>
                <input
                  type="text"
                  required
                  value={authEmployeeId}
                  onChange={(e) => setAuthEmployeeId(e.target.value)}
                  placeholder="e.g. TEST-EMP-001 or EMP-001"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Key size={14} className="text-emerald-600" />
                  <span>Account Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter your employee account password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Admin Access Tier Controlled</span>
                </div>
                <p>
                  Warranty registration privileges are assigned in the Admin Portal under <b>Staff & Employees &gt; Warranty Access Tier</b> (e.g. <i>Warranty Registrar</i>, <i>Manager</i>, or <i>Full Access</i>).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs tracking-wider transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying Staff Privileges...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Verify Credentials & Open Warranty Desk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* STEP 2: AUTHORIZED STAFF DESK & WARRANTY REGISTRATION FORM */
        <div className="space-y-6">
          {/* Active Authorized Staff Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {authEmployee.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-950 text-sm">{authEmployee.name}</span>
                  <span className="bg-emerald-200 text-emerald-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                    {authEmployee.employeeId}
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ {authEmployee.warrantyAccess?.accessType || 'Registrar'} Authorized
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  {authEmployee.department || 'Technical'} • {authEmployee.designation || 'Service Engineer'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStaffLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Sign out of current staff session"
            >
              <LogOut size={13} />
              <span>Switch Staff / Lock</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            {/* Category Tabs: Showroom or Plant */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setCategory('Showroom')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  category === 'Showroom'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Showroom / Retail Customer
              </button>
              <button
                type="button"
                onClick={() => setCategory('Plant')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  category === 'Plant'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Plant / Industrial Sales
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold mb-6">
                <AlertCircle size={18} className="shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {registeredNumber ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Warranty Successfully Registered!</h3>
                <p className="text-xs text-slate-500">
                  Registered by authorized staff <b>{authEmployee.name}</b> ({authEmployee.employeeId}).
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Warranty Number</span>
                  <span className="font-mono text-2xl font-black text-emerald-700 tracking-wider">
                    {registeredNumber}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href="/warranty/check"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20"
                  >
                    <Search size={14} />
                    <span>Verify in Status Checker</span>
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => setRegisteredNumber(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-950 transition cursor-pointer"
                  >
                    Register Another Product
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWarrantySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Customer / Entity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Saji Khan"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      placeholder="9549730483"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Product / Model Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="e.g. EkoRide Pro / 60V 30Ah Lithium Pack"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Serial Number / VIN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="e.g. SN-89481903"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bill / Invoice No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      placeholder="INV-2026-001"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Purchase Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Warranty Period
                    </label>
                    <select
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="12">12 Months (1 Year)</option>
                      <option value="18">18 Months (1.5 Years)</option>
                      <option value="24">24 Months (2 Years)</option>
                      <option value="36">36 Months (3 Years)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={18} />
                    )}
                    <span>CONFIRM & REGISTER WARRANTY</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyRegister;
