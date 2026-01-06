import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
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

  // Handle SPA routing - serve index.html for all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // In Vercel and local prod, static files are usually handled by the platform, 
    // but we'll provide a fallback here for robustness.
    const distPath = path.resolve(process.cwd(), "dist", "public");
    const filePath = path.join(distPath, req.path);
    
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }

    const indexPage = process.env.NODE_ENV === "production" 
      ? path.join(distPath, "index.html")
      : path.resolve(process.cwd(), "client", "index.html");
      
    if (fs.existsSync(indexPage)) {
      res.sendFile(indexPage);
    } else {
      next();
    }
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  const port = parseInt(process.env.PORT || "5000", 10);
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        console.log(`serving on port ${port}`);
      },
    );
  }
})();

export default app;
