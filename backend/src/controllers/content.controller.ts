import { Request, Response } from 'express';
import { Content, IServiceCard } from '../models/Content';

export const defaultServiceCards: IServiceCard[] = [
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
];

export const defaultHeroData = {
  heading: 'Ekosmart Battery Solution (EBS)\nHigh Power Lithium-Ion & LFP Battery Packs',
  subheading: 'High Charging Power • Long Life • Low Maintenance. Official support portal for EV scooter & E-rickshaw batteries, genuine spare parts, and warranty verification.',
  primaryButtonText: 'Register Complaint',
  primaryButtonLink: '/complaint/register',
  secondaryButtonText: 'Check Battery Warranty',
  secondaryButtonLink: '/warranty/check',
  logoType: 'preset' as const,
  logoImage: '',
  complaintLogoType: 'preset' as const,
  complaintLogoImage: '',
};

export const defaultFooterData = {
  companyName: 'Ekosmart Battery Solution (EBS) & EV Spare Parts',
  copyrightText: '2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0',
  disclaimer: 'Official customer support, complaint tracking & battery warranty verification portal',
  address: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
  phone: '+91 8949049003',
  email: 'support@ekosmartdrive.in',
  website: 'www.ekosmartdrive.in',
  gstin: '08DTUPM4205B1Z0',
  officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
  showPrivacyPolicy: true,
  showTermsConditions: true,
  showRefundPolicy: true,
  logoType: 'preset' as const,
  logoImage: '',
};

export const defaultPrivacyPolicyData = {
  title: 'Privacy Policy & Battery Data Protection',
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
  isPublished: true,
};

export const defaultTermsConditionsData = {
  title: 'Terms & Conditions (Battery & Spare Parts Policy)',
  content: `1. Service & Warranty Registration Terms:
By submitting a complaint, spare parts request, or warranty registration on this portal (www.ekosmartdrive.in), you confirm that all details provided (serial number, bill number, and issue descriptions) are accurate and authentic.

2. EBS EV Battery Warranty Specifications:
- 48V Series Lithium-Ion & LFP Batteries (48V 28Ah, 32Ah, 36Ah, 40Ah): Covered by a 3-Year Official Replacement & Service Warranty with Pan-India technical support.
- 60V Series EV Batteries (60V 28Ah, 32Ah, 36Ah, 40Ah): Covered by a 1.5-Year Official Warranty.
- 72V Series EV Batteries (72V 28Ah, 32Ah, 36Ah): Covered by a 1.5-Year Official Warranty.
- Aluminium Body Lithium Fast Chargers (67.2V / 72V, 6A - 10A): Covered by a 1-Year Official Warranty.

3. Pan-India Service & Transportation Policy:
- Ekosmart Battery Solution provides technical service support across all Indian states.
- In cases requiring factory laboratory inspection or battery pack replacement dispatch from Kota Plant, transportation & freight charges are extra as per standard logistics rates.

4. Warranty Exclusions & Safety Guidelines:
- Battery warranty remains void if the protective seal is broken, casing is tampered with by unauthorized personnel, or if the unit suffers from deep over-discharge, mechanical crush, or direct water immersion.
- Customers must strictly use authorized EBS aluminium body chargers matching rated voltage/amperage specifications.

5. Authorized Divisions:
Service complaints are categorized and handled under four designated divisions: Battery, Rental, Showroom, and Spare Parts. Warranty claims for commercial industrial units fall under the Plant category.`,
  isPublished: true,
};

export const defaultContactData = {
  heading: 'Get in Touch With Us',
  subheading:
    'Need technical assistance with your Lithium-Ion / LFP battery pack, genuine EV spare parts, warranty verification, or showroom dealership inquiries? Our Kota Central Plant engineering team is here to help.',
  badgeText: 'Official Ekosmart Support & Contact Directory',
  helplinePhone: '+91 8949049003',
  supportEmail: 'support@ekosmartdrive.in',
  plantAddress: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
  officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
  gstin: '08DTUPM4205B1Z0',
  website: 'www.ekosmartdrive.in',
  dropdownOptions: [
    'Lithium Battery Solution (EBS)',
    'EV Spare Parts Wholesale/Retail',
    'Drive Rental Assistance',
    'Showroom & Dealership Inquiries',
    'Plant Commercial Warranty Inspection',
  ],
  isPublished: true,
};

