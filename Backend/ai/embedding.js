import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Embeddings } from "@langchain/core/embeddings";
import { pipeline } from "@xenova/transformers";

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value || !String(value).trim()) {
    throw new Error(`${name} is required.`);
  }

  return String(value).trim();
}

let cachedGoogleApiKey;

// Lazy configuration helper functions to avoid ESM static import order bugs
function getGeminiModel() {
  return process.env.GEMINI_MODEL || process.env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash";
}

function getGeminiTemperature() {
  return process.env.GEMINI_TEMPERATURE ? Number(process.env.GEMINI_TEMPERATURE) : 0.2;
}

function getGeminiMaxTokens() {
  return process.env.GEMINI_MAX_OUTPUT_TOKENS ? Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) : undefined;
}

function getEmbeddingModelInternal() {
  return process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
}

/**
 * Custom LangChain-compatible Embeddings class using @xenova/transformers.
 * This runs feature extraction locally using ONNX runtime under the hood.
 */
class XenovaEmbeddings extends Embeddings {
  constructor(fields = {}) {
    super(fields);
    this.modelName = fields.modelName || "Xenova/all-MiniLM-L6-v2";
    this.pipelinePromise = null;
  }

  /**
   * Lazily loads the feature-extraction pipeline and caches the promise.
   * This ensures the model is loaded only once and reused for all subsequent queries.
   */
  async _getPipeline() {
    if (!this.pipelinePromise) {
      this.pipelinePromise = pipeline("feature-extraction", this.modelName);
    }
    return this.pipelinePromise;
  }

  /**
   * Embeds a list of texts sequentially to avoid memory spikes and thread blocking.
   * Returns a 2D array of embeddings.
   */
  async embedDocuments(documents) {
    const extractor = await this._getPipeline();
    const embeddings = [];
    for (const doc of documents) {
      const output = await extractor(doc, { pooling: "mean", normalize: true });
      embeddings.push(Array.from(output.data));
    }
    return embeddings;
  }

  /**
   * Embeds a single text query and returns its embedding vector.
   */
  async embedQuery(document) {
    const extractor = await this._getPipeline();
    const output = await extractor(document, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  }
}

let cachedEmbeddings;
let cachedChatModel;

export function getChatModel() {
  return getGeminiModel();
}

export function getEmbeddingModel() {
  return getEmbeddingModelInternal();
}

export function getLangChainEmbeddings() {
  if (!cachedEmbeddings) {
    cachedEmbeddings = new XenovaEmbeddings({
      modelName: getEmbeddingModelInternal(),
    });
  }

  return cachedEmbeddings;
}

export function getLangChainChatModel() {
  if (!cachedChatModel) {
    const config = {
      model: getGeminiModel(),
      apiKey: cachedGoogleApiKey || (cachedGoogleApiKey = getRequiredEnv("GOOGLE_API_KEY")),
      temperature: getGeminiTemperature(),
      streaming: false,
    };
    
    const maxTokens = getGeminiMaxTokens();
    if (maxTokens !== undefined) {
      config.maxOutputTokens = maxTokens;
    }
    
    cachedChatModel = new ChatGoogleGenerativeAI(config);
  }

  return cachedChatModel;
}

function normalizeTextInput(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return String(value).trim();
}

export async function embedText(text) {
  const input = normalizeTextInput(text);

  if (!input) {
    throw new Error("Cannot create an embedding for empty text.");
  }

  return getLangChainEmbeddings().embedQuery(input);
}

export async function embedTexts(texts) {
  const input = Array.isArray(texts) ? texts.map(normalizeTextInput).filter(Boolean) : [];

  if (!input.length) {
    throw new Error("Cannot create embeddings for an empty batch.");
  }

  return getLangChainEmbeddings().embedDocuments(input);
}

export async function generateText(messages, options = {}) {
  if (!Array.isArray(messages) || !messages.length) {
    throw new Error("messages must be a non-empty array.");
  }

  const maxTokens = options.maxTokens ?? getGeminiMaxTokens();
  const config = {
    model: options.model || getGeminiModel(),
    apiKey: cachedGoogleApiKey || (cachedGoogleApiKey = getRequiredEnv("GOOGLE_API_KEY")),
    temperature: options.temperature ?? 0.2,
    streaming: false,
  };
  
  if (maxTokens !== undefined) {
    config.maxOutputTokens = maxTokens;
  }

  const model = options.model ? new ChatGoogleGenerativeAI(config) : getLangChainChatModel();

  const response = await model.invoke(messages, {
    temperature: options.temperature,
    maxOutputTokens: options.maxTokens,
    json: options.json ?? true,
  });

  if (typeof response.content === "string") {
    return response.content.trim();
  }

  if (Array.isArray(response.content)) {
    return response.content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("")
      .trim();
  }

  return "";
}
