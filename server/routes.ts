
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { MongoUser, MongoAdmin } from "./db";
import * as XLSX from "xlsx";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed admin user
  (async () => {
    try {
      const adminExists = await MongoAdmin.findOne({ username: "Nasoadmin" });
      if (!adminExists) {
        await MongoAdmin.create({
          username: "Nasoadmin",
          password: "nasohold"
        });
        console.log("Admin user seeded successfully");
      }
    } catch (err) {
      console.error("Failed to seed admin user:", err);
    }
  })();

  // Admin Login Route
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await MongoAdmin.findOne({ username, password });
      if (admin) {
        res.json({ success: true });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      res.status(500).json({ message: "Login failed" });
    }
  });

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
      // Just return the data, don't save to MongoDB yet
      res.status(200).json({ name, email, number });
    } catch (err) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post(api.quiz.submit.path, async (req, res) => {
    try {
      const input = api.quiz.submit.input.parse(req.body);
      const submission = await storage.createQuizSubmission(input);

      // Save user and results to MongoDB ONLY on successful quiz completion
      if (req.body.email) {
        await MongoUser.findOneAndUpdate(
          { email: req.body.email },
          { 
            name: req.body.name, // Ensure name is passed or stored in local context
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
