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

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check with Database Status
app.get('/api/v1/health', (_req: Request, res: Response) => {
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
});

// Mount Centralized API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/employees', employeeRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/complaint-types', complaintTypeRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/tickets', complaintRoutes);
app.use('/api/v1/warranty', warrantyRoutes);
app.use('/api/v1/warranties', warrantyRoutes);
app.use('/api/v1/forms', formRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/cms', contentRoutes);

export default app;

