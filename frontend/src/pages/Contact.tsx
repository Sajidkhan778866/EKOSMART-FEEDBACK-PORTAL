import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCheck,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  UserCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { EbsLogo } from '../components/EbsLogo';
import { API_BASE } from '../config/api';

export interface IDivisionContact {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  inCharge?: string;
  officeHours?: string;
  address?: string;
}

interface ContactCMSData {
  heading: string;
  subheading: string;
  badgeText: string;
  helplinePhone: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  supportEmail: string;
  salesEmail?: string;
  plantAddress: string;
  officeHours: string;
  gstin: string;
  website: string;
  mapUrl?: string;
  dropdownOptions: string[];
  divisionContacts?: IDivisionContact[];
  isPublished: boolean;
}

const defaultContactCMS: ContactCMSData = {
  heading: 'Get in Touch With Us',
  subheading:
    'Need technical assistance with your Lithium-Ion / LFP battery pack, genuine EV spare parts, warranty verification, or showroom dealership inquiries? Our Kota Central Plant engineering team is here to help.',
  badgeText: 'Official Ekosmart Support & Contact Directory',
  helplinePhone: '+91 8949049003',
  alternatePhone: '+91 9549730483',
  whatsappNumber: '+91 8949049003',
  supportEmail: 'support@ekosmartdrive.in',
  salesEmail: 'sales@ekosmartdrive.in',
  plantAddress: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
  officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
  gstin: '08DTUPM4205B1Z0',
  website: 'www.ekosmartdrive.in',
  mapUrl: 'https://maps.google.com/?q=Kota,Rajasthan',
  dropdownOptions: [
    'Lithium Battery Solution (EBS)',
    'EV Spare Parts Wholesale/Retail',
    'Drive Rental Assistance',
    'Showroom & Dealership Inquiries',
    'Plant Commercial Warranty Inspection',
  ],
  divisionContacts: [
    {
      name: 'Lithium Battery Solution (EBS)',
      phone: '+91 8949049003',
      email: 'battery@ekosmartdrive.in',
      whatsapp: '+91 8949049003',
      inCharge: 'Lead Battery Diagnostic Engineer',
      officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
      address: 'Kota Central Plant - Testing Bay 1',
    },
    {
      name: 'EV Spare Parts Wholesale/Retail',
      phone: '+91 8949049003',
      email: 'parts@ekosmartdrive.in',
      whatsapp: '+91 8949049003',
      inCharge: 'Parts Logistics Manager',
      officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
      address: 'Kota Central Plant - Warehouse A',
    },
    {
      name: 'Drive Rental Assistance',
      phone: '+91 8949049003',
      email: 'rental@ekosmartdrive.in',
      whatsapp: '+91 8949049003',
      inCharge: 'Fleet Mobility Lead',
      officeHours: '24/7 Helpline Support',
      address: 'Kota Mobility Desk',
    },
    {
      name: 'Showroom & Dealership Inquiries',
      phone: '+91 8949049003',
      email: 'showroom@ekosmartdrive.in',
      whatsapp: '+91 8949049003',
      inCharge: 'Dealership Franchise Head',
      officeHours: '10:00 AM - 7:00 PM (Mon - Sat)',
      address: 'Kota Flagship Experience Center',
    },
  ],
  isPublished: true,
};

