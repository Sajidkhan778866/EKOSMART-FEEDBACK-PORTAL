import { useState, useEffect } from 'react';
import {
  LayoutTemplate,
  CreditCard,
  FileText,
  Shield,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Phone,
  Building2,
  List,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Sparkles,
  Copy,
  Tag,
  Filter,
  CheckCircle2,
  Layers,
  Zap,
  Battery,
  Bike,
  Store,
  Settings,
  Search,
  ShieldCheck,
  ShieldAlert,
  Truck,
  Wrench,
  HelpCircle,
  Activity,
  Package,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  UserCheck,
  MapPin,
  Clock,
} from 'lucide-react';
import { contentApi, API_BASE_URL } from '../api/client';

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5003';

interface IServiceCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  section?: string;
  badge?: string;
  features?: string[];
  linkUrl: string;
  buttonText: string;
  color: string;
  icon: string;
  iconType?: 'icon' | 'image';
  iconImage?: string;
  bgType?: 'color' | 'image';
  bgImage?: string;
  bgOverlayOpacity?: number;
  isVisible: boolean;
  order: number;
}

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

interface ICMSContent {
  hero: {
    heading: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    logoType?: 'preset' | 'image';
    logoImage?: string;
    complaintLogoType?: 'preset' | 'image';
    complaintLogoImage?: string;
  };
  serviceCards: IServiceCard[];
  footer: {
    companyName: string;
    copyrightText: string;
    disclaimer: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    gstin?: string;
    officeHours?: string;
    showPrivacyPolicy: boolean;
    showTermsConditions: boolean;
    showRefundPolicy: boolean;
    logoType?: 'preset' | 'image';
    logoImage?: string;
  };
  privacyPolicy: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  termsConditions: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  refundPolicy: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  contactInfo: {
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
  };
}

const AVAILABLE_ICONS = [
  'Store',
  'Bike',
  'Settings',
  'Battery',
  'FileText',
  'Search',
  'ShieldCheck',
  'ShieldAlert',
  'Truck',
  'Wrench',
  'Zap',
  'Package',
  'Phone',
  'Activity',
  'HelpCircle',
];

const AVAILABLE_COLORS = [
  { label: 'Emerald / Green', value: 'emerald' },
  { label: 'Blue', value: 'blue' },
  { label: 'Amber / Orange', value: 'amber' },
  { label: 'Purple / Violet', value: 'purple' },
  { label: 'Indigo', value: 'indigo' },
  { label: 'Teal', value: 'teal' },
  { label: 'Rose / Red', value: 'rose' },
  { label: 'Cyan', value: 'cyan' },
  { label: 'Slate / Dark Gray', value: 'slate' },
];

const STANDARD_SECTIONS = ['Showroom', 'Rental', 'Spare Parts', 'Battery', 'Warranty', 'General'];

const QUICK_LINK_PRESETS = [
  { label: 'Showroom Ticket', url: '/complaint/register?division=Showroom' },
  { label: 'Rental Ticket', url: '/complaint/register?division=Rental' },
  { label: 'Spare Parts Ticket', url: '/complaint/register?division=Spare%20Parts' },
  { label: 'Battery Ticket', url: '/complaint/register?division=Battery' },
  { label: 'Check Warranty', url: '/warranty/check' },
  { label: 'Register Warranty', url: '/warranty/register' },
  { label: 'Track Ticket', url: '/complaint/track' },
  { label: 'Contact Us', url: '/contact' },
];

const defaultFallbackContent: ICMSContent = {
  hero: {
    heading: 'Ekosmart Battery Solution (EBS)\nHigh Power Lithium-Ion & LFP Battery Packs',
    subheading: 'High Charging Power • Long Life • Low Maintenance. Official customer support portal for EV scooter & E-rickshaw batteries, genuine spare parts, and warranty verification.',
    primaryButtonText: 'Register Complaint',
    primaryButtonLink: '/complaint/register',
    secondaryButtonText: 'Check Battery Warranty',
    secondaryButtonLink: '/warranty/check',
    logoType: 'preset',
    logoImage: '',
    complaintLogoType: 'preset',
    complaintLogoImage: '',
  },
  serviceCards: [
    {
      id: 'div-showroom',
      title: 'Showroom Support',
      subtitle: 'EV Sales & Dealership Network',
      description: 'Sales, dealership service inquiries, and new EV vehicle delivery assistance',
      section: 'Showroom',
      badge: 'NEW BOOKINGS',
      features: ['EV Vehicle Registration', 'Dealership Franchise Support', 'Test Drive & Delivery Assistance'],
      linkUrl: '/complaint/register?division=Showroom',
      buttonText: 'Select Showroom',
      color: 'emerald',
      icon: 'Store',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 1,
    },
    {
      id: 'div-rental',
      title: 'Drive Rental',
      subtitle: 'Daily & Monthly EV Mobility',
      description: 'EV scooter booking assistance, battery swaps, and rider issue reports.',
      section: 'Rental',
      badge: 'FLEXIBLE PLANS',
      features: ['Quick Battery Swap Network', 'Flexible Daily/Monthly Subscriptions', '24/7 Roadside Assistance'],
      linkUrl: '/complaint/register?division=Rental',
      buttonText: 'Select Rental',
      color: 'blue',
      icon: 'Bike',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 2,
    },
    {
      id: 'div-spare-parts',
      title: 'Spare Parts',
      subtitle: 'OEM Components & Accessories',
      description: 'Genuine Ekosmart replacement parts and warranty claim ticket logs',
      section: 'Spare Parts',
      badge: 'GENUINE OEM',
      features: ['Aluminium Fast Chargers (67.2V/72V)', 'Smart BMS & Harness Kits', 'Motor, Controller & Throttle Units'],
      linkUrl: '/complaint/register?division=Spare%20Parts',
      buttonText: 'Select Parts',
      color: 'purple',
      icon: 'Settings',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 3,
    },
    {
      id: 'div-battery',
      title: 'Lithium Battery',
      subtitle: 'High Performance LFP & Li-Ion',
      description: 'Battery health diagnostics, cell voltage inspection, and AMC requests',
      section: 'Battery',
      badge: '3-YEAR WARRANTY',
      features: ['48V / 60V / 72V Custom Packs', 'State-of-Health (SoH) Diagnostic', 'Kota Plant Rapid Repair / Swap'],
      linkUrl: '/complaint/register?division=Battery',
      buttonText: 'Select Battery',
      color: 'teal',
      icon: 'Battery',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 4,
    },
  ],
  footer: {
    companyName: 'Ekosmart Battery Solution (EBS) & EV Spare Parts',
    copyrightText: '2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0',
    disclaimer: 'Official customer support, complaint tracking & battery warranty verification portal',
    address: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
    phone: '+91 8949049003',
    email: 'support@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
    showPrivacyPolicy: true,
    showTermsConditions: true,
    showRefundPolicy: true,
    logoType: 'preset',
    logoImage: '',
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    content: 'When you register a service complaint or product warranty on the Ekosmart Platform, we collect necessary personal details including your name, contact mobile number, email address, product serial number, and invoice details. Your information is used strictly to authenticate service requests via Email OTP, schedule inspections with authorized technical engineers, validate warranty validity for Showroom and Plant sales, and provide real-time ticket tracking updates. We implement strict database access controls and industry-standard encryption protocols.',
    isPublished: true,
  },
  termsConditions: {
    title: 'Terms & Conditions',
    content: 'By submitting a complaint or warranty registration on this portal, you confirm that all details provided (serial number, bill number, and issue descriptions) are accurate and authentic. Service complaints are categorized and handled under four designated divisions: Battery, Rental, Showroom, and Spare Parts. Warranty claims for commercial units fall under the Plant category. All registered warranties are subject to physical inspection by our certified engineers.',
    isPublished: true,
  },
  refundPolicy: {
    title: 'Refund & Replacement Policy',
    content: 'Defective battery cells and genuine spare parts verified under valid active warranty will be repaired or replaced free of charge by authorized Ekosmart service engineers within standard SLA timelines. Security deposits for EV rental plans are refunded to the original payment source within 5-7 business days following vehicle return and technical handover clearance.',
    isPublished: true,
  },
  contactInfo: {
    heading: 'We are here to support your green journey',
    subheading: 'Whether you need technical support for battery packs, spare parts dispatch, dealership queries, or rental assistance, our engineering and support teams in Kota are ready to assist you.',
    badgeText: 'GET IN TOUCH WITH US',
    helplinePhone: '+91 8949049003',
    alternatePhone: '+91 9549730483',
    whatsappNumber: '+91 8949049003',
    supportEmail: 'support@ekosmartdrive.in',
    salesEmail: 'sales@ekosmartdrive.in',
    plantAddress: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
    officeHours: 'Mon - Sat: 10:00 AM - 6:30 PM',
    gstin: '08DTUPM4205B1Z0',
    website: 'www.ekosmartdrive.in',
    mapUrl: 'https://maps.google.com/?q=Kota,Rajasthan',
    dropdownOptions: [
      'Lithium Battery Solution (EBS)',
      'EV Spare Parts Wholesale/Retail',
      'Drive Rental Assistance',
      'Showroom & Dealership Inquiries',
      'Plant Commercial Warranty Inspection',
      'Accounts / Invoice Query',
      'Other General Inquiry',
    ],
    divisionContacts: [
      {
        id: 'div-con-battery',
        name: 'Lithium Battery Solution (EBS)',
        phone: '+91 8949049003',
        email: 'battery@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Lead Battery Diagnostic Engineer',
        officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
      },
      {
        id: 'div-con-parts',
        name: 'EV Spare Parts Wholesale/Retail',
        phone: '+91 8949049003',
        email: 'parts@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Parts Logistics Manager',
        officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
      },
      {
        id: 'div-con-rental',
        name: 'Drive Rental Assistance',
        phone: '+91 8949049003',
        email: 'rental@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Fleet Mobility Lead',
        officeHours: '24/7 Helpline Support',
      },
      {
        id: 'div-con-showroom',
        name: 'Showroom & Dealership Inquiries',
        phone: '+91 8949049003',
        email: 'showroom@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Dealership Franchise Head',
        officeHours: '10:00 AM - 7:00 PM',
      },
      {
        id: 'div-con-warranty',
        name: 'Plant Commercial Warranty Inspection',
        phone: '+91 8949049003',
        email: 'warranty@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Chief Quality Inspector',
        officeHours: '10:00 AM - 6:00 PM',
      },
    ],
    isPublished: true,
  },
};

