import mongoose from 'mongoose';

let isConnecting = false;
let reconnectTimer: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY_MS = 2000;

const getMongoUri = (): string => {
  return process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/ekosmart';
};

// Set up connection event listeners once
const setupConnectionListeners = () => {
  mongoose.connection.on('connected', () => {
    reconnectAttempts = 0;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error:`, err.message || err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected from database server.');
    scheduleReconnect();
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Reconnected to database server.');
  });

  mongoose.connection.on('close', () => {
    console.log('[MongoDB] Connection closed.');
  });
};

const scheduleReconnect = () => {
  if (reconnectTimer || mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error(`[MongoDB] Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Please check MongoDB server status.`);
    return;
  }

  reconnectAttempts++;
  const delay = Math.min(INITIAL_RECONNECT_DELAY_MS * Math.pow(1.5, reconnectAttempts - 1), 30000);
  console.log(`[MongoDB] Scheduling reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${Math.round(delay / 1000)}s...`);

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      await connectDB();
    } catch (err: any) {
      console.error(`[MongoDB] Reconnection attempt failed: ${err.message}`);
    }
  }, delay);
};

let listenersConfigured = false;

const connectDB = async () => {
  // If already connected (readyState 1), return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting (readyState 2), wait for it
  if (isConnecting) {
    return mongoose.connection;
  }

  if (!listenersConfigured) {
    setupConnectionListeners();
    listenersConfigured = true;
  }

  isConnecting = true;
  const uri = getMongoUri();

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 25,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      autoIndex: true,
    });

    console.log(`[MongoDB] Connection pool established (Pool: 5-25): ${conn.connection.host}`);

    // Clean up obsolete indexes safely if they exist
    try {
      const customerCollection = mongoose.connection.collection('customers');
      const indexes = await customerCollection.indexes();
      if (indexes.some((idx: any) => idx.name === 'phone_1')) {
        await customerCollection.dropIndex('phone_1');
        console.log('[MongoDB] Cleaned up obsolete phone_1 index on customers collection');
      }
    } catch {
      // Ignore if index doesn't exist
    }

    return conn;
  } catch (error: any) {
    console.error(`[MongoDB] Initial connection error: ${error.message || error}`);
    scheduleReconnect();
    throw error;
  } finally {
    isConnecting = false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getDbStatus = () => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
};

export default connectDB;
