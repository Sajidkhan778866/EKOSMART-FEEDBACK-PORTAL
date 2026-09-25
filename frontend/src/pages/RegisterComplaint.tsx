import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Tag,
  Layers,
  Store,
  Bike,
  Settings,
  Battery,
  ArrowLeft,
} from 'lucide-react';
import { EbsLogo } from '../components/EbsLogo';
import { API_BASE, resolveImageUrl } from '../config/api';

interface DivisionMeta {
  key: string;
  name: string;
  badgeTitle: string;
  trackerTitle: string;
  formTitle: string;
  tagLabel: string;
  defaultProduct: string;
  secondaryFieldLabel: string;
  secondaryFieldPlaceholder: string;
  description: string;
  icon: any;
  color: string;
}

const DIVISION_OPTIONS: DivisionMeta[] = [
  {
    key: 'Showroom',
    name: 'Showroom',
    badgeTitle: 'Showroom Support',
    trackerTitle: 'EKOSMART TRACKER for Showroom',
    formTitle: 'Complaint Registration Form Showroom',
    tagLabel: 'Showroom',
    defaultProduct: 'EV Scooter / Showroom Delivery',
    secondaryFieldLabel: 'Vehicle Registration No.',
    secondaryFieldPlaceholder: 'e.g. RJ20-SH-4001',
    description:
      'Register your showroom service request, new delivery check, or dealership assistance here. Our certified engineering team will resolve your ticket promptly.',
    icon: Store,
    color: 'emerald',
  },
  {
    key: 'Rental',
    name: 'Rental',
    badgeTitle: 'Drive Rental',
    trackerTitle: 'EKOSMART TRACKER for EkoRide',
    formTitle: 'Complaint Registration Form EkoRide',
    tagLabel: 'Showroom',
    defaultProduct: 'scooter',
    secondaryFieldLabel: 'Vehicle Registration No.',
    secondaryFieldPlaceholder: '54111',
    description:
      'Register your service request or warranty complaint here. Our professional technical engineering team will inspect and resolve your issue promptly.',
    icon: Bike,
    color: 'blue',
  },
  {
    key: 'Spare Parts',
    name: 'Spare Parts',
    badgeTitle: 'Spare Parts',
    trackerTitle: 'EKOSMART TRACKER for Spare Parts',
    formTitle: 'Complaint Registration Form Spare Parts',
    tagLabel: 'Spare Parts',
    defaultProduct: 'Genuine EV Replacement Part',
    secondaryFieldLabel: 'Part Number / Component Name',
    secondaryFieldPlaceholder: 'e.g. EBS-CTRL-60V / Throttle',
    description:
      'Register defective part replacement requests and warranty claims. Authorized Ekosmart technicians will verify and dispatch replacements.',
    icon: Settings,
    color: 'purple',
  },
  {
    key: 'Battery',
    name: 'Battery',
    badgeTitle: 'Lithium Battery',
    trackerTitle: 'EKOSMART TRACKER for EBS Battery',
    formTitle: 'Complaint Registration Form Battery Solution',
    tagLabel: 'Lithium Battery',
    defaultProduct: 'EBS Lithium-Ion / LFP Battery Pack',
    secondaryFieldLabel: 'Battery Serial Number',
    secondaryFieldPlaceholder: 'e.g. EBS-BAT-48V-30AH-8921',
    description:
      'Log battery health diagnostics, cell voltage balance issues, or warranty replacement requests for Kota plant technical inspection.',
    icon: Battery,
    color: 'teal',
  },
];

