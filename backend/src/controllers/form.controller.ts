import { Request, Response } from 'express';
import { ComplaintForm } from '../models/ComplaintForm';
import { WarrantyForm } from '../models/WarrantyForm';
import { Content } from '../models/Content';
import { ComplaintType } from '../models/ComplaintType';

const extractDivisionFromCard = (c: any): string => {
  if (c.linkUrl && c.linkUrl.includes('division=')) {
    try {
      const match = c.linkUrl.match(/division=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    } catch {}
  }
  if (c.section && c.section.trim()) {
    return c.section.trim();
  }
  if (c.title && c.title.trim()) {
    return c.title.trim();
  }
  return '';
};

export const getDynamicSections = async (_req: Request, res: Response) => {
  try {
    const content = (await Content.findOne({ key: 'global_cms' })) || (await Content.findOne());
    const sectionsSet = new Set<string>();

    if (content?.serviceCards && Array.isArray(content.serviceCards)) {
      content.serviceCards
        .filter((c) => c.isVisible !== false)
        .forEach((c) => {
          const div = extractDivisionFromCard(c);
          if (div) sectionsSet.add(div);
        });
    }

    const complaintForms = await ComplaintForm.find({ isActive: { $ne: false } }, 'division');
    complaintForms.forEach((f) => {
      const d = f.division?.trim();
      if (d) sectionsSet.add(d);
    });

    let sections = Array.from(sectionsSet);
    if (sections.length === 0) {
      sections = ['Showroom', 'Rental', 'Spare Parts', 'Battery'];
    }

    // Case-insensitive deduplication while preserving original casing
    const uniqueSections: string[] = [];
    const seenLower = new Set<string>();
    for (const sec of sections) {
      const lower = sec.toLowerCase();
      if (!seenLower.has(lower)) {
        seenLower.add(lower);
        uniqueSections.push(sec);
      }
    }

    res.json({ success: true, data: uniqueSections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getComplaintForm = async (req: Request, res: Response) => {
  try {
    const division = req.params.division as any;
    const form = await ComplaintForm.findOne({ division, isActive: true });
    
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found for this division' });
    }
    
    res.json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllComplaintForms = async (_req: Request, res: Response) => {
  try {
    const forms = await ComplaintForm.find();
    res.json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWarrantyForm = async (req: Request, res: Response) => {
  try {
    const category = req.params.category as any;
    const form = await WarrantyForm.findOne({ category, isActive: true });
    
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found for this category' });
    }
    
    res.json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllWarrantyForms = async (_req: Request, res: Response) => {
  try {
    const forms = await WarrantyForm.find();
    res.json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin routes
export const saveComplaintForm = async (req: Request, res: Response) => {
  try {
    const { division, fields } = req.body;
    let form = await ComplaintForm.findOne({ division });
    
    if (form) {
      form.fields = fields;
      form.version += 1;
      await form.save();
    } else {
      form = await ComplaintForm.create({ division, fields });
    }
    
    res.json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteComplaintForm = async (req: Request, res: Response) => {
  try {
    const divisionParam = (req.params.division as string) || '';
    const cleanDiv = divisionParam.trim();

    // 1. Delete complaint form configuration
    await ComplaintForm.deleteMany({
      division: { $regex: new RegExp(`^${cleanDiv}$`, 'i') },
    });

    // 2. Cascade remove matching service card from CMS Content
    const content = (await Content.findOne({ key: 'global_cms' })) || (await Content.findOne());
    if (content && content.serviceCards) {
      content.serviceCards = content.serviceCards.filter(
        (c) => (c.section || c.title || '').trim().toLowerCase() !== cleanDiv.toLowerCase()
      );
      content.markModified('serviceCards');
      await content.save();
    }

    // 3. Cascade remove matching complaint types
    await ComplaintType.deleteMany({
      division: { $regex: new RegExp(`^${cleanDiv}$`, 'i') },
    });

    res.json({
      success: true,
      message: `Service "${cleanDiv}" and form deleted successfully from forms, CMS, and complaint types`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const saveWarrantyForm = async (req: Request, res: Response) => {
  try {
    const { category, fields } = req.body;
    let form = await WarrantyForm.findOne({ category });
    
    if (form) {
      form.fields = fields;
      form.version += 1;
      await form.save();
    } else {
      form = await WarrantyForm.create({ category, fields });
    }
    
    res.json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteWarrantyForm = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    await WarrantyForm.findOneAndDelete({ category });
    res.json({ success: true, message: `Form for ${category} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

