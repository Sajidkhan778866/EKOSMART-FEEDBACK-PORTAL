import { Request, Response } from 'express';
import { Page, IPage, ISectionConfig } from '../models/Page';
import { ThemeConfig, IThemeConfig } from '../models/ThemeConfig';
import { FormSchema, IFormSchema } from '../models/FormSchema';
import { MediaAsset } from '../models/MediaAsset';
import { FrontendAuditLog } from '../models/FrontendAuditLog';
import { Complaint } from '../models/Complaint';
import { Warranty } from '../models/Warranty';
import { Customer } from '../models/Customer';
import { generateTicketNumber } from './complaint.controller';

// ==========================================
// DEFAULT SEED CONFIGURATIONS
// ==========================================

export const DEFAULT_THEME: Partial<IThemeConfig> = {
  key: 'global_theme',
  name: 'Ekosmart Official Clean Theme',
  tokens: {
    colors: {
      primary: '#059669', // Emerald-600
      primaryHover: '#047857', // Emerald-700
      primaryGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      secondary: '#0284c7', // Sky-600
      secondaryHover: '#0369a1',
      accent: '#d97706', // Amber-600
      background: '#f8fafc', // Slate-50
      surface: '#ffffff',
      surfaceBorder: '#e2e8f0',
      text: '#0f172a', // Slate-900
      textMuted: '#64748b', // Slate-500
      textInverted: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
      headerBg: '#ffffff',
      footerBg: '#0f172a',
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headingFont: 'Inter, system-ui, -apple-system, sans-serif',
      baseFontSize: '16px',
      headingScaleRatio: 1.25,
      fontWeights: {
        normal: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
      lineHeight: '1.6',
    },
    spacing: {
      containerMaxWidth: '1280px',
      radiusDefault: '12px',
      radiusCard: '16px',
      radiusButton: '12px',
      spacingScale: 1,
      shadowLevel: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    effects: {
      enableAnimations: true,
      transitionDuration: '200ms',
      hoverScale: '1.02',
      entranceAnimation: 'fade-up',
    },
  },
  header: {
    logoType: 'preset',
    logoUrl: '',
    siteTitle: 'EKOSMART EV BATTERY SOLUTION',
    tagline: 'Clean Energy & Smart Electric Mobility',
    height: '72px',
    isSticky: true,
    isTransparent: false,
    showCustomerLoginButton: true,
    ctaButton: {
      label: 'Register Complaint',
      url: '/complaint/register',
      isVisible: true,
      color: 'emerald',
    },
    navItems: [
      { id: 'nav-home', label: 'Home', url: '/', icon: 'Home', order: 1, isVisible: true, isExternal: false },
      { id: 'nav-complaint', label: 'Register Complaint', url: '/complaint/register', icon: 'FileText', order: 2, isVisible: true, isExternal: false },
      { id: 'nav-track', label: 'Track Ticket', url: '/complaint/track', icon: 'Search', order: 3, isVisible: true, isExternal: false },
      { id: 'nav-warranty', label: 'Warranty Check', url: '/warranty/check', icon: 'ShieldCheck', order: 4, isVisible: true, isExternal: false },
      { id: 'nav-showroom', label: 'Showroom Billing', url: '/showroom-billing', icon: 'Receipt', order: 5, isVisible: true, isExternal: false },
      { id: 'nav-contact', label: 'Contact', url: '/contact', icon: 'Phone', order: 6, isVisible: true, isExternal: false },
    ],
  },
  footer: {
    companyName: 'Ekosmart Battery Solution (EBS) & EV Mobility',
    tagline: 'High Power Lithium-Ion & LFP Battery Technologies',
    copyrightText: '© 2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0',
    disclaimer: 'Official customer support, service ticket resolution & warranty verification portal.',
    address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    phone: '+91 8949049003 / +91 9549730483',
    email: 'support@ekosmartdrive.in',
    officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
    gstin: '08DTUPM4205B1Z0',
    website: 'www.ekosmartdrive.in',
    showPrivacyPolicy: true,
    showTermsConditions: true,
    showRefundPolicy: true,
    columns: [
      {
        title: 'Customer Services',
        links: [
          { label: 'Register Complaint', url: '/complaint/register' },
          { label: 'Track Service Ticket', url: '/complaint/track' },
          { label: 'Check Battery Warranty', url: '/warranty/check' },
          { label: 'Register New Warranty', url: '/warranty/register' },
        ],
      },
      {
        title: 'Solutions & Products',
        links: [
          { label: '48V Lithium-Ion Packs', url: '/#services' },
          { label: '60V/72V LFP EV Batteries', url: '/#services' },
          { label: 'Aluminium Fast Chargers', url: '/#services' },
          { label: 'EV Drive Rental Plans', url: '/#services' },
        ],
      },
      {
        title: 'Customer Account',
        links: [
          { label: 'Customer Login', url: '/customer/login' },
          { label: 'Digital Coins & Wallet', url: '/customer/wallet' },
          { label: 'Refer & Earn (+500)', url: '/customer/referrals' },
          { label: 'Showroom Invoices', url: '/customer/purchases' },
        ],
      },
    ],
    socialLinks: [
      { platform: 'WhatsApp Helpline', url: 'https://wa.me/918949049003', icon: 'MessageSquare' },
      { platform: 'Email Support', url: 'mailto:support@ekosmartdrive.in', icon: 'Mail' },
    ],
  },
  loginPromptTimer: {
    enabled: true,
    durationSeconds: 20,
    title: 'Welcome to Ekosmart',
    message: 'Please login or register with your email to access your digital coin rewards, referral codes, and showroom invoices.',
  },
};

export const DEFAULT_FORMS: Array<Partial<IFormSchema>> = [
  {
    formKey: 'contact_form',
    title: 'Customer Inquiry & Helpline Form',
    description: 'Reach our engineering and customer support team at Kota Central Plant.',
    destinationWorkflow: 'contact_inquiry',
    submitButton: { label: 'Send Message', color: 'emerald', icon: 'Send', size: 'md' },
    successMessage: 'Thank you! Your message has been dispatched to our Kota Plant support team.',
    errorMessage: 'Unable to send message. Please call +91 8949049003 directly.',
    version: 1,
    isActive: true,
    fields: [
      { fieldKey: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true, width: '1/2', order: 1 },
      { fieldKey: 'mobile', label: 'Mobile Number', type: 'phone', placeholder: '10-digit mobile number', required: true, width: '1/2', order: 2 },
      { fieldKey: 'email', label: 'Email Address', type: 'email', placeholder: 'yourname@example.com', required: false, width: 'full', order: 3 },
      {
        fieldKey: 'division',
        label: 'Inquiry Category / Division',
        type: 'select',
        options: [
          'Lithium Battery Solution (EBS)',
          'EV Spare Parts Wholesale/Retail',
          'Drive Rental Assistance',
          'Showroom & Dealership Inquiries',
          'Plant Commercial Warranty Inspection',
        ],
        required: true,
        width: 'full',
        order: 4,
      },
      { fieldKey: 'message', label: 'Your Message / Requirement', type: 'textarea', placeholder: 'Describe your requirement or question...', required: true, width: 'full', order: 5 },
    ],
  },
  {
    formKey: 'complaint_form',
    title: 'Register Technical Service Complaint',
    description: 'Submit an official support ticket for fast SLA diagnostic inspection and repair.',
    destinationWorkflow: 'ticket_submission',
    submitButton: { label: 'Register Official Complaint', color: 'emerald', icon: 'AlertCircle', size: 'lg' },
    successMessage: 'Service complaint registered successfully! Track your ticket status anytime.',
    errorMessage: 'Failed to submit complaint. Please check your details and retry.',
    version: 1,
    isActive: true,
    fields: [
      { fieldKey: 'customerName', label: 'Customer / Owner Name', type: 'text', placeholder: 'e.g. Rahul Sharma', required: true, width: '1/2', order: 1 },
      { fieldKey: 'customerMobile', label: 'Registered Mobile Number', type: 'phone', placeholder: '10-digit mobile number', required: true, width: '1/2', order: 2 },
      { fieldKey: 'customerEmail', label: 'Email Address (For Invoice & Updates)', type: 'email', placeholder: 'customer@example.com', required: false, width: 'full', order: 3 },
      {
        fieldKey: 'division',
        label: 'Select Service Division',
        type: 'select',
        options: ['Battery', 'Rental', 'Showroom', 'Spare Parts'],
        required: true,
        width: '1/2',
        order: 4,
      },
      { fieldKey: 'batterySerial', label: 'Battery / Product Serial Number', type: 'text', placeholder: 'e.g. EBS-48V-2026-XXXX', required: false, width: '1/2', order: 5 },
      { fieldKey: 'address', label: 'Service Location / City (Kota / Pan-India)', type: 'text', placeholder: 'Enter your city or delivery address', required: false, width: 'full', order: 6 },
      { fieldKey: 'description', label: 'Issue Description / Problem Observed', type: 'textarea', placeholder: 'Describe the issue (e.g. low mileage, charger not connecting, cell imbalance)...', required: true, width: 'full', order: 7 },
    ],
  },
  {
    formKey: 'warranty_register_form',
    title: 'Official Battery Warranty Registration',
    description: 'Register your newly purchased Ekosmart battery pack for verified Pan-India warranty.',
    destinationWorkflow: 'warranty_registration',
    submitButton: { label: 'Submit Warranty Registration', color: 'emerald', icon: 'ShieldCheck', size: 'lg' },
    successMessage: 'Warranty registration verified and linked to your digital account!',
    errorMessage: 'Warranty registration failed. Please ensure the serial number matches your invoice.',
    version: 1,
    isActive: true,
    fields: [
      { fieldKey: 'customerName', label: 'Customer Name', type: 'text', placeholder: 'Enter full name', required: true, width: '1/2', order: 1 },
      { fieldKey: 'customerMobile', label: 'Mobile Number', type: 'phone', placeholder: '10-digit mobile', required: true, width: '1/2', order: 2 },
      { fieldKey: 'customerEmail', label: 'Email Address', type: 'email', placeholder: 'customer@example.com', required: true, width: 'full', order: 3 },
      { fieldKey: 'batterySerialNumber', label: 'Battery Pack Serial Number', type: 'text', placeholder: 'e.g. EBS48V32AH9942', required: true, width: '1/2', order: 4 },
      { fieldKey: 'invoiceNumber', label: 'Invoice / Bill Number', type: 'text', placeholder: 'e.g. EBS-INV-1001', required: true, width: '1/2', order: 5 },
      { fieldKey: 'purchaseDate', label: 'Date of Purchase', type: 'date', required: true, width: '1/2', order: 6 },
      {
        fieldKey: 'batteryModel',
        label: 'Battery Model / Specification',
        type: 'select',
        options: ['48V 28Ah LFP', '48V 32Ah LFP (3-Yr Warranty)', '60V 32Ah Lithium-Ion', '72V 36Ah High Performance', 'Aluminium Fast Charger 60V/72V'],
        required: true,
        width: '1/2',
        order: 7,
      },
    ],
  },
];

export const getDefaultPages = (): Array<Partial<IPage>> => [
  {
    pageId: 'page_home',
    title: 'Ekosmart Battery Solution — High Power EV Batteries & Support',
    slug: '/',
    description: 'Official portal for Ekosmart Lithium-Ion & LFP battery packs, service complaints, warranty checks and customer rewards.',
    status: 'published',
    isHome: true,
    access: 'public',
    currentVersion: 1,
    sections: [
      {
        id: 'sec-hero',
        name: 'Hero Banner & Action Header',
        isVisible: true,
        order: 1,
        container: {
          maxWidth: '7xl',
          paddingY: 'xl',
          paddingX: 'md',
          bgType: 'gradient',
          bgGradient: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #022c22 100%)',
          borderRadius: '2xl',
          shadow: 'xl',
        },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-hero-1',
            type: 'HeroBanner',
            name: 'Main Hero Section',
            isVisible: true,
            order: 1,
            props: {
              badgeText: '⚡ OFFICIAL EKOSMART CLEAN ENERGY & MOBILITY PORTAL',
              heading: 'Ekosmart Battery Solution (EBS)\nHigh Power Lithium-Ion & LFP Battery Packs',
              subheading: 'High Charging Power • Long Life • Low Maintenance. Official support portal for EV scooter & E-rickshaw batteries, genuine spare parts, and warranty verification.',
              primaryButtonText: 'Register Complaint',
              primaryButtonLink: '/complaint/register',
              secondaryButtonText: 'Check Battery Warranty',
              secondaryButtonLink: '/warranty/check',
              showCoinsBadge: true,
              coinsBadgeText: '🪙 Earn 500 Coins on Battery Bills & Friend Referrals',
            },
          },
        ],
      },
      {
        id: 'sec-stats',
        name: 'Key Platform Metrics',
        isVisible: true,
        order: 2,
        container: { maxWidth: '7xl', paddingY: 'md', paddingX: 'md' },
        layout: { display: 'grid', gridCols: 4, gridGap: 'md' },
        responsive: { mobileCols: 2, tabletCols: 2 },
        components: [
          {
            id: 'cmp-stat-1',
            type: 'StatsCounter',
            name: 'Packs Deployed',
            isVisible: true,
            order: 1,
            props: { number: '50,000+', label: 'Battery Packs Serviced', icon: 'BatteryCharging', color: 'emerald' },
          },
          {
            id: 'cmp-stat-2',
            type: 'StatsCounter',
            name: 'Warranty Coverage',
            isVisible: true,
            order: 2,
            props: { number: '3 Years', label: 'Comprehensive Warranty', icon: 'ShieldCheck', color: 'blue' },
          },
          {
            id: 'cmp-stat-3',
            type: 'StatsCounter',
            name: 'Service SLA',
            isVisible: true,
            order: 3,
            props: { number: '24-48 Hours', label: 'Technical Resolution SLA', icon: 'Clock', color: 'amber' },
          },
          {
            id: 'cmp-stat-4',
            type: 'StatsCounter',
            name: 'Coin Rewards',
            isVisible: true,
            order: 4,
            props: { number: '🪙 +500', label: 'Coins Credited on Billing', icon: 'Coins', color: 'orange' },
          },
        ],
      },
      {
        id: 'sec-services',
        name: 'Services & Divisions Grid',
        isVisible: true,
        order: 3,
        container: { maxWidth: '7xl', paddingY: 'lg', paddingX: 'md' },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-heading-services',
            type: 'HeadingText',
            name: 'Services Header',
            isVisible: true,
            order: 1,
            props: {
              level: 'h2',
              title: 'Our Clean Mobility Divisions & Customer Services',
              subtitle: 'Select any service card below for immediate complaint registration, warranty checks, or showroom inquiries.',
              align: 'center',
            },
          },
          {
            id: 'cmp-service-grid',
            type: 'ServiceCardGrid',
            name: 'Core Service Cards',
            isVisible: true,
            order: 2,
            props: {
              cards: [
                {
                  id: 'card-1',
                  title: 'EV Battery Solution (EBS)',
                  subtitle: 'Lithium-Ion & LFP High Power Packs',
                  description: 'Factory-tested 48V, 60V, and 72V smart lithium packs for electric 2-wheelers and 3-wheelers.',
                  badge: '3-Year Warranty',
                  icon: 'Zap',
                  color: 'emerald',
                  linkUrl: '/complaint/register',
                  buttonText: 'Battery Support',
                  features: ['Smart BMS Balance', 'Cell Health Diagnostics', 'Pan-India Service'],
                },
                {
                  id: 'card-2',
                  title: 'EV Spare Parts & Accessories',
                  subtitle: 'Genuine Wholesale & Retail Components',
                  description: 'Authentic lithium fast chargers, wiring harnesses, motor controllers, and replacement cells.',
                  badge: 'OEM Genuine',
                  icon: 'Package',
                  color: 'blue',
                  linkUrl: '/complaint/register',
                  buttonText: 'Spare Parts Help',
                  features: ['Aluminium Fast Chargers', 'Plug-and-play connectors', 'Kota Plant Dispatched'],
                },
                {
                  id: 'card-3',
                  title: 'Drive & Battery Rental Plans',
                  subtitle: 'Commercial Electric Mobility',
                  description: 'Flexible daily, monthly, and fleet leasing packages with zero upfront battery replacement cost.',
                  badge: 'Flexible Subscriptions',
                  icon: 'Truck',
                  color: 'amber',
                  linkUrl: '/complaint/register',
                  buttonText: 'Rental Inquiries',
                  features: ['Instant Swapping', 'Zero Maintenance Cost', 'Deposit Refundable'],
                },
                {
                  id: 'card-4',
                  title: 'Showroom Billing & Verification',
                  subtitle: 'Official Tax Invoices & Digital Coins',
                  description: 'Soft copy GST tax invoice download, verified warranty certificates, and exclusive referral codes.',
                  badge: 'Digital Wallet',
                  icon: 'Receipt',
                  color: 'purple',
                  linkUrl: '/showroom-billing',
                  buttonText: 'Showroom Billing',
                  features: ['GST Soft Copy Receipt', 'Warranty Badge Included', '+500 Coins Credited'],
                },
              ],
            },
          },
        ],
      },
      {
        id: 'sec-referral',
        name: 'Referral & Digital Wallet Highlights',
        isVisible: true,
        order: 4,
        container: {
          maxWidth: '7xl',
          paddingY: 'lg',
          paddingX: 'md',
          bgType: 'gradient',
          bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 50%, #fef9c3 100%)',
          borderRadius: '2xl',
          borderColor: '#fde68a',
          borderStyle: 'solid',
          borderWidth: '2px',
        },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-referral-widget',
            type: 'CustomerReferralWidget',
            name: 'Referral Program Widget',
            isVisible: true,
            order: 1,
            props: {
              title: 'Ekosmart Refer & Earn Rewards Program',
              subtitle: 'Share your unique referral code with friends and colleagues. When they purchase an EV Battery pack, both of you get rewarded!',
              batteryCoins: 500,
              showroomCoins: 250,
              referrerReward: 500,
              ctaLabel: 'View Your Wallet & Referral Code',
              ctaUrl: '/customer/referrals',
            },
          },
        ],
      },
      {
        id: 'sec-faq',
        name: 'Frequently Asked Questions',
        isVisible: true,
        order: 5,
        container: { maxWidth: '5xl', paddingY: 'lg', paddingX: 'md' },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-faq-heading',
            type: 'HeadingText',
            name: 'FAQ Heading',
            isVisible: true,
            order: 1,
            props: {
              level: 'h2',
              title: 'Frequently Asked Questions',
              subtitle: 'Common questions regarding Ekosmart battery maintenance, warranty coverage, and service complaints.',
              align: 'center',
            },
          },
          {
            id: 'cmp-faq-accordion',
            type: 'AccordionFaq',
            name: 'Main FAQ List',
            isVisible: true,
            order: 2,
            props: {
              items: [
                {
                  question: 'How do I register a service complaint for my EV battery?',
                  answer: 'Click on "Register Complaint", select your division (Battery / Rental / Showroom / Spare Parts), enter your mobile and battery serial number, and describe the issue. A unique ticket number will be generated immediately.',
                },
                {
                  question: 'What is the warranty period on Ekosmart Lithium-Ion & LFP batteries?',
                  answer: '48V Series LFP batteries come with an official 3-Year Replacement/Service Warranty. 60V and 72V packs carry a 1.5-Year warranty, and Aluminium Fast Chargers carry a 1-Year warranty.',
                },
                {
                  question: 'How do I earn digital wallet coins and redeem them?',
                  answer: 'When a showroom invoice is generated for your purchase, coins (500 for Battery, 250 for Showroom) are credited to your customer account. You can redeem these coins for battery servicing, spare parts, or maintenance.',
                },
                {
                  question: 'How long does complaint resolution take?',
                  answer: 'Most standard battery diagnostic checks and BMS cell rebalancing are addressed within 24 to 48 hours by our certified engineers.',
                },
              ],
            },
          },
        ],
      },
    ],
    draftSections: [],
  },
  {
    pageId: 'page_complaint_register',
    title: 'Register Service Complaint — Ekosmart Support',
    slug: '/complaint/register',
    description: 'Submit an official support ticket for battery diagnostics, rental assistance, or showroom issues.',
    status: 'published',
    isHome: false,
    access: 'public',
    currentVersion: 1,
    sections: [
      {
        id: 'sec-complaint-header',
        name: 'Header Banner',
        isVisible: true,
        order: 1,
        container: {
          maxWidth: '5xl',
          paddingY: 'lg',
          paddingX: 'md',
          bgType: 'gradient',
          bgGradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          borderRadius: '2xl',
        },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-c-hero',
            type: 'HeadingText',
            name: 'Complaint Title',
            isVisible: true,
            order: 1,
            props: {
              level: 'h1',
              title: 'Register Technical Service Complaint',
              subtitle: 'Our Kota Central Plant engineering team provides rapid 24-48h resolution across all battery & EV divisions.',
              align: 'center',
              textColor: '#ffffff',
            },
          },
        ],
      },
      {
        id: 'sec-complaint-form',
        name: 'Complaint Form Container',
        isVisible: true,
        order: 2,
        container: { maxWidth: '4xl', paddingY: 'md', paddingX: 'md' },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-complaint-dynamic-form',
            type: 'DynamicFormBlock',
            name: 'Complaint Dynamic Form',
            isVisible: true,
            order: 1,
            props: {
              formKey: 'complaint_form',
            },
          },
        ],
      },
    ],
    draftSections: [],
  },
  {
    pageId: 'page_complaint_track',
    title: 'Track Service Complaint Status — Ekosmart',
    slug: '/complaint/track',
    description: 'Lookup the live status, assigned engineer, and resolution history of your service ticket.',
    status: 'published',
    isHome: false,
    access: 'public',
    currentVersion: 1,
    sections: [
      {
        id: 'sec-track-header',
        name: 'Header Banner',
        isVisible: true,
        order: 1,
        container: {
          maxWidth: '5xl',
          paddingY: 'lg',
          paddingX: 'md',
          bgType: 'gradient',
          bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          borderRadius: '2xl',
        },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-t-hero',
            type: 'HeadingText',
            name: 'Track Title',
            isVisible: true,
            order: 1,
            props: {
              level: 'h1',
              title: 'Live Service Ticket Tracker',
              subtitle: 'Enter your Complaint Ticket ID or Registered Mobile Number to view real-time progress.',
              align: 'center',
              textColor: '#ffffff',
            },
          },
        ],
      },
      {
        id: 'sec-track-block',
        name: 'Tracker Interactive Component',
        isVisible: true,
        order: 2,
        container: { maxWidth: '4xl', paddingY: 'md', paddingX: 'md' },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-tracker',
            type: 'ComplaintTrackerBlock',
            name: 'Interactive Complaint Tracker',
            isVisible: true,
            order: 1,
            props: {},
          },
        ],
      },
    ],
    draftSections: [],
  },
  {
    pageId: 'page_warranty_check',
    title: 'Battery Warranty Verification — Ekosmart',
    slug: '/warranty/check',
    description: 'Verify official manufacturer warranty validity, remaining months, and service terms.',
    status: 'published',
    isHome: false,
    access: 'public',
    currentVersion: 1,
    sections: [
      {
        id: 'sec-warranty-header',
        name: 'Header Banner',
        isVisible: true,
        order: 1,
        container: {
          maxWidth: '5xl',
          paddingY: 'lg',
          paddingX: 'md',
          bgType: 'gradient',
          bgGradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          borderRadius: '2xl',
        },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-w-hero',
            type: 'HeadingText',
            name: 'Warranty Check Title',
            isVisible: true,
            order: 1,
            props: {
              level: 'h1',
              title: 'Official Battery Warranty Verification',
              subtitle: 'Instantly check warranty status, registered owner, purchase invoice, and expiration date.',
              align: 'center',
              textColor: '#ffffff',
            },
          },
        ],
      },
      {
        id: 'sec-warranty-checker',
        name: 'Warranty Checker Block',
        isVisible: true,
        order: 2,
        container: { maxWidth: '4xl', paddingY: 'md', paddingX: 'md' },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-warranty-check-block',
            type: 'WarrantyCheckBlock',
            name: 'Warranty Lookup Component',
            isVisible: true,
            order: 1,
            props: {},
          },
        ],
      },
    ],
    draftSections: [],
  },
  {
    pageId: 'page_contact',
    title: 'Contact Us — Ekosmart Kota Central Plant',
    slug: '/contact',
    description: 'Direct contact details, engineering team phone directory, Kota Plant address and inquiry form.',
    status: 'published',
    isHome: false,
    access: 'public',
    currentVersion: 1,
    sections: [
      {
        id: 'sec-contact-directory',
        name: 'Contact & Directory Information',
        isVisible: true,
        order: 1,
        container: { maxWidth: '7xl', paddingY: 'lg', paddingX: 'md' },
        layout: { display: 'block' },
        responsive: { hideDesktop: false, hideTablet: false, hideMobile: false },
        components: [
          {
            id: 'cmp-contact-directory',
            type: 'ContactDirectoryBlock',
            name: 'Plant Directory & Map',
            isVisible: true,
            order: 1,
            props: {
              heading: 'Get in Touch With Us',
              subheading: 'Need technical assistance with your Lithium-Ion / LFP battery pack, genuine EV spare parts, or dealership inquiries? Our Kota team is here to help.',
              plantAddress: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
              helplinePhone: '+91 8949049003',
              alternatePhone: '+91 9549730483',
              supportEmail: 'support@ekosmartdrive.in',
              officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
            },
          },
        ],
      },
    ],
    draftSections: [],
  },
];

