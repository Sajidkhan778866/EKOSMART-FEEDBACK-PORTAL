import mongoose, { Schema, Document } from 'mongoose';

export interface IComponentConfig {
  id: string;
  type: string; // 'HeroBanner' | 'HeadingText' | 'RichTextBlock' | 'ServiceCardGrid' | 'FeatureList' | 'ImageBlock' | 'VideoBlock' | 'Button' | 'ButtonGroup' | 'AccordionFaq' | 'TabsBlock' | 'StatsCounter' | 'DynamicFormBlock' | 'ComplaintTrackerBlock' | 'WarrantyCheckBlock' | 'CustomerReferralWidget' | 'ContactDirectoryBlock' | 'AlertBanner' | 'Divider' | 'PricingCardGrid' | 'TestimonialsCarousel'
  name?: string;
  isVisible: boolean;
  order: number;
  props: Record<string, any>;
  style?: {
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textColor?: string;
    bgColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    shadow?: string;
    border?: string;
    customCss?: string;
  };
  responsive?: {
    hideDesktop?: boolean;
    hideTablet?: boolean;
    hideMobile?: boolean;
  };
  action?: {
    type: 'none' | 'navigate' | 'modal' | 'scroll' | 'external_link' | 'trigger_form';
    target?: string;
  };
}

export interface ISectionConfig {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
  container: {
    maxWidth?: 'full' | '7xl' | '6xl' | '5xl' | '4xl' | '3xl' | 'prose';
    width?: string;
    minHeight?: string;
    paddingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    paddingX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    marginY?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
    bgType?: 'transparent' | 'solid' | 'gradient' | 'image';
    bgColor?: string;
    bgGradient?: string;
    bgImage?: string;
    bgOverlayOpacity?: number;
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
    borderColor?: string;
    borderWidth?: string;
  };
  layout: {
    display?: 'block' | 'grid' | 'flex';
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
    gridGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    flexDir?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexAlign?: 'start' | 'center' | 'end' | 'stretch';
    flexJustify?: 'start' | 'center' | 'end' | 'between' | 'around';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  };
  responsive?: {
    hideDesktop?: boolean;
    hideTablet?: boolean;
    hideMobile?: boolean;
    mobileCols?: 1 | 2;
    tabletCols?: 1 | 2 | 3;
    mobilePaddingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  };
  components: IComponentConfig[];
}

export interface IPageRevision {
  version: number;
  publishedAt: Date;
  publishedBy: string;
  changeNote?: string;
  snapshot: {
    title: string;
    slug: string;
    meta?: any;
    sections: ISectionConfig[];
  };
}

export interface IPage extends Document {
  pageId: string;
  title: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  isHome: boolean;
  access: 'public' | 'customer' | 'employee' | 'admin';
  meta: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  sections: ISectionConfig[];
  draftSections: ISectionConfig[];
  currentVersion: number;
  revisions: IPageRevision[];
  headerConfigOverride?: any;
  footerConfigOverride?: any;
  createdAt: Date;
  updatedAt: Date;
}

const componentSchema = new Schema<IComponentConfig>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    props: { type: Schema.Types.Mixed, default: {} },
    style: {
      textAlign: { type: String, default: 'left' },
      textColor: { type: String, default: '' },
      bgColor: { type: String, default: '' },
      padding: { type: String, default: '' },
      margin: { type: String, default: '' },
      borderRadius: { type: String, default: '' },
      shadow: { type: String, default: '' },
      border: { type: String, default: '' },
      customCss: { type: String, default: '' },
    },
    responsive: {
      hideDesktop: { type: Boolean, default: false },
      hideTablet: { type: Boolean, default: false },
      hideMobile: { type: Boolean, default: false },
    },
    action: {
      type: { type: String, default: 'none' },
      target: { type: String, default: '' },
    },
  },
  { _id: false }
);

const sectionSchema = new Schema<ISectionConfig>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    container: {
      maxWidth: { type: String, default: '7xl' },
      width: { type: String, default: '100%' },
      minHeight: { type: String, default: '' },
      paddingY: { type: String, default: 'md' },
      paddingX: { type: String, default: 'md' },
      marginY: { type: String, default: 'none' },
      bgType: { type: String, default: 'transparent' },
      bgColor: { type: String, default: '' },
      bgGradient: { type: String, default: '' },
      bgImage: { type: String, default: '' },
      bgOverlayOpacity: { type: Number, default: 0 },
      borderRadius: { type: String, default: 'none' },
      shadow: { type: String, default: 'none' },
      borderStyle: { type: String, default: 'none' },
      borderColor: { type: String, default: '' },
      borderWidth: { type: String, default: '' },
    },
    layout: {
      display: { type: String, default: 'block' },
      gridCols: { type: Number, default: 1 },
      gridGap: { type: String, default: 'md' },
      flexDir: { type: String, default: 'column' },
      flexAlign: { type: String, default: 'start' },
      flexJustify: { type: String, default: 'start' },
      flexWrap: { type: String, default: 'wrap' },
    },
    responsive: {
      hideDesktop: { type: Boolean, default: false },
      hideTablet: { type: Boolean, default: false },
      hideMobile: { type: Boolean, default: false },
      mobileCols: { type: Number, default: 1 },
      tabletCols: { type: Number, default: 1 },
      mobilePaddingY: { type: String, default: 'sm' },
    },
    components: [componentSchema],
  },
  { _id: false }
);

const pageRevisionSchema = new Schema<IPageRevision>(
  {
    version: { type: Number, required: true },
    publishedAt: { type: Date, default: Date.now },
    publishedBy: { type: String, default: 'Admin' },
    changeNote: { type: String, default: '' },
    snapshot: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const pageSchema = new Schema<IPage>(
  {
    pageId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    isHome: { type: Boolean, default: false },
    access: { type: String, enum: ['public', 'customer', 'employee', 'admin'], default: 'public' },
    meta: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    sections: [sectionSchema],
    draftSections: [sectionSchema],
    currentVersion: { type: Number, default: 1 },
    revisions: [pageRevisionSchema],
    headerConfigOverride: { type: Schema.Types.Mixed },
    footerConfigOverride: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for fast lookup
pageSchema.index({ slug: 1, status: 1 });
pageSchema.index({ isHome: 1 });

export const Page = mongoose.model<IPage>('Page', pageSchema);
