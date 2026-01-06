import { MongoUser, connectMongo } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, number, score, answers } = req.body;
    
    // Ensure DB connection
    await connectMongo();

    // Save user and results to MongoDB
    const emailLower = email ? email.toLowerCase() : null;
    
    let submission = {
      id: Math.floor(Math.random() * 1000000),
      score,
      answers,
      name: name || "",
      email: emailLower || "",
      number: number || "",
      createdAt: new Date()
    };

    if (emailLower) {
      await MongoUser.findOneAndUpdate(
        { email: emailLower },
        { 
          name,
          number,
          score, 
          answers,
          completedAt: new Date() 
        },
        { upsert: true, new: true }
      );
    }

    return res.status(201).json(submission);
  } catch (err) {
    console.error("Quiz submission error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
