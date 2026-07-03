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
  let statusCode = error.statusCode || 500;
  let message = error.message || "AI request failed";

  // Translate specific library / model errors to production-ready HTTP status codes
  const errText = String(error.message || "").toLowerCase();
  
  if (errText.includes("quota") || errText.includes("429") || errText.includes("too many requests")) {
    statusCode = 429;
    message = "AI service rate limit exceeded. Please wait a few seconds before retrying.";
  } else if (errText.includes("chroma") || errText.includes("fetch") && errText.includes("8001")) {
    statusCode = 503;
    message = "The product catalog service is temporarily offline. Please try again in a moment.";
  } else if (errText.includes("google") || errText.includes("generativeai")) {
    statusCode = 502;
    message = "AI generation model failed to respond. Please try again.";
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: error.details || null,
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

export async function healthAi(_req, res) {
  let status = "healthy";

  try {
    // Dynamically test connection to ChromaDB
    const vectorStore = await getProductVectorStore();
    await vectorStore.collection.count();
  } catch (error) {
    console.error("[AI Health] ChromaDB health check failed:", error);
    status = "degraded";
  }

  return res.status(200).json({
    success: true,
    llm: "Gemini",
    vectorStore: "ChromaDB",
    embedding: "MiniLM",
    status,
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
