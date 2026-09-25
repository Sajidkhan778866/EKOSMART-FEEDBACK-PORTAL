import mongoose from 'mongoose';
import { ensureDefaultSeedData } from '../utils/autoSeed';

const getMongoUri = (): string => {
  const uri =
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    'mongodb://127.0.0.1:27017/ekosmart';
  return uri.trim();
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

let listenersConfigured = false;

const setupConnectionListeners = () => {
  if (listenersConfigured) return;
  listenersConfigured = true;

  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
    // Run idempotent auto-seeding on fresh connection
    ensureDefaultSeedData().catch((err) => {
      console.error('[MongoDB] Auto-seeding error:', err);
    });
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error:`, err.message || err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected from database server.');
    if (cached) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Reconnected to database server.');
  });
};

const connectDB = async (): Promise<typeof mongoose> => {
  // 1. If already connected, return existing connection
  if ((mongoose.connection.readyState as number) === 1) {
    // If connected but not seeded yet, trigger seed check
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
      maxPoolSize: 20,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      autoIndex: true,
    };

    console.log(`[MongoDB] Connecting to database (${uri.includes('mongodb+srv') ? 'MongoDB Atlas Cloud' : 'Local MongoDB'})...`);

    cached.promise = mongoose.connect(uri, opts).then((m) => {
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
      cached.promise = null;
      cached.conn = null;
      console.error(`[MongoDB] Connection failed: ${err.message || err}`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
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
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'unknown',
    name: mongoose.connection.name || 'unknown',
    isCloud: getMongoUri().includes('mongodb+srv'),
  };
};

export default connectDB;
