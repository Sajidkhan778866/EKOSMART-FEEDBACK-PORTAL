import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  ClipboardList,
  ShieldCheck,
  UserCheck,
  FileText,
  LayoutTemplate,
  BarChart2,
  Settings,
  LogOut,
  Package,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EbsLogo } from './EbsLogo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Stock Inventory', path: '/stock', icon: <Package size={18} /> },
    { name: 'Showroom Billing', path: '/billing', icon: <Receipt size={18} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={18} /> },
    { name: 'Complaints', path: '/complaints', icon: <ClipboardList size={18} /> },
    { name: 'Warranty', path: '/warranty', icon: <ShieldCheck size={18} /> },
    { name: 'Customers', path: '/customers', icon: <UserCheck size={18} /> },
    { name: 'Form Builder', path: '/forms', icon: <FileText size={18} /> },
    { name: 'Content CMS', path: '/cms', icon: <LayoutTemplate size={18} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart2 size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 text-white min-h-screen flex flex-col flex-shrink-0 shadow-2xl" style={{ backgroundColor: '#111827' }}>
      {/* Brand Header with Official EBS Logo and Mobile Close */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <EbsLogo variant="battery" size="sm" showText={true} />
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl md:hidden transition cursor-pointer"
            title="Close Menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-xs ${
                isActive
                  ? 'bg-green-900/60 text-green-400 border border-green-700/50 shadow-inner'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
        <div className="px-2">
          <p className="text-xs font-bold text-slate-200">{user?.name || 'Super Admin'}</p>
          <p className="text-[11px] text-slate-400 font-mono">{user?.email || 'admin@ekosmart.com'}</p>
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
