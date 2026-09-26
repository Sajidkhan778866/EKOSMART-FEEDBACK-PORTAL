import express, { Express, Request, Response, NextFunction } from 'express';
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

// Allowed Origins Parser
const rawAllowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim().toLowerCase())
  : [];

const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    // 1. Allow server-to-server, curl, mobile apps, or same-origin requests (no origin header)
    if (!requestOrigin) {
      return callback(null, true);
    }

    const originLower = requestOrigin.toLowerCase();

    // 2. Allow if wildcard or in configured list
    if (
      rawAllowedOrigins.includes('*') ||
      rawAllowedOrigins.includes(originLower) ||
      originLower.endsWith('.vercel.app') ||
      originLower.includes('localhost') ||
      originLower.includes('127.0.0.1') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    // Default: allow and reflect the requesting origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Disposition'],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serverless DB auto-connection middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
  } catch (err: any) {
    console.error('[Middleware] Database connection error during request:', err.message || err);
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
    database: getDbStatus(),
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

  res.status(200).json({
    success: true,
    server: 'online',
    message: healthy ? 'Ekosmart API Server & Database operational' : 'API Server online, database connecting/pending',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
};

app.get('/api/v1/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

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

// Catch-all 404 JSON response for unmatched API routes (prevents returning HTML)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  }
  next();
});

// Centralized error handler returning clean JSON
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[AppError]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

export default app;
