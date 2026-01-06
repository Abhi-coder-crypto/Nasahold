
import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quizSubmissions = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  number: text("number").unique(),
  answers: jsonb("answers").notNull(), // Store answers as JSON
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissions).pick({
  answers: true,
  score: true,
});

export type QuizSubmission = typeof quizSubmissions.$inferSelect;
export type InsertQuizSubmission = z.infer<typeof insertQuizSubmissionSchema>;
