
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { MongoUser, connectMongo } from "./db";
import mongoose from "mongoose";
import * as XLSX from "xlsx";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Admin Routes
  app.get("/api/admin/users", async (_req, res) => {
    try {
      const users = await MongoUser.find().sort({ completedAt: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/export", async (_req, res) => {
    try {
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
      res.send(buffer);
    } catch (err) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, number } = req.body;
      
      if (!name || !email || !number) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Allow any email address including company domains like digitiohub.in
      const emailLower = email.toLowerCase();
      
      // Basic email format check that allows any domain including .in
      if (!/^\S+@\S+\.\S+$/.test(emailLower)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Ensure DB connection
      try {
        await connectMongo();
      } catch (connErr) {
        console.error("Database connection failed during registration:", connErr);
        return res.status(500).json({ message: "Database connection failed" });
      }

      const existingUser = await MongoUser.findOne({ 
        $or: [{ email: emailLower }, { number }] 
      });

      if (existingUser) {
        return res.status(409).json({ message: "You have already registered or taken the exam." });
      }

      // Return 200 to match what the frontend expects for a pre-registration check or initial step
      // The user is actually created/updated in /api/quiz submit
      res.status(200).json({ name, email: emailLower, number });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.quiz.submit.path, async (req, res) => {
    try {
      const input = api.quiz.submit.input.parse(req.body);
      const submission = await storage.createQuizSubmission(input);

      // Save user and results to MongoDB ONLY on successful quiz completion
      if (req.body.email) {
        const emailLower = req.body.email.toLowerCase();
        await MongoUser.findOneAndUpdate(
          { email: emailLower },
          { 
            name: req.body.name,
            number: req.body.number,
            score: input.score, 
            answers: input.answers,
            completedAt: new Date() 
          },
          { upsert: true, new: true }
        );
      }

      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
