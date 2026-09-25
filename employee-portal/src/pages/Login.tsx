import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { empAuthApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !password) {
      setError('Please enter your Employee ID and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await empAuthApi.login(employeeId.trim(), password.trim());
      if (res.data?.success && res.data?.data?.token) {
        login(res.data.data.token, res.data.data);
        navigate('/dashboard');
      } else {
        setError(res.data?.message || 'Invalid credentials. Please check your Employee ID and password.');
      }
    } catch (err: any) {
      console.error('Employee Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid Employee ID or password. Please verify your credentials.');
      } else if (err.response?.status === 403) {
        setError('This employee account has been deactivated. Please contact administrator.');
      } else if (err.response?.status === 404) {
        setError('Backend API endpoint not found. Please ensure VITE_API_URL is configured.');
      } else if (err.response?.status === 503) {
        setError('Database is currently connecting. Please wait a few moments and try again.');
      } else if (err.message === 'Network Error' || !err.response) {
        setError('Network error: Unable to connect to backend server. Please check your internet connection or backend URL.');
      } else {
        setError(err.message || 'Server error. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-indigo-600">
        <div className="bg-slate-950 p-8 text-center text-white">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <User size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">STAFF & EMPLOYEE LOGIN</h1>
          <p className="text-slate-400 text-sm mt-1">Ekosmart Service & Operations Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="e.g. TEST-EMP-001"
              />
              <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
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
                className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-600/30 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'SIGN IN TO WORKSPACE'}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Demo Account: <span className="font-mono text-slate-600">TEST-EMP-001 / employee123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
