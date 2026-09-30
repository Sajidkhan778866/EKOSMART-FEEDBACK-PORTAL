import { Link } from 'react-router-dom';
import {
  Receipt,
  ShieldCheck,
  QrCode,
  UserCheck,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { EMPLOYEE_PORTAL_URL } from '../config/api';

export default function ShowroomBillingPublic() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-slate-700 text-center space-y-4">
        <div className="inline-flex p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Receipt size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Showroom Counter Billing & Invoicing</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Official billing, barcode scanning, warranty registration, and tax invoice generation at Ekosmart authorized service and retail counters.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={EMPLOYEE_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl shadow-lg transition flex items-center gap-2 text-xs"
          >
            <UserCheck size={16} />
            <span>Authorized Staff Billing Login</span>
            <ExternalLink size={13} />
          </a>
          <Link
            to="/customer/purchases"
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-600 transition flex items-center gap-2 text-xs"
          >
            <span>Customer Invoice Lookup</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Customer Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 inline-block">
            <QrCode size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">1. Serial Number Scan</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every battery pack and electric vehicle component features an authentic laser-etched serial and barcode scanned at the showroom counter.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 inline-block">
            <Receipt size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2. GST Tax Invoice</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Authorized personnel issue computer-generated, multi-page GST tax invoices with QR codes and detailed product specifications.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 inline-block">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3. Automatic Warranty & Rewards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every qualifying purchase activates an official manufacturer warranty certificate and awards 500 bonus coins to the customer's wallet.
          </p>
        </div>
      </div>

      {/* Notice on Security & Employee Access */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm flex items-center gap-2 text-amber-900">
            <Lock size={16} className="text-amber-700" />
            <span>Staff Authentication Required for Billing Generation</span>
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
            In compliance with GST regulations and stock audit guidelines, invoices can only be created by certified Ekosmart employees with verified billing credentials.
          </p>
        </div>
        <a
          href={EMPLOYEE_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Staff Login</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
