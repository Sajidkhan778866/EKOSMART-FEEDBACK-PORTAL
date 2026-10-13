import type { Request, Response } from 'express';
import app from '../src/app';
import connectDB from '../src/config/db';

export default async function handler(req: Request, res: Response) {
  try {
    // Fast warm-up for DB with 3s timeout guard so lambda never hits Vercel execution limit
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
    await Promise.race([connectPromise, timeoutPromise]);
  } catch (err: any) {
    console.error('[Vercel Serverless] DB connection error before request:', err?.message || err);
  }
  return app(req, res);
}
