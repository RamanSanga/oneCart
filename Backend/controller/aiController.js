import { z } from "zod";
import { answerProductQuestion, retrieveProductContext } from "../ai/ragChain.js";
import { getProductVectorStore } from "../ai/vectorStore.js";
import { indexAllProducts } from "../ai/productIndexer.js";

// Validation schema supporting both frontend compatible 'query' and standard 'message' keys
const aiQuerySchema = z.object({
  query: z.string().trim().optional(),
  message: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(12).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .max(12)
    .optional(),
}).refine(data => {
  const text = (data.message || data.query || "").trim();
  return text.length > 0;
}, {
  message: "Either message or query must be provided and cannot be empty",
  path: ["message"],
});

function parsePayload(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "message",
      message: issue.message,
    }));

    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.details = issues;
    throw error;
  }

  return result.data;
}

function sendAiError(res, error) {
  console.error("[AI Diagnostic Error]:", error);
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      message: error.message || "AI request failed",
      stack: error.stack || null,
      details: error.details || error.message || null,
      rawError: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
    },
  });
}

export async function chatAi(req, res) {
  const startTime = Date.now();
  try {
    const payload = parsePayload(aiQuerySchema, req.body || {});
    const queryText = (payload.message || payload.query || "").trim();

    console.log(`[AI Chat] Query received: "${queryText}"`);

    const options = {
      limit: payload.limit,
      messages: payload.messages,
    };

    // 1. Log semantic retrieval execution time
    const retrieveStart = Date.now();
    const retrieved = await retrieveProductContext(queryText, options);
    const retrievalTime = Date.now() - retrieveStart;
    console.log(`[AI Chat] Retrieval completed in ${retrievalTime}ms. Retrieved ${retrieved.length} products.`);

    // 2. Log Gemini LLM synthesis execution time
    const llmStart = Date.now();
    const result = await answerProductQuestion(queryText, options);
    const llmTime = Date.now() - llmStart;
    console.log(`[AI Chat] LLM completed in ${llmTime}ms.`);

    const totalTime = Date.now() - startTime;
    console.log(`[AI Chat] Total response time: ${totalTime}ms`);

    return res.status(200).json({
      success: true,
      message: result.answer || "",
      products: result.topProducts || [],
      suggestions: result.suggestions || [],
      comparison: result.comparison || null,
      data: {
        answer: result.answer || "",
        intent: result.intent || "conversation",
        filtersApplied: result.filtersApplied || {},
        conversationSummary: result.conversationSummary || "",
        topProducts: result.topProducts || [],
        recommendationProducts: result.recommendationProducts || [],
        relatedProducts: result.relatedProducts || [],
        confidence: result.confidence ?? null,
        query: queryText,
        comparison: result.comparison || null,
      },
    });
  } catch (error) {
    console.error(`[AI Chat] Error processing chat:`, error);
    return sendAiError(res, error);
  }
}

export async function searchAi(req, res) {
  const startTime = Date.now();
  try {
    const payload = parsePayload(aiQuerySchema, req.body || {});
    const queryText = (payload.message || payload.query || "").trim();

    console.log(`[AI Search] Query received: "${queryText}"`);

    const options = {
      limit: payload.limit,
      messages: payload.messages,
    };

    const retrieveStart = Date.now();
    const retrieved = await retrieveProductContext(queryText, options);
    const retrievalTime = Date.now() - retrieveStart;
    console.log(`[AI Search] Retrieval completed in ${retrievalTime}ms. Retrieved ${retrieved.length} products.`);

    const llmStart = Date.now();
    const result = await answerProductQuestion(queryText, options);
    const llmTime = Date.now() - llmStart;
    console.log(`[AI Search] LLM completed in ${llmTime}ms.`);

    const totalTime = Date.now() - startTime;
    console.log(`[AI Search] Total response time: ${totalTime}ms`);

    return res.status(200).json({
      success: true,
      message: result.answer || "",
      products: result.topProducts || [],
      suggestions: result.suggestions || [],
      comparison: result.comparison || null,
      data: {
        answer: result.answer || "",
        intent: result.intent || "conversation",
        filtersApplied: result.filtersApplied || {},
        conversationSummary: result.conversationSummary || "",
        topProducts: result.topProducts || [],
        recommendationProducts: result.recommendationProducts || [],
        relatedProducts: result.relatedProducts || [],
        confidence: result.confidence ?? null,
        query: queryText,
        comparison: result.comparison || null,
      },
    });
  } catch (error) {
    console.error(`[AI Search] Error processing search:`, error);
    return sendAiError(res, error);
  }
}

