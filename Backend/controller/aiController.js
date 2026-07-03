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
  const diagnostics = {
    environment: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? `Loaded (${process.env.GOOGLE_API_KEY.substring(0, 8)}...)` : "Missing",
      GEMINI_MODEL: process.env.GEMINI_MODEL || "Not set (using default: gemini-2.5-flash)",
      CHROMA_URL: process.env.CHROMA_URL || "Not set",
      CHROMA_HOST: process.env.CHROMA_HOST || "Not set",
      CHROMA_PORT: process.env.CHROMA_PORT || "Not set",
    },
    mongoDb: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
    },
    chromaDb: {
      connected: false,
      config: null,
      collectionExists: false,
      productCount: 0,
      error: null,
    },
    embeddingPipeline: {
      working: false,
      error: null,
    },
    status: "healthy",
  };

  // 1. Get Chroma Configuration
  try {
    diagnostics.chromaDb.config = getChromaConfig();
  } catch (err) {
    diagnostics.chromaDb.error = `Config read error: ${err.message}`;
  }

  // 2. Test ChromaDB Connection & Collection Count
  try {
    const vectorStore = await getProductVectorStore();
    diagnostics.chromaDb.connected = true;
    diagnostics.chromaDb.collectionExists = true;
    
    // Fetch product count
    const count = await vectorStore.collection.count();
    diagnostics.chromaDb.productCount = count;
  } catch (err) {
    diagnostics.chromaDb.error = `Connection/Count error: ${err.message}`;
    diagnostics.status = "degraded";
  }

  // 3. Test Embedding Generator Pipeline
  try {
    const testEmbedding = await embedText("Test product context");
    diagnostics.embeddingPipeline.working = Array.isArray(testEmbedding) && testEmbedding.length > 0;
  } catch (err) {
    diagnostics.embeddingPipeline.error = `Embedding error: ${err.message}`;
    diagnostics.status = "degraded";
  }

  return res.status(200).json({
    success: true,
    diagnostics,
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
