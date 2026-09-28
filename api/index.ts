import type { Request, Response } from 'express';
import app from '../backend/src/app';
import connectDB from '../backend/src/config/db';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (err: any) {
    console.error('[Vercel Serverless Root] DB connection error before request:', err.message || err);
  }
  return app(req, res);
}

