import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white h-16 shadow-sm flex items-center px-8 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Employee Workspace</h2>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
