
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { MongoUser } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, number } = req.body;
      const user = await MongoUser.findOneAndUpdate(
        { email },
        { name, number },
        { upsert: true, new: true }
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post(api.quiz.submit.path, async (req, res) => {
    try {
      const input = api.quiz.submit.input.parse(req.body);
      const submission = await storage.createQuizSubmission(input);

      // Update score in MongoDB if email is provided
      if (req.body.email) {
        await MongoUser.findOneAndUpdate(
          { email: req.body.email },
          { score: input.score, completedAt: new Date() }
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
