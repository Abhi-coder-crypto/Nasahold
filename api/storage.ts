import {
  type InsertQuizSubmission,
  type QuizSubmission
} from "../shared/schema.js";

export interface IStorage {
  createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission>;
}

export class DatabaseStorage implements IStorage {
  async createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission> {
    // We are only using MongoDB, so we return the input as if it was saved to fulfill the interface
    // The actual persistence is handled in the route via MongoUser
    return {
      id: Math.floor(Math.random() * 1000000),
      ...submission,
      name: (submission as any).name || "",
      email: (submission as any).email || "",
      number: (submission as any).number || "",
      createdAt: new Date()
    } as QuizSubmission;
  }
}

export const storage = new DatabaseStorage();
