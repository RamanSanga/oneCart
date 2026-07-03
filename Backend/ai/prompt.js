export const SYSTEM_PROMPT = [
  "You are a product retrieval assistant for an e-commerce store.",
  "Use only the provided catalog context and conversation context when answering product questions.",
  "Support natural language search, recommendations, related products, budget filtering, and category filtering.",
  "Return JSON only. Do not return markdown, prose, or code fences.",
  "If the context is incomplete, say so clearly instead of guessing.",
  'The final JSON must use product data only from the retrieved context and must include: answer, intent, query, confidence, filtersApplied, topProducts, recommendationProducts, relatedProducts, and conversationSummary.',
].join(" ");

export function buildTopProductsBlock(items = []) {
  if (!Array.isArray(items) || !items.length) {
    return "[]";
  }

  return JSON.stringify(
    items.map((item) => ({
      id: item.id || "",
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      subCategory: item.subCategory || "",
      price: item.price ?? null,
      brand: item.brand || "",
      image: item.image || "",
      bestSeller: Boolean(item.bestSeller),
      score: item.score ?? null,
    })),
    null,
    2
  );
}

export function buildConversationContext(messages = []) {
  if (!Array.isArray(messages) || !messages.length) {
    return "[]";
  }

  return JSON.stringify(
    messages
      .filter((message) => message && (message.role === "user" || message.role === "assistant"))
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content:
          typeof message.content === "string"
            ? message.content
            : message.role === "user"
              ? message.question || message.content || ""
              : message.answer || message.content || "",
      })),
    null,
    2
  );
}

export function buildContextBlock(items = []) {
  if (!Array.isArray(items) || !items.length) {
    return "No catalog context was retrieved.";
  }

  return items
    .map((item, index) => {
      const lines = [
        `Product ${index + 1}: ${item.name || item.id || "Unknown product"}`,
        item.description ? `Description: ${item.description}` : null,
        item.category ? `Category: ${item.category}` : null,
        item.subCategory ? `Subcategory: ${item.subCategory}` : null,
        item.price !== undefined && item.price !== null ? `Price: ${item.price}` : null,
        item.sizes?.length ? `Sizes: ${item.sizes.join(", ")}` : null,
        item.stockSummary ? `Stock: ${item.stockSummary}` : null,
      ].filter(Boolean);

      return lines.join("\n");
    })
    .join("\n\n");
}

export function buildRagMessages({ question, context, conversationContext }) {
  return [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: [
        "Conversation context JSON:",
        conversationContext || "[]",
        "",
        "Retrieved products JSON:",
        context || "No catalog context was retrieved.",
        "",
        `Question: ${question}`,
        "",
        'Respond with valid JSON only using this structure: {"answer": string, "intent": string, "query": string, "confidence": number, "filtersApplied": object, "topProducts": array, "recommendationProducts": array, "relatedProducts": array, "conversationSummary": string}.',
      ].join("\n"),
    },
  ];
}

export function buildRagJsonMessages({ question, topProducts, conversationContext }) {
  return buildRagMessages({
    question,
    context: buildTopProductsBlock(topProducts),
    conversationContext,
  });
}
