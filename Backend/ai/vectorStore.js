import { ChromaClient } from "chromadb";
import { Chroma as LangChainChroma } from "@langchain/community/vectorstores/chroma";
import { getLangChainEmbeddings } from "./embedding.js";

let cachedClient;
let cachedCollection;
let cachedVectorStore;

/**
 * Lazily reads the environment variables when configuration is actually requested.
 * This prevents static ESM import ordering issues where environment variables
 * are read before dotenv.config() has executed.
 */
function getChromaConfigInternal() {
  // Support a single CHROMA_URL (e.g. https://your-chroma.onrender.com)
  // OR individual CHROMA_HOST / CHROMA_PORT / CHROMA_SSL env vars.
  const CHROMA_URL = process.env.CHROMA_URL || "";

  let CHROMA_HOST, CHROMA_PORT, CHROMA_SSL;

  if (CHROMA_URL) {
    try {
      const parsed = new URL(CHROMA_URL);
      CHROMA_HOST = parsed.hostname;
      CHROMA_PORT = Number(parsed.port) || (parsed.protocol === "https:" ? 443 : 80);
      CHROMA_SSL  = parsed.protocol === "https:";
    } catch {
      CHROMA_HOST = "localhost";
      CHROMA_PORT = 8001;
      CHROMA_SSL  = false;
    }
  } else {
    CHROMA_HOST = process.env.CHROMA_HOST || "localhost";
    CHROMA_PORT = Number(process.env.CHROMA_PORT || 8001);
    CHROMA_SSL  = String(process.env.CHROMA_SSL || "false").toLowerCase() === "true";
  }

  const CHROMA_TENANT          = process.env.CHROMA_TENANT || "default_tenant";
  const CHROMA_DATABASE        = process.env.CHROMA_DATABASE || "default_database";
  const CHROMA_COLLECTION_NAME = process.env.CHROMA_COLLECTION_NAME || process.env.CHROMA_PRODUCTS_COLLECTION || "onecart_products";

  return {
    host: CHROMA_HOST,
    port: CHROMA_PORT,
    ssl:  CHROMA_SSL,
    tenant: CHROMA_TENANT,
    database: CHROMA_DATABASE,
    collectionName: CHROMA_COLLECTION_NAME,
  };
}

export function getChromaClient() {
  if (!cachedClient) {
    const config = getChromaConfigInternal();
    cachedClient = new ChromaClient({
      host: config.host,
      port: config.port,
      ssl: config.ssl,
      tenant: config.tenant,
      database: config.database,
    });
  }

  return cachedClient;
}

export function getChromaConfig() {
  return getChromaConfigInternal();
}

export async function getProductCollection() {
  if (!cachedCollection) {
    const config = getChromaConfigInternal();
    try {
      const client = getChromaClient();
      cachedCollection = await client.getOrCreateCollection({
        name: config.collectionName,
        embeddingFunction: null,
        metadata: {
          app: "oneCart",
          domain: "products",
        },
      });
    } catch (error) {
      throw new Error(
        `Unable to initialize ChromaDB collection "${config.collectionName}" at ${config.host}:${config.port}. ` +
          `Check CHROMA_HOST, CHROMA_PORT, CHROMA_SSL, CHROMA_TENANT, and CHROMA_DATABASE. Original error: ${error.message}`
      );
    }
  }

  return cachedCollection;
}

export async function getProductVectorStore() {
  if (!cachedVectorStore) {
    const config = getChromaConfigInternal();
    try {
      await getProductCollection();
      cachedVectorStore = await LangChainChroma.fromExistingCollection(
        getLangChainEmbeddings(),
        {
          index: getChromaClient(),
          collectionName: config.collectionName,
          clientParams: {
            host: config.host,
            port: config.port,
            ssl: config.ssl,
            tenant: config.tenant,
            database: config.database,
          },
        }
      );
    } catch (error) {
      throw new Error(
        `Unable to initialize LangChain Chroma vector store for collection "${config.collectionName}". ` +
          `Confirm the Chroma server is running and reachable. Original error: ${error.message}`
      );
    }
  }

  return cachedVectorStore;
}

export async function resetProductCollectionCache() {
  cachedCollection = undefined;
}

export async function resetProductVectorStoreCache() {
  cachedVectorStore = undefined;
}
