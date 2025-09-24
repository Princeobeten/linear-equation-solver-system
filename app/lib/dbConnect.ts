import mongoose from 'mongoose';

// Define the type for our cached MongoDB connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
  retryCount: number;
};

// Add mongoose property to the NodeJS global type
declare global {
  var mongoose: MongooseCache | undefined;
};

const MONGODB_URI = process.env.MONGODB_URI as string;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

if (!MONGODB_URI) {
  console.warn(
    'MONGODB_URI environment variable not defined. Please check your .env.local file.'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Use the global mongoose cache or initialize it
let cached: MongooseCache = global.mongoose || { conn: null, promise: null, isConnecting: false, retryCount: 0 };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isConnecting: false, retryCount: 0 };
}

/**
 * Connect to MongoDB with retry mechanism
 * @returns Mongoose instance
 */
async function dbConnect() {
  // If already connected, return the connection
  if (cached.conn) {
    return cached.conn;
  }

  // Prevent multiple simultaneous connection attempts
  if (cached.isConnecting) {
    console.log('Another connection attempt is in progress, waiting...');
    try {
      return await cached.promise as typeof mongoose;
    } catch (error) {
      console.error('Error while waiting for pending connection:', error);
      throw error;
    }
  }

  // If not connecting and no existing promise, try to connect
  if (!cached.promise) {
    cached.isConnecting = true;
    cached.retryCount = 0;

    const connectWithRetry = async (): Promise<typeof mongoose> => {
      try {
        if (!MONGODB_URI) {
          throw new Error('MONGODB_URI is not defined');
        }

        // Connection options to improve stability
        const opts = {
          bufferCommands: false,
          serverSelectionTimeoutMS: 10000, // 10 seconds instead of default 30
          socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
          maxPoolSize: 10, // Maximum pool size
          minPoolSize: 5, // Minimum pool size
          connectTimeoutMS: 10000, // Connection timeout
          family: 4, // Use IPv4, skip trying IPv6
        };

        console.log(`Connecting to MongoDB (attempt ${cached.retryCount + 1}/${MAX_RETRIES + 1})...`);
        const mongoose_instance = await mongoose.connect(MONGODB_URI, opts);
        console.log('MongoDB connected successfully!');
        
        cached.isConnecting = false;
        cached.retryCount = 0;
        return mongoose_instance;
      } catch (error) {
        console.error(`MongoDB connection attempt ${cached.retryCount + 1} failed:`, error);
        
        // If we've exhausted our retries
        if (cached.retryCount >= MAX_RETRIES) {
          cached.isConnecting = false;
          cached.promise = null;
          console.error(`Failed to connect to MongoDB after ${MAX_RETRIES + 1} attempts`);
          throw error;
        }
        
        // Retry with exponential backoff
        const delay = RETRY_DELAY_MS * Math.pow(2, cached.retryCount);
        console.log(`Retrying in ${delay}ms...`);
        
        // Increment retry count and wait before next attempt
        cached.retryCount++;
        await new Promise(resolve => setTimeout(resolve, delay));
        return connectWithRetry();
      }
    };

    cached.promise = connectWithRetry();
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // Ensure promise is cleared for future attempts
    cached.promise = null;
    cached.isConnecting = false;
    
    // Rethrow with a friendly message
    throw new Error('Database connection failed. Please try again later.');
  }
}

export default dbConnect;
