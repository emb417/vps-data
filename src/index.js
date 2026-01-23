import "dotenv/config";
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import apiRouter from "./routers/api.v1.js";

const PORT = process.env.PORT || 3080;

const app = express();

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

const httpLogger = pinoHttp({
  logger,
  customSuccessMessage: (req, res) =>
    `${res.statusCode} ${req.method} ${req.url}`,
  customErrorMessage: (req, res, err) =>
    `${res.statusCode} ${req.method} ${req.url} ${err?.message ?? ""}`,
  customAttributeKeys: {
    req: "ignore",
    res: "ignore",
    err: "ignore",
    responseTime: "ignore",
  },
  serializers: { ignore: () => undefined },
  wrapSerializers: false,
});

app.use(httpLogger);
app.use(express.json());

let cachedVpsDb = null;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function loadVpsDb() {
  const now = Date.now();

  if (cachedVpsDb && now - lastFetch < CACHE_TTL) {
    return cachedVpsDb;
  }

  const response = await fetch(
    "https://virtualpinballspreadsheet.github.io/vps-db/db/vpsdb.json",
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch VPS DB: ${response.status}`);
  }

  cachedVpsDb = await response.json();
  lastFetch = now;

  return cachedVpsDb;
}

app.use(
  "/api/v1",
  async (req, res, next) => {
    try {
      req.vpsDb = await loadVpsDb();
      next();
    } catch (err) {
      logger.error(`vpsData load failed: ${err.message}`);
      res.status(503).json({ error: "Service temporarily unavailable" });
    }
  },
  apiRouter,
);

app.get("/api", (req, res) => {
  res.send("VPS API Service is up and running...");
});

app.get("/", (req, res) => {
  res.send("VPS Data Service is up and running...");
});

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});
