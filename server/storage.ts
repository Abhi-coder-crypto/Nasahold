
import { db } from "./db";
import {
  quizSubmissions,
  type InsertQuizSubmission,
  type QuizSubmission
} from "@shared/schema";

export interface IStorage {
  createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission>;
}

export class DatabaseStorage implements IStorage {
  async createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission> {
    const [result] = await db.insert(quizSubmissions).values(submission).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