import mongoose from "mongoose";
import { getChromaConfig } from "../ai/vectorStore.js";
import { embedText } from "../ai/embedding.js";

export async function healthAi(_req, res) {
  const checks = {
    GOOGLE_API_KEY: false,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    CHROMA_URL: "not set",
    MongoDB: "disconnected",
    ChromaDB: "disconnected",
    CollectionExists: false,
    VectorCount: 0,
    GeminiTest: "failed"
  };
  const errors = [];

  // Check GOOGLE_API_KEY presence
  if (process.env.GOOGLE_API_KEY) {
    checks.GOOGLE_API_KEY = true;
  } else {
    errors.push("Environment: GOOGLE_API_KEY variable is missing.");
  }

  // Check CHROMA_URL presence
  if (process.env.CHROMA_URL) {
    checks.CHROMA_URL = "loaded";
  } else if (process.env.CHROMA_HOST) {
    checks.CHROMA_URL = "loaded (legacy CHROMA_HOST set)";
  } else {
    errors.push("Environment: CHROMA_URL and CHROMA_HOST variables are missing.");
  }

  // Check MongoDB
  try {
    if (mongoose.connection.readyState === 1) {
      checks.MongoDB = "connected";
    } else {
      checks.MongoDB = `disconnected (readyState: ${mongoose.connection.readyState})`;
      errors.push(`MongoDB check failed: connection state is ${mongoose.connection.readyState}`);
    }
  } catch (err) {
    checks.MongoDB = "failed";
    errors.push(`MongoDB check error: ${err.message}`);
  }

  // Check ChromaDB Connection and Vector Count
  try {
    const vectorStore = await getProductVectorStore();
    checks.ChromaDB = "connected";
    checks.CollectionExists = true;
    const count = await vectorStore.collection.count();
    checks.VectorCount = count;
  } catch (err) {
    checks.ChromaDB = "failed";
    errors.push(`ChromaDB check failed: ${err.message}`);
  }

  // Check Gemini Embeddings Pipeline
  try {
    const testEmbedding = await embedText("Test product context");
    if (Array.isArray(testEmbedding) && testEmbedding.length > 0) {
      checks.GeminiTest = "success";
    } else {
      errors.push("Gemini check failed: embedding array is empty or invalid format.");
    }
  } catch (err) {
    checks.GeminiTest = "failed";
    errors.push(`Gemini Embedding pipeline failed: ${err.message}`);
  }

  const status = errors.length === 0 ? "healthy" : "degraded";

  return res.status(200).json({
    success: true,
    status,
    checks,
    errors
  });
}

// POST /api/ai/reindex — Admin-only bulk re-index of all products into ChromaDB
export async function reindexAi(req, res) {
  const secret = req.headers["x-admin-secret"] || req.body?.secret || "";
  const expected = process.env.ADMIN_REINDEX_SECRET || "";

  if (expected && secret !== expected) {
    return res.status(403).json({ success: false, message: "Unauthorized." });
  }

  try {
    const result = await indexAllProducts();
    return res.status(200).json({
      success: true,
      message: `Re-indexed ${result.indexed} products into ChromaDB.`,
      indexed: result.indexed,
    });
  } catch (error) {
    console.error("[AI Reindex] Failed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
