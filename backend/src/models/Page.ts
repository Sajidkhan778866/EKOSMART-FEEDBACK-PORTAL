import mongoose, { Schema, Document } from 'mongoose';

export type ComponentType =
  | 'hero_banner'
  | 'service_cards_grid'
  | 'feature_grid'
  | 'dynamic_form'
  | 'ticket_tracker'
  | 'warranty_checker'
  | 'text_heading'
  | 'rich_text'
  | 'button'
  | 'button_group'
  | 'card'
  | 'card_grid'
  | 'accordion_faq'
  | 'tabs_container'
  | 'stats_counter'
  | 'image_gallery'
  | 'video_player'
  | 'alert_banner'
  | 'divider_spacer'
  | 'data_table'
  | 'customer_wallet_card'
  | 'customer_profile_card'
  | 'contact_info_box';

export interface IComponentConfig {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;
  styling?: {
    color?: string;
    bgColor?: string;
    bgGradient?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    padding?: string;
    margin?: string;
    border?: string;
    borderRadius?: string;
    shadow?: string;
    width?: string;
    maxWidth?: string;
    height?: string;
    customCss?: string;
  };
  responsive?: {
    hideOnDesktop?: boolean;
    hideOnTablet?: boolean;
    hideOnMobile?: boolean;
    mobileFontSize?: string;
    tabletFontSize?: string;
    mobilePadding?: string;
  };
  animation?: {
    type?: 'none' | 'fade-in' | 'slide-up' | 'slide-down' | 'zoom-in' | 'bounce';
    duration?: string;
    delay?: string;
    hoverEffect?: 'none' | 'scale' | 'glow' | 'lift';
  };
  action?: {
    type?: 'none' | 'navigate' | 'external_link' | 'open_modal' | 'scroll_to' | 'submit_form';
    payload?: string;
    target?: '_self' | '_blank';
  };
  children?: IComponentConfig[];
}

export interface ISectionConfig {
  id: string;
  name: string;
  type: 'standard' | 'hero' | 'grid' | 'fullwidth' | 'split' | 'card_container';
  layout: {
    width?: 'boxed' | 'full' | 'narrow';
    maxWidth?: string;
    columns?: number;
    gap?: string;
    alignItems?: 'start' | 'center' | 'end' | 'stretch';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
    direction?: 'row' | 'column';
  };
  styling: {
    bgColor?: string;
    bgGradient?: string;
    bgImage?: string;
    bgOverlayOpacity?: number;
    paddingY?: string;
    paddingX?: string;
    marginY?: string;
    borderRadius?: string;
    border?: string;
    shadow?: string;
    minHeight?: string;
  };
  responsive: {
    hideOnDesktop?: boolean;
    hideOnTablet?: boolean;
    hideOnMobile?: boolean;
    columnsTablet?: number;
    columnsMobile?: number;
    paddingYMobile?: string;
  };
  components: IComponentConfig[];
  isVisible: boolean;
  order: number;
}

export interface IPageRevision {
  revisionId: string;
  title: string;
  sections: ISectionConfig[];
  designTokensOverride?: Record<string, any>;
  publishedAt: Date;
  publishedBy: string;
  note?: string;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  isHomepage: boolean;
  isPublished: boolean;
  status: 'draft' | 'published' | 'archived';
  accessLevel: 'public' | 'customer' | 'employee' | 'admin';
  sections: ISectionConfig[];
  draftSections: ISectionConfig[];
  revisions: IPageRevision[];
  designTokensOverride?: Record<string, any>;
  customCss?: string;
  order: number;
  lastPublishedAt?: Date;
  lastEditedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComponentSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, default: 'Component' },
    props: { type: Schema.Types.Mixed, default: {} },
    styling: { type: Schema.Types.Mixed, default: {} },
    responsive: { type: Schema.Types.Mixed, default: {} },
    animation: { type: Schema.Types.Mixed, default: {} },
    action: { type: Schema.Types.Mixed, default: {} },
    children: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: 'Section' },
    type: { type: String, default: 'standard' },
    layout: { type: Schema.Types.Mixed, default: { width: 'boxed', columns: 1, gap: '1.5rem' } },
    styling: { type: Schema.Types.Mixed, default: { paddingY: '3rem', paddingX: '1.5rem' } },
    responsive: { type: Schema.Types.Mixed, default: {} },
    components: { type: [ComponentSchema], default: [] },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const PageRevisionSchema = new Schema(
  {
    revisionId: { type: String, required: true },
    title: { type: String, required: true },
    sections: { type: [SectionSchema], default: [] },
    designTokensOverride: { type: Schema.Types.Mixed, default: {} },
    publishedAt: { type: Date, default: Date.now },
    publishedBy: { type: String, default: 'Admin' },
    note: { type: String, default: 'Published revision' },
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    metaDescription: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    isHomepage: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    accessLevel: { type: String, enum: ['public', 'customer', 'employee', 'admin'], default: 'public' },
    sections: { type: [SectionSchema], default: [] },
    draftSections: { type: [SectionSchema], default: [] },
    revisions: { type: [PageRevisionSchema], default: [] },
    designTokensOverride: { type: Schema.Types.Mixed, default: {} },
    customCss: { type: String, default: '' },
    order: { type: Number, default: 0 },
    lastPublishedAt: { type: Date },
    lastEditedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

PageSchema.index({ slug: 1, isPublished: 1 });

const Page: mongoose.Model<IPage> = (mongoose.models.Page as mongoose.Model<IPage>) || mongoose.model<IPage>('Page', PageSchema);
export { Page };
export default Page;
