import "dotenv/config";
import express from "express";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import apiRouter from "./routers/api.v1.js";
import { initializeCache } from "./utils/cache.js";

const PORT = process.env.PORT || 3080;

const app = express();

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

app.use("/api/v1", apiRouter);

app.get("/api", (req, res) => {
  res.send("VPS API Endpoint is available, try /api/v1/games.");
});

app.get("/", (req, res) => {
  res.send("VPS Data Service is up and running...");
});

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
  initializeCache();
});
