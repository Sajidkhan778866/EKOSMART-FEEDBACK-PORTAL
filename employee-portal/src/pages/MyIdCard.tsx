import { useState, useEffect } from 'react';
import {
  CreditCard,
  Printer,
  ShieldCheck,
  User,
  Building,
  Sparkles,
  QrCode,
  Barcode as BarcodeIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { contentApi, resolveImageUrl } from '../api/client';

export interface IIdCardConfig {
  templateName: string;
  companyName: string;
  companySubtitle: string;
  companyAddress: string;
  logoType: 'preset' | 'image';
  logoImage?: string;
  primaryColor: string;
  secondaryColor: string;
  fields: Array<{
    fieldKey: string;
    label: string;
    isVisible: boolean;
    order: number;
  }>;
  showBarcode: boolean;
  showQrCode: boolean;
  authorizedSignatoryText: string;
  termsText: string;
}

const defaultIdConfig: IIdCardConfig = {
  templateName: 'Ekosmart Official Holographic Card',
  companyName: 'EKOSMART BATTERY SOLUTION (EBS)',
  companySubtitle: 'Authorized Technical & Field Operations Personnel',
  companyAddress: 'Kota Industrial Area, Rajasthan - 324005',
  logoType: 'preset',
  primaryColor: '#064e3b',
  secondaryColor: '#059669',
  fields: [
    { fieldKey: 'employeeId', label: 'Employee ID', isVisible: true, order: 1 },
    { fieldKey: 'designation', label: 'Designation', isVisible: true, order: 2 },
    { fieldKey: 'department', label: 'Department', isVisible: true, order: 3 },
    { fieldKey: 'division', label: 'Division Scope', isVisible: true, order: 4 },
    { fieldKey: 'mobile', label: 'Mobile Phone', isVisible: true, order: 5 },
    { fieldKey: 'email', label: 'Email', isVisible: true, order: 6 },
    { fieldKey: 'joiningDate', label: 'Valid Since', isVisible: true, order: 7 },
  ],
  showBarcode: true,
  showQrCode: true,
  authorizedSignatoryText: 'Authorized Signatory • Ekosmart HR & Operations',
  termsText:
    'This identity card is the property of Ekosmart Battery Solution. If found, please return to the nearest Ekosmart authorized center.',
};

const MyIdCard = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<IIdCardConfig>(defaultIdConfig);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await contentApi.getPublic();
      if (res.data?.success && res.data.data?.idCardConfig) {
        setConfig({
          ...defaultIdConfig,
          ...res.data.data.idCardConfig,
        });
      }
    } catch {
      // fallback to default
    }
  };

  const isFieldVisible = (key: string): boolean => {
    const field = (config.fields || []).find((f) => f.fieldKey === key);
    return field ? field.isVisible : true;
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard size={16} />
            <span>Digital Staff Credentials</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Official Employee ID Card</h1>
          <p className="text-xs text-slate-300 mt-1">
            Verified staff badge with soft-coded permissions, department division, and QR verification.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer"
        >
          <Printer size={16} />
          <span>Print / Save ID Card</span>
        </button>
      </div>

      {/* ID Card Presentation Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6">
        {/* FRONT OF CARD */}
        <div
          className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white relative flex flex-col justify-between"
          style={{ minHeight: '520px' }}
        >
          {/* Card Top Brand Band */}
          <div
            className="p-5 text-white text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${config.primaryColor || '#064e3b'}, ${
                config.secondaryColor || '#059669'
              })`,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-emerald-300" />
              <h3 className="font-black text-xs tracking-wider uppercase leading-tight">
                {config.companyName || 'EKOSMART BATTERY SOLUTION'}
              </h3>
            </div>
            <p className="text-[10px] text-emerald-200/90 font-medium">
              {config.companySubtitle || 'Technical & Field Operations Personnel'}
            </p>
          </div>

          {/* Profile Photo & Hologram */}
          <div className="flex flex-col items-center -mt-6 z-10 px-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl border-2 border-emerald-500/40 overflow-hidden relative">
              {user?.photoUrl ? (
                <img
                  src={resolveImageUrl(user.photoUrl)}
                  alt={user?.name || 'Staff'}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <User size={40} />
                </div>
              )}
            </div>

            <h2 className="text-base font-black text-slate-900 mt-2 text-center">{user?.name || 'Authorized Staff'}</h2>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
              <Sparkles size={12} />
              <span>{user?.designation || 'Field Service Specialist'}</span>
            </div>
          </div>

          {/* Attributes List */}
          <div className="p-5 space-y-2 text-xs flex-1">
            {isFieldVisible('employeeId') && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Employee ID:</span>
                <span className="font-mono font-bold text-slate-800">{user?.employeeId || 'EBS-EMP-001'}</span>
              </div>
            )}
            {isFieldVisible('department') && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Department:</span>
                <span className="font-bold text-slate-700">{user?.department || 'Operations'}</span>
              </div>
            )}
            {isFieldVisible('division') && user?.division && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Divisions:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[160px] text-right">
                  {Array.isArray(user.division) ? user.division.join(', ') : user.division}
                </span>
              </div>
            )}
            {isFieldVisible('mobile') && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Mobile:</span>
                <span className="font-mono font-semibold text-slate-700">{user?.mobile || '+91 8949049003'}</span>
              </div>
            )}
            {isFieldVisible('email') && user?.email && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-mono text-slate-600 truncate max-w-[160px]">{user.email}</span>
              </div>
            )}
          </div>

          {/* Card Bottom Barcode */}
          {config.showBarcode && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
              <div className="font-mono tracking-widest text-slate-700 font-bold text-xs flex items-center gap-1.5">
                <BarcodeIcon size={24} className="text-slate-600" />
                <span>*{user?.employeeId || 'EBS-2026'}*</span>
              </div>
            </div>
          )}
        </div>

        {/* BACK OF CARD */}
        <div
          className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white relative flex flex-col justify-between p-5 text-xs text-slate-600"
          style={{ minHeight: '520px' }}
        >
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
              <Building size={14} className="text-emerald-600" />
              <span>Company Information & Terms</span>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              {config.termsText ||
                'This identity card is the property of Ekosmart Battery Solution. Unauthorized use is prohibited.'}
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-[11px]">
              <div className="font-bold text-slate-800">Headquarters / Main Plant:</div>
              <div className="text-slate-500">{config.companyAddress || 'Kota Industrial Area, Rajasthan'}</div>
              <div className="text-emerald-700 font-semibold mt-1">Helpline: +91 8949049003</div>
            </div>
          </div>

          {/* QR Code & Signature */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {config.showQrCode && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div>
                  <div className="text-[11px] font-bold text-emerald-950">Verified Employee QR</div>
                  <div className="text-[10px] text-emerald-700">Scan to verify credentials</div>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-xs text-emerald-800">
                  <QrCode size={36} />
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <div className="h-8 flex items-center justify-center text-slate-400 italic text-[11px] font-serif border-b border-dashed border-slate-300">
                Ekosmart Authorized Signatory
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                {config.authorizedSignatoryText || 'Authorized Signatory • Ekosmart HR & Operations'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyIdCard;
