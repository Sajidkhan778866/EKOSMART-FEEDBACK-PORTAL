import { Request, Response } from 'express';
import ThemeConfig, {
  defaultColors,
  defaultTypography,
  defaultDimensions,
  defaultEffects,
  defaultHeader,
  defaultFooter,
  IThemeConfig,
} from '../models/ThemeConfig';
import FrontendAuditLog from '../models/FrontendAuditLog';

// Helper: Ensure theme exists
export const getOrCreateTheme = async (): Promise<IThemeConfig> => {
  let theme = await ThemeConfig.findOne({ key: 'global_theme' });
  if (!theme) {
    console.log('[Theme] Initializing default global design tokens in MongoDB...');
    theme = await ThemeConfig.create({
      key: 'global_theme',
      colors: defaultColors,
      typography: defaultTypography,
      dimensions: defaultDimensions,
      effects: defaultEffects,
      header: defaultHeader,
      footer: defaultFooter,
      lastPublishedAt: new Date(),
    });
  }
  return theme;
};

// GET /api/v1/theme/public (Get published global design tokens & navigation)
export const getPublicTheme = async (_req: Request, res: Response) => {
  try {
    const theme = await getOrCreateTheme();
    res.json({
      success: true,
      data: {
        colors: theme.colors,
        typography: theme.typography,
        dimensions: theme.dimensions,
        effects: theme.effects,
        header: theme.header,
        footer: theme.footer,
        customGlobalCss: theme.customGlobalCss,
        lastPublishedAt: theme.lastPublishedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/theme/admin (Get admin full theme with draft)
export const getAdminTheme = async (_req: Request, res: Response) => {
  try {
    const theme = await getOrCreateTheme();
    res.json({
      success: true,
      data: theme,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/theme/admin/draft (Save draft design tokens)
export const updateAdminThemeDraft = async (req: Request, res: Response) => {
  try {
    const { colors, typography, dimensions, effects, header, footer, customGlobalCss } = req.body;
    const theme = await getOrCreateTheme();

    theme.draftConfig = {
      colors: colors || theme.draftConfig?.colors || theme.colors,
      typography: typography || theme.draftConfig?.typography || theme.typography,
      dimensions: dimensions || theme.draftConfig?.dimensions || theme.dimensions,
      effects: effects || theme.draftConfig?.effects || theme.effects,
      header: header || theme.draftConfig?.header || theme.header,
      footer: footer || theme.draftConfig?.footer || theme.footer,
    };

    if (customGlobalCss !== undefined) {
      theme.customGlobalCss = customGlobalCss;
    }

    theme.lastEditedBy = (req as any).user?.name || 'Admin';
    await theme.save();

    await FrontendAuditLog.create({
      action: 'update_theme_draft',
      targetType: 'theme',
      targetName: 'Global Design Tokens & Layout',
      adminEmail: (req as any).user?.email || 'admin@ekosmart.com',
      details: { hasHeader: Boolean(header), hasColors: Boolean(colors) },
    });

    res.json({
      success: true,
      message: 'Theme draft saved successfully',
      data: theme,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/theme/admin/publish (Publish draft tokens live)
export const publishAdminTheme = async (req: Request, res: Response) => {
  try {
    const { note = 'Published global design tokens & layout' } = req.body;
    const theme = await getOrCreateTheme();

    if (theme.draftConfig) {
      theme.colors = theme.draftConfig.colors;
      theme.typography = theme.draftConfig.typography;
      theme.dimensions = theme.draftConfig.dimensions;
      theme.effects = theme.draftConfig.effects;
      theme.header = theme.draftConfig.header;
      theme.footer = theme.draftConfig.footer;
    }

    theme.lastPublishedAt = new Date();
    theme.lastEditedBy = (req as any).user?.name || 'Admin';

    // Record revision
    const revision = {
      revisionId: `theme_rev_${Date.now()}`,
      publishedAt: new Date(),
      publishedBy: (req as any).user?.name || 'Admin',
      colors: theme.colors,
      typography: theme.typography,
      dimensions: theme.dimensions,
      effects: theme.effects,
      header: theme.header,
      footer: theme.footer,
      note,
    };

    if (!theme.revisions) theme.revisions = [];
    theme.revisions.unshift(revision as any);
    if (theme.revisions.length > 20) {
      theme.revisions = theme.revisions.slice(0, 20);
    }

    await theme.save();

    await FrontendAuditLog.create({
      action: 'publish_theme',
      targetType: 'theme',
      targetName: 'Global Design Tokens & Layout',
      adminEmail: (req as any).user?.email || 'admin@ekosmart.com',
      details: { revisionId: revision.revisionId, note },
    });

    res.json({
      success: true,
      message: 'Global design tokens and layout published live to the frontend!',
      data: theme,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/theme/admin/reset (Reset tokens to default)
export const resetAdminTheme = async (req: Request, res: Response) => {
  try {
    const theme = await getOrCreateTheme();

    theme.colors = defaultColors;
    theme.typography = defaultTypography;
    theme.dimensions = defaultDimensions;
    theme.effects = defaultEffects;
    theme.header = defaultHeader;
    theme.footer = defaultFooter;
    theme.draftConfig = null as any;
    theme.lastPublishedAt = new Date();
    theme.lastEditedBy = (req as any).user?.name || 'Admin';

    theme.revisions.unshift({
      revisionId: `theme_rev_${Date.now()}_reset`,
      publishedAt: new Date(),
      publishedBy: (req as any).user?.name || 'Admin',
      colors: defaultColors,
      typography: defaultTypography,
      dimensions: defaultDimensions,
      effects: defaultEffects,
      header: defaultHeader,
      footer: defaultFooter,
      note: 'Factory reset to default enterprise theme',
    } as any);

    await theme.save();

    await FrontendAuditLog.create({
      action: 'reset_theme',
      targetType: 'theme',
      targetName: 'Global Design Tokens & Layout',
      adminEmail: (req as any).user?.email || 'admin@ekosmart.com',
      details: { note: 'Reset to factory defaults' },
    });

    res.json({
      success: true,
      message: 'Reset theme to factory default tokens successfully',
      data: theme,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
