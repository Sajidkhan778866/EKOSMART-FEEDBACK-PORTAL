import multer from 'multer';

// Use memoryStorage for 100% compatibility with Vercel Serverless Functions & Local Node
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and WebP are allowed.'));
  }
};

export const uploadEmployeePhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});
