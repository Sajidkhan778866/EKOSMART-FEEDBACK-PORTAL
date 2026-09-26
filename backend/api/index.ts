import type { Request, Response } from 'express';
import app from '../src/app';
import connectDB from '../src/config/db';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (err: any) {
    console.error('[Vercel Serverless] DB connection error before request:', err.message || err);
  }
  return app(req, res);
}

