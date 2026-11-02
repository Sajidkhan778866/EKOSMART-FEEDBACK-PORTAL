import type { Request, Response } from 'express';
import app from '../src/app';
import connectDB from '../src/config/db';
import { loadSmtpCredentialsAsync } from '../src/services/email.service';

export default async function handler(req: Request, res: Response) {
  try {
    const connectPromise = connectDB().then(() => loadSmtpCredentialsAsync());
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));
    await Promise.race([connectPromise, timeoutPromise]);
  } catch (err: any) {
    console.error('[Vercel Serverless Backend] Initialization warning before request:', err?.message || err);
  }
  return app(req, res);
}
