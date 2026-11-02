import type { Request, Response } from 'express';
import app from '../backend/src/app';
import connectDB from '../backend/src/config/db';
import { loadSmtpCredentialsAsync } from '../backend/src/services/email.service';

export default async function handler(req: Request, res: Response) {
  try {
    // Fast warm-up for MongoDB and saved SMTP credentials with 3.5s timeout guard
    const connectPromise = connectDB().then(() => loadSmtpCredentialsAsync());
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));
    await Promise.race([connectPromise, timeoutPromise]);
  } catch (err: any) {
    console.error('[Vercel Serverless Root] Initialization warning before request:', err?.message || err);
  }
  return app(req, res);
}
