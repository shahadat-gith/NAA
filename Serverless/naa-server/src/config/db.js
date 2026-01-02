import mongoose from "mongoose";

// Prevent Mongoose from buffering queries
mongoose.set("bufferCommands", false);
mongoose.set("strictQuery", false);

// Global cache for Lambda reuse
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Reuse existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection only once
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // fail fast
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      family: 4, // ⬅ force IPv4 (important for Lambda/Windows)
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected");
  return cached.conn;
};

export default connectDB;
