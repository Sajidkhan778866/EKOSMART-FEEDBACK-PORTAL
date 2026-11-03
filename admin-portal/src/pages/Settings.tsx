import { useState, useEffect } from 'react';
import {
  Shield,
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
  Clock,
  Mail,
  KeyRound,
  Database,
  Eye,
  EyeOff,
  RefreshCw,
  PlugZap,
  HardDrive,
  Lock,
} from 'lucide-react';
import { customerApi, contentApi, databaseApi, smtpApi } from '../api/client';

const Settings = () => {
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [savingCoins, setSavingCoins] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState(true);
  const [savingTimer, setSavingTimer] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Database Setup Form & Status State
  const [loadingDb, setLoadingDb] = useState(true);
  const [testingDb, setTestingDb] = useState(false);
  const [savingDb, setSavingDb] = useState(false);
  const [reconnectingDb, setReconnectingDb] = useState(false);
  const [showDbPassword, setShowDbPassword] = useState(false);
  const [dbFeedback, setDbFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const [dbStatus, setDbStatus] = useState<{
    state: string;
    readyState: number;
    host: string;
    port: number | string;
    databaseName: string;
    isCloud: boolean;
    lastError: string | null;
  }>({
    state: 'unknown',
    readyState: 0,
    host: 'unknown',
    port: 27017,
    databaseName: 'ekosmart',
    isCloud: false,
    lastError: null,
  });

  const [dbCollections, setDbCollections] = useState({
    bills: 0,
    stock: 0,
    complaints: 0,
    warranties: 0,
    customers: 0,
    employees: 0,
    admins: 0,
  });

  const [dbForm, setDbForm] = useState({
    dbType: 'mongodb+srv',
    host: '',
    port: '27017',
    dbName: 'ekosmart',
    username: '',
    password: '',
    securityMode: 'tls-srv',
    authSource: 'admin',
    hasStoredPassword: false,
    isConfigured: false,
  });

  // SMTP & OTP Email Server State
  const [loadingSmtp, setLoadingSmtp] = useState(true);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [testRecipientEmail, setTestRecipientEmail] = useState('');
  const [smtpFeedback, setSmtpFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [smtpForm, setSmtpForm] = useState({
    host: 'server62.hostingraja.org',
    port: 465,
    secure: true,
    user: 'support_otp_email@ekosmartdrivecomplain.in',
    pass: '',
    from: '"Ekosmart Verification" <support_otp_email@ekosmartdrivecomplain.in>',
    rejectUnauthorized: false,
    hasPassword: false,
    isConfigured: false,
    source: 'default',
  });

  const [loginTimer, setLoginTimer] = useState({
    enabled: true,
    durationSeconds: 20,
    title: 'Welcome to Ekosmart',
    message: 'Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards.',
  });

  const [referralSettings, setReferralSettings] = useState({
    enabled: true,
    welcomeRewardCoins: 0,
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
      '1. Customer registration starts with 0 coins. Reward coins are awarded strictly on showroom purchases.',
      '2. Every qualifying showroom & EV battery product purchase awards reward coins directly to the customer digital wallet.',
      '3. The referring customer receives referral coins once their referred friend completes verification or first purchase.',
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
    fetchDatabaseStatus();
    fetchSmtpSettings();
  }, []);

  const fetchSmtpSettings = async () => {
    try {
      setLoadingSmtp(true);
      const res = await smtpApi.getSettings();
      if (res.data?.success && res.data.data) {
        const cfg = res.data.data;
        setSmtpForm((prev) => ({
          ...prev,
          host: cfg.host || 'server62.hostingraja.org',
          port: Number(cfg.port) || 465,
          secure: cfg.secure !== undefined ? Boolean(cfg.secure) : Number(cfg.port) === 465,
          user: cfg.user || 'support_otp_email@ekosmartdrivecomplain.in',
          pass: '',
          from: cfg.from || `"Ekosmart Verification" <${cfg.user || 'support_otp_email@ekosmartdrivecomplain.in'}>`,
          rejectUnauthorized: Boolean(cfg.rejectUnauthorized),
          hasPassword: Boolean(cfg.hasPassword),
          isConfigured: Boolean(cfg.isConfigured),
          source: cfg.source || 'default',
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch SMTP settings:', err);
    } finally {
      setLoadingSmtp(false);
    }
  };

  const handleTestSmtpConnection = async (sendTestOtp = false) => {
    setSmtpFeedback(null);
    if (!smtpForm.host.trim() || !smtpForm.user.trim()) {
      setSmtpFeedback({ type: 'error', message: 'SMTP Host and SMTP Mailbox Username are required.' });
      return;
    }
    if (sendTestOtp && (!testRecipientEmail.trim() || !testRecipientEmail.includes('@'))) {
      setSmtpFeedback({ type: 'error', message: 'Please enter a valid recipient email address to send a test OTP.' });
      return;
    }

    try {
      setTestingSmtp(true);
      const res = await smtpApi.testConnection({
        host: smtpForm.host.trim(),
        port: Number(smtpForm.port) || 465,
        secure: smtpForm.secure,
        user: smtpForm.user.trim(),
        pass: smtpForm.pass,
        useStoredPassword: !smtpForm.pass && smtpForm.hasPassword,
        from: smtpForm.from.trim(),
        rejectUnauthorized: smtpForm.rejectUnauthorized,
        email: sendTestOtp ? testRecipientEmail.trim() : undefined,
      });

      if (res.data?.success) {
        setSmtpFeedback({
          type: 'success',
          message: res.data.message || 'SMTP connection verified successfully!',
        });
      } else {
        setSmtpFeedback({
          type: 'error',
          message: res.data?.message || 'SMTP connection verification failed.',
        });
      }
    } catch (err: any) {
      setSmtpFeedback({
        type: 'error',
        message: err.response?.data?.message || 'SMTP verification failed. Please check host, port, username, and password.',
      });
    } finally {
      setTestingSmtp(false);
    }
  };

  const handleSaveSmtpSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpFeedback(null);
    if (!smtpForm.host.trim() || !smtpForm.user.trim()) {
      setSmtpFeedback({ type: 'error', message: 'SMTP Host and SMTP Mailbox Username are required.' });
      return;
    }

    try {
      setSavingSmtp(true);
      const res = await smtpApi.saveSettings({
        host: smtpForm.host.trim(),
        port: Number(smtpForm.port) || 465,
        secure: smtpForm.secure,
        user: smtpForm.user.trim(),
        pass: smtpForm.pass,
        useStoredPassword: !smtpForm.pass && smtpForm.hasPassword,
        from: smtpForm.from.trim(),
        rejectUnauthorized: smtpForm.rejectUnauthorized,
      });

      if (res.data?.success) {
        setSmtpForm((prev) => ({
          ...prev,
          pass: '',
          hasPassword: Boolean(res.data.data?.hasPassword),
          isConfigured: Boolean(res.data.data?.isConfigured),
          source: 'database',
        }));
        setShowSmtpPassword(false);
        setSmtpFeedback({
          type: res.data.verified ? 'success' : 'info',
          message: res.data.message || 'SMTP configuration saved!',
        });
        showAlert('success', 'SMTP configuration saved!');
      } else {
        setSmtpFeedback({
          type: 'error',
          message: res.data?.message || 'Failed to save SMTP configuration.',
        });
      }
    } catch (err: any) {
      setSmtpFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save SMTP configuration.',
      });
    } finally {
      setSavingSmtp(false);
    }
  };

  const fetchDatabaseStatus = async () => {
    try {
      setLoadingDb(true);
      const res = await databaseApi.getStatus();
      if (res.data?.success && res.data.data) {
        const { connection, configuration, collections } = res.data.data;
        if (connection) {
          setDbStatus(connection);
        }
        if (collections) {
          setDbCollections(collections);
        }
        if (configuration) {
          setDbForm((prev) => ({
            ...prev,
            dbType: configuration.dbType || 'mongodb+srv',
            host: configuration.host || '',
            port: configuration.port || '27017',
            dbName: configuration.dbName || 'ekosmart',
            username: configuration.username || '',
            password: '', // Never populate or store the password in frontend state
            securityMode: configuration.securityMode || (configuration.dbType === 'mongodb+srv' ? 'tls-srv' : 'standard'),
            authSource: configuration.authSource || 'admin',
            hasStoredPassword: Boolean(configuration.hasPassword),
            isConfigured: Boolean(configuration.isConfigured),
          }));
        }
      }
    } catch (err: any) {
      console.warn('Failed to fetch database status:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  const validateDbForm = (): string | null => {
    if (dbForm.dbType === 'mysql-notice') {
      return 'This platform uses MongoDB / Mongoose schemas. MySQL/MariaDB credentials cannot connect to the MongoDB driver. Please select MongoDB Atlas (SRV) or Standard MongoDB Host.';
    }
    if (!dbForm.host.trim()) {
      return 'Database Host is required.';
    }
    if (!dbForm.dbName.trim()) {
      return 'Database Name is required.';
    }
    if (dbForm.dbType === 'mongodb' && (!dbForm.port.trim() || isNaN(Number(dbForm.port)))) {
      return 'Valid numeric Database Port (e.g. 27017) is required for standard MongoDB connections.';
    }
    if (dbForm.dbType === 'mongodb+srv' && !dbForm.username.trim()) {
      return 'Database Username is required for MongoDB Atlas (SRV) connections.';
    }
    if (dbForm.dbType === 'mongodb+srv' && !dbForm.password.trim() && !dbForm.hasStoredPassword) {
      return 'Database Password is required.';
    }
    return null;
  };

  const handleTestDbConnection = async () => {
    setDbFeedback(null);
    const validationErr = validateDbForm();
    if (validationErr) {
      setDbFeedback({ type: 'error', message: validationErr });
      return;
    }

    try {
      setTestingDb(true);
      const res = await databaseApi.testConnection({
        dbType: dbForm.dbType,
        host: dbForm.host.trim(),
        port: dbForm.port.trim(),
        dbName: dbForm.dbName.trim(),
        username: dbForm.username.trim(),
        password: dbForm.password,
        securityMode: dbForm.securityMode,
        authSource: dbForm.authSource,
        useStoredPassword: !dbForm.password && dbForm.hasStoredPassword,
      });

      if (res.data?.success) {
        setDbFeedback({
          type: 'success',
          message: res.data.message || 'Database connection verified successfully!',
        });
      } else {
        setDbFeedback({
          type: 'error',
          message: res.data?.message || 'Database connection test failed.',
        });
      }
    } catch (err: any) {
      setDbFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Connection test failed. Please verify host, credentials, and network access.',
      });
    } finally {
      setTestingDb(false);
    }
  };

  const handleSaveDbConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbFeedback(null);
    const validationErr = validateDbForm();
    if (validationErr) {
      setDbFeedback({ type: 'error', message: validationErr });
      return;
    }

    try {
      setSavingDb(true);
      const res = await databaseApi.saveConfiguration({
        dbType: dbForm.dbType,
        host: dbForm.host.trim(),
        port: dbForm.port.trim(),
        dbName: dbForm.dbName.trim(),
        username: dbForm.username.trim(),
        password: dbForm.password,
        securityMode: dbForm.securityMode,
        authSource: dbForm.authSource,
        useStoredPassword: !dbForm.password && dbForm.hasStoredPassword,
      });

      if (res.data?.success) {
        setDbForm((prev) => ({ ...prev, password: '', hasStoredPassword: true, isConfigured: true }));
        setShowDbPassword(false);
        setDbFeedback({
          type: 'success',
          message: res.data.message || 'Database configuration saved and connected!',
        });
        showAlert('success', 'Database configuration updated and connected!');
        await fetchDatabaseStatus();
      } else {
        setDbFeedback({
          type: 'error',
          message: res.data?.message || 'Failed to save database configuration.',
        });
      }
    } catch (err: any) {
      setDbFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save database configuration.',
      });
    } finally {
      setSavingDb(false);
    }
  };

  const handleReconnectDatabase = async () => {
    setDbFeedback(null);
    try {
      setReconnectingDb(true);
      const res = await databaseApi.reconnect();
      if (res.data?.success) {
        setDbFeedback({
          type: 'success',
          message: res.data.message || 'Database reconnected and verified!',
        });
        await fetchDatabaseStatus();
      } else {
        setDbFeedback({
          type: 'error',
          message: res.data?.message || 'Database reconnection failed.',
        });
      }
    } catch (err: any) {
      setDbFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Database reconnection failed.',
      });
    } finally {
      setReconnectingDb(false);
    }
  };

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

    try {
      setLoadingTimer(true);
      const res = await contentApi.getAdmin();
      if (res.data?.success && res.data.data?.customerLoginTimer) {
        setLoginTimer((prev) => ({
          ...prev,
          ...res.data.data.customerLoginTimer,
        }));
      }
    } catch (err: any) {
      console.warn('Failed to load customer login timer settings:', err);
    } finally {
      setLoadingTimer(false);
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

  const handleSaveTimerSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingTimer(true);
      const res = await contentApi.updateAdmin({ customerLoginTimer: loginTimer });
      if (res.data?.success) {
        showAlert('success', 'Customer Login Prompt & Timer settings updated successfully!');
      } else {
        showAlert('error', res.data?.message || 'Failed to update login timer settings');
      }
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to update customer login timer settings');
    } finally {
      setSavingTimer(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-800">System Configuration</h1>
        <p className="text-slate-500 text-xs">
          Manage business architecture, SMTP OTP email server, and persistent database settings.
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
      {/* 1. SOFT-CODED CUSTOMER WALLET & REWARD COINS MATRIX (Hidden)                   */}
      {/* ============================================================================== */}
      {false && (
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
              {/* Field 1: Account Opening / Registration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-slate-500" />
                    <span>Registration Bonus Coins</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full font-bold">
                    Signup = 0 Coins
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
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Coins size={14} className="absolute left-2.5 top-3 text-slate-400 fill-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500">
                  Set to 0. Coins are strictly awarded on showroom purchasing (invoicing).
                </p>
              </div>

              {/* Field 2: Referrer Reward Coins */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gift size={14} className="text-emerald-600" />
                    <span>Referrer Purchase Bonus</span>
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
                <p className="text-[10px] text-slate-500">Awarded to referring customer when friend makes first showroom purchase.</p>
              </div>

              {/* Field 3: Referred Friend Bonus */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gift size={14} className="text-blue-600" />
                    <span>Referred Friend Purchase Bonus</span>
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
                <p className="text-[10px] text-slate-500">Bonus coins awarded to new friend upon making their qualifying showroom purchase.</p>
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
                <p className="text-[10px] text-slate-500">Coins credited on EV Battery pack invoice checkout.</p>
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
      )}

      {/* ============================================================================== */}
      {/* 2. SOFT-CODED CUSTOMER LOGIN PROMPT & TIMER (Requested)                        */}
      {/* ============================================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Clock size={24} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-base">
                  Customer Login Prompt & Timer Configuration (Soft-Coded)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ⏱️ {loginTimer.durationSeconds}s Timer
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure the timed login prompt that gently invites public frontend visitors to login or link their showroom purchases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <label className="text-xs font-bold text-slate-700 px-3 flex items-center gap-2 cursor-pointer">
              <span>Login Prompt:</span>
              <input
                type="checkbox"
                checked={loginTimer.enabled}
                onChange={(e) => setLoginTimer({ ...loginTimer, enabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
              <span className={`text-[11px] font-black ${loginTimer.enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                {loginTimer.enabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </label>
          </div>
        </div>

        {loadingTimer ? (
          <div className="py-10 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-emerald-600" size={24} />
            <p className="text-xs">Loading login prompt configuration...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveTimerSettings} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Delay Duration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Popup Delay Duration (Seconds)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="3"
                    max="300"
                    required
                    value={loginTimer.durationSeconds}
                    onChange={(e) =>
                      setLoginTimer({ ...loginTimer, durationSeconds: Math.max(3, Number(e.target.value) || 20) })
                    }
                    className="w-28 p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-center text-base text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 20, 30, 60, 120].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setLoginTimer({ ...loginTimer, durationSeconds: sec })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          loginTimer.durationSeconds === sec
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Visitors browse freely for this duration before the login prompt is presented.
                </p>
              </div>

              {/* Prompt Title */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Prompt Modal Title
                </label>
                <input
                  type="text"
                  required
                  value={loginTimer.title}
                  onChange={(e) => setLoginTimer({ ...loginTimer, title: e.target.value })}
                  placeholder="e.g. Welcome to Ekosmart"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">Main headline displayed at the top of the popup modal.</p>
              </div>
            </div>

            {/* Prompt Message / Subtitle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Prompt Subtitle / Description Text
              </label>
              <textarea
                rows={2}
                value={loginTimer.message}
                onChange={(e) => setLoginTimer({ ...loginTimer, message: e.target.value })}
                placeholder="e.g. Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">Appears under the title on the timed customer login popup.</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingTimer}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                {savingTimer ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                <span>Save Login Prompt Configuration</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ============================================================================== */}
      {/* 3. SMTP & OTP EMAIL SERVER CONFIGURATION (VERCEL & CPANEL READY)               */}
      {/* ============================================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <KeyRound size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                SMTP & Automatic OTP Email Server (Vercel & cPanel Ready)
              </h3>
              <p className="text-xs text-slate-400">
                Configure outgoing SMTP credentials for Customer Login OTP, Registration OTP, Complaint OTP & Soft-Copy GST Invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-black text-[11px] uppercase flex items-center gap-1.5 ${
                smtpForm.isConfigured
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  smtpForm.isConfigured ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              {smtpForm.isConfigured ? 'SMTP CONFIGURED' : 'PASSWORD REQUIRED'}
            </span>
            <button
              type="button"
              onClick={fetchSmtpSettings}
              disabled={loadingSmtp}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="Refresh SMTP Status"
            >
              <RefreshCw size={15} className={loadingSmtp ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Quick Provider Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500">Quick Presets:</span>
          <button
            type="button"
            onClick={() =>
              setSmtpForm((prev) => ({
                ...prev,
                host: 'server62.hostingraja.org',
                port: 465,
                secure: true,
                user: 'support_otp_email@ekosmartdrivecomplain.in',
                from: '"Ekosmart Verification" <support_otp_email@ekosmartdrivecomplain.in>',
                rejectUnauthorized: false,
              }))
            }
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold text-[11px] transition cursor-pointer"
          >
            HostingRaja cPanel SSL (server62.hostingraja.org:465)
          </button>
          <button
            type="button"
            onClick={() =>
              setSmtpForm((prev) => ({
                ...prev,
                host: 'mail.ekosmartdrive.in',
                port: 465,
                secure: true,
                user: 'support_otp_email@ekosmartdrivecomplain.in',
                from: '"Ekosmart Verification" <support_otp_email@ekosmartdrivecomplain.in>',
                rejectUnauthorized: false,
              }))
            }
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold text-[11px] transition cursor-pointer"
          >
            Custom Domain Mail (mail.ekosmartdrive.in:465)
          </button>
          <button
            type="button"
            onClick={() =>
              setSmtpForm((prev) => ({
                ...prev,
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                user: 'Smartdrive5640@gmail.com',
                from: '"Ekosmart Verification" <Smartdrive5640@gmail.com>',
                rejectUnauthorized: true,
              }))
            }
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold text-[11px] transition cursor-pointer"
          >
            Gmail SMTP (Smartdrive5640@gmail.com:465)
          </button>
        </div>

        {smtpFeedback && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-start gap-2.5 ${
              smtpFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : smtpFeedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {smtpFeedback.type === 'success' ? (
              <CheckCircle2 size={17} className="flex-shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle size={17} className="flex-shrink-0 mt-0.5 text-red-600" />
            )}
            <span className="leading-relaxed">{smtpFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSaveSmtpSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Outgoing SMTP Host <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={smtpForm.host}
                onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                placeholder="server62.hostingraja.org"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                SMTP Port & Encryption <span className="text-red-500">*</span>
              </label>
              <select
                value={`${smtpForm.port}-${smtpForm.secure ? 'ssl' : 'tls'}`}
                onChange={(e) => {
                  const [portStr, mode] = e.target.value.split('-');
                  setSmtpForm({
                    ...smtpForm,
                    port: Number(portStr),
                    secure: mode === 'ssl',
                  });
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="465-ssl">Port 465 — Implicit SSL / TLS (Recommended)</option>
                <option value="587-tls">Port 587 — STARTTLS</option>
                <option value="25-tls">Port 25 — Standard Relay</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                TLS Certificate Validation
              </label>
              <select
                value={smtpForm.rejectUnauthorized ? 'strict' : 'relaxed'}
                onChange={(e) => setSmtpForm({ ...smtpForm, rejectUnauthorized: e.target.value === 'strict' })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="relaxed">Relaxed (Recommended for cPanel Shared SSL)</option>
                <option value="strict">Strict CA Verification (Gmail / SES / Brevo)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                SMTP Mailbox Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={smtpForm.user}
                onChange={(e) =>
                  setSmtpForm({
                    ...smtpForm,
                    user: e.target.value,
                    from: `"Ekosmart Verification" <${e.target.value}>`,
                  })
                }
                placeholder="support_otp_email@ekosmartdrivecomplain.in"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>SMTP Mailbox Password</span>
                {smtpForm.hasPassword && !smtpForm.pass && (
                  <span className="text-[10px] text-emerald-700 font-semibold">Stored on server</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showSmtpPassword ? 'text' : 'password'}
                  value={smtpForm.pass}
                  onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                  placeholder={
                    smtpForm.hasPassword
                      ? '•••••••••••• (Leave blank to keep stored password)'
                      : 'Enter mailbox / app password'
                  }
                  autoComplete="new-password"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSmtpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Sender Display Name & Email (From)
              </label>
              <input
                type="text"
                value={smtpForm.from}
                onChange={(e) => setSmtpForm({ ...smtpForm, from: e.target.value })}
                placeholder='"Ekosmart Verification" <support_otp_email@ekosmartdrivecomplain.in>'
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Live Test OTP Dispatch Bar */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              <Mail size={16} className="text-blue-600 flex-shrink-0" />
              <input
                type="email"
                value={testRecipientEmail}
                onChange={(e) => setTestRecipientEmail(e.target.value)}
                placeholder="Enter recipient email (e.g. Smartdrive5640@gmail.com) to send a live test OTP..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleTestSmtpConnection(false)}
                disabled={testingSmtp || savingSmtp}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {testingSmtp ? <Loader2 size={14} className="animate-spin text-blue-600" /> : <PlugZap size={14} className="text-blue-600" />}
                <span>Verify SMTP</span>
              </button>
              <button
                type="button"
                onClick={() => handleTestSmtpConnection(true)}
                disabled={testingSmtp || savingSmtp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {testingSmtp ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                <span>Send Test OTP</span>
              </button>
              <button
                type="submit"
                disabled={savingSmtp || testingSmtp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {savingSmtp ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save SMTP Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ============================================================================== */}
      {/* 4. ENFORCED BUSINESS ARCHITECTURE (Read-only System Constraints)                 */}
      {/* ============================================================================== */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Shield className="text-emerald-600" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Enforced Business Architecture</h3>
            <p className="text-xs text-slate-400">Strict system constraints validated at the backend level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs">
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
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <Database className="text-blue-600" size={24} />
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Database Setup & Connection Manager (cPanel Ready)
              </h3>
              <p className="text-xs text-slate-400">
                Configure, test, and monitor the persistent MongoDB database for Customer Support, Complaints & Staff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-black text-[11px] uppercase flex items-center gap-1.5 ${
                dbStatus.readyState === 1
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus.readyState === 1 ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              {dbStatus.readyState === 1 ? 'CONNECTED' : dbStatus.state.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={fetchDatabaseStatus}
              disabled={loadingDb}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="Refresh Connection Status"
            >
              <RefreshCw size={15} className={loadingDb ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Live Connection & Collection Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          {[
            { label: 'Complaints', count: dbCollections.complaints },
            { label: 'Customers', count: dbCollections.customers },
            { label: 'Employees', count: dbCollections.employees },
            { label: 'Admins', count: dbCollections.admins },
          ].map((stat) => (
            <div key={stat.label} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-base font-black text-slate-800 font-mono">{stat.count}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              dbStatus.readyState === 1
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div>
              <p className="font-bold flex items-center gap-1.5">
                <HardDrive size={15} />
                <span>Connection Status: {dbStatus.state.toUpperCase()}</span>
              </p>
              <p className="text-[11px] mt-1 font-mono">
                Host: <strong>{dbStatus.host}</strong> | DB: <strong>{dbStatus.databaseName}</strong>
              </p>
              {dbStatus.lastError && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">Last Error: {dbStatus.lastError}</p>
              )}
            </div>
            <span className="px-2.5 py-1 bg-white/80 rounded-lg font-mono font-bold text-[10px] border border-current/20">
              {dbStatus.isCloud ? 'CLOUD SRV' : 'DIRECT HOST'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold flex items-center gap-1.5">
                <Lock size={15} className="text-blue-600" />
                <span>
                  Configuration Status: {dbForm.isConfigured ? 'CONFIGURED' : 'DEFAULT / LOCAL'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Stored Password:{' '}
                <strong>{dbForm.hasStoredPassword ? '•••••••• (Masked on Server)' : 'None / Unauthenticated Local'}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleReconnectDatabase}
              disabled={reconnectingDb}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
            >
              {reconnectingDb ? <Loader2 size={13} className="animate-spin" /> : <PlugZap size={13} />}
              <span>Reconnect DB</span>
            </button>
          </div>
        </div>

        {dbFeedback && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-start gap-2.5 ${
              dbFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : dbFeedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {dbFeedback.type === 'success' ? (
              <CheckCircle2 size={17} className="flex-shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle size={17} className="flex-shrink-0 mt-0.5 text-red-600" />
            )}
            <span className="leading-relaxed">{dbFeedback.message}</span>
          </div>
        )}

        {/* Protected Admin Database Setup Form */}
        <form onSubmit={handleSaveDbConfiguration} className="space-y-5 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Database Type (Supported Driver) <span className="text-red-500">*</span>
              </label>
              <select
                value={dbForm.dbType}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setDbForm({
                    ...dbForm,
                    dbType: nextType,
                    securityMode: nextType === 'mongodb+srv' ? 'tls-srv' : 'standard',
                    port: nextType === 'mongodb+srv' ? '' : (dbForm.port || '27017'),
                  });
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="mongodb+srv">MongoDB Atlas Cloud (mongodb+srv://) — Recommended for cPanel</option>
                <option value="mongodb">MongoDB Standard Host / VPS / cPanel Local (mongodb://)</option>
                <option value="mysql-notice">cPanel MySQL / MariaDB (Compatibility Info)</option>
              </select>
            </div>

            {/* Database Host */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Database Host <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={dbForm.host}
                onChange={(e) => setDbForm({ ...dbForm, host: e.target.value })}
                placeholder={
                  dbForm.dbType === 'mongodb+srv' ? 'cluster0.xxxxx.mongodb.net' : '127.0.0.1 or db.yourdomain.com'
                }
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Database Port */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Database Port {dbForm.dbType === 'mongodb' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                disabled={dbForm.dbType === 'mongodb+srv'}
                value={dbForm.dbType === 'mongodb+srv' ? 'SRV Auto (27017)' : dbForm.port}
                onChange={(e) => setDbForm({ ...dbForm, port: e.target.value })}
                placeholder="27017"
                className="w-full p-2.5 bg-white disabled:bg-slate-100 disabled:text-slate-400 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Database Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Database Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={dbForm.dbName}
                onChange={(e) => setDbForm({ ...dbForm, dbName: e.target.value })}
                placeholder="ekosmart"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Database Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Database Username {dbForm.dbType === 'mongodb+srv' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={dbForm.username}
                onChange={(e) => setDbForm({ ...dbForm, username: e.target.value })}
                placeholder="ekosmart_admin"
                autoComplete="off"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Database Password (Masked with Show/Hide Toggle) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Database Password</span>
                {dbForm.hasStoredPassword && !dbForm.password && (
                  <span className="text-[10px] text-emerald-700 font-semibold">Stored on server</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showDbPassword ? 'text' : 'password'}
                  value={dbForm.password}
                  onChange={(e) => setDbForm({ ...dbForm, password: e.target.value })}
                  placeholder={
                    dbForm.hasStoredPassword
                      ? '•••••••••••• (Leave blank to keep stored password)'
                      : 'Enter database password'
                  }
                  autoComplete="new-password"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowDbPassword(!showDbPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showDbPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showDbPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Connection Security Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Connection Security / TLS Mode
              </label>
              <select
                value={dbForm.securityMode}
                disabled={dbForm.dbType === 'mongodb+srv'}
                onChange={(e) => setDbForm({ ...dbForm, securityMode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="tls-srv">TLS / SSL Enforced via DNS SRV (Atlas Default)</option>
                <option value="tls">TLS / SSL Encrypted Connection (?tls=true)</option>
                <option value="standard">Standard Direct Connection (Localhost / Internal VPC)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Authentication Database (authSource)
              </label>
              <input
                type="text"
                value={dbForm.authSource}
                onChange={(e) => setDbForm({ ...dbForm, authSource: e.target.value })}
                placeholder="admin"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500">
              🔒 Passwords and full connection URIs are never stored in browser storage or returned by API responses.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleTestDbConnection}
                disabled={testingDb || savingDb}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                {testingDb ? <Loader2 size={14} className="animate-spin text-blue-600" /> : <PlugZap size={14} className="text-blue-600" />}
                <span>Test Connection</span>
              </button>

              <button
                type="submit"
                disabled={savingDb || testingDb}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                {savingDb ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{dbForm.isConfigured ? 'Update Configuration' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