// ==========================================
// PUBLIC ENDPOINTS (Fast Cached Data for Site)
// ==========================================

export const getPublicTheme = async (_req: Request, res: Response) => {
  try {
    let theme = await ThemeConfig.findOne({ key: 'global_theme' });
    if (!theme) {
      theme = await ThemeConfig.create(DEFAULT_THEME);
    }
    return res.status(200).json({
      success: true,
      data: theme,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch theme configuration', error: err.message });
  }
};

export const getPublicPages = async (_req: Request, res: Response) => {
  try {
    const pages = await Page.find({ status: 'published' })
      .select('pageId title slug description isHome access meta updatedAt currentVersion')
      .sort({ isHome: -1, title: 1 });
    return res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch pages list', error: err.message });
  }
};

export const getPublicPageBySlug = async (req: Request, res: Response) => {
  try {
    const rawParam = req.params[0] || (req.query.slug as string) || '/';
    let rawSlug = String(rawParam).trim();
    if (!rawSlug.startsWith('/')) rawSlug = '/' + rawSlug;
    if (rawSlug.length > 1 && rawSlug.endsWith('/')) rawSlug = rawSlug.slice(0, -1);

    // 1. Try exact slug match
    let page = await Page.findOne({ slug: rawSlug, status: 'published' });

    // 2. If looking for root or not found, try isHome: true
    if (!page && (rawSlug === '/' || rawSlug === '')) {
      page = await Page.findOne({ isHome: true, status: 'published' });
    }

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page not found for route: ${rawSlug}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch page', error: err.message });
  }
};

export const getPublicFormSchema = async (req: Request, res: Response) => {
  try {
    const { formKey } = req.params;
    let form = await FormSchema.findOne({ formKey, isActive: true });
    if (!form) {
      const defaultForm = DEFAULT_FORMS.find((f) => f.formKey === formKey);
      if (defaultForm) {
        form = await FormSchema.create(defaultForm);
      }
    }
    if (!form) {
      return res.status(404).json({ success: false, message: `Form schema not found: ${formKey}` });
    }
    return res.status(200).json({ success: true, data: form });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch form schema', error: err.message });
  }
};

export const submitPublicForm = async (req: Request, res: Response) => {
  try {
    const { formKey } = req.params;
    const formData = req.body;

    const schema = await FormSchema.findOne({ formKey, isActive: true });
    if (!schema) {
      return res.status(404).json({ success: false, message: `Form not found: ${formKey}` });
    }

    // Validate required fields
    for (const field of schema.fields) {
      if (field.required && (!formData[field.fieldKey] || formData[field.fieldKey].toString().trim() === '')) {
        return res.status(400).json({
          success: false,
          message: `Field '${field.label}' is required.`,
        });
      }
    }

    // Process destination workflow safely
    if (schema.destinationWorkflow === 'ticket_submission') {
      const cleanMobile = String(formData.customerMobile || formData.mobile || '').trim();
      const cleanName = String(formData.customerName || formData.name || 'Customer').trim();
      const cleanDivision = String(formData.division || 'Battery').trim();

      let customer = cleanMobile ? await Customer.findOne({ mobile: cleanMobile }) : null;
      if (!customer) {
        customer = await Customer.create({
          customerId: `CUST-${Date.now().toString().slice(-6)}`,
          name: cleanName,
          mobile: cleanMobile || `TMP-${Date.now().toString().slice(-6)}`,
          email: formData.customerEmail || formData.email || undefined,
          customerType: 'General',
        });
      }

      const ticketNumber = await generateTicketNumber(cleanDivision);
      const newComplaint = await Complaint.create({
        ticketNumber,
        customer: customer._id,
        division: cleanDivision,
        description: formData.description || formData.message || 'Service request submitted',
        status: 'New',
        priority: 'Medium',
        formData,
      });

      return res.status(200).json({
        success: true,
        message: schema.successMessage || 'Complaint registered successfully!',
        ticketId: newComplaint.ticketNumber,
        data: newComplaint,
      });
    }

    if (schema.destinationWorkflow === 'warranty_registration') {
      const cleanMobile = String(formData.customerMobile || formData.mobile || '').trim();
      const cleanName = String(formData.customerName || formData.name || 'Customer').trim();
      let customer = cleanMobile ? await Customer.findOne({ mobile: cleanMobile }) : null;
      if (!customer) {
        customer = await Customer.create({
          customerId: `CUST-${Date.now().toString().slice(-6)}`,
          name: cleanName,
          mobile: cleanMobile || `TMP-${Date.now().toString().slice(-6)}`,
          email: formData.customerEmail || formData.email || undefined,
          customerType: 'General',
        });
      }

      const pDate = formData.purchaseDate ? new Date(formData.purchaseDate) : new Date();
      const expDate = new Date(pDate);
      expDate.setFullYear(expDate.getFullYear() + 3);

      const newWarranty = await Warranty.create({
        warrantyNumber: `WRN-${Date.now().toString().slice(-6)}`,
        category: 'Battery',
        customer: customer._id,
        product: formData.batteryModel || '48V LFP EV Battery Pack',
        serialNumber: formData.batterySerialNumber || formData.batterySerial || `SN-${Date.now().toString().slice(-6)}`,
        billNumber: formData.invoiceNumber || 'INV-DIRECT',
        purchaseDate: pDate,
        warrantyStartDate: pDate,
        warrantyExpiryDate: expDate,
        status: 'Active',
        formData,
      });

      return res.status(200).json({
        success: true,
        message: schema.successMessage || 'Warranty registered successfully!',
        data: newWarranty,
      });
    }

    // Default contact inquiry
    console.log(`[FormSubmission] Contact inquiry received for form [${formKey}]:`, formData);
    return res.status(200).json({
      success: true,
      message: schema.successMessage || 'Form submitted successfully!',
      data: formData,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to process form submission', error: err.message });
  }
};

// ==========================================
// ADMIN ENDPOINTS (Protected Visual Builder)
// ==========================================

export const getAdminPages = async (_req: Request, res: Response) => {
  try {
    const pages = await Page.find().sort({ isHome: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: pages });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to load pages', error: err.message });
  }
};

export const getAdminPageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await Page.findOne({ $or: [{ _id: id }, { pageId: id }] });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to load page', error: err.message });
  }
};

export const createAdminPage = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, isHome, access, templateType } = req.body;

    let formattedSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();
    if (!formattedSlug.startsWith('/')) formattedSlug = '/' + formattedSlug;

    // Check slug collision
    const existing = await Page.findOne({ slug: formattedSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Page with slug '${formattedSlug}' already exists.` });
    }

    const pageId = `page_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    // If isHome is true, unset other homepages
    if (isHome) {
      await Page.updateMany({}, { $set: { isHome: false } });
    }

    let defaultSections: ISectionConfig[] = [
      {
        id: `sec-${Date.now()}`,
        name: 'Main Content Section',
        isVisible: true,
        order: 1,
        container: { maxWidth: '7xl', paddingY: 'lg', paddingX: 'md' },
        layout: { display: 'block' },
        components: [
          {
            id: `cmp-${Date.now()}`,
            type: 'HeadingText',
            name: 'Page Title Heading',
            isVisible: true,
            order: 1,
            props: {
              level: 'h1',
              title: title,
              subtitle: description || 'Add description here...',
              align: 'left',
            },
          },
        ],
      },
    ];

    const newPage = await Page.create({
      pageId,
      title,
      slug: formattedSlug,
      description: description || '',
      status: 'draft',
      isHome: Boolean(isHome),
      access: access || 'public',
      sections: defaultSections,
      draftSections: defaultSections,
      currentVersion: 1,
      revisions: [],
    });

    await FrontendAuditLog.create({
      adminName: (req as any).user?.name || 'Administrator',
      action: 'create_page',
      targetType: 'Page',
      targetId: newPage.pageId,
      targetTitle: newPage.title,
    });

    return res.status(201).json({ success: true, message: 'Page created successfully', data: newPage });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to create page', error: err.message });
  }
};

export const updateAdminPageDraft = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { draftSections, title, slug, description, meta, isHome, access } = req.body;

    const page = await Page.findOne({ $or: [{ _id: id }, { pageId: id }] });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    if (draftSections !== undefined) page.draftSections = draftSections;
    if (title) page.title = title;
    if (slug) {
      let s = slug.trim();
      if (!s.startsWith('/')) s = '/' + s;
      page.slug = s;
    }
    if (description !== undefined) page.description = description;
    if (meta !== undefined) page.meta = meta;
    if (access) page.access = access;
    if (isHome !== undefined) {
      page.isHome = isHome;
      if (isHome) {
        await Page.updateMany({ _id: { $ne: page._id } }, { $set: { isHome: false } });
      }
    }

    await page.save();

    return res.status(200).json({
      success: true,
      message: 'Draft saved successfully without affecting published frontend.',
      data: page,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to save page draft', error: err.message });
  }
};

export const publishAdminPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { changeNote } = req.body;

    const page = await Page.findOne({ $or: [{ _id: id }, { pageId: id }] });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const newVersion = (page.currentVersion || 0) + 1;

    // Snapshot for revision history
    const revisionSnapshot = {
      version: newVersion,
      publishedAt: new Date(),
      publishedBy: (req as any).user?.name || 'Administrator',
      changeNote: changeNote || `Published version ${newVersion}`,
      snapshot: {
        title: page.title,
        slug: page.slug,
        meta: page.meta,
        sections: JSON.parse(JSON.stringify(page.draftSections && page.draftSections.length > 0 ? page.draftSections : page.sections)),
      },
    };

    // Promote draftSections to live published sections
    page.sections = JSON.parse(JSON.stringify(page.draftSections && page.draftSections.length > 0 ? page.draftSections : page.sections));
    page.status = 'published';
    page.currentVersion = newVersion;
    page.revisions.unshift(revisionSnapshot as any);

    // Keep max 25 revisions
    if (page.revisions.length > 25) {
      page.revisions = page.revisions.slice(0, 25);
    }

    await page.save();

    await FrontendAuditLog.create({
      adminName: (req as any).user?.name || 'Administrator',
      action: 'publish_page',
      targetType: 'Page',
      targetId: page.pageId,
      targetTitle: `${page.title} (v${newVersion})`,
      details: { changeNote },
    });

    return res.status(200).json({
      success: true,
      message: `Page published live as Version ${newVersion}!`,
      data: page,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to publish page', error: err.message });
  }
};

export const rollbackAdminPage = async (req: Request, res: Response) => {
  try {
    const { id, version } = req.params;
    const targetVersion = Number(version);

    const page = await Page.findOne({ $or: [{ _id: id }, { pageId: id }] });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const rev = page.revisions.find((r) => r.version === targetVersion);
    if (!rev) {
      return res.status(404).json({ success: false, message: `Revision version ${version} not found.` });
    }

    // Restore snapshot into draft and published
    page.sections = rev.snapshot.sections;
    page.draftSections = JSON.parse(JSON.stringify(rev.snapshot.sections));
    if (rev.snapshot.title) page.title = rev.snapshot.title;
    if (rev.snapshot.slug) page.slug = rev.snapshot.slug;

    await page.save();

    await FrontendAuditLog.create({
      adminName: (req as any).user?.name || 'Administrator',
      action: 'rollback_page',
      targetType: 'Page',
      targetId: page.pageId,
      targetTitle: `${page.title} (Rolled back to v${targetVersion})`,
    });

    return res.status(200).json({
      success: true,
      message: `Page successfully rolled back to Version ${targetVersion}!`,
      data: page,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to rollback page', error: err.message });
  }
};

export const duplicateAdminPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const original = await Page.findOne({ $or: [{ _id: id }, { pageId: id }] });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Original page not found' });
    }

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newPage = await Page.create({
      pageId: `page_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      description: original.description,
      status: 'draft',
      isHome: false,
      access: original.access,
      meta: original.meta,
      sections: JSON.parse(JSON.stringify(original.sections)),
      draftSections: JSON.parse(JSON.stringify(original.draftSections || original.sections)),
      currentVersion: 1,
      revisions: [],
    });

    return res.status(201).json({ success: true, message: 'Page duplicated successfully', data: newPage });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to duplicate page', error: err.message });
  }
};

export const deleteAdminPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await Page.findOne({ $or: [{ _id: id }, { pageId: id }] });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    if (page.isHome) {
      return res.status(400).json({ success: false, message: 'Cannot delete the active homepage. Set another page as homepage first.' });
    }

    await Page.deleteOne({ _id: page._id });

    await FrontendAuditLog.create({
      adminName: (req as any).user?.name || 'Administrator',
      action: 'delete_page',
      targetType: 'Page',
      targetId: page.pageId,
      targetTitle: page.title,
    });

    return res.status(200).json({ success: true, message: 'Page deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete page', error: err.message });
  }
};

// Theme Management
export const getAdminTheme = async (_req: Request, res: Response) => {
  try {
    let theme = await ThemeConfig.findOne({ key: 'global_theme' });
    if (!theme) {
      theme = await ThemeConfig.create(DEFAULT_THEME);
    }
    return res.status(200).json({ success: true, data: theme });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch theme', error: err.message });
  }
};

export const updateAdminTheme = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    let theme = await ThemeConfig.findOneAndUpdate(
      { key: 'global_theme' },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    await FrontendAuditLog.create({
      adminName: (req as any).user?.name || 'Administrator',
      action: 'update_theme',
      targetType: 'Theme',
      targetId: 'global_theme',
      targetTitle: theme.name,
    });

    return res.status(200).json({ success: true, message: 'Global design tokens and theme updated live!', data: theme });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to update theme', error: err.message });
  }
};

// Forms Management
export const getAdminForms = async (_req: Request, res: Response) => {
  try {
    const forms = await FormSchema.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: forms });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch forms', error: err.message });
  }
};

export const saveAdminForm = async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    if (!formData.formKey || !formData.title) {
      return res.status(400).json({ success: false, message: 'Form key and title are required.' });
    }

    const form = await FormSchema.findOneAndUpdate(
      { formKey: formData.formKey },
      { $set: { ...formData, $inc: { version: 1 } } },
      { new: true, upsert: true }
    );

    await FrontendAuditLog.create({
      adminName: (req as any).user?.name || 'Administrator',
      action: 'update_form',
      targetType: 'Form',
      targetId: form.formKey,
      targetTitle: form.title,
    });

    return res.status(200).json({ success: true, message: 'Form schema saved successfully', data: form });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to save form', error: err.message });
  }
};

export const deleteAdminForm = async (req: Request, res: Response) => {
  try {
    const { formKey } = req.params;
    await FormSchema.deleteOne({ formKey });
    return res.status(200).json({ success: true, message: 'Form deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete form', error: err.message });
  }
};

// Media Management
export const getAdminMedia = async (_req: Request, res: Response) => {
  try {
    const media = await MediaAsset.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: media });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch media assets', error: err.message });
  }
};

export const createAdminMedia = async (req: Request, res: Response) => {
  try {
    const { name, url, category, altText, size, mimeType } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'Media name and URL are required.' });
    }

    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const asset = await MediaAsset.create({
      assetId,
      name,
      url,
      category: category || 'general',
      altText: altText || name,
      size: size || 0,
      mimeType: mimeType || 'image/jpeg',
      uploadedBy: (req as any).user?.name || 'Administrator',
    });

    return res.status(201).json({ success: true, message: 'Media registered successfully', data: asset });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to register media asset', error: err.message });
  }
};

export const deleteAdminMedia = async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    await MediaAsset.deleteOne({ assetId });
    return res.status(200).json({ success: true, message: 'Media asset deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete media asset', error: err.message });
  }
};

// Audit Logs
export const getAuditLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await FrontendAuditLog.find().sort({ timestamp: -1 }).limit(100);
    return res.status(200).json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs', error: err.message });
  }
};

// Master Seeder Function
export const seedDefaultContent = async (_req: Request, res: Response) => {
  try {
    // 1. Seed Theme
    let theme = await ThemeConfig.findOne({ key: 'global_theme' });
    if (!theme) {
      theme = await ThemeConfig.create(DEFAULT_THEME);
    }

    // 2. Seed Forms
    for (const formDef of DEFAULT_FORMS) {
      const exists = await FormSchema.findOne({ formKey: formDef.formKey });
      if (!exists) {
        await FormSchema.create(formDef);
      }
    }

    // 3. Seed Default Pages
    const defaultPages = getDefaultPages();
    for (const pageDef of defaultPages) {
      const exists = await Page.findOne({ slug: pageDef.slug });
      if (!exists) {
        await Page.create({
          ...pageDef,
          draftSections: JSON.parse(JSON.stringify(pageDef.sections || [])),
          currentVersion: 1,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: '100% Soft-Coded CMS Pages, Forms, and Theme seeded successfully!',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to seed default content', error: err.message });
  }
};