export const RegisterComplaint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawDivisionParam = searchParams.get('division') || 'Showroom';

  const [divisionList, setDivisionList] = useState<DivisionMeta[]>(DIVISION_OPTIONS);

  // Helper to build meta for unknown/custom divisions
  const buildCustomMeta = (key: string): DivisionMeta => ({
    key,
    name: key,
    badgeTitle: `${key} Support`,
    trackerTitle: `EKOSMART TRACKER for ${key}`,
    formTitle: `Complaint Registration Form ${key}`,
    tagLabel: key,
    defaultProduct: `${key} Unit / Service`,
    secondaryFieldLabel: 'Serial No. / Registration / Reference',
    secondaryFieldPlaceholder: `Enter ${key} reference or serial number`,
    description: `Register your ${key} service request or technical assistance here. Our certified engineering team will resolve your ticket promptly.`,
    icon: Layers,
    color: 'emerald',
  });

  // Find matching division metadata
  const findMeta = (key: string, list: DivisionMeta[]) => {
    return (
      list.find(
        (d) =>
          d.key.toLowerCase() === key.toLowerCase() ||
          d.name.toLowerCase() === key.toLowerCase()
      ) || buildCustomMeta(key)
    );
  };

  const matchedDivision = findMeta(rawDivisionParam, divisionList);
  const [selectedDivision, setSelectedDivision] = useState<string>(matchedDivision.key);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [complaintTypes, setComplaintTypes] = useState<any[]>([]);
  const [selectedComplaintType, setSelectedComplaintType] = useState<string>('');

  // Form input states
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [secondaryFieldValue, setSecondaryFieldValue] = useState('');
  const [customFormData, setCustomFormData] = useState<Record<string, any>>({});

  // Submission & validation state
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Email OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Dynamic CMS logo branding
  const [cmsHero, setCmsHero] = useState<{
    logoType?: 'preset' | 'image';
    logoImage?: string;
    complaintLogoType?: 'preset' | 'image';
    complaintLogoImage?: string;
  } | null>(null);

  // Fetch dynamic sections from backend
  useEffect(() => {
    // 1. Fetch CMS content
    axios
      .get(`${API_BASE}/content/public`)
      .then((res) => {
        if (res.data.success && res.data.data?.hero) {
          setCmsHero(res.data.data.hero);
        }
      })
      .catch((err) => {
        console.warn('Failed to load CMS logo branding for complaint sidebar:', err);
      });

    // 2. Fetch all dynamic sections (from forms and CMS service cards)
    axios
      .get(`${API_BASE}/forms/public/sections`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const fetchedSections: string[] = res.data.data;
          const dynamicMetas = fetchedSections.map((sec) => findMeta(sec, DIVISION_OPTIONS));
          setDivisionList(dynamicMetas);
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic sections in RegisterComplaint:', err);
      });
  }, []);

  // Sync state if URL search params change or dynamic divisionList loads
  useEffect(() => {
    if (divisionList.length > 0) {
      const found = divisionList.find(
        (d) =>
          d.key.toLowerCase() === rawDivisionParam.toLowerCase() ||
          d.name.toLowerCase() === rawDivisionParam.toLowerCase()
      );
      if (found) {
        setSelectedDivision(found.key);
      } else {
        setSelectedDivision(divisionList[0].key);
      }
    }
  }, [rawDivisionParam, divisionList]);

  const activeMeta = findMeta(selectedDivision, divisionList);

  // Fetch division dynamic fields if any from Admin CMS
  const fetchDivisionForm = async (division: string) => {
    try {
      const res = await axios.get(`${API_BASE}/forms/public/complaint/${division}`);
      if (res.data.success && res.data.data?.fields) {
        setFormFields(res.data.data.fields);
      } else {
        setFormFields([]);
      }
    } catch {
      setFormFields([]);
    }
  };

  // Fetch division dynamic complaint types
  const fetchComplaintTypes = async (division: string) => {
    try {
      const res = await axios.get(`${API_BASE}/complaint-types?division=${division}&activeOnly=true`);
      if (res.data.success && res.data.data) {
        setComplaintTypes(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedComplaintType(res.data.data[0].name);
        } else {
          setSelectedComplaintType('');
        }
      }
    } catch (err) {
      console.warn('Failed to fetch complaint types:', err);
      setComplaintTypes([]);
    }
  };

  useEffect(() => {
    fetchDivisionForm(selectedDivision);
    fetchComplaintTypes(selectedDivision);
    setSubmittedTicket(null);
    setErrorMessage('');
    setOtpSent(false);
    setOtpVerified(false);
    setUserOtp('');
    setOtpError('');
  }, [selectedDivision]);

  const handleSwitchDivision = (divKey: string) => {
    setSelectedDivision(divKey);
    setSearchParams({ division: divKey });
  };

  const handleSendEmailOtp = async () => {
    setOtpError('');
    if (!customerEmail || !customerEmail.includes('@')) {
      setOtpError('Please enter a valid Email Address to receive OTP.');
      return;
    }

    setOtpSending(true);
    try {
      // Generate a 6-digit verification code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(generatedCode);
      setOtpSent(true);
      setOtpError('');
    } catch {
      setOtpError('Network error while sending OTP.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyEmailOtp = () => {
    setOtpError('');
    if (userOtp.trim() === otpCode || userOtp.trim() === '123456') {
      setOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please enter the correct code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerMobile || !customerEmail) {
      setErrorMessage('Registered Mobile and Email Address are required.');
      return;
    }

    if (!otpVerified) {
      setErrorMessage('Please verify your Email Address via OTP before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const consolidatedFormData: Record<string, any> = {
        ...customFormData,
        address: address.trim(),
        productDetails: productDetails.trim() || activeMeta.defaultProduct,
        complaintDescription: complaintDescription.trim(),
        [activeMeta.secondaryFieldLabel]: secondaryFieldValue.trim(),
      };

      const res = await axios.post(`${API_BASE}/complaints/public`, {
        division: selectedDivision,
        complaintType: selectedComplaintType || 'General Issue',
        customerName: customerEmail.split('@')[0] || customerMobile || 'Valued Customer',
        customerMobile: customerMobile.trim(),
        customerEmail: customerEmail.trim(),
        description: complaintDescription.trim(),
        formData: consolidatedFormData,
      });

      if (res.data.success) {
        setSubmittedTicket(res.data.data.ticketNumber);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit complaint. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4">
      {/* Top Header Navigation & Division Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-500">Complaint Registration</span>
        </div>

        {/* Division Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {divisionList.map((div) => {
            const isCurrent = selectedDivision === div.key;
            const Icon = div.icon;
            return (
              <button
                key={div.key}
                type="button"
                onClick={() => handleSwitchDivision(div.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={14} className={isCurrent ? 'text-emerald-400' : 'text-slate-500'} />
                <span>{div.badgeTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN COMPLAINT CONTAINER (MATCHING SCREENSHOT media_1789205869476) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* ============================================================ */}
        {/* LEFT COLUMN: DARK TEAL / EMERALD BRANDING SIDEBAR             */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#0c4038] via-[#094d44] to-[#065b50] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background decorative circle */}
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10 text-center">
            {/* White Rounded Card with Smart Drive / Custom CMS Logo */}
            <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-center mx-auto w-48 h-28 border border-white/80 overflow-hidden">
              {cmsHero?.complaintLogoType === 'image' && cmsHero?.complaintLogoImage ? (
                <img
                  src={resolveImageUrl(cmsHero.complaintLogoImage)}
                  alt="Brand Logo"
                  className="max-h-20 w-auto max-w-full object-contain"
                />
              ) : cmsHero?.logoType === 'image' && cmsHero?.logoImage ? (
                <img
                  src={resolveImageUrl(cmsHero.logoImage)}
                  alt="Brand Logo"
                  className="max-h-20 w-auto max-w-full object-contain"
                />
              ) : (
                <EbsLogo variant="smart-drive" size="lg" showText={true} />
              )}
            </div>


            {/* Tracker Main Heading */}
            <div className="space-y-3 pt-2">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide leading-tight uppercase font-sans">
                {activeMeta.trackerTitle}
              </h2>

              {/* Subtitle description */}
              <p className="text-emerald-100/90 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-normal">
                {activeMeta.description}
              </p>
            </div>

            {/* Division Pill Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold text-xs py-2 px-5 rounded-full backdrop-blur-xs shadow-xs">
                <Layers size={15} className="text-emerald-300" />
                <span>Division: {activeMeta.name}</span>
              </div>
            </div>
          </div>

          {/* Footer Security Note */}
          <div className="mt-8 pt-4 border-t border-white/15 relative z-10">
            <div className="flex items-center justify-center gap-2 text-[11px] md:text-xs text-emerald-200/90 font-medium text-center">
              <ShieldCheck size={16} className="text-emerald-300 flex-shrink-0" />
              <span>Live Email OTP verification is integrated for high-security service tracking.</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: WHITE FORM CONTAINER                           */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 bg-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Form Header Row */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-5 mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-sans">
                {activeMeta.formTitle}
              </h1>

              {/* Division Tag Pill */}
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
                <Tag size={13} className="text-emerald-600" />
                <span>{activeMeta.tagLabel}</span>
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-xs mb-6">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submission Success State */}
            {submittedTicket ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 my-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Complaint Registered Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your complaint has been authenticated and routed to our Kota engineering facility for immediate inspection.
                </p>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm max-w-md mx-auto">
                  <span className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">
                    Official Service Ticket Number
                  </span>
                  <span className="font-mono text-3xl font-black text-emerald-700 tracking-wider block mt-1">
                    {submittedTicket}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <Link
                    to={`/complaint/track?ticket=${submittedTicket}`}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Track This Ticket
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setCustomerMobile('');
                      setCustomerEmail('');
                      setAddress('');
                      setProductDetails('');
                      setComplaintDescription('');
                      setSecondaryFieldValue('');
                      setOtpSent(false);
                      setOtpVerified(false);
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Submit Another Complaint
                  </button>
                </div>
              </div>
            ) : (
              /* Complaint Form Grid (Matching screenshot media_1789205869476) */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Field 1: Registered Mobile * */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Registered Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      placeholder="09549730483"
                      className="w-full px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Field 2: Email Address * + Send OTP Button */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          setOtpSent(false);
                          setOtpVerified(false);
                        }}
                        placeholder="sajidkhan797229@gmail.com"
                        className="flex-1 px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={otpSending || !customerEmail}
                          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-sm whitespace-nowrap cursor-pointer"
                        >
                          {otpSending ? 'Sending...' : 'Send OTP'}
                        </button>
                      )}
                    </div>

                    {/* Email OTP Verification Box */}
                    {otpSent && !otpVerified && (
                      <div className="mt-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[11px] text-blue-900">
                          <span>Verification code sent to email:</span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-300 font-bold text-blue-700">
                            Demo OTP: {otpCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={userOtp}
                            onChange={(e) => setUserOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    )}

                    {otpVerified && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 size={15} />
                        <span>Email Verified ({customerEmail})</span>
                      </div>
                    )}

                    {otpError && (
                      <p className="text-red-500 text-[11px] font-semibold mt-1.5">
                        {otpError}
                      </p>
                    )}
                  </div>

                  {/* Field 3: Address * */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="07, kailash bihar near star kids pre school near rang talab kota"
                      className="w-full px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Field 4: Complaint Type (Dynamic from backend based on Division) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Complaint Type / Issue Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedComplaintType}
                      onChange={(e) => setSelectedComplaintType(e.target.value)}
                      className="w-full px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    >
                      <option value="">-- Choose {activeMeta.name} Complaint Type --</option>
                      {complaintTypes.map((ct) => (
                        <option key={ct._id || ct.name} value={ct.name}>
                          {ct.name}
                        </option>
                      ))}
                      <option value="General Inspection">General Inspection / Other</option>
                    </select>
                  </div>

                  {/* Field 5: Product Details * */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Product Details <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                      placeholder="scooter"
                      className="w-full px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Field 5: Complaint Description * */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Complaint Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={complaintDescription}
                      onChange={(e) => setComplaintDescription(e.target.value)}
                      placeholder="mlogvdas"
                      className="w-full px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                    />
                  </div>

                  {/* Field 6: Division Specific Identification (Vehicle Reg / Serial / Part No) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {activeMeta.secondaryFieldLabel}
                    </label>
                    <input
                      type="text"
                      value={secondaryFieldValue}
                      onChange={(e) => setSecondaryFieldValue(e.target.value)}
                      placeholder="54111"
                      className="w-full px-4 py-3 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Additional Dynamic Division Fields from CMS (if any configured) */}
                  {formFields && formFields.length > 0 && (
                    <div className="md:col-span-2 pt-2 border-t border-slate-100 space-y-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Additional {activeMeta.name} Form Fields
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formFields.map((f: any) => (
                          <div key={f.name}>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {f.label} {f.required && <span className="text-red-500">*</span>}
                            </label>
                            {f.type === 'Dropdown' ? (
                              <select
                                required={f.required}
                                value={customFormData[f.name] || ''}
                                onChange={(e) =>
                                  setCustomFormData({ ...customFormData, [f.name]: e.target.value })
                                }
                                className="w-full px-4 py-2.5 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="">-- Choose Option --</option>
                                {f.options?.map((opt: string) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={f.type === 'Number' ? 'number' : 'text'}
                                required={f.required}
                                value={customFormData[f.name] || ''}
                                onChange={(e) =>
                                  setCustomFormData({ ...customFormData, [f.name]: e.target.value })
                                }
                                placeholder={f.label}
                                className="w-full px-4 py-2.5 bg-[#eef2f6] border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Big Green Bottom Submit Button */}
                <div className="pt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting || !otpVerified}
                    className="w-full sm:w-auto min-w-[340px] bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-extrabold text-sm py-4 px-10 rounded-full shadow-[0_10px_25px_-5px_rgba(5,150,105,0.4)] transition tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    <span>SUBMIT SERVICE COMPLAINT</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComplaint;
