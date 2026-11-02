import mongoose from 'mongoose';
import { ensureDefaultSeedData } from '../utils/autoSeed';

const isPlaceholderUri = (val?: string): boolean => {
  if (!val || !val.trim()) return true;
  const v = val.trim();
  return v.includes('<cluster') || v.includes('<username>') || v.includes('<password>') || v.includes('<db_');
};

const getMongoUri = (): string => {
  const explicitUri =
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL;

  if (explicitUri && !isPlaceholderUri(explicitUri)) {
    return explicitUri.trim();
  }

  // Support structured DB_* environment variables if provided
  if (process.env.DB_HOST && !isPlaceholderUri(process.env.DB_HOST)) {
    const host = process.env.DB_HOST.trim();
    const port = (process.env.DB_PORT || '').trim();
    const dbName = (process.env.DB_NAME || 'ekosmart').trim();
    const user = (process.env.DB_USER || '').trim();
    const pass = process.env.DB_PASSWORD || '';
    const isSrv = process.env.DB_SSL === 'srv' || host.includes('.mongodb.net');
    const protocol = isSrv ? 'mongodb+srv' : 'mongodb';
    const authPart = user ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@` : '';
    const portPart = !isSrv && port ? `:${port}` : '';
    const queryPart = isSrv ? '?retryWrites=true&w=majority' : (process.env.DB_SSL === 'true' ? '?tls=true' : '');
    return `${protocol}://${authPart}${host}${portPart}/${dbName}${queryPart}`;
  }

  return 'mongodb://127.0.0.1:27017/ekosmart';
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let lastConnectionError: string | null = null;

let listenersConfigured = false;

const setupConnectionListeners = () => {
  if (listenersConfigured) return;
  listenersConfigured = true;

  mongoose.connection.on('connected', () => {
    lastConnectionError = null;
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
    // Run idempotent auto-seeding on fresh connection
    ensureDefaultSeedData().catch((err) => {
      console.error('[MongoDB] Auto-seeding error:', err);
    });
  });

  mongoose.connection.on('error', (err) => {
    lastConnectionError = err.message || String(err);
    console.error(`[MongoDB] Connection error:`, lastConnectionError);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected from database server.');
    if (cached) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  mongoose.connection.on('reconnected', () => {
    lastConnectionError = null;
    console.log('[MongoDB] Reconnected to database server.');
  });
};

// Set bufferCommands to false so Mongoose fails fast with informative errors instead of hanging for 10s
mongoose.set('bufferCommands', false);

const connectDB = async (): Promise<typeof mongoose> => {
  // 1. If already connected, return existing connection
  if ((mongoose.connection.readyState as number) === 1) {
    // If connected but not seeded yet, trigger seed check in background
    ensureDefaultSeedData().catch(() => {});
    return mongoose;
  }

  // 2. If cached connection exists and is ready
  if (cached.conn && (mongoose.connection.readyState as number) === 1) {
    return cached.conn;
  }

  setupConnectionListeners();

  const uri = getMongoUri();

  // 3. If a connection promise is already in flight, reuse it
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      autoIndex: true,
    };

    console.log(`[MongoDB] Connecting to database (${uri.includes('mongodb+srv') ? 'MongoDB Atlas Cloud' : 'Local MongoDB'})...`);

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      lastConnectionError = null;
      console.log(`[MongoDB] Connection pool established with ${m.connection.host}`);
      // Clean up obsolete indexes safely if they exist
      try {
        const customerCollection = m.connection.collection('customers');
        customerCollection.indexes().then((indexes: any) => {
          if (indexes.some((idx: any) => idx.name === 'phone_1')) {
            customerCollection.dropIndex('phone_1').catch(() => {});
          }
        }).catch(() => {});
      } catch {
        // Ignore
      }

      // Run auto-seeding
      ensureDefaultSeedData().catch((err) => {
        console.error('[MongoDB] Auto-seeding background error:', err);
      });

      return m;
    }).catch((err) => {
      lastConnectionError = err.message || String(err);
      cached.promise = null;
      cached.conn = null;
      console.error(`[MongoDB] Connection failed: ${lastConnectionError}`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err: any) {
    lastConnectionError = err.message || String(err);
    cached.promise = null;
    cached.conn = null;
    throw err;
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
  const activeUri = getMongoUri();
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'unknown',
    port: mongoose.connection.port || (activeUri.includes('mongodb+srv') ? 27017 : 27017),
    name: mongoose.connection.name || 'ekosmart',
    isCloud: activeUri.includes('mongodb+srv'),
    lastError: lastConnectionError,
  };
};

export const reconnectDB = async (newUri?: string): Promise<typeof mongoose> => {
  if (newUri && newUri.trim()) {
    process.env.DATABASE_URL = newUri.trim();
    process.env.MONGODB_URI = newUri.trim();
  }
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch {
    // ignore disconnect errors
  }
  cached.conn = null;
  cached.promise = null;
  lastConnectionError = null;
  return await connectDB();
};

export default connectDB;
