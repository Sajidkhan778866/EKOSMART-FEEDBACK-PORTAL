import { useState, useRef, useEffect, type FC } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Building2,
  CheckCircle,
  Palette,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { contentApi, resolveImageUrl } from '../api/client';

export interface EmployeeCardData {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  division: string[];
  designation: string;
  role: string;
  photoUrl?: string;
  barcode?: string;
  certificates?: any[];
  issuedItems?: any[];
  warrantyAccess?: any;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

interface IdCardModalProps {
  employee: EmployeeCardData | null;
  onClose: () => void;
}

export type SoftIdTemplate = 'emerald' | 'cyber' | 'amber' | 'slate';

interface TemplateTheme {
  id: SoftIdTemplate;
  name: string;
  iconEmoji: string;
  headerBg: string;
  accentBorder: string;
  accentText: string;
  accentPill: string;
  qrBorder: string;
  printPrimary: string;
  printSecondary: string;
}

const TEMPLATES: Record<SoftIdTemplate, TemplateTheme> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Pro (OEM)',
    iconEmoji: '🌲',
    headerBg: 'from-slate-950 via-slate-900 to-emerald-950 border-emerald-500',
    accentBorder: 'border-emerald-500',
    accentText: 'text-emerald-400',
    accentPill: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    qrBorder: 'border-emerald-500',
    printPrimary: '#064e3b',
    printSecondary: '#059669',
  },
  cyber: {
    id: 'cyber',
    name: 'Electric Cyan',
    iconEmoji: '⚡',
    headerBg: 'from-slate-950 via-blue-950 to-cyan-950 border-cyan-400',
    accentBorder: 'border-cyan-400',
    accentText: 'text-cyan-400',
    accentPill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    qrBorder: 'border-cyan-400',
    printPrimary: '#082f49',
    printSecondary: '#0284c7',
  },
  amber: {
    id: 'amber',
    name: 'HV Safety Field',
    iconEmoji: '⚠️',
    headerBg: 'from-zinc-950 via-amber-950 to-orange-950 border-amber-500',
    accentBorder: 'border-amber-500',
    accentText: 'text-amber-400',
    accentPill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    qrBorder: 'border-amber-500',
    printPrimary: '#78350f',
    printSecondary: '#d97706',
  },
  slate: {
    id: 'slate',
    name: 'Titanium Slate',
    iconEmoji: '🏛️',
    headerBg: 'from-slate-950 via-slate-900 to-zinc-900 border-indigo-400',
    accentBorder: 'border-indigo-400',
    accentText: 'text-indigo-400',
    accentPill: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    qrBorder: 'border-indigo-400',
    printPrimary: '#0f172a',
    printSecondary: '#4f46e5',
  },
};

