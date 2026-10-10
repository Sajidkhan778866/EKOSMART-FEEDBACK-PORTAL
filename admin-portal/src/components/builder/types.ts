export interface IComponentConfig {
  id: string;
  type: string;
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
  publishedAt: string;
  publishedBy: string;
  changeNote?: string;
  snapshot: {
    title: string;
    slug: string;
    meta?: any;
    sections: ISectionConfig[];
  };
}

export interface IPage {
  _id?: string;
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
  updatedAt?: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface IThemeConfig {
  _id?: string;
  key: string;
  name: string;
  tokens: {
    colors: {
      primary: string;
      primaryHover: string;
      primaryGradient: string;
      secondary: string;
      secondaryHover: string;
      accent: string;
      background: string;
      surface: string;
      surfaceBorder: string;
      text: string;
      textMuted: string;
      textInverted: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
      headerBg: string;
      footerBg: string;
    };
    typography: {
      fontFamily: string;
      headingFont: string;
      baseFontSize: string;
      headingScaleRatio: number;
      fontWeights: {
        normal: number;
        medium: number;
        bold: number;
        black: number;
      };
      lineHeight: string;
    };
    spacing: {
      containerMaxWidth: string;
      radiusDefault: string;
      radiusCard: string;
      radiusButton: string;
      spacingScale: number;
      shadowLevel: string;
    };
    effects: {
      enableAnimations: boolean;
      transitionDuration: string;
      hoverScale: string;
      entranceAnimation: string;
    };
  };
  header: {
    logoType: 'preset' | 'image';
    logoUrl?: string;
    siteTitle: string;
    tagline: string;
    height: string;
    isSticky: boolean;
    isTransparent: boolean;
    showCustomerLoginButton: boolean;
    ctaButton?: {
      label: string;
      url: string;
      isVisible: boolean;
      color: string;
    };
    navItems: Array<{
      id: string;
      label: string;
      url: string;
      icon?: string;
      order: number;
      isVisible: boolean;
      isExternal?: boolean;
      highlightBadge?: string;
      dropdownItems?: Array<{
        id: string;
        label: string;
        url: string;
        icon?: string;
        description?: string;
      }>;
    }>;
  };
  footer: {
    companyName: string;
    tagline: string;
    copyrightText: string;
    disclaimer: string;
    address: string;
    phone: string;
    email: string;
    officeHours: string;
    gstin: string;
    website: string;
    showPrivacyPolicy: boolean;
    showTermsConditions: boolean;
    showRefundPolicy: boolean;
    columns: Array<{
      title: string;
      links: Array<{
        label: string;
        url: string;
        isExternal?: boolean;
      }>;
    }>;
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  loginPromptTimer: {
    enabled: boolean;
    durationSeconds: number;
    title: string;
    message: string;
  };
}
