import express from "express";
import rateLimit from "express-rate-limit";
import { chatAi, healthAi, searchAi, reindexAi } from "../controller/aiController.js";

const aiRoutes = express.Router();

const aiWindowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const aiMaxRequests = Number(process.env.AI_RATE_LIMIT_MAX || 30);

const aiRateLimiter = rateLimit({
  windowMs: aiWindowMs,
  limit: aiMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many AI requests, please try again later.",
    },
  },
});

aiRoutes.get("/health",  healthAi);
aiRoutes.post("/chat",   aiRateLimiter, chatAi);
aiRoutes.post("/search", aiRateLimiter, searchAi);
aiRoutes.post("/reindex", reindexAi);

export default aiRoutes;
