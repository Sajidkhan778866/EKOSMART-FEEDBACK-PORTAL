import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceCard {
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

export interface IContent extends Document {
  key: string;
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
  footer: {
    companyName: string;
    copyrightText: string;
    disclaimer: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    gstin: string;
    officeHours: string;
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
  updatedAt: Date;
}

const serviceCardSchema = new Schema<IServiceCard>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, required: true },
  section: { type: String, default: 'General' },
  badge: { type: String, default: '' },
  features: { type: [String], default: [] },
  linkUrl: { type: String, required: true },
  buttonText: { type: String, required: true },
  color: { type: String, default: 'emerald' },
  icon: { type: String, default: 'FileText' },
  iconType: { type: String, enum: ['icon', 'image'], default: 'icon' },
  iconImage: { type: String, default: '' },
  bgType: { type: String, enum: ['color', 'image'], default: 'color' },
  bgImage: { type: String, default: '' },
  bgOverlayOpacity: { type: Number, default: 70 },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 1 },
});

const divisionContactSchema = new Schema(
  {
    id: { type: String, default: () => `div-contact-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    inCharge: { type: String, default: '' },
    officeHours: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { _id: false }
);

const contentSchema = new Schema<IContent>(
  {
    key: { type: String, default: 'global_cms', unique: true },
    hero: {
      heading: { type: String, default: 'Ekosmart Battery Solution (EBS)\nHigh Power Lithium-Ion & LFP Battery Packs' },
      subheading: {
        type: String,
        default: 'High Charging Power • Long Life • Low Maintenance. Official support portal for EV scooter & E-rickshaw batteries, genuine spare parts, and warranty verification.',
      },
      primaryButtonText: { type: String, default: 'Register Complaint' },
      primaryButtonLink: { type: String, default: '/complaint/register' },
      secondaryButtonText: { type: String, default: 'Check Battery Warranty' },
      secondaryButtonLink: { type: String, default: '/warranty/check' },
      logoType: { type: String, enum: ['preset', 'image'], default: 'preset' },
      logoImage: { type: String, default: '' },
      complaintLogoType: { type: String, enum: ['preset', 'image'], default: 'preset' },
      complaintLogoImage: { type: String, default: '' },
    },
    serviceCards: [serviceCardSchema],
    contactInfo: {
      heading: { type: String, default: 'Get in Touch With Us' },
      subheading: {
        type: String,
        default:
          'Need technical assistance with your Lithium-Ion / LFP battery pack, genuine EV spare parts, warranty verification, or showroom dealership inquiries? Our Kota Central Plant engineering team is here to help.',
      },
      badgeText: { type: String, default: 'Official Ekosmart Support & Contact Directory' },
      helplinePhone: { type: String, default: '+91 8949049003' },
      alternatePhone: { type: String, default: '+91 9549730483' },
      whatsappNumber: { type: String, default: '+91 8949049003' },
      supportEmail: { type: String, default: 'support@ekosmartdrive.in' },
      salesEmail: { type: String, default: 'sales@ekosmartdrive.in' },
      plantAddress: { type: String, default: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002' },
      officeHours: { type: String, default: '10:00 AM to 6:30 PM (Mon - Sat)' },
      gstin: { type: String, default: '08DTUPM4205B1Z0' },
      website: { type: String, default: 'www.ekosmartdrive.in' },
      mapUrl: { type: String, default: 'https://maps.google.com/?q=Kota,Rajasthan' },
      dropdownOptions: {
        type: [String],
        default: [
          'Lithium Battery Solution (EBS)',
          'EV Spare Parts Wholesale/Retail',
          'Drive Rental Assistance',
          'Showroom & Dealership Inquiries',
          'Plant Commercial Warranty Inspection',
        ],
      },
      divisionContacts: [divisionContactSchema],
      isPublished: { type: Boolean, default: true },
    },
    footer: {
      companyName: { type: String, default: 'Ekosmart Battery Solution (EBS) & EV Spare Parts' },
      copyrightText: { type: String, default: '2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0' },
      disclaimer: { type: String, default: 'Official customer support, complaint tracking & battery warranty verification portal' },
      address: { type: String, default: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002' },
      phone: { type: String, default: '+91 8949049003' },
      email: { type: String, default: 'support@ekosmartdrive.in' },
      website: { type: String, default: 'www.ekosmartdrive.in' },
      gstin: { type: String, default: '08DTUPM4205B1Z0' },
      officeHours: { type: String, default: '10:00 AM to 6:30 PM (Mon - Sat)' },
      showPrivacyPolicy: { type: Boolean, default: true },
      showTermsConditions: { type: Boolean, default: true },
      showRefundPolicy: { type: Boolean, default: true },
      logoType: { type: String, enum: ['preset', 'image'], default: 'preset' },
      logoImage: { type: String, default: '' },
    },
    privacyPolicy: {
      title: { type: String, default: 'Privacy Policy & Battery Data Protection' },
      content: {
        type: String,
        default: `1. Information We Collect
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
      },
      isPublished: { type: Boolean, default: true },
    },
    termsConditions: {
      title: { type: String, default: 'Terms & Conditions (Battery & Spare Parts Policy)' },
      content: {
        type: String,
        default: `1. Service & Warranty Registration Terms:
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
      },
      isPublished: { type: Boolean, default: true },
    },
    refundPolicy: {
      title: { type: String, default: 'Refund & Battery Replacement Policy' },
      content: {
        type: String,
        default: `1. Battery & Spare Parts Replacement:
Defective battery cells, BMS circuit boards, and genuine spare parts verified under valid active warranty (3 Years for 48V, 1.5 Years for 60V/72V, 1 Year for Aluminium Chargers) will be repaired or replaced free of charge by authorized Ekosmart service engineers within standard SLA timelines. Pan-India transport charges are extra as applicable.

2. Rental Security Deposit Refunds:
Security deposits for EV rental plans are refunded to the original payment source within 5-7 business days following vehicle return and technical handover clearance.

3. Bulk & Wholesale MOQ Orders:
Bulk battery orders applicable as per Minimum Order Quantity (MOQ 5 / MOQ 10) terms with dispatch clearance from Kota Central Plant.`,
      },
      isPublished: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const Content = mongoose.model<IContent>('Content', contentSchema);
