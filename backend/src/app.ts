import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB, { getDbStatus, isDbConnected } from './config/db';

import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import complaintRoutes from './routes/complaint.routes';
import complaintTypeRoutes from './routes/complaintType.routes';
import warrantyRoutes from './routes/warranty.routes';
import formRoutes from './routes/form.routes';
import dashboardRoutes from './routes/dashboard.routes';
import customerRoutes from './routes/customer.routes';
import contentRoutes from './routes/content.routes';

const app: Express = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serverless DB auto-connection middleware
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Middleware] Database connection error:', err);
  }
  next();
});

// Root ping
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Ekosmart EV & Battery Management API Server',
    status: 'online',
    version: '1.0.0',
    healthCheck: '/api/v1/health',
  });
});

// Serve uploaded files statically across all routes with no-stale cache headers
const staticUploadOptions = {
  maxAge: 0,
  setHeaders: (res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  },
};

app.use('/uploads', express.static(path.join(__dirname, '../uploads'), staticUploadOptions));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), staticUploadOptions));
app.use('/uploads', express.static(path.join(process.cwd(), 'backend/uploads'), staticUploadOptions));
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../uploads'), staticUploadOptions));
app.use('/api/v1/uploads', express.static(path.join(process.cwd(), 'uploads'), staticUploadOptions));
app.use('/api/v1/uploads', express.static(path.join(process.cwd(), 'backend/uploads'), staticUploadOptions));


// Health Check with Database Status
const healthCheckHandler = (_req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  const healthy = isDbConnected();

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? 'Ekosmart API Server is healthy' : 'Database is currently reconnecting/degraded',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
};

app.get('/api/v1/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);

// Mount Centralized API Routes (supports both /api/v1 and /api prefixes)
const mountRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/admin/employees`, employeeRoutes);
  app.use(`${prefix}/employees`, employeeRoutes);
  app.use(`${prefix}/complaint-types`, complaintTypeRoutes);
  app.use(`${prefix}/complaints`, complaintRoutes);
  app.use(`${prefix}/tickets`, complaintRoutes);
  app.use(`${prefix}/warranty`, warrantyRoutes);
  app.use(`${prefix}/warranties`, warrantyRoutes);
  app.use(`${prefix}/forms`, formRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/customers`, customerRoutes);
  app.use(`${prefix}/content`, contentRoutes);
  app.use(`${prefix}/cms`, contentRoutes);
};

mountRoutes('/api/v1');
mountRoutes('/api');

export default app;