const renderLivePreviewIcon = (card: IServiceCard) => {
  if (card.iconType === 'image' && card.iconImage) {
    return <img src={card.iconImage} alt={card.title} className="w-8 h-8 object-contain mx-auto" />;
  }
  const iconProps = { className: 'w-7 h-7 mx-auto' };
  switch (card.icon?.toLowerCase()) {
    case 'store':
    case 'showroom':
      return <Store {...iconProps} />;
    case 'bike':
    case 'scooter':
      return <Bike {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'battery':
      return <Battery {...iconProps} />;
    case 'wrench':
      return <Wrench {...iconProps} />;
    case 'truck':
      return <Truck {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'shieldcheck':
      return <ShieldCheck {...iconProps} />;
    case 'shieldalert':
      return <ShieldAlert {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'helpcircle':
      return <HelpCircle {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getCardPreviewTheme = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'emerald':
    case 'green':
      return {
        cardBg: 'bg-[#16a34a]',
        btnText: 'text-[#15803d]',
        badgeBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-400/40',
        iconColor: 'text-[#16a34a]',
      };
    case 'blue':
      return {
        cardBg: 'bg-[#2563eb]',
        btnText: 'text-[#1e40af]',
        badgeBg: 'bg-blue-900/60 text-blue-200 border-blue-400/40',
        iconColor: 'text-[#2563eb]',
      };
    case 'purple':
    case 'violet':
      return {
        cardBg: 'bg-[#7c3aed]',
        btnText: 'text-[#581c87]',
        badgeBg: 'bg-purple-900/60 text-purple-200 border-purple-400/40',
        iconColor: 'text-[#7c3aed]',
      };
    case 'amber':
    case 'orange':
      return {
        cardBg: 'bg-[#d97706]',
        btnText: 'text-[#b45309]',
        badgeBg: 'bg-amber-900/60 text-amber-200 border-amber-400/40',
        iconColor: 'text-[#d97706]',
      };
    case 'teal':
      return {
        cardBg: 'bg-[#0f766e]',
        btnText: 'text-[#115e59]',
        badgeBg: 'bg-teal-900/60 text-teal-200 border-teal-400/40',
        iconColor: 'text-[#0f766e]',
      };
    case 'indigo':
      return {
        cardBg: 'bg-[#4f46e5]',
        btnText: 'text-[#4338ca]',
        badgeBg: 'bg-indigo-900/60 text-indigo-200 border-indigo-400/40',
        iconColor: 'text-[#4f46e5]',
      };
    case 'rose':
    case 'red':
      return {
        cardBg: 'bg-[#e11d48]',
        btnText: 'text-[#be123c]',
        badgeBg: 'bg-rose-900/60 text-rose-200 border-rose-400/40',
        iconColor: 'text-[#e11d48]',
      };
    case 'cyan':
      return {
        cardBg: 'bg-[#0891b2]',
        btnText: 'text-[#0e7490]',
        badgeBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-400/40',
        iconColor: 'text-[#0891b2]',
      };
    case 'slate':
    default:
      return {
        cardBg: 'bg-[#334155]',
        btnText: 'text-[#1e293b]',
        badgeBg: 'bg-slate-900/60 text-slate-200 border-slate-400/40',
        iconColor: 'text-[#334155]',
      };
  }
};

const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = (e) => resolve((e.target?.result as string) || '');
      r.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  });
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'hero' | 'policies' | 'footer' | 'contact'>('cards');
  const [content, setContent] = useState<ICMSContent>(defaultFallbackContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newDropdownOption, setNewDropdownOption] = useState<string>('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [featureDrafts, setFeatureDrafts] = useState<{ [cardId: string]: string }>({});
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null);

  const getDivisionContact = (optName: string): IDivisionContact => {
    const existing = (content.contactInfo?.divisionContacts || []).find(
      (c) => c.name.trim().toLowerCase() === optName.trim().toLowerCase()
    );
    if (existing) return existing;
    return {
      name: optName,
      phone: content.contactInfo?.helplinePhone || '+91 8949049003',
      email: content.contactInfo?.supportEmail || 'support@ekosmartdrive.in',
      whatsapp: content.contactInfo?.whatsappNumber || '+91 8949049003',
      inCharge: 'Department In-Charge',
      officeHours: content.contactInfo?.officeHours || '10:00 AM - 6:30 PM (Mon - Sat)',
    };
  };

  const updateDivisionContact = (optName: string, field: keyof IDivisionContact, value: string) => {
    const currentList = [...(content.contactInfo?.divisionContacts || [])];
    const idx = currentList.findIndex((c) => c.name.trim().toLowerCase() === optName.trim().toLowerCase());
    if (idx >= 0) {
      currentList[idx] = { ...currentList[idx], [field]: value };
    } else {
      currentList.push({
        ...getDivisionContact(optName),
        [field]: value,
      });
    }
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        divisionContacts: currentList,
      },
    });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const normalizeServiceCards = (cards: IServiceCard[]) => {
    return (cards || []).map((card, idx) => {
      let section = card.section;
      if (!section || section === 'General') {
        const lower = `${card.id} ${card.title}`.toLowerCase();
        if (lower.includes('showroom')) section = 'Showroom';
        else if (lower.includes('rental')) section = 'Rental';
        else if (lower.includes('spare') || lower.includes('parts')) section = 'Spare Parts';
        else if (lower.includes('battery')) section = 'Battery';
        else if (lower.includes('warranty')) section = 'Warranty';
        else section = section || 'General';
      }
      return { ...card, section, order: card.order || idx + 1 };
    });
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getAdmin();
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setContent({
          ...defaultFallbackContent,
          ...d,
          serviceCards: normalizeServiceCards(d.serviceCards || defaultFallbackContent.serviceCards),
          contactInfo: d.contactInfo ? { ...defaultFallbackContent.contactInfo, ...d.contactInfo } : defaultFallbackContent.contactInfo,
        });
      }
    } catch (err: any) {
      console.warn('Admin content fetch failed, trying public fallback:', err);
      try {
        const pubRes = await fetch(`${API_BASE_URL}/content/public`);
        const pubData = await pubRes.json();
        if (pubData.success && pubData.data) {
          const pd = pubData.data;
          setContent({
            hero: pd.hero || defaultFallbackContent.hero,
            serviceCards: normalizeServiceCards(pd.serviceCards || defaultFallbackContent.serviceCards),
            footer: pd.footer || defaultFallbackContent.footer,
            privacyPolicy: pd.privacyPolicy || defaultFallbackContent.privacyPolicy,
            termsConditions: pd.termsConditions || defaultFallbackContent.termsConditions,
            refundPolicy: pd.refundPolicy || defaultFallbackContent.refundPolicy,
            contactInfo: pd.contactInfo ? { ...defaultFallbackContent.contactInfo, ...pd.contactInfo } : defaultFallbackContent.contactInfo,
          });
        }
      } catch (fallbackErr) {
        console.error('Failed to load fallback CMS content:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      setSaving(true);
      setNotification(null);
      const res = await contentApi.updateAdmin(content);
      if (res.data.success) {
        setContent(res.data.data);
        setNotification({
          type: 'success',
          message: 'Soft-coded CMS content successfully saved & updated across portal!',
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: 'error',
          message: res.data.message || 'Failed to save CMS changes',
        });
      }
    } catch (err: any) {
      console.error('Failed to save CMS changes:', err);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 413
          ? 'Uploaded image files are too large. Please upload smaller images.'
          : err.response?.status === 401
          ? 'Admin session expired. Please log in again.'
          : err.message || 'Failed to save CMS changes');
      setNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  // Card Handlers
  const handleAddCard = (sectionPreset?: string) => {
    if (!content) return;
    const targetSection = sectionPreset && sectionPreset !== 'all' ? sectionPreset : 'General';
    const newCard: IServiceCard = {
      id: `card-${Date.now()}`,
      title: 'New Service Card',
      subtitle: `${targetSection} Services`,
      description: 'Add a helpful description for this customer action or support service.',
      section: targetSection,
      badge: 'NEW',
      features: ['24/7 Dedicated Support', 'Fast Resolution SLA'],
      linkUrl: `/complaint/register?division=${encodeURIComponent(targetSection)}`,
      buttonText: 'Get Started',
      color: targetSection === 'Battery' ? 'teal' : targetSection === 'Rental' ? 'blue' : targetSection === 'Spare Parts' ? 'purple' : targetSection === 'Showroom' ? 'emerald' : 'emerald',
      icon: targetSection === 'Battery' ? 'Battery' : targetSection === 'Rental' ? 'Bike' : targetSection === 'Spare Parts' ? 'Settings' : targetSection === 'Showroom' ? 'Store' : 'FileText',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: content.serviceCards.length + 1,
    };
    setContent({
      ...content,
      serviceCards: [...content.serviceCards, newCard],
    });
  };

  const handleDuplicateCard = (index: number) => {
    if (!content) return;
    const original = content.serviceCards[index];
    const copyCard: IServiceCard = {
      ...original,
      id: `card-${Date.now()}`,
      title: `${original.title} (Copy)`,
      order: content.serviceCards.length + 1,
      features: original.features ? [...original.features] : [],
    };
    setContent({
      ...content,
      serviceCards: [...content.serviceCards, copyCard],
    });
  };

  const handleUpdateCard = (index: number, field: keyof IServiceCard, value: any) => {
    if (!content) return;
    const updatedCards = [...content.serviceCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setContent({ ...content, serviceCards: updatedCards });
  };

  const handleDeleteCard = async (index: number) => {
    if (!content) return;
    const cardToDelete = content.serviceCards[index];
    const cardTitle = cardToDelete?.title || cardToDelete?.section || 'this card';

    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${cardTitle}"? It will be removed from the homepage and customer portal.`
      )
    ) {
      return;
    }

    const updatedCards = content.serviceCards.filter((_, i) => i !== index);
    const updatedContent = { ...content, serviceCards: updatedCards };
    setContent(updatedContent);

    // Auto-reset section filter if the deleted card was the only card in this section
    const remainingSections = Array.from(new Set(updatedCards.map((c) => (c.section || '').trim()).filter(Boolean)));
    if (selectedSectionFilter !== 'all' && !remainingSections.some((s) => s.toLowerCase() === selectedSectionFilter.toLowerCase())) {
      setSelectedSectionFilter('all');
    }

    try {
      setSaving(true);
      const res = await contentApi.updateAdmin(updatedContent);
      if (res.data.success) {
        setContent(res.data.data);
        setNotification({
          type: 'success',
          message: `Service card "${cardTitle}" deleted successfully and removed from frontend!`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to auto-save after delete:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete card on server. Please check your admin connection.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const cards = [...content.serviceCards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const temp = cards[index];
    cards[index] = cards[targetIndex];
    cards[targetIndex] = temp;

    // re-assign order numbers
    const reordered = cards.map((c, idx) => ({ ...c, order: idx + 1 }));
    setContent({ ...content, serviceCards: reordered });
  };

  const handleAddFeature = (cardIndex: number, cardId: string) => {
    const text = (featureDrafts[cardId] || '').trim();
    if (!text || !content) return;
    const updatedCards = [...content.serviceCards];
    const currentFeatures = updatedCards[cardIndex].features || [];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      features: [...currentFeatures, text],
    };
    setContent({ ...content, serviceCards: updatedCards });
    setFeatureDrafts((prev) => ({ ...prev, [cardId]: '' }));
  };

  const handleRemoveFeature = (cardIndex: number, featureIndex: number) => {
    if (!content) return;
    const updatedCards = [...content.serviceCards];
    const currentFeatures = updatedCards[cardIndex].features || [];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      features: currentFeatures.filter((_, fIdx) => fIdx !== featureIndex),
    };
    setContent({ ...content, serviceCards: updatedCards });
  };

  const handleUpdateFeature = (cardIndex: number, featureIndex: number, value: string) => {
    if (!content) return;
    const updatedCards = [...content.serviceCards];
    const currentFeatures = [...(updatedCards[cardIndex].features || [])];
    currentFeatures[featureIndex] = value;
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      features: currentFeatures,
    };
    setContent({ ...content, serviceCards: updatedCards });
  };

  // Derive unique section list dynamically strictly from existing cards (no ghost sections)
  const dynamicSections = Array.from(
    new Set(
      (content?.serviceCards || [])
        .map((c) => (c.section || '').trim())
        .filter(Boolean)
    )
  );

  // Auto-reset section filter if current filter section no longer exists
  useEffect(() => {
    if (
      selectedSectionFilter !== 'all' &&
      !dynamicSections.some((s) => s.toLowerCase() === selectedSectionFilter.toLowerCase())
    ) {
      setSelectedSectionFilter('all');
    }
  }, [content?.serviceCards, selectedSectionFilter]);

  const displayedCards = content.serviceCards
    .map((card, originalIndex) => ({ card, originalIndex }))
    .filter(({ card }) => {
      if (selectedSectionFilter === 'all') return true;
      return (card.section || 'General').toLowerCase() === selectedSectionFilter.toLowerCase();
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="text-green-600" />
            Soft-Coded Content Manager (CMS)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Edit live homepage flash cards, section divisions, hero slogans, legal policies, and footer links without modifying code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={FRONTEND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 text-xs font-semibold transition"
          >
            <span>Live Frontend</span>
            <ExternalLink size={14} />
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'cards'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard size={18} />
          <span>Flash / Service Cards ({content.serviceCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'hero'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutTemplate size={18} />
          <span>Hero & Header</span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'policies'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield size={18} />
          <span>Policies & Compliance</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'footer'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={18} />
          <span>Footer & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'contact'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone size={18} />
          <span>Contact & Dropdowns</span>
        </button>
      </div>

      {/* TAB 1: SERVICE CARDS */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {/* Top Control Bar: Header, Section Filter Chips, Add Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Layers size={18} className="text-green-600" />
                  <span>Homepage Service Cards & Section Divisions</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure dynamic flash cards across all business sections (Showroom, Rental, Spare Parts, Battery, Warranty).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddCard(selectedSectionFilter !== 'all' ? selectedSectionFilter : 'General')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>
                    Add Card {selectedSectionFilter !== 'all' ? `to ${selectedSectionFilter}` : ''}
                  </span>
                </button>
              </div>
            </div>

            {/* Section Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Filter size={13} />
                <span>Filter Section:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedSectionFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedSectionFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>All Sections</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current font-bold">
                  {content.serviceCards.length}
                </span>
              </button>

              {dynamicSections.map((sec) => {
                const count = content.serviceCards.filter(
                  (c) => (c.section || 'General').toLowerCase() === sec.toLowerCase()
                ).length;
                const isSelected = selectedSectionFilter.toLowerCase() === sec.toLowerCase();
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSectionFilter(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-green-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{sec}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {displayedCards.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <CreditCard size={24} />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">No Service Cards in this Section</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no cards assigned to section &ldquo;{selectedSectionFilter}&rdquo;. Click the button below to add one.
              </p>
              <button
                type="button"
                onClick={() => handleAddCard(selectedSectionFilter !== 'all' ? selectedSectionFilter : 'General')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer hover:bg-green-700"
              >
                <Plus size={15} />
                <span>Add Card to {selectedSectionFilter}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedCards.map(({ card, originalIndex }) => {
                const previewTheme = getCardPreviewTheme(card.color);
                return (
                  <div
                    key={card.id || originalIndex}
                    className={`bg-white rounded-2xl border shadow-sm transition overflow-hidden ${
                      card.isVisible ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60 bg-slate-50'
                    }`}
                  >
                    {/* Card Card Header Strip */}
                    <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 bg-slate-800 text-white rounded-full font-bold text-xs flex items-center justify-center shadow-xs">
                          {card.order || originalIndex + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-800">
                          {card.title || 'Untitled Card'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
                          Section: {card.section || 'General'}
                        </span>
                        {card.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                            {card.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(originalIndex, 'up')}
                          disabled={originalIndex === 0}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 disabled:opacity-30 transition cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(originalIndex, 'down')}
                          disabled={originalIndex === content.serviceCards.length - 1}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 disabled:opacity-30 transition cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateCard(originalIndex)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Duplicate Card"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateCard(originalIndex, 'isVisible', !card.isVisible)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                            card.isVisible
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                          title={card.isVisible ? 'Visible on Homepage' : 'Hidden from Homepage'}
                        >
                          {card.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span>{card.isVisible ? 'Live' : 'Hidden'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(originalIndex)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body: 2 Columns (Editor on Left, Live Preview on Right) */}
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* LEFT: Inputs (8 cols) */}
                      <div className="lg:col-span-8 space-y-4">
                        {/* Section & Badge Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Tag size={13} className="text-green-600" />
                              <span>Section / Category</span>
                            </label>
                            <input
                              type="text"
                              list={`section-list-${originalIndex}`}
                              value={card.section || 'General'}
                              onChange={(e) => handleUpdateCard(originalIndex, 'section', e.target.value)}
                              placeholder="e.g. Showroom, Battery, Rental"
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 bg-white"
                            />
                            <datalist id={`section-list-${originalIndex}`}>
                              {STANDARD_SECTIONS.map((s) => (
                                <option key={s} value={s} />
                              ))}
                            </datalist>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Sparkles size={13} className="text-amber-500" />
                              <span>Card Badge Pill (Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={card.badge || ''}
                              onChange={(e) => handleUpdateCard(originalIndex, 'badge', e.target.value)}
                              placeholder="e.g. 3-YEAR WARRANTY, POPULAR, OEM"
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 uppercase"
                            />
                          </div>
                        </div>

                        {/* Title & Subtitle Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Card Title</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => handleUpdateCard(originalIndex, 'title', e.target.value)}
                              placeholder="e.g. Lithium Battery"
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Subtitle / Tagline</label>
                            <input
                              type="text"
                              value={card.subtitle || ''}
                              onChange={(e) => handleUpdateCard(originalIndex, 'subtitle', e.target.value)}
                              placeholder="e.g. High Performance LFP & Li-Ion"
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 text-slate-600"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 text-xs">Description</label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => handleUpdateCard(originalIndex, 'description', e.target.value)}
                            placeholder="Detailed explanation of services provided..."
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500"
                          />
                        </div>

                        {/* Key Features Bullet Points Manager */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                          <label className="block font-bold text-slate-800 text-xs flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 size={14} className="text-green-600" />
                              <span>Key Features & Highlights ({card.features?.length || 0})</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              Rendered as bullet list on homepage card
                            </span>
                          </label>

                          {/* Existing Features List */}
                          {card.features && card.features.length > 0 && (
                            <div className="space-y-1.5">
                              {card.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-1.5">
                                  <span className="text-green-600 text-xs">✓</span>
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleUpdateFeature(originalIndex, fIdx, e.target.value)}
                                    className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white focus:ring-1 focus:ring-green-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(originalIndex, fIdx)}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                                    title="Remove Bullet"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add New Feature Input */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              value={featureDrafts[card.id] || ''}
                              onChange={(e) => setFeatureDrafts({ ...featureDrafts, [card.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddFeature(originalIndex, card.id);
                                }
                              }}
                              placeholder="Type a feature and press enter (e.g. 3-Year Warranty Replacement)..."
                              className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddFeature(originalIndex, card.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={13} />
                              <span>Add Bullet</span>
                            </button>
                          </div>
                        </div>

                        {/* Target Link URL with Quick Presets */}
                        <div className="space-y-1.5 text-xs">
                          <label className="block font-bold text-slate-700">Target Link URL</label>
                          <input
                            type="text"
                            value={card.linkUrl}
                            onChange={(e) => handleUpdateCard(originalIndex, 'linkUrl', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-green-500"
                          />
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-bold text-slate-400">Quick Links:</span>
                            {QUICK_LINK_PRESETS.map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleUpdateCard(originalIndex, 'linkUrl', preset.url)}
                                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold transition cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Text & Color Palette */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Button Text</label>
                            <input
                              type="text"
                              value={card.buttonText}
                              onChange={(e) => handleUpdateCard(originalIndex, 'buttonText', e.target.value)}
                              placeholder="e.g. Select Battery"
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Color Palette Theme</label>
                            <select
                              value={card.color}
                              onChange={(e) => handleUpdateCard(originalIndex, 'color', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 font-medium bg-white"
                            >
                              {AVAILABLE_COLORS.map((col) => (
                                <option key={col.value} value={col.value}>
                                  {col.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Icon Mode Switcher & Configuration */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                              <ImageIcon size={15} className="text-green-600" />
                              <span>Card Icon / Graphic Type</span>
                            </label>

                            <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleUpdateCard(originalIndex, 'iconType', 'icon')}
                                className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                                  (card.iconType || 'icon') === 'icon'
                                    ? 'bg-white text-green-700 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                Vector Icon
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCard(originalIndex, 'iconType', 'image')}
                                className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                                  card.iconType === 'image'
                                    ? 'bg-white text-green-700 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                Custom Image Icon
                              </button>
                            </div>
                          </div>

                          {(card.iconType || 'icon') === 'icon' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  Choose Built-in Icon
                                </label>
                                <select
                                  value={card.icon}
                                  onChange={(e) => handleUpdateCard(originalIndex, 'icon', e.target.value)}
                                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                                >
                                  {AVAILABLE_ICONS.map((icon) => (
                                    <option key={icon} value={icon}>
                                      {icon}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500">Selected:</span>
                                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                  {card.icon}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                                    {card.iconImage ? (
                                      <img
                                        src={card.iconImage}
                                        alt="Card Icon Preview"
                                        className="w-full h-full object-contain p-1"
                                      />
                                    ) : (
                                      <ImageIcon size={24} className="text-slate-400" />
                                    )}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 mt-1">Image Preview</span>
                                </div>

                                <div className="sm:col-span-9 space-y-2.5">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                      Upload Image from Computer
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                                        <Upload size={14} />
                                        <span>Choose Image File</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              try {
                                                const res = await compressImageFile(file, 400, 400, 0.9);
                                                if (res) {
                                                  handleUpdateCard(originalIndex, 'iconImage', res);
                                                }
                                              } catch (err) {
                                                console.error('Failed to compress icon image:', err);
                                              }
                                            }
                                          }}
                                        />
                                      </label>
                                      {card.iconImage && (
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateCard(originalIndex, 'iconImage', '')}
                                          className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                                        >
                                          Clear
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                      Or Enter Image URL
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="https://example.com/logo.png or /assets/battery.png"
                                      value={card.iconImage || ''}
                                      onChange={(e) => handleUpdateCard(originalIndex, 'iconImage', e.target.value)}
                                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500 font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Background Appearance & Image Option */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                              <ImageIcon size={15} className="text-blue-600" />
                              <span>Card Background Appearance</span>
                            </label>

                            <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleUpdateCard(originalIndex, 'bgType', 'color')}
                                className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                                  (card.bgType || 'color') === 'color'
                                    ? 'bg-white text-blue-700 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                Solid Color Theme
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCard(originalIndex, 'bgType', 'image')}
                                className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                                  card.bgType === 'image'
                                    ? 'bg-white text-blue-700 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                Custom Background Image
                              </button>
                            </div>
                          </div>

                          {card.bgType === 'image' ? (
                            <div className="space-y-3 pt-1">
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                                  <div className="w-full h-20 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs relative">
                                    {card.bgImage ? (
                                      <>
                                        <img
                                          src={card.bgImage}
                                          alt="Card Background Preview"
                                          className="w-full h-full object-cover"
                                        />
                                        <div
                                          className="absolute inset-0"
                                          style={{
                                            backgroundColor: `rgba(0,0,0, ${(card.bgOverlayOpacity ?? 70) / 100})`,
                                          }}
                                        />
                                        <span className="absolute z-10 text-[10px] font-bold text-white uppercase drop-shadow">
                                          Preview
                                        </span>
                                      </>
                                    ) : (
                                      <ImageIcon size={24} className="text-slate-400" />
                                    )}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 mt-1">Background Preview</span>
                                </div>

                                <div className="sm:col-span-9 space-y-2.5">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                      Upload Background Image from Device
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                                        <Upload size={14} />
                                        <span>Choose Background File</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              try {
                                                const res = await compressImageFile(file, 1600, 1200, 0.8);
                                                if (res) {
                                                  handleUpdateCard(originalIndex, 'bgImage', res);
                                                }
                                              } catch (err) {
                                                console.error('Failed to compress background image:', err);
                                              }
                                            }
                                          }}
                                        />
                                      </label>
                                      {card.bgImage && (
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateCard(originalIndex, 'bgImage', '')}
                                          className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                                        >
                                          Clear Image
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                      Or Enter Background Image URL
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="https://images.unsplash.com/... or /assets/battery-bg.jpg"
                                      value={card.bgImage || ''}
                                      onChange={(e) => handleUpdateCard(originalIndex, 'bgImage', e.target.value)}
                                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-blue-500 font-mono"
                                    />
                                  </div>

                                  {/* Dark Overlay Opacity Slider */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="text-[11px] font-semibold text-slate-700">
                                        Dark Readability Overlay: {card.bgOverlayOpacity ?? 70}%
                                      </label>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        (Keeps text & buttons legible)
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min="20"
                                      max="95"
                                      step="5"
                                      value={card.bgOverlayOpacity ?? 70}
                                      onChange={(e) =>
                                        handleUpdateCard(originalIndex, 'bgOverlayOpacity', Number(e.target.value))
                                      }
                                      className="w-full accent-blue-600 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500">
                              Currently using the color palette theme (<span className="font-semibold text-slate-700 capitalize">{card.color || 'emerald'}</span>). Switch to &ldquo;Custom Background Image&rdquo; to add a photographic backdrop.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT: Live Preview (4 cols) */}
                      <div className="lg:col-span-4 flex flex-col items-center justify-start bg-slate-100/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Eye size={14} className="text-green-600" />
                            <span>Live Card Preview</span>
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {card.isVisible ? '● Live on Web' : '○ Hidden'}
                          </span>
                        </div>

                        {/* Preview Card Component */}
                        <div
                          style={
                            card.bgType === 'image' && card.bgImage
                              ? {
                                  backgroundImage: `url("${card.bgImage}")`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }
                              : undefined
                          }
                          className={`w-full max-w-[280px] relative overflow-hidden ${
                            card.bgType === 'image' && card.bgImage ? 'bg-slate-900' : previewTheme.cardBg
                          } rounded-3xl p-5 text-white text-center flex flex-col justify-between shadow-lg transition duration-200 min-h-[340px]`}
                        >
                          {/* Background Overlay if image is active */}
                          {card.bgType === 'image' && card.bgImage && (
                            <div
                              className="absolute inset-0 z-0"
                              style={{
                                backgroundColor: `rgba(15, 23, 42, ${(card.bgOverlayOpacity ?? 70) / 100})`,
                                backgroundImage:
                                  'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                              }}
                            />
                          )}

                          <div className="space-y-3 relative z-10">
                            {/* Card Badge if any */}
                            {card.badge && (
                              <div className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/20 text-white border border-white/30 tracking-wider backdrop-blur-xs">
                                {card.badge}
                              </div>
                            )}

                            {/* Circular Icon */}
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mx-auto border-2 border-white/40 overflow-hidden p-2">
                              {renderLivePreviewIcon(card)}
                            </div>

                            {/* Title & Subtitle */}
                            <div>
                              <h4 className="text-base font-extrabold text-white tracking-wide">
                                {card.title || 'Untitled Card'}
                              </h4>
                              {card.subtitle && (
                                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-0.5">
                                  {card.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-white/90 text-xs leading-relaxed font-normal line-clamp-3">
                              {card.description || 'Description goes here...'}
                            </p>

                            {/* Features list in preview */}
                            {card.features && card.features.length > 0 && (
                              <ul className="text-left space-y-1 pt-1 text-[11px] text-white/95">
                                {card.features.slice(0, 3).map((feat, i) => (
                                  <li key={i} className="flex items-center gap-1.5">
                                    <span className="text-white/70">✓</span>
                                    <span className="truncate">{feat}</span>
                                  </li>
                                ))}
                                {card.features.length > 3 && (
                                  <li className="text-[10px] text-white/75 italic">
                                    +{card.features.length - 3} more feature bullets
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>

                          {/* Button */}
                          <div className="pt-4 relative z-10">
                            <div
                              className={`w-full bg-white ${previewTheme.btnText} font-bold py-2.5 px-4 rounded-full text-xs shadow-md text-center`}
                            >
                              {card.buttonText || 'Select Service'}
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 text-center">
                          Preview reflects real-time styling on the customer homepage.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HERO & HEADER */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-800">Homepage Hero & Header Branding</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the logo branding, banner titles, welcome message, and main call-to-action buttons.
            </p>
          </div>

          {/* Header & Hero Brand Logo Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-green-600" />
                  <span>Header / Navbar Brand Logo</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Select whether to display the official preset SVG emblem or upload a custom company logo image.
                </p>
              </div>

              {/* Mode Toggle Button Group */}
              <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, logoType: 'preset' },
                    })
                  }
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    (content.hero.logoType || 'preset') === 'preset'
                      ? 'bg-white text-green-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preset SVG Emblem
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, logoType: 'image' },
                    })
                  }
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    content.hero.logoType === 'image'
                      ? 'bg-white text-green-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Image Logo
                </button>
              </div>
            </div>

            {(content.hero.logoType || 'preset') === 'preset' ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  EBS
                </div>
                <div>
                  <span className="font-bold text-slate-800">Using Official Ekosmart Battery Solution (EBS) Emblem</span>
                  <p className="text-[11px] text-slate-500">
                    Default SVG branding with Battery & Lightning symbol is active in top navigation header.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Image Preview Thumbnail */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                      {content.hero.logoImage ? (
                        <img
                          src={content.hero.logoImage}
                          alt="Header Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Logo Preview</span>
                  </div>

                  {/* Upload from Computer & URL Input */}
                  <div className="sm:col-span-9 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Upload Logo Image from Computer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                          <Upload size={14} />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const res = await compressImageFile(file, 800, 400, 0.9);
                                  if (res) {
                                    setContent({
                                      ...content,
                                      hero: { ...content.hero, logoImage: res },
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to compress hero logo:', err);
                                }
                              }
                            }}
                          />
                        </label>
                        {content.hero.logoImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, logoImage: '' },
                              })
                            }
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Or Enter Logo Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png or /assets/brand-logo.png"
                        value={content.hero.logoImage || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, logoImage: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Complaint Registration Form Sidebar Logo Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-emerald-700" />
                  <span>Complaint Registration Sidebar Logo (Smart Drive Badge)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Controls the logo inside the white badge on the dark green sidebar at /complaint/register.
                </p>
              </div>

              {/* Mode Toggle Button Group */}
              <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, complaintLogoType: 'preset' },
                    })
                  }
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    (content.hero.complaintLogoType || 'preset') === 'preset'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preset Smart Drive Emblem
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, complaintLogoType: 'image' },
                    })
                  }
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    content.hero.complaintLogoType === 'image'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Image Logo
                </button>
              </div>
            </div>

            {(content.hero.complaintLogoType || 'preset') === 'preset' ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div className="w-16 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-emerald-400 font-black text-xs shadow-xs">
                  SMART DRIVE
                </div>
                <div>
                  <span className="font-bold text-slate-800">Using Official SMART DRIVE Emblem</span>
                  <p className="text-[11px] text-slate-500">
                    Default Smart Drive circular speedometer & road logo badge rendered in the complaint registration sidebar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Image Preview Thumbnail */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                      {content.hero.complaintLogoImage ? (
                        <img
                          src={content.hero.complaintLogoImage}
                          alt="Sidebar Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Sidebar Logo Preview</span>
                  </div>

                  {/* Upload from Computer & URL Input */}
                  <div className="sm:col-span-9 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Upload Sidebar Logo Image from Computer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                          <Upload size={14} />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const res = await compressImageFile(file, 800, 400, 0.9);
                                  if (res) {
                                    setContent({
                                      ...content,
                                      hero: { ...content.hero, complaintLogoImage: res },
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to compress complaint logo:', err);
                                }
                              }
                            }}
                          />
                        </label>
                        {content.hero.complaintLogoImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, complaintLogoImage: '' },
                              })
                            }
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Or Enter Sidebar Logo Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/smart-drive.png or /assets/logo.png"
                        value={content.hero.complaintLogoImage || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, complaintLogoImage: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Main Heading</label>
              <textarea
                rows={2}
                value={content.hero.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, heading: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-green-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subheading / Description</label>
              <textarea
                rows={3}
                value={content.hero.subheading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheading: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-xs text-slate-800">Primary CTA Button</span>
                <div>
                  <label className="block text-slate-600 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={content.hero.primaryButtonText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, primaryButtonText: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Target Link</label>
                  <input
                    type="text"
                    value={content.hero.primaryButtonLink}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, primaryButtonLink: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-xs text-slate-800">Secondary CTA Button</span>
                <div>
                  <label className="block text-slate-600 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, secondaryButtonText: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Target Link</label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonLink}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, secondaryButtonLink: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POLICIES & COMPLIANCE */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          {/* Privacy Policy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Privacy Policy</h3>
                <p className="text-xs text-slate-500">Rendered at /privacy-policy on the public portal.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.privacyPolicy.isPublished}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      privacyPolicy: { ...content.privacyPolicy, isPublished: e.target.checked },
                    })
                  }
                  className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <span>Published</span>
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.privacyPolicy.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      privacyPolicy: { ...content.privacyPolicy, title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy Content</label>
                <textarea
                  rows={6}
                  value={content.privacyPolicy.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      privacyPolicy: { ...content.privacyPolicy, content: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Terms & Conditions</h3>
                <p className="text-xs text-slate-500">Rendered at /terms-conditions on the public portal.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.termsConditions.isPublished}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      termsConditions: { ...content.termsConditions, isPublished: e.target.checked },
                    })
                  }
                  className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <span>Published</span>
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.termsConditions.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      termsConditions: { ...content.termsConditions, title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terms Content</label>
                <textarea
                  rows={6}
                  value={content.termsConditions.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      termsConditions: { ...content.termsConditions, content: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Refund & Replacement Policy</h3>
                <p className="text-xs text-slate-500">Rendered at /refund-policy on the public portal.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.refundPolicy.isPublished}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      refundPolicy: { ...content.refundPolicy, isPublished: e.target.checked },
                    })
                  }
                  className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <span>Published</span>
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.refundPolicy.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      refundPolicy: { ...content.refundPolicy, title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy Content</label>
                <textarea
                  rows={6}
                  value={content.refundPolicy.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      refundPolicy: { ...content.refundPolicy, content: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOOTER & BRANDING */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-800">Global Footer & Branding</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the company logo branding, name, copyright line, disclaimer, and policy link visibility in the public footer.
            </p>
          </div>

          {/* Footer Brand Logo Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-green-600" />
                  <span>Footer Brand Logo / Graphic</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Select whether to display the official preset SVG emblem or upload a custom footer branding logo.
                </p>
              </div>

              {/* Mode Toggle Button Group */}
              <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, logoType: 'preset' },
                    })
                  }
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    (content.footer.logoType || 'preset') === 'preset'
                      ? 'bg-white text-green-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preset SVG Emblem
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, logoType: 'image' },
                    })
                  }
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    content.footer.logoType === 'image'
                      ? 'bg-white text-green-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Image Logo
                </button>
              </div>
            </div>

            {(content.footer.logoType || 'preset') === 'preset' ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  EBS
                </div>
                <div>
                  <span className="font-bold text-slate-800">Using Official Ekosmart Battery Solution (EBS) Emblem</span>
                  <p className="text-[11px] text-slate-500">
                    Default SVG branding with Battery & Lightning symbol is active in footer column 1.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Image Preview Thumbnail */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                      {content.footer.logoImage ? (
                        <img
                          src={content.footer.logoImage}
                          alt="Footer Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Footer Logo Preview</span>
                  </div>

                  {/* Upload from Computer & URL Input */}
                  <div className="sm:col-span-9 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Upload Footer Logo Image from Computer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                          <Upload size={14} />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const res = await compressImageFile(file, 800, 400, 0.9);
                                  if (res) {
                                    setContent({
                                      ...content,
                                      footer: { ...content.footer, logoImage: res },
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to compress footer logo:', err);
                                }
                              }
                            }}
                          />
                        </label>
                        {content.footer.logoImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                footer: { ...content.footer, logoImage: '' },
                              })
                            }
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Or Enter Footer Logo Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/footer-logo.png or /assets/brand-logo.png"
                        value={content.footer.logoImage || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, logoImage: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Entity Name</label>
              <input
                type="text"
                value={content.footer.companyName}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, companyName: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={content.footer.gstin || '08DTUPM4205B1Z0'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, gstin: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plant / Office Address</label>
              <input
                type="text"
                value={content.footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, address: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={content.footer.phone || '+91 8949049003'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, phone: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="text"
                value={content.footer.email || 'support@ekosmartdrive.in'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, email: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Hours</label>
              <input
                type="text"
                value={content.footer.officeHours || '10:00 AM to 6:30 PM (Mon - Sat)'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, officeHours: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Copyright Notice</label>
              <input
                type="text"
                value={content.footer.copyrightText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, copyrightText: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Disclaimer / Support Note</label>
              <textarea
                rows={2}
                value={content.footer.disclaimer}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, disclaimer: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100">
              <span className="block font-bold text-slate-800 mb-3">Footer Navigation Link Toggles</span>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.footer.showPrivacyPolicy}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showPrivacyPolicy: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Show Privacy Policy Link</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.footer.showTermsConditions}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showTermsConditions: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Show Terms & Conditions Link</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.footer.showRefundPolicy}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showRefundPolicy: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Show Refund Policy Link</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT US & DROPDOWN MENU */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Section 1: Dynamic Concern Division Dropdown Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <List className="text-green-600" size={20} />
                  Concern Division / Department Dropdown Menu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Soft-code the dropdown options displayed in the Contact Us page concern selector. Add, edit, reorder, or customize options.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                  {content.contactInfo?.dropdownOptions?.length || 0} Active Options
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : 'Save Dropdown'}</span>
                </button>
              </div>
            </div>

            {/* Quick Add Preset Options Pill Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Quick-Add Recommended Divisions</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const defaultOptions = [
                      'Lithium Battery Solution (EBS)',
                      'EV Spare Parts Wholesale/Retail',
                      'Drive Rental Assistance',
                      'Showroom & Dealership Inquiries',
                      'Plant Commercial Warranty Inspection',
                      'Accounts / Invoice Query',
                      'Other General Inquiry',
                    ];
                    setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        dropdownOptions: defaultOptions,
                      },
                    });
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-green-700 flex items-center gap-1 transition"
                >
                  <RotateCcw size={12} />
                  <span>Reset to Standard Set</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Lithium Battery Solution (EBS)',
                  'EV Spare Parts Wholesale/Retail',
                  'Drive Rental Assistance',
                  'Showroom & Dealership Inquiries',
                  'Plant Commercial Warranty Inspection',
                  'High Voltage BMS Technical Query',
                  'Charger & Power Electronics',
                  'Accounts & Billing Department',
                  'Other General Inquiry',
                ].map((preset) => {
                  const alreadyExists = (content.contactInfo?.dropdownOptions || []).includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => {
                        if (!alreadyExists) {
                          setContent({
                            ...content,
                            contactInfo: {
                              ...content.contactInfo,
                              dropdownOptions: [...(content.contactInfo?.dropdownOptions || []), preset],
                            },
                          });
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium flex items-center gap-1 ${
                        alreadyExists
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-green-500 hover:text-green-700 hover:bg-green-50/50 cursor-pointer shadow-xs'
                      }`}
                    >
                      <span>{alreadyExists ? '✓' : '+'}</span>
                      <span>{preset}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Option Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type custom division name (e.g. Factory Inspection Department)..."
                value={newDropdownOption}
                onChange={(e) => setNewDropdownOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newDropdownOption.trim()) {
                      setContent({
                        ...content,
                        contactInfo: {
                          ...content.contactInfo,
                          dropdownOptions: [...(content.contactInfo?.dropdownOptions || []), newDropdownOption.trim()],
                        },
                      });
                      setNewDropdownOption('');
                    }
                  }
                }}
                className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newDropdownOption.trim()) {
                    setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        dropdownOptions: [...(content.contactInfo?.dropdownOptions || []), newDropdownOption.trim()],
                      },
                    });
                    setNewDropdownOption('');
                  }
                }}
                disabled={!newDropdownOption.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-40"
              >
                <Plus size={16} />
                <span>Add Custom Option</span>
              </button>
            </div>

            {/* List of Current Options with Dedicated Contact Details */}
            <div className="space-y-3 pt-1">
              {(content.contactInfo?.dropdownOptions || []).map((opt, idx) => {
                const divContact = getDivisionContact(opt);
                const isExpanded = expandedDivision === opt;
                return (
                  <div
                    key={idx}
                    className={`border rounded-2xl transition overflow-hidden ${
                      isExpanded ? 'border-green-400 bg-green-50/20 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-6 h-6 bg-slate-200 text-slate-700 font-bold text-xs rounded-full flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newName = e.target.value;
                            const oldName = opt;
                            const updatedOptions = [...(content.contactInfo?.dropdownOptions || [])];
                            updatedOptions[idx] = newName;
                            
                            // Update divisionContacts if renamed
                            const currentDivList = [...(content.contactInfo?.divisionContacts || [])];
                            const cIdx = currentDivList.findIndex(c => c.name.trim().toLowerCase() === oldName.trim().toLowerCase());
                            if (cIdx >= 0) {
                              currentDivList[cIdx] = { ...currentDivList[cIdx], name: newName };
                            }

                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updatedOptions,
                                divisionContacts: currentDivList,
                              },
                            });
                          }}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                      </div>

                      {/* Summary & Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pl-8 sm:pl-0">
                        <button
                          type="button"
                          onClick={() => setExpandedDivision(isExpanded ? null : opt)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                            isExpanded
                              ? 'bg-green-600 text-white border-green-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                          }`}
                        >
                          <Phone size={12} className={isExpanded ? 'text-white' : 'text-green-600'} />
                          <span>{isExpanded ? 'Hide Contact' : 'Edit Contact'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const updated = [...content.contactInfo.dropdownOptions];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updated,
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (content.contactInfo?.dropdownOptions?.length || 0) - 1}
                          onClick={() => {
                            const updated = [...content.contactInfo.dropdownOptions];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updated,
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={(content.contactInfo?.dropdownOptions?.length || 0) <= 1}
                          onClick={() => {
                            const updated = content.contactInfo.dropdownOptions.filter((_, i) => i !== idx);
                            const updatedContacts = (content.contactInfo?.divisionContacts || []).filter(
                              (c) => c.name.trim().toLowerCase() !== opt.trim().toLowerCase()
                            );
                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updated,
                                divisionContacts: updatedContacts,
                              },
                            });
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 rounded hover:bg-red-50 transition"
                          title="Delete Option"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Division Contact Coordinates Form */}
                    {isExpanded && (
                      <div className="bg-white border-t border-green-200 p-4 space-y-3 text-xs animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 size={13} className="text-green-600" />
                            <span>Dedicated Coordinates for: <b className="text-green-800">{opt}</b></span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Displayed dynamically in Contact Directory</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <Phone size={11} className="text-green-600" />
                              <span>Department Phone / Helpline</span>
                            </label>
                            <input
                              type="text"
                              placeholder="+91 8949049003"
                              value={divContact.phone || ''}
                              onChange={(e) => updateDivisionContact(opt, 'phone', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <Mail size={11} className="text-blue-600" />
                              <span>Department Support Email</span>
                            </label>
                            <input
                              type="email"
                              placeholder="battery@ekosmartdrive.in"
                              value={divContact.email || ''}
                              onChange={(e) => updateDivisionContact(opt, 'email', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <MessageSquare size={11} className="text-emerald-600" />
                              <span>WhatsApp Direct Contact</span>
                            </label>
                            <input
                              type="text"
                              placeholder="+91 8949049003"
                              value={divContact.whatsapp || ''}
                              onChange={(e) => updateDivisionContact(opt, 'whatsapp', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <UserCheck size={11} className="text-purple-600" />
                              <span>Department In-Charge / Lead</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Lead Battery Diagnostic Engineer"
                              value={divContact.inCharge || ''}
                              onChange={(e) => updateDivisionContact(opt, 'inCharge', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <Clock size={11} className="text-amber-600" />
                              <span>Department Office Hours</span>
                            </label>
                            <input
                              type="text"
                              placeholder="10:00 AM - 6:30 PM (Mon - Sat)"
                              value={divContact.officeHours || ''}
                              onChange={(e) => updateDivisionContact(opt, 'officeHours', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <MapPin size={11} className="text-red-500" />
                              <span>Specific Desk / Facility Area</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Kota Central Plant - Bay 2"
                              value={divContact.address || ''}
                              onChange={(e) => updateDivisionContact(opt, 'address', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Contact Page Content & Headings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-green-600" size={20} />
                Contact Us Header & Banner Content
              </h3>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.contactInfo?.isPublished ?? true}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, isPublished: e.target.checked },
                    })
                  }
                  className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <span>Published & Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge / Tagline Text</label>
                <input
                  type="text"
                  value={content.contactInfo?.badgeText || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, badgeText: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={content.contactInfo?.heading || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, heading: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Introductory Subheading</label>
                <textarea
                  rows={2}
                  value={content.contactInfo?.subheading || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, subheading: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Official Communication Channels & Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="text-green-600" size={20} />
              Official Support Details & Coordinates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Helpline Number</label>
                <input
                  type="text"
                  value={content.contactInfo?.helplinePhone || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, helplinePhone: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alternate / Escalation Phone</label>
                <input
                  type="text"
                  placeholder="+91 9549730483"
                  value={content.contactInfo?.alternatePhone || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, alternatePhone: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={content.contactInfo?.supportEmail || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, supportEmail: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sales & Bulk Inquiry Email</label>
                <input
                  type="email"
                  placeholder="sales@ekosmartdrive.in"
                  value={content.contactInfo?.salesEmail || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, salesEmail: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+91 8949049003"
                  value={content.contactInfo?.whatsappNumber || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, whatsappNumber: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Maps / Directions URL</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/?q=Kota,Rajasthan"
                  value={content.contactInfo?.mapUrl || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, mapUrl: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Plant / Corporate Address</label>
                <input
                  type="text"
                  value={content.contactInfo?.plantAddress || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, plantAddress: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Working / Office Hours</label>
                <input
                  type="text"
                  value={content.contactInfo?.officeHours || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, officeHours: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={content.contactInfo?.gstin || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, gstin: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                <input
                  type="text"
                  value={content.contactInfo?.website || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, website: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Bottom Save & Preview Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
            <div>
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Ready to publish Contact Us & Dropdown updates?</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Saving will update the live Contact Us form dropdown and phone/email coordinates across {FRONTEND_URL}/contact.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`${FRONTEND_URL}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 text-xs font-semibold transition"
              >
                <span>Preview Contact Page</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving Changes...' : 'Save Contact & Dropdown'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
