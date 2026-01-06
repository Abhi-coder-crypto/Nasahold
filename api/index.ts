import express from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";
import { connectMongo } from "./db.js";

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

// Initial Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Production specific listener
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`serving on port ${port}`);
  });
}

export default app;