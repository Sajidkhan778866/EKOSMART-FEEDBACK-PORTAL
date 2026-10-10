import { Request, Response } from 'express';
import MediaAsset from '../models/MediaAsset';
import FrontendAuditLog from '../models/FrontendAuditLog';
import fs from 'fs';
import path from 'path';

// GET /api/v1/media/admin (List media library assets)
export const getMediaAssets = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { altText: { $regex: String(search), $options: 'i' } },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const assets = await MediaAsset.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assets,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/media/admin/upload (Upload asset)
export const uploadMediaAsset = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { name, category = 'general', altText = '', tags = '' } = req.body;
    const cleanTags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

    const fileUrl = `/uploads/${req.file.filename}`;

    const asset = await MediaAsset.create({
      name: name || req.file.originalname,
      category,
      url: fileUrl,
      altText: altText || name || req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: cleanTags,
      uploadedBy: (req as any).user?.name || 'Admin',
    });

    await FrontendAuditLog.create({
      action: 'upload_media',
      targetType: 'media',
      targetId: String(asset._id),
      targetName: asset.name,
      adminEmail: (req as any).user?.email || 'admin@ekosmart.com',
      details: { url: fileUrl, category, size: req.file.size },
    });

    res.status(201).json({
      success: true,
      message: 'Media asset uploaded successfully',
      data: asset,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/media/admin/:id
export const deleteMediaAsset = async (req: Request, res: Response) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found' });
    }

    // Attempt local file cleanup
    try {
      const filename = path.basename(asset.url);
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      // ignore file removal failure
    }

    await MediaAsset.findByIdAndDelete(req.params.id);

    await FrontendAuditLog.create({
      action: 'delete_media',
      targetType: 'media',
      targetId: String(asset._id),
      targetName: asset.name,
      adminEmail: (req as any).user?.email || 'admin@ekosmart.com',
      details: { url: asset.url },
    });

    res.json({
      success: true,
      message: `Media asset "${asset.name}" deleted successfully`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
