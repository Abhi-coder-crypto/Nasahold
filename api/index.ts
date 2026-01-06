import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import { connectMongo } from "./db";
import path from "path";
import fs from "fs";

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
  
  // Vercel specific path resolution
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  // Check if it's a static file (with extension)
  if (req.path.includes(".")) {
    const filePath = path.join(distPath, req.path);
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
  }

  // Fallback to index.html for all other routes (SPA)
  const indexPage = path.join(distPath, "index.html");
  if (fs.existsSync(indexPage)) {
    return res.sendFile(indexPage);
  }
  
  // Final fallback to client index for local development
  const clientIndex = path.resolve(process.cwd(), "client", "index.html");
  if (fs.existsSync(clientIndex)) {
    return res.sendFile(clientIndex);
  }
  
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
