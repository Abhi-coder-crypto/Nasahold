import mongoose from "mongoose";

// MongoDB Setup
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set. MongoDB is required for this application.");
}

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
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
