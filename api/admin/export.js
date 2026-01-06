import { MongoUser, connectMongo } from "../db.js";
import * as XLSX from "xlsx";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongo();
    const users = await MongoUser.find().lean();
    const data = users.map(u => ({
      Name: u.name,
      Email: u.email,
      Phone: u.number,
      Score: `${u.score} / 7`,
      Date: new Date(u.completedAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=participants.xlsx");
    return res.send(buffer);
  } catch (err) {
    console.error("Admin export error:", err);
    return res.status(500).json({ message: "Failed to export data" });
  }
}
