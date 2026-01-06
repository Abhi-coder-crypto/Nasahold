import { MongoUser, connectMongo } from "../db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongo();
    const users = await MongoUser.find().sort({ completedAt: -1 });
    return res.status(200).json(users);
  } catch (err) {
    console.error("Admin users fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
}
