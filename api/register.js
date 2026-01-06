import { MongoUser, connectMongo } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, number } = req.body;
    
    if (!name || !email || !number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailLower = email.toLowerCase();
    
    // Ensure DB connection
    await connectMongo();

    const existingUser = await MongoUser.findOne({ 
      : [{ email: emailLower }, { number }] 
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or Phone number already registered" });
    }

    return res.status(200).json({ name, email: emailLower, number });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
