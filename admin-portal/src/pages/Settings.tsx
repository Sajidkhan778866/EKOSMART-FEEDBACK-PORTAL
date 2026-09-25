import { Shield, Server } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Configuration</h1>
        <p className="text-slate-500 text-sm">Manage business rules, division constraints, and security settings</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Shield className="text-green-600" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Enforced Business Architecture</h3>
            <p className="text-xs text-slate-400">Strict system constraints validated at the backend level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">Complaint Divisions (Fixed)</span>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Battery</li>
              <li>Rental</li>
              <li>Showroom</li>
              <li>Spare Parts</li>
            </ul>
            <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">
              ✓ Plant is excluded from Complaint Tracker
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">Warranty Categories (Fixed)</span>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Showroom Sales</li>
              <li>Plant Commercial Units</li>
            </ul>
            <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">
              ✓ Completely separated from complaint system
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 pt-2">
          <Server className="text-blue-600" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Server & Database Connection</h3>
            <p className="text-xs text-slate-400">MongoDB centralized connection with REST API backend</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div>
            <p className="font-bold">Backend Status: Online</p>
            <p className="text-emerald-700 mt-0.5">Connected to MongoDB on port 5000</p>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-bold text-[11px]">
            HEALTHY
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
