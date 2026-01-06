import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";
import { connectMongo } from "./db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize DB and Routes
(async () => {
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

// Handle SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  
  // In Vercel, static files are handled by the 'routes' config in vercel.json
  // If the request reaches here, it's either an API call or a missed static file
  res.status(404).send("Not Found");
});

// Production specific listener
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`serving on port ${port}`);
  });
}

export default app;
