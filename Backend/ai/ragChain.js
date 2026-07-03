import { z } from "zod";
import {
  SYSTEM_PROMPT,
  buildConversationContext,
  buildRagMessages,
  buildTopProductsBlock,
} from "./prompt.js";
import { getLangChainChatModel } from "./embedding.js";
import { getProductVectorStore } from "./vectorStore.js";
import { BufferMemory, ChatMessageHistory } from "@langchain/classic/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

function mapDocumentToProduct(document, score) {
  const metadata = document.metadata || {};

  return {
    id: metadata.id || metadata.productId || "",
    name: metadata.name || "",
    description: metadata.description || document.pageContent || "",
    category: metadata.category || "",
    subCategory: metadata.subCategory || "",
    price: metadata.price ?? null,
    brand: metadata.brand || "",
    image: metadata.image || "",
    score,
  };
}

const assistantPlanSchema = z.object({
  intent: z.enum(["search", "recommendation", "related", "budget", "category", "conversation", "comparison"]),
  searchQuery: z.string().trim().default(""),
  category: z.string().trim().default(""),
  subCategory: z.string().trim().default(""),
  brand: z.string().trim().default(""),
  minBudget: z.number().default(-1),
  maxBudget: z.number().default(-1),
  limit: z.number().int().min(1).max(12).default(5),
  relatedTo: z.string().trim().default(""),
  compareProducts: z.array(z.string().trim()).default([]),
});

function normalizeLimit(limit) {
  const numericLimit = Number(limit);
  if (Number.isFinite(numericLimit) && numericLimit > 0) {
    return Math.min(12, Math.max(1, Math.floor(numericLimit)));
  }

  return 5;
}

function buildConversationText(messages = []) {
  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .slice(-8)
    .map((message, index) => {
      const content =
        typeof message.content === "string"
          ? message.content
          : message.role === "user"
            ? message.question || message.content || ""
            : message.answer || message.content || "";

      return `${index + 1}. ${message.role.toUpperCase()}: ${content}`;
    })
    .join("\n");
}