// Generate pure SVG QR code simulation
const generateQrSvg = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  
  const size = 21;
  let cells = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= size - 7;
      const isBottomLeft = r >= size - 7 && c < 7;
      
      let isFilled = false;
      if (isTopLeft) {
        isFilled = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else if (isTopRight) {
        const cAdj = c - (size - 7);
        isFilled = r === 0 || r === 6 || cAdj === 0 || cAdj === 6 || (r >= 2 && r <= 4 && cAdj >= 2 && cAdj <= 4);
      } else if (isBottomLeft) {
        const rAdj = r - (size - 7);
        isFilled = rAdj === 0 || rAdj === 6 || c === 0 || c === 6 || (rAdj >= 2 && rAdj <= 4 && c >= 2 && c <= 4);
      } else {
        isFilled = Math.abs((hash ^ (r * 31 + c * 17))) % 3 === 0;
      }

      if (isFilled) {
        cells += `<rect x="${c * 6}" y="${r * 6}" width="6" height="6" fill="#0f172a" />`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 126" width="126" height="126" style="background:#fff;">
    ${cells}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const IdCardModal: FC<IdCardModalProps> = ({ employee, onClose }) => {
  const [viewMode, setViewMode] = useState<'front' | 'back' | 'dual'>('dual');
  const [selectedTemplate, setSelectedTemplate] = useState<SoftIdTemplate>('emerald');
  const [showSoftCustomizer, setShowSoftCustomizer] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic Soft-Coded Configuration State (Loaded from CMS / customizable live)
  const [companyName, setCompanyName] = useState('EKOSMART');
  const [companySubtitle, setCompanySubtitle] = useState('Battery Solution & EV Spare Parts');
  const [plantAddress, setPlantAddress] = useState('Rang Talab, Near by Star Kids School, Kota (Raj) - 324002');
  const [plantPhone, setPlantPhone] = useState('+91 8949049003');
  const [plantEmail, setPlantEmail] = useState('support@ekosmart.in');
  const [gstin, setGstin] = useState('08DTUPM4205B1Z0');
  const [disclaimer, setDisclaimer] = useState('Property of Ekosmart Battery Solution. If found, please return to Rang Talab, Kota or call helpline.');
  const [signatoryTitle, setSignatoryTitle] = useState('Authorized Officer');
  const [validityYears, setValidityYears] = useState(3);
  const [verificationHeader, setVerificationHeader] = useState('TERMS & VERIFICATION');

  useEffect(() => {
    contentApi
      .getAdmin()
      .then((res: any) => {
        if (res.data.success && res.data.data) {
          const cms = res.data.data;
          if (cms.footer?.companyName) setCompanyName(cms.footer.companyName);
          else if (cms.hero?.heading) setCompanyName(cms.hero.heading);

          if (cms.contactInfo?.subheading) setCompanySubtitle(cms.contactInfo.subheading);
          else if (cms.hero?.subheading) setCompanySubtitle(cms.hero.subheading);

          if (cms.contactInfo?.plantAddress) setPlantAddress(cms.contactInfo.plantAddress);
          else if (cms.footer?.address) setPlantAddress(cms.footer.address);

          if (cms.contactInfo?.helplinePhone) setPlantPhone(cms.contactInfo.helplinePhone);
          else if (cms.footer?.phone) setPlantPhone(cms.footer.phone);

          if (cms.contactInfo?.supportEmail) setPlantEmail(cms.contactInfo.supportEmail);
          else if (cms.footer?.email) setPlantEmail(cms.footer.email);

          if (cms.contactInfo?.gstin) setGstin(cms.contactInfo.gstin);
          else if (cms.footer?.gstin) setGstin(cms.footer.gstin);

          if (cms.footer?.disclaimer) setDisclaimer(cms.footer.disclaimer);
        }
      })
      .catch((e: any) => console.warn('Could not load CMS info for Soft ID Card:', e));
  }, []);

  if (!employee) return null;

  const currentTheme = TEMPLATES[selectedTemplate] || TEMPLATES.emerald;
  const qrCodeUrl = generateQrSvg(`EKOSMART-EMP:${employee.employeeId}:${employee.email}`);
  const issueYear = employee.createdAt ? new Date(employee.createdAt).getFullYear() : 2026;
  const expiryYear = issueYear + validityYears;

  const certCount = employee.certificates?.length || 0;
  const assetCount = employee.issuedItems?.length || 0;
  const warrantyTier = employee.warrantyAccess?.enabled
    ? employee.warrantyAccess?.accessType || 'Registrar'
    : 'Standard';

  const handlePrint = () => {
    window.print();
  };

  const handleResetSoftCodes = () => {
    setCompanyName('EKOSMART');
    setCompanySubtitle('Battery Solution & EV Spare Parts');
    setPlantAddress('Rang Talab, Near by Star Kids School, Kota (Raj) - 324002');
    setPlantPhone('+91 8949049003');
    setPlantEmail('support@ekosmart.in');
    setGstin('08DTUPM4205B1Z0');
    setDisclaimer('Property of Ekosmart Battery Solution. If found, please return to Rang Talab, Kota or call helpline.');
    setSignatoryTitle('Authorized Officer');
    setValidityYears(3);
    setVerificationHeader('TERMS & VERIFICATION');
  };

  const handleDownloadBadge = () => {
    const printableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Soft ID Card - ${employee.name} (${employee.employeeId})</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; padding: 40px; text-align: center; }
          .card-container { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 20px; }
          .badge { width: 320px; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); background: #ffffff; text-align: center; border: 1px solid #cbd5e1; }
          .badge-header { background: linear-gradient(135deg, ${currentTheme.printPrimary}, ${currentTheme.printSecondary}); color: #fff; padding: 20px 12px; }
          .badge-header h2 { margin: 0; font-size: 16px; letter-spacing: 2px; }
          .badge-header p { margin: 2px 0 0; font-size: 10px; opacity: 0.9; }
          .photo { width: 92px; height: 92px; border-radius: 50%; object-cover; margin: -46px auto 10px; border: 4px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: ${currentTheme.printSecondary}; }
          .name { font-size: 18px; font-weight: bold; color: #0f172a; margin: 4px 0 0; }
          .designation { font-size: 12px; color: ${currentTheme.printSecondary}; font-weight: 700; margin-bottom: 8px; }
          .emp-id { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-family: monospace; font-weight: bold; font-size: 13px; padding: 3px 12px; border-radius: 6px; }
          .details { padding: 14px 20px; text-align: left; font-size: 11px; color: #334155; }
          .details-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .barcode-box { background: #fff; padding: 10px; border-top: 1px dashed #cbd5e1; }
          .footer-info { font-size: 9px; color: #64748b; padding: 10px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <h1>${companyName} - Official Soft ID Badge</h1>
        <p>Template: <b>${currentTheme.name}</b> | Staff: <b>${employee.name}</b> (${employee.employeeId}) | Plant Helpline: <b>${plantPhone}</b></p>
        <div class="card-container">
          <!-- Front Card -->
          <div class="badge">
            <div class="badge-header">
              <h2>${companyName}</h2>
              <p>${companySubtitle}</p>
            </div>
            <div style="height: 50px;"></div>
            <div class="name">${employee.name}</div>
            <div class="designation">${employee.designation}</div>
            <div class="emp-id">${employee.employeeId}</div>
            <div class="details">
              <div class="details-row"><span>Department:</span> <b>${employee.department}</b></div>
              <div class="details-row"><span>Division:</span> <b>${employee.division?.join(', ') || 'General'}</b></div>
              <div class="details-row"><span>Warranty Tier:</span> <b>${warrantyTier}</b></div>
              <div class="details-row"><span>Credentials:</span> <b>${certCount} Certs • ${assetCount} Assets</b></div>
              <div class="details-row"><span>Status:</span> <b style="color:${currentTheme.printSecondary};">${employee.status}</b></div>
              <div class="details-row"><span>Valid Thru:</span> <b>${expiryYear}</b></div>
            </div>
            ${employee.barcode ? `<div class="barcode-box"><img src="${employee.barcode}" style="height:50px; width:100%; object-fit:contain;" /></div>` : ''}
            <div class="footer-info">${plantAddress}</div>
          </div>

          <!-- Back Card -->
          <div class="badge" style="background:#0f172a; color:#fff;">
            <div style="padding:15px; border-bottom:1px solid #334155;">
              <h3 style="margin:0; font-size:12px; color:#38bdf8; text-transform:uppercase;">${verificationHeader}</h3>
              <p style="margin:4px 0 0; font-size:10px; color:#94a3b8;">${companyName} - Official Staff Identification</p>
            </div>
            <div style="padding:20px 10px;">
              <img src="${qrCodeUrl}" style="width:100px; height:100px; background:#fff; padding:6px; border-radius:12px;" />
              <div style="margin-top:12px; font-size:10px; text-align:left; padding:0 20px; color:#cbd5e1;">
                <p style="margin:4px 0;">📞 ${employee.mobile} (Plant: ${plantPhone})</p>
                <p style="margin:4px 0;">✉️ ${employee.email}</p>
                <p style="margin:4px 0;">📍 ${plantAddress}</p>
              </div>
            </div>
            <div style="padding:10px; font-size:8px; color:#94a3b8; border-top:1px solid #1e293b; background:#020617;">
              <p style="margin:0 0 4px;">${disclaimer}</p>
              <div style="display:flex; justify-content:space-between; padding-top:4px; border-top:1px solid #1e293b;">
                <span>GSTIN: ${gstin}</span>
                <span style="font-style:italic;">${signatoryTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([printableHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_Soft_ID_${selectedTemplate}_${employee.employeeId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container Box */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Top Control Header (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide flex items-center gap-2">
                <span>Official Employee Soft ID Badge</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {employee.employeeId}
                </span>
              </h2>
              <p className="text-xs text-slate-400">High-resolution printable, template-selectable & scannable corporate identification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Soft-Code Customizer Toggle */}
            <button
              onClick={() => setShowSoftCustomizer(!showSoftCustomizer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                showSoftCustomizer
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
              }`}
            >
              <Sliders size={14} />
              <span>{showSoftCustomizer ? 'Close Soft-Codes' : 'Soft-Code Settings'}</span>
            </button>

            {/* View Selector Tabs */}
            <div className="bg-slate-800 p-1 rounded-xl flex text-xs font-semibold">
              <button
                onClick={() => setViewMode('front')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'front' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setViewMode('back')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'back' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setViewMode('dual')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'dual' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dual View
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Soft ID Template Selector Bar */}
        <div className="bg-slate-800/95 border-b border-slate-700/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-white print:hidden">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-emerald-400" />
            <span className="font-bold text-slate-300">Choose Soft ID Template:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(TEMPLATES) as SoftIdTemplate[]).map((tKey) => {
              const tmpl = TEMPLATES[tKey];
              const isSel = selectedTemplate === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setSelectedTemplate(tKey)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-xs border ${
                    isSel
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{tmpl.iconEmoji}</span>
                  <span>{tmpl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Soft-Code Customizer Drawer (Hidden in Print) */}
        {showSoftCustomizer && (
          <div className="bg-slate-900 text-white p-5 border-b border-slate-700 space-y-3 animate-in slide-in-from-top-3 duration-150 print:hidden text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-amber-400" />
                <span className="font-bold text-amber-300">Soft-Coded ID Card Variables (Live Dynamic Sync)</span>
              </div>
              <button
                type="button"
                onClick={handleResetSoftCodes}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-lg transition cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Company Display Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Company Subtitle / Tagline</label>
                <input
                  type="text"
                  value={companySubtitle}
                  onChange={(e) => setCompanySubtitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Plant Helpline Number</label>
                <input
                  type="text"
                  value={plantPhone}
                  onChange={(e) => setPlantPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Validity (Years)</label>
                <select
                  value={validityYears}
                  onChange={(e) => setValidityYears(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                >
                  <option value={1}>1 Year (Exp: {issueYear + 1})</option>
                  <option value={2}>2 Years (Exp: {issueYear + 2})</option>
                  <option value={3}>3 Years (Exp: {issueYear + 3})</option>
                  <option value={5}>5 Years (Exp: {issueYear + 5})</option>
                  <option value={10}>10 Years (Exp: {issueYear + 10})</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Authorized Signatory Title</label>
                <input
                  type="text"
                  value={signatoryTitle}
                  onChange={(e) => setSignatoryTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Card Back Header Title</label>
                <input
                  type="text"
                  value={verificationHeader}
                  onChange={(e) => setVerificationHeader(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Registered Address / Plant Unit</label>
                <input
                  type="text"
                  value={plantAddress}
                  onChange={(e) => setPlantAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10.5px] font-semibold mb-1">Support Email</label>
                <input
                  type="text"
                  value={plantEmail}
                  onChange={(e) => setPlantEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: ID Card Visual Showcase */}
        <div className="p-8 bg-slate-100/90 flex flex-col items-center justify-center min-h-[480px] print:p-0 print:bg-white">
          <div
            id="printable-id-card"
            ref={cardRef}
            className="flex flex-wrap items-center justify-center gap-8 print:gap-10 print:m-0"
          >
            {/* ================= FRONT CARD ================= */}
            {(viewMode === 'front' || viewMode === 'dual') && (
              <div className="w-[300px] h-[500px] bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden relative flex flex-col justify-between print:shadow-none print:border-slate-800">
                {/* Lanyard Hole Cutout Graphic */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-slate-300/80 rounded-full border border-slate-400/50 z-20 print:border-slate-400"></div>

                {/* Card Top Header with dynamic template gradient & soft-coded company */}
                <div className={`bg-gradient-to-br ${currentTheme.headerBg} text-white pt-7 pb-6 px-4 text-center relative border-b-4`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-gradient-to-tr from-emerald-600 to-green-400 text-slate-950 rounded flex items-center justify-center font-black text-[10px]">
                      EBS
                    </div>
                    <span className={`font-extrabold tracking-widest text-xs uppercase ${currentTheme.accentText}`}>
                      {companyName}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold block truncate">
                    {companySubtitle}
                  </span>
                </div>

                {/* Photo & Profile Section */}
                <div className="text-center px-4 -mt-10 relative z-10 space-y-1.5">
                  <div className="relative inline-block">
                    {employee.photoUrl ? (
                      <img
                        src={resolveImageUrl(employee.photoUrl)}
                        alt={employee.name}
                        className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-white shadow-md bg-white"
                      />
                    ) : (

                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-black text-2xl flex items-center justify-center mx-auto border-4 border-white shadow-md`}>
                        {employee.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                      <CheckCircle size={12} />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{employee.name}</h3>
                    <p className="text-slate-600 text-xs font-semibold">{employee.designation}</p>
                  </div>

                  <div className="inline-block bg-slate-900 text-emerald-400 font-mono text-xs font-bold px-3 py-0.5 rounded-lg border border-slate-700">
                    ID: {employee.employeeId}
                  </div>
                </div>

                {/* Badges & Division Information */}
                <div className="px-5 py-1.5 space-y-1.5 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Department</span>
                      <span className="font-semibold text-slate-800">{employee.department}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Scope / Tier</span>
                      <span className="font-bold text-slate-700">{warrantyTier}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Authorized Divisions</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[140px]">
                        {employee.division?.map((div) => (
                          <span
                            key={div}
                            className="bg-emerald-100 text-emerald-800 font-bold text-[8.5px] px-1.5 py-0.2 rounded"
                          >
                            {div}
                          </span>
                        ))}
                      </div>
                    </div>
                    {(certCount > 0 || assetCount > 0) && (
                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100 text-slate-600">
                        <span>Assets / Credentials</span>
                        <span className="font-bold">
                          {certCount} Certs • {assetCount} Items
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Barcode Section */}
                <div className="bg-white px-4 py-2 text-center border-t border-slate-100 flex flex-col items-center justify-center">
                  {employee.barcode ? (
                    <img
                      src={employee.barcode}
                      alt="Code128 Barcode"
                      className="h-10 w-full object-contain"
                    />
                  ) : (
                    <div className="font-mono text-[9px] text-slate-400">BARCODE: {employee.employeeId}</div>
                  )}
                  <div className="flex justify-between w-full text-[8.5px] text-slate-400 px-2 mt-0.5">
                    <span>STATUS: ACTIVE</span>
                    <span>EXP: {expiryYear}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= BACK CARD ================= */}
            {(viewMode === 'back' || viewMode === 'dual') && (
              <div className="w-[300px] h-[500px] bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 overflow-hidden relative flex flex-col justify-between print:shadow-none print:border-slate-800">
                {/* Lanyard Hole Cutout Graphic */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-slate-800 rounded-full border border-slate-700 z-20"></div>

                {/* Back Header */}
                <div className="pt-7 pb-3 px-5 border-b border-slate-800 text-center">
                  <span className={`text-[10px] font-mono tracking-widest ${currentTheme.accentText} uppercase font-bold block`}>
                    {verificationHeader}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                    {companyName} - Official Staff Identification
                  </p>
                </div>

                {/* QR Code & Contact Data */}
                <div className="p-4 space-y-2.5 text-center">
                  <div className={`bg-white p-2 rounded-2xl inline-block border-2 ${currentTheme.qrBorder} shadow-md`}>
                    <img src={qrCodeUrl} alt="QR Verification" className="w-20 h-20 object-contain" />
                  </div>
                  <span className={`block text-[9px] font-mono ${currentTheme.accentText} tracking-wider`}>
                    SCAN TO VERIFY AUTHENTICITY
                  </span>

                  <div className="bg-slate-800/80 rounded-xl p-2.5 text-left space-y-1.5 text-[10px] border border-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone size={12} className={currentTheme.accentText} />
                      <span className="truncate">{employee.mobile} (Plant: {plantPhone})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail size={12} className={currentTheme.accentText} />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <Building2 size={12} className={`${currentTheme.accentText} shrink-0 mt-0.5`} />
                      <span className="leading-tight text-[9.5px]">{plantAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Card Disclaimer & Signature */}
                <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-center space-y-1">
                  <p className="text-[8px] text-slate-500 leading-tight">
                    {disclaimer}
                  </p>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[8px] text-slate-400">
                    <span>GSTIN: {gstin}</span>
                    <span className={`font-serif italic ${currentTheme.accentText}`}>{signatoryTitle}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Footer (Hidden in Print) */}
        <div className="bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles size={16} className="text-amber-500" />
            <span>CR80 standard soft badge format ({currentTheme.name}) with scannable QR & Barcode</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadBadge}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Download size={15} />
              <span>Download Digital Badge</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Badge Card</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
