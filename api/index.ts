import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";
import { connectMongo } from "./db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize DB and Routes
(async () => {
  const httpServer = createServer(app);
  try {
    await connectMongo();
    await registerRoutes(httpServer, app);
  } catch (err) {
    console.error("Initialization error:", err);
  }
})();

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Explicit registration route for Vercel edge cases
app.post("/api/register", async (req, res, next) => {
  try {
    // This is handled by registerRoutes, but adding explicit proxy for Vercel routing
    next();
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;