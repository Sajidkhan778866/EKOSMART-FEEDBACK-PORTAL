import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, Settings, CheckCircle2, RefreshCw } from 'lucide-react';
import { authApi, getApiBaseUrl, getCustomApiUrl, setCustomApiUrl, clearCustomApiUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Backend URL Configurer
  const [showConfig, setShowConfig] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [currentBaseUrl, setCurrentBaseUrl] = useState('');
  const [configSuccess, setConfigSuccess] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentBaseUrl(getApiBaseUrl());
    const saved = getCustomApiUrl();
    if (saved) setCustomUrlInput(saved);
  }, []);

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) {
      clearCustomApiUrl();
      setCurrentBaseUrl(getApiBaseUrl());
      setConfigSuccess('Reset to default API URL.');
      setError('');
      setTimeout(() => setConfigSuccess(''), 3000);
      return;
    }

    setCustomApiUrl(customUrlInput.trim());
    const newBase = getApiBaseUrl();
    setCurrentBaseUrl(newBase);
    setConfigSuccess(`Connected to: ${newBase}`);
    setError('');
    setTimeout(() => {
      setConfigSuccess('');
      setShowConfig(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login(email.trim(), password.trim());
      if (res.data?.success && res.data?.data?.token) {
        login(res.data.data.token, res.data.data);
        navigate('/dashboard');
      } else {
        setError(res.data?.message || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      console.error('Admin Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please verify your credentials.');
      } else if (err.response?.status === 403) {
        setError('This admin account has been deactivated.');
      } else if (err.response?.status === 405) {
        setError('Backend API URL not configured in Vercel. Click "Configure Backend URL" below to connect.');
        setShowConfig(true);
      } else if (err.response?.status === 404) {
        setError('Backend API endpoint not found. Click "Configure Backend URL" below to connect your deployed backend.');
        setShowConfig(true);
      } else if (err.response?.status === 503) {
        setError('Database is currently connecting. Please wait a few moments and try again.');
      } else if (err.message === 'Network Error' || !err.response) {
        setError('Network error: Unable to connect to backend server. Please verify backend URL below.');
        setShowConfig(true);
      } else {
        setError(err.message || 'Server error. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-8 text-center text-white border-b-4 border-green-600">
          <div className="w-12 h-12 bg-green-600/20 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">EKOSMART ADMIN</h1>
          <p className="text-slate-400 text-sm mt-1">Authorized Management Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{error}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                placeholder="admin@ekosmart.com"
              />
              <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
              <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-600/30 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'SIGN IN TO DASHBOARD'}
          </button>

          <div className="text-center pt-2 space-y-2">
            <p className="text-xs text-slate-400">
              Default Credentials: <span className="font-mono text-slate-600">admin@ekosmart.com / admin123</span>
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-xs text-slate-500 hover:text-green-600 inline-flex items-center gap-1 font-medium transition-colors"
              >
                <Settings size={13} />
                {showConfig ? 'Hide Backend Settings' : 'Configure Backend API URL'}
              </button>
            </div>
          </div>

          {showConfig && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Settings size={14} className="text-green-600" />
                Backend API Connection
              </div>
              <div className="text-slate-500 break-all font-mono bg-white p-2 border border-slate-200 rounded">
                Active: {currentBaseUrl || 'Default'}
              </div>
              {configSuccess && (
                <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} />
                  {configSuccess}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-slate-600 font-medium">
                  Deployed Backend URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://ekosmart-backend.vercel.app"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiUrl}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded text-xs transition-colors flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    Connect
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Tip: In Vercel, set <span className="font-mono font-bold">VITE_API_URL</span> in Project Settings for permanent configuration.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
