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

// Start listening immediately on Passenger socket/port
const rawPort = process.env.PORT || 5000;
const isNamedPipeOrSocket = isNaN(Number(rawPort));

const server = isNamedPipeOrSocket
  ? app.listen(rawPort, () => {
      console.log(`[Server] Ekosmart API Server running on Passenger socket/pipe: ${rawPort}`);
    })
  : app.listen(Number(rawPort), '0.0.0.0', () => {
      console.log(`[Server] Ekosmart API Server running on port ${rawPort} (0.0.0.0)`);
    });

// Connect to MongoDB asynchronously without blocking HTTP listener
connectDB()
  .then(() => {
    console.log('[Server] MongoDB connection initialized.');
  })
  .catch((err) => {
    console.error('[Server] Initial MongoDB connection failed (will retry on incoming requests):', err.message || err);
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