export const defaultRefundPolicyData = {
  title: 'Refund & Battery Replacement Policy',
  content: `1. Battery & Spare Parts Replacement:
Defective battery cells, BMS circuit boards, and genuine spare parts verified under valid active warranty (3 Years for 48V, 1.5 Years for 60V/72V, 1 Year for Aluminium Chargers) will be repaired or replaced free of charge by authorized Ekosmart service engineers within standard SLA timelines. Pan-India transport charges are extra as applicable.

2. Rental Security Deposit Refunds:
Security deposits for EV rental plans are refunded to the original payment source within 5-7 business days following vehicle return and technical handover clearance.

3. Bulk & Wholesale MOQ Orders:
Bulk battery orders applicable as per Minimum Order Quantity (MOQ 5 / MOQ 10) terms with dispatch clearance from Kota Central Plant.`,
  isPublished: true,
};

export const getOrCreateDefaultContent = async () => {
  let content = await Content.findOne({ key: 'global_cms' });
  if (!content) {
    content = await Content.create({
      key: 'global_cms',
      hero: defaultHeroData,
      serviceCards: defaultServiceCards,
      contactInfo: defaultContactData,
      footer: defaultFooterData,
      privacyPolicy: defaultPrivacyPolicyData,
      termsConditions: defaultTermsConditionsData,
      refundPolicy: defaultRefundPolicyData,
    });
  } else {
    let modified = false;
    if (!content.serviceCards || content.serviceCards.length === 0) {
      content.serviceCards = defaultServiceCards;
      modified = true;
    }
    if (!content.contactInfo || !content.contactInfo.dropdownOptions || content.contactInfo.dropdownOptions.length === 0) {
      content.contactInfo = defaultContactData;
      modified = true;
    }
    if (!content.footer?.phone || !content.footer?.address) {
      content.footer = { ...defaultFooterData, ...(content.footer ? ((content.footer as any).toObject ? (content.footer as any).toObject() : content.footer) : {}) };
      modified = true;
    }
    if (!content.privacyPolicy?.content?.includes('8949049003')) {
      content.privacyPolicy = defaultPrivacyPolicyData;
      content.termsConditions = defaultTermsConditionsData;
      content.refundPolicy = defaultRefundPolicyData;
      content.hero = defaultHeroData;
      modified = true;
    }
    if (modified) {
      await content.save();
    }
  }
  return content;
};

// GET /api/v1/content/public - Public endpoint
export const getPublicContent = async (_req: Request, res: Response) => {
  try {
    const content = await getOrCreateDefaultContent();
    const visibleCards = (content.serviceCards || [])
      .filter((card) => card.isVisible)
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: {
        hero: content.hero,
        serviceCards: visibleCards,
        contactInfo: content.contactInfo || defaultContactData,
        footer: content.footer,
        privacyPolicy: content.privacyPolicy,
        termsConditions: content.termsConditions,
        refundPolicy: content.refundPolicy,
      },
    });
  } catch (error: any) {
    console.error('Error fetching public content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public content',
      data: {
        hero: defaultHeroData,
        serviceCards: defaultServiceCards,
        contactInfo: defaultContactData,
        footer: defaultFooterData,
        privacyPolicy: defaultPrivacyPolicyData,
        termsConditions: defaultTermsConditionsData,
        refundPolicy: defaultRefundPolicyData,
      },
    });
  }
};

// GET /api/v1/content/admin - Admin endpoint
export const getAdminContent = async (_req: Request, res: Response) => {
  try {
    const content = await getOrCreateDefaultContent();
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin content',
      error: error.message,
    });
  }
};

// PUT /api/v1/content/admin - Admin update endpoint
export const updateAdminContent = async (req: Request, res: Response) => {
  try {
    const { hero, serviceCards, footer, privacyPolicy, termsConditions, refundPolicy, contactInfo } = req.body;
    let content = await getOrCreateDefaultContent();

    if (hero) content.hero = { ...content.hero, ...hero };
    if (serviceCards) {
      content.serviceCards = serviceCards;
      content.markModified('serviceCards');
    }
    if (contactInfo) {
      content.contactInfo = {
        ...(content.contactInfo ? ((content.contactInfo as any).toObject ? (content.contactInfo as any).toObject() : content.contactInfo) : {}),
        ...contactInfo,
      };
      content.markModified('contactInfo');
    }
    if (footer) {
      content.footer = { ...content.footer, ...footer };
      content.markModified('footer');
    }
    if (privacyPolicy) {
      content.privacyPolicy = { ...content.privacyPolicy, ...privacyPolicy };
      content.markModified('privacyPolicy');
    }
    if (termsConditions) {
      content.termsConditions = { ...content.termsConditions, ...termsConditions };
      content.markModified('termsConditions');
    }
    if (refundPolicy) {
      content.refundPolicy = { ...content.refundPolicy, ...refundPolicy };
      content.markModified('refundPolicy');
    }

    content.updatedAt = new Date();
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update content',
      error: error.message,
    });
  }
};
