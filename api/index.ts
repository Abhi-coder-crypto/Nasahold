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

(async () => {
  try {
    await connectMongo();
    await registerRoutes(httpServer, app);
  } catch (err) {
    console.error("Initialization error:", err);
  }

  // Handle SPA routing
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // Vercel deployment path for static files
    const distPath = path.resolve(process.cwd(), "dist", "public");
    const filePath = path.join(distPath, req.path);
    
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }

    const indexPage = path.join(distPath, "index.html");
    if (fs.existsSync(indexPage)) {
      res.sendFile(indexPage);
    } else {
      res.status(404).send("Not Found");
    }
  });
})();

export default app;
