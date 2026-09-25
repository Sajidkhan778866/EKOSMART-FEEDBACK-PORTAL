import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
});

connectDB()
  .then(() => {
    const server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`[Server] Ekosmart API Server running on port ${PORT} (0.0.0.0)`);
    });


    const shutdown = async () => {
      console.log('[Server] Graceful shutdown initiated...');
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((err) => {
    console.error('[Server] Failed to start server:', err);
  });

