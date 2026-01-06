import mongoose from "mongoose";

// MongoDB Setup
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://abhijeet18012001_db_user:rOzpJgudgnLiO4Xp@nasahold.tokzqiw.mongodb.net/?appName=Nasahold";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be set. MongoDB is required for this application.");
}

let isConnected = false;

export const connectMongo = async () => {
  if (isConnected) return;
  
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Don't exit process in serverless
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
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

export const MongoUser = mongoose.models.User || mongoose.model("User", UserSchema);
