import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Database, Phone, Mail, MapPin, Cpu, CheckCircle } from 'lucide-react';
import { EbsLogo } from '../components/EbsLogo';
import { API_BASE } from '../config/api';

const defaultPolicy = {
  title: 'Privacy Policy & Battery Telemetry Governance',
  content: `1. Information We Collect
When you register a service complaint or product warranty on the Ekosmart Platform, we collect necessary personal details including your name, contact mobile number (+91 8949049003 helpline verification), email address, product serial number, and invoice details.

2. Specific Privacy & Data Handling for Battery Service:
- Battery Telemetry & Serial Traceability: Battery serial numbers and charging cycle logs collected during diagnostic checkups are used strictly to validate active 3-Year (48V) or 1.5-Year (60V/72V) warranty status and calculate state-of-health (SoH).
- Location & Service Dispatch: Geolocation data and service address in Kota or Pan-India regions are shared only with assigned certified field engineers for on-site diagnostic service.
- OTP Authentication: Email OTPs are generated to authenticate customer identity before registering complaints or warranty transfers.

3. Statutory Compliance & GST Governance:
Our operations comply with the Indian Information Technology Act, 2000, and GST statutory compliance rules under GSTIN: 08DTUPM4205B1Z0 (Ekosmart Battery Solution, Rang Talab, Kota, Rajasthan - 324002).

4. Contact & Support Division:
For privacy inquiries or technical support:
- Email: support@ekosmartdrive.in
- Phone: +91 8949049003
- Address: Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002
- Office Timings: 10:00 AM to 6:30 PM (Mon - Sat)`,
};

const PrivacyPolicy = () => {
  const [policy, setPolicy] = useState(defaultPolicy);
  const [lastUpdated, setLastUpdated] = useState<string>('September 2026');

  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.privacyPolicy) {
          setPolicy(data.data.privacyPolicy);
          if (data.data.updatedAt) {
            setLastUpdated(new Date(data.data.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch privacy policy from CMS:', err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{policy.title}</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5">Official Ekosmart Battery Solution (EBS) Privacy & Data Charter • {lastUpdated}</p>
          </div>
        </div>
        <EbsLogo variant="battery" size="sm" showText={false} />
      </div>

      {/* Key Highlights Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Lock size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Security</span>
            <span className="text-xs font-bold text-slate-800">Email OTP Protected</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Cpu size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Battery Diagnostics</span>
            <span className="text-xs font-bold text-slate-800">Telemetry & SoH Privacy</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Database size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Compliance</span>
            <span className="text-xs font-bold text-slate-800">GST: 08DTUPM4205B1Z0</span>
          </div>
        </div>
      </div>

      {/* Main Dynamic Policy Content */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
        {policy.content}
      </div>

      {/* Official Plant Contact Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
          <CheckCircle size={18} />
          <span>Ekosmart Data Protection & Factory Grievance Officer</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
          <div className="flex items-center gap-2.5">
            <Phone size={16} className="text-emerald-400 flex-shrink-0" />
            <span>Direct: +91 8949049003</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail size={16} className="text-emerald-400 flex-shrink-0" />
            <span>Email: support@ekosmartdrive.in</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Rang Talab, Near Star Kids School, Kota, Rajasthan - 324002</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