export const Contact = () => {
  const [cms, setCms] = useState<ContactCMSData>(defaultContactCMS);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    division: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.contactInfo) {
          const loaded = { ...defaultContactCMS, ...data.data.contactInfo };
          setCms(loaded);
          if (loaded.dropdownOptions && loaded.dropdownOptions.length > 0) {
            setFormData((prev) => ({ ...prev, division: prev.division || loaded.dropdownOptions[0] }));
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic CMS contact data, using defaults:', err);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      setErrorMessage('Please fill in your Name, Mobile Number, and Message.');
      return;
    }
    setSubmitted(true);
    setErrorMessage('');
  };

  // Find active division's contact details
  const activeDivisionContact: IDivisionContact | undefined =
    cms.divisionContacts?.find(
      (c) => c.name.trim().toLowerCase() === (formData.division || '').trim().toLowerCase()
    ) ||
    cms.divisionContacts?.find(
      (c) =>
        (formData.division || '').toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes((formData.division || '').toLowerCase())
    );

  const cleanHelpline = (cms.helplinePhone || '+918949049003').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (cms.whatsappNumber || cms.helplinePhone || '918949049003').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 py-4">
      {/* Header Banner (Soft-Coded from CMS) */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          <PhoneCall size={14} />
          <span>{cms.badgeText || 'Official Ekosmart Support & Contact Directory'}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {cms.heading || 'Get in Touch With Us'}
        </h1>

        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {cms.subheading ||
            'Need technical assistance with your Lithium-Ion / LFP battery pack, genuine EV spare parts, warranty verification, or showroom dealership inquiries? Our Kota Central Plant engineering team is here to help.'}
        </p>
      </div>

      {/* 4 Core Contact Cards Grid (Soft-Coded from CMS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Helpline & Alternate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition text-center space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <Phone size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Direct Helpline</h3>
            <p className="text-slate-500 text-xs">Customer support & battery technician hotline</p>
            <div className="space-y-1">
              <div className="font-mono font-bold text-emerald-700 text-sm">{cms.helplinePhone}</div>
              {cms.alternatePhone && (
                <div className="font-mono text-slate-500 text-[11px]">Alt: {cms.alternatePhone}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${cleanHelpline}`}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs transition block shadow-sm"
            >
              Call Now
            </a>
            {cms.whatsappNumber && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hi%20Ekosmart%20Support,%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare size={13} />
                <span>WhatsApp Us</span>
              </a>
            )}
          </div>
        </div>

        {/* Card 2: Email Support & Sales */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition text-center space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
              <Mail size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Official Email</h3>
            <p className="text-slate-500 text-xs">Direct technical query & corporate warranty inbox</p>
            <div className="space-y-1">
              <div className="font-mono font-bold text-blue-700 text-xs truncate">{cms.supportEmail}</div>
              {cms.salesEmail && (
                <div className="font-mono text-slate-500 text-[11px] truncate">Sales: {cms.salesEmail}</div>
              )}
            </div>
          </div>
          <a
            href={`mailto:${cms.supportEmail}`}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs transition block shadow-sm"
          >
            Send Email
          </a>
        </div>

        {/* Card 3: Central Plant */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition text-center space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto border border-purple-200 shadow-xs">
              <MapPin size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Manufacturing Plant</h3>
            <p className="text-slate-500 text-xs line-clamp-2">{cms.plantAddress}</p>
            <div className="font-bold text-purple-700 text-xs">Kota Central Facility</div>
          </div>
          <a
            href={cms.mapUrl || 'https://maps.google.com/?q=Kota,Rajasthan'}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>View on Map</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Card 4: Operating Hours */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition text-center space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
              <Clock size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Office & Plant Hours</h3>
            <p className="text-slate-500 text-xs">Technical dispatch & customer reception</p>
            <div className="font-bold text-amber-700 text-xs">{cms.officeHours}</div>
          </div>
          <div className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-full font-bold text-xs block">
            Mon - Sat (Sun Closed)
          </div>
        </div>
      </div>

      {/* Main Section: Interactive Form + Plant Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Company Dossier (Soft-coded from CMS) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 space-y-6 border border-slate-800 shadow-xl">
          <div className="space-y-3">
            <EbsLogo variant="battery" size="md" />
            <p className="text-slate-300 text-xs leading-relaxed pt-2">
              Ekosmart Battery Solution (EBS) & Ekosmart EV Spare Parts operates a state-of-the-art battery assembly, testing, and laboratory diagnostics facility in Kota, Rajasthan.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-5 space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Building2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Corporate Entity</span>
                <span className="font-semibold text-slate-100">Ekosmart Battery Solution (EBS)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCheck size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Government GSTIN Registration</span>
                <span className="font-mono font-bold text-emerald-400">{cms.gstin}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Plant & Service Center Address</span>
                <span className="text-slate-200 leading-relaxed block">
                  {cms.plantAddress}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Helpline & Alternate Phone</span>
                <span className="font-mono font-bold text-slate-100">{cms.helplinePhone}</span>
                {cms.alternatePhone && (
                  <span className="font-mono text-slate-400 block text-[11px] mt-0.5">Alt: {cms.alternatePhone}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Customer & Sales Email</span>
                <span className="font-mono text-slate-100 block">{cms.supportEmail}</span>
                {cms.salesEmail && (
                  <span className="font-mono text-slate-400 block text-[11px] mt-0.5">{cms.salesEmail}</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/60 rounded-2xl p-4 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-400 flex-shrink-0" />
            <span>Pan-India technical assistance, battery replacement logistics, and warranty coverage active.</span>
          </div>
        </div>

        {/* Right Column: Send Message / Inquiry Form with Soft-Coded Dropdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Send an Official Inquiry</h3>
            <p className="text-slate-500 text-xs mt-1">
              Have questions regarding dealership, bulk battery orders, or spare parts? Fill out the form below.
            </p>
          </div>

          {/* Quick Division Preset Chips */}
          {cms.dropdownOptions && cms.dropdownOptions.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-emerald-600" />
                <span>Quick Select Division / Concern:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {cms.dropdownOptions.map((opt) => {
                  const isSelected = (formData.division || cms.dropdownOptions[0]) === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, division: opt })}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Active Department Contact Card Callout */}
          {activeDivisionContact && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                    Direct Contact: {activeDivisionContact.name}
                  </h4>
                </div>
                {activeDivisionContact.inCharge && (
                  <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                    <UserCheck size={12} />
                    <span>{activeDivisionContact.inCharge}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeDivisionContact.phone && (
                  <div className="flex items-center gap-2 text-slate-700 bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <Phone size={14} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Helpline</span>
                      <a
                        href={`tel:${activeDivisionContact.phone.replace(/[^0-9+]/g, '')}`}
                        className="font-mono font-bold text-emerald-800 hover:underline"
                      >
                        {activeDivisionContact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {activeDivisionContact.email && (
                  <div className="flex items-center gap-2 text-slate-700 bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <Mail size={14} className="text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Department Email</span>
                      <a
                        href={`mailto:${activeDivisionContact.email}`}
                        className="font-mono font-bold text-blue-800 hover:underline truncate block text-xs"
                      >
                        {activeDivisionContact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {activeDivisionContact.whatsapp && (
                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-800">
                    Fastest response via WhatsApp: <b className="font-mono">{activeDivisionContact.whatsapp}</b>
                  </span>
                  <a
                    href={`https://wa.me/${activeDivisionContact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Ekosmart%20${encodeURIComponent(activeDivisionContact.name)},%20I%20have%20an%20inquiry.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-emerald-900">Inquiry Received!</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you, <b>{formData.name}</b>. Our customer response team in Kota has received your message regarding{' '}
                <b>{formData.division}</b> and will contact you at <b>{formData.mobile}</b> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    mobile: '',
                    email: '',
                    division: cms.dropdownOptions[0] || 'Battery',
                    subject: '',
                    message: '',
                  });
                }}
                className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sajid Khan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. 9549730483"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="saji@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* SOFT-CODED DROPDOWN MENU FROM CMS */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Concern Division (Soft-Coded)
                  </label>
                  <select
                    value={formData.division || (cms.dropdownOptions[0] || '')}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {cms.dropdownOptions && cms.dropdownOptions.length > 0 ? (
                      cms.dropdownOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))
                    ) : (
                      <option value="General Support">General Support</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Inquiring about 60V 32Ah battery pack or spare parts price list"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide your query or technical issue details here..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>SUBMIT INQUIRY TO KOTA PLANT</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
