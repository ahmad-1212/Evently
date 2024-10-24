import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached: {
  conn: Connection | null;
  promise: Promise<Connection> | null;
} = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Connection> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing!");

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "evently",
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
