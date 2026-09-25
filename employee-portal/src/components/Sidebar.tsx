import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, ShieldCheck, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EbsLogo } from './EbsLogo';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Complaints', path: '/complaints', icon: <ClipboardList size={18} /> },
    { name: 'Warranty', path: '/warranty', icon: <ShieldCheck size={18} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-slate-800">
        <EbsLogo variant="battery" size="sm" />
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-950 text-indigo-400 border border-indigo-700/50 shadow-inner'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="px-2">
          <p className="text-xs font-bold text-slate-200">{user?.name || 'Staff Member'}</p>
          <p className="text-[11px] text-slate-400 font-mono">{user?.employeeId || 'EMP-001'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