function buildWhereFromPlan(plan) {
  const conditions = [];

  if (plan.category) {
    conditions.push({ category: { $eq: plan.category } });
  }

  if (plan.subCategory) {
    conditions.push({ subCategory: { $eq: plan.subCategory } });
  }

  if (plan.brand) {
    conditions.push({ brand: { $eq: plan.brand } });
  }

  if (plan.minBudget != null && plan.minBudget >= 0) {
    conditions.push({ price: { $gte: Number(plan.minBudget) } });
  }

  if (plan.maxBudget != null && plan.maxBudget >= 0) {
    conditions.push({ price: { $lte: Number(plan.maxBudget) } });
  }

  if (conditions.length === 0) {
    return undefined;
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return { $and: conditions };
}

function dedupeProducts(products = []) {
  const seen = new Set();

  return products.filter((product) => {
    const id = product.id || product._id || product.name;
    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

function buildRelatedSearchQuery(product) {
  return [product?.name, product?.category, product?.subCategory, product?.brand]
    .filter(Boolean)
    .join(" ");
}

function getNormalizedQuery(input) {
  return String(input || "").trim();
}

async function buildAssistantPlan(question, messages, options = {}) {
  const planner = getLangChainChatModel().withStructuredOutput(assistantPlanSchema, {
    method: "jsonSchema",
    strict: true,
  });

  const messagesList = [
    [
      "system",
      [
        "You analyze shopping conversations and extract retrieval parameters for product search.",
        "Classify the user intent as search, recommendation, related, budget, category, conversation, or comparison.",
        "For product comparisons, set intent to 'comparison' and extract the two product names/descriptions to compare into 'compareProducts'.",
        "Use the conversation history to resolve relative/follow-up queries (e.g. 'Show cheaper ones', 'Only black', 'Any under 1000'). Carry over category, subCategory, or brand from previous turns, and update budget filters or search terms based on the context.",
        "If the user query switches to a new, unrelated topic (e.g. from jackets to shoes, or from clothing to bags), clear all previous category, subCategory, and budget filters to perform a fresh search and reset the context.",
        "Infer budget limits and category filters only when supported by the text.",
        "Return structured JSON only.",
      ].join(" "),
    ],
    [
      "human",
      [
        `Current query: ${question}`,
        "",
        `Conversation history:\n${buildConversationText(messages) || "[]"}`,
        "",
        `Maximum products to retrieve: ${normalizeLimit(options.limit)}`,
      ].join("\n"),
    ],
  ];

  return planner.invoke(messagesList);
}

async function retrieveProductsWithFilters(question, plan, options = {}) {
  const vectorStore = await getProductVectorStore();
  const limit = normalizeLimit(plan.limit || options.limit);
  const where = buildWhereFromPlan(plan);
  
  let searchResults = [];
  if (where) {
    searchResults = await vectorStore.similaritySearchWithScore(question, limit, where);
  }
  
  // Fallback to unfiltered search if filtered search yielded 0 results
  if (where && searchResults.length === 0) {
    searchResults = await vectorStore.similaritySearchWithScore(question, limit, undefined);
  } else if (!where) {
    searchResults = await vectorStore.similaritySearchWithScore(question, limit, undefined);
  }

  return dedupeProducts(searchResults.map(([document, score]) => mapDocumentToProduct(document, score)));
}

async function buildAssistantPayload(question, messages = [], options = {}) {
  const query = getNormalizedQuery(question);

  if (!query) {
    return {
      query: "",
      intent: "conversation",
      confidence: 0,
      filtersApplied: { category: "", subCategory: "", brand: "", minBudget: null, maxBudget: null },
      conversationSummary: "",
      topProducts: [],
      recommendationProducts: [],
      relatedProducts: [],
      answer: "",
    };
  }

  // Initialize LangChain Conversation Memory
  const chatHistory = new ChatMessageHistory();
  if (Array.isArray(messages)) {
    for (const msg of messages) {
      const content = msg.content || msg.question || msg.answer || "";
      if (!content || msg.isError) continue;

      if (msg.role === "user") {
        await chatHistory.addMessage(new HumanMessage(content));
      } else if (msg.role === "assistant") {
        await chatHistory.addMessage(new AIMessage(content));
      }
    }
  }

  const memory = new BufferMemory({
    chatHistory,
    returnMessages: true,
    memoryKey: "history",
  });

  const memoryVars = await memory.loadMemoryVariables({});
  const memoryMessages = memoryVars.history || [];

  // Convert message history from memory back to standard representation for downstream tasks
  const standardHistory = memoryMessages.map((msg) => ({
    role: msg._getType() === "human" ? "user" : "assistant",
    content: msg.content,
  }));

  const plan = await buildAssistantPlan(query, standardHistory, options);
  
  let topProducts = [];
  if (plan.intent === "comparison" && Array.isArray(plan.compareProducts) && plan.compareProducts.length > 0) {
    const vectorStore = await getProductVectorStore();
    const comparedList = [];
    for (const prodName of plan.compareProducts) {
      if (!prodName?.trim()) continue;
      const searchResults = await vectorStore.similaritySearchWithScore(prodName, 1, undefined);
      if (searchResults && searchResults.length > 0) {
        comparedList.push(mapDocumentToProduct(searchResults[0][0], searchResults[0][1]));
      }
    }
    topProducts = dedupeProducts(comparedList);
  } else {
    topProducts = await retrieveProductsWithFilters(plan.searchQuery || query, plan, options);
  }

  const recommendationProducts = await retrieveRecommendationProducts(plan, query, options);
  const relatedProducts = await retrieveRelatedProducts(topProducts, plan, query, options);

  const synthesized = await synthesizeAssistantResponse({
    question: query,
    plan,
    conversationContext: buildConversationContext(standardHistory),
    topProducts,
    recommendationProducts,
    relatedProducts,
    options,
  });

  return {
    ...synthesized,
    query: query,
    intent: synthesized.intent || plan.intent,
    filtersApplied: synthesized.filtersApplied || {
      category: plan.category || "",
      subCategory: plan.subCategory || "",
      brand: plan.brand || "",
      minBudget: plan.minBudget ?? null,
      maxBudget: plan.maxBudget ?? null,
    },
    conversationSummary: "",
    topProducts,
    recommendationProducts,
    relatedProducts,
  };
}

async function retrieveRelatedProducts(seedProducts, plan, question, options = {}) {
  const seedProduct = seedProducts?.[0];
  if (!seedProduct) {
    return [];
  }

  const vectorStore = await getProductVectorStore();
  const relatedQuery = buildRelatedSearchQuery(seedProduct) || plan.relatedTo || question;
  const relatedWhere = buildWhereFromPlan({
    ...plan,
    category: plan.category || seedProduct.category,
    subCategory: plan.subCategory || seedProduct.subCategory,
    brand: plan.brand || seedProduct.brand,
  });
  const relatedResults = await vectorStore.similaritySearchWithScore(relatedQuery, normalizeLimit(options.limit || plan.limit), relatedWhere);

  return dedupeProducts(
    relatedResults
      .map(([document, score]) => mapDocumentToProduct(document, score))
      .filter((product) => product.id !== seedProduct.id)
  );
}

async function retrieveRecommendationProducts(plan, question, options = {}) {
  const vectorStore = await getProductVectorStore();
  const recommendationQuery = plan.searchQuery || question;
  const recommendationWhere = buildWhereFromPlan(plan);
  const recommendationResults = await vectorStore.similaritySearchWithScore(
    recommendationQuery,
    normalizeLimit(options.recommendationLimit || plan.limit),
    recommendationWhere
  );

  return dedupeProducts(recommendationResults.map(([document, score]) => mapDocumentToProduct(document, score)));
}

async function synthesizeAssistantResponse({ question, plan, conversationContext, topProducts, recommendationProducts, relatedProducts, options = {} }) {
  const synthesisModel = getLangChainChatModel().withStructuredOutput(
    z.object({
      answer: z.string().trim(),
      intent: z.string().trim(),
      query: z.string().trim(),
      confidence: z.number().min(0).max(1),
      suggestions: z.array(z.string().trim()).default([]),
      filtersApplied: z
        .object({
          category: z.string().trim().default(""),
          subCategory: z.string().trim().default(""),
          brand: z.string().trim().default(""),
          minBudget: z.number().default(-1),
          maxBudget: z.number().default(-1),
        })
        .default({ category: "", subCategory: "", brand: "", minBudget: -1, maxBudget: -1 }),
      comparison: z
        .object({
          productA: z
            .object({
              id: z.string().default(""),
              name: z.string().default(""),
              price: z.number().default(0),
              brand: z.string().default(""),
              category: z.string().default(""),
              description: z.string().default(""),
            })
            .default({}),
          productB: z
            .object({
              id: z.string().default(""),
              name: z.string().default(""),
              price: z.number().default(0),
              brand: z.string().default(""),
              category: z.string().default(""),
              description: z.string().default(""),
            })
            .default({}),
          differences: z.array(z.string()).default([]),
          recommendation: z.string().default(""),
        })
        .optional(),
    }),
    { method: "jsonSchema", strict: true }
  );

  const promptMessages = buildRagMessages({
    question,
    context: buildTopProductsBlock(topProducts),
    conversationContext,
  });

  return synthesisModel.invoke([
    ...promptMessages.map((message) => [message.role, message.content]),
    [
      "human",
      [
        "Recommendation products JSON:",
        buildTopProductsBlock(recommendationProducts),
        "",
        "Related products JSON:",
        buildTopProductsBlock(relatedProducts),
        "",
        `Intent: ${plan.intent}`,
        `Resolved filters: ${JSON.stringify({
          category: plan.category || "",
          subCategory: plan.subCategory || "",
          brand: plan.brand || "",
          minBudget: plan.minBudget ?? null,
          maxBudget: plan.maxBudget ?? null,
        })}`,
        "",
        "Generate a concise natural-language answer that references only the provided product data.",
        "If the intent is 'comparison' and there are compared products, populate the 'comparison' field in the schema comparing the two products, listing their specifications (productA and productB details from the context), differences, and a final recommendation. Do not invent any specifications.",
        "If recommending an outfit or combination, suggest specific combinations (e.g. matching shirt and jeans) in the natural-language answer using only retrieved products.",
        "Also, generate 2-3 short, relevant follow-up query suggestions/choices as strings for the shopper.",
        'Return JSON that reflects the actual search, conversation context, and includes suggestions.',
      ].join("\n"),
    ],
  ]);
}

export async function retrieveProductContext(question, options = {}) {
  const query = getNormalizedQuery(question);

  if (!query) {
    return [];
  }

  const vectorStore = await getProductVectorStore();
  const results = await vectorStore.similaritySearchWithScore(query, normalizeLimit(options.limit));

  return dedupeProducts(results.map(([document, score]) => mapDocumentToProduct(document, score)));
}

export async function answerProductQuestion(question, options = {}) {
  return buildAssistantPayload(question, options.messages || [], options);
}

export async function buildRagDebugPayload(question, options = {}) {
  const query = String(question || "").trim();
  const topProducts = await retrieveProductContext(query, options);

  return {
    query,
    topProducts,
    topProductsJson: buildTopProductsBlock(topProducts),
    promptMessages: buildRagMessages({
      question: query,
      context: buildTopProductsBlock(topProducts),
      conversationContext: buildConversationContext(options.messages || []),
    }),
  };
}
