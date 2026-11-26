import express from "express";
import dotenv from "dotenv";
import { Database } from "./db/setup.js";
import router from "./routes/routes.js";
import cors from "cors";

const setupServer = async () => {
  dotenv.config();
  const app = express();
  app.use(cors({
    origin: process.env.CLIENT_URL
  }))
  const PORT = process.env.PORT || 5000;

  try {
    const db = new Database(process.env.DATABASE_URL);
  } catch (error) {
    console.log("db connection failed");
  }

  app.get("/", async (_, res) => {
    res.send("<div>hello harry</div>");
  });

  app.get("/db-health", async (_, res) => {
    const start = Date.now();
    const db = new Database(process.env.DATABASE_URL);
    try {
      await db.query("SELECT 1");
      const latencyMs = Date.now() - start;
      res.json({ ok: true, latencyMs });
    } catch (err) {
      console.error("DB health check failed", err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", router);

  app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
  });
};

setupServer();
