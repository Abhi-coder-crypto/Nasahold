import mongoose from "mongoose";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// MongoDB Setup
if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI not set. MongoDB features will be disabled.");
}

export const connectMongo = async () => {
  if (!process.env.MONGODB_URI) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  score: { type: Number, default: 0 },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  completedAt: { type: Date, default: Date.now },
});

// Remove unique constraint from email in Mongo schema since we handle it in business logic
// and multiple attempts might have been logged before the current duplicate prevention was in place.
// Actually, it's better to keep it unique but ensure we handle cases where it might fail.
// Given the user wants "perfect", let's ensure the schema matches the logic.

export const MongoUser = mongoose.models.User || mongoose.model("User", UserSchema);
