import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MoreVertical, Menu, LogOut, Package, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { EbsLogo } from './EbsLogo';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-x-hidden">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Mobile Off-Canvas Sliding Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="bg-white h-16 shadow-xs flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* 3-Dot / Hamburger Menu Toggle for Mobile */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl md:hidden transition border border-slate-200 cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              title="Toggle Menu"
            >
              <MoreVertical size={18} className="text-emerald-700" />
              <Menu size={18} className="text-slate-700 -ml-1" />
            </button>

            <div className="md:hidden">
              <EbsLogo variant="battery" size="sm" />
            </div>

            <h2 className="hidden md:block text-xl font-black text-slate-800 tracking-tight">
              Employee Workspace
            </h2>
          </div>

          {/* Right Header User / Actions Section */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            <button
              onClick={() => navigate('/stock')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Package size={14} />
              <span>Stock Store</span>
            </button>

            {/* User Profile Pill with 3-Dot Options */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer border border-slate-200"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Staff'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{user?.employeeId || 'EMP'}</p>
                </div>
                <MoreVertical size={14} className="text-slate-500 ml-0.5" />
              </button>

              {/* 3-Dot User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name || 'Employee'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{user?.employeeId || ''}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 capitalize">{user?.role || 'Staff Member'}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/idcard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User size={14} className="text-slate-400" />
                        <span>My Employee ID Card</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/salary');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package size={14} className="text-slate-400" />
                        <span>My Salary Slips</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
