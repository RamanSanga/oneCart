import { ChromaClient } from "chromadb";
import { Chroma as LangChainChroma } from "@langchain/community/vectorstores/chroma";
import { getLangChainEmbeddings } from "./embedding.js";

let cachedClient;
let cachedCollection;
let cachedVectorStore;

/**
 * Resolves Chroma connection config from environment variables.
 * Supports CHROMA_URL (full URL) or individual CHROMA_HOST / CHROMA_PORT / CHROMA_SSL vars.
 * chromadb@3.5.x requires host, port, ssl — the `path` option is deprecated and fails.
 */
function getChromaConfigInternal() {
  const CHROMA_URL = process.env.CHROMA_URL || "";
  let host, port, ssl;

  if (CHROMA_URL) {
    try {
      const parsed = new URL(CHROMA_URL);
      host = parsed.hostname;
      ssl  = parsed.protocol === "https:";
      // If URL has an explicit port use it; otherwise default to 443 (https) or 80 (http)
      port = parsed.port ? Number(parsed.port) : (ssl ? 443 : 80);
    } catch {
      host = "localhost";
      port = 8001;
      ssl  = false;
    }
  } else {
    host = process.env.CHROMA_HOST || "localhost";
    port = Number(process.env.CHROMA_PORT || 8001);
    ssl  = String(process.env.CHROMA_SSL || "false").toLowerCase() === "true";
  }

  const tenant         = process.env.CHROMA_TENANT || "default_tenant";
  const database       = process.env.CHROMA_DATABASE || "default_database";
  const collectionName = process.env.CHROMA_COLLECTION_NAME || process.env.CHROMA_PRODUCTS_COLLECTION || "onecart_products";

  return { host, port, ssl, tenant, database, collectionName };
}

/**
 * Returns a singleton ChromaClient using host/port/ssl (confirmed working in chromadb@3.5.x).
 */
export function getChromaClient() {
  if (!cachedClient) {
    const { host, port, ssl, tenant, database } = getChromaConfigInternal();
    cachedClient = new ChromaClient({ host, port, ssl, tenant, database });
  }
  return cachedClient;
}

export function getChromaConfig() {
  return getChromaConfigInternal();
}

export async function getProductCollection() {
  if (!cachedCollection) {
    const { collectionName } = getChromaConfigInternal();
    try {
      const client = getChromaClient();
      cachedCollection = await client.getOrCreateCollection({
        name: collectionName,
        embeddingFunction: null,
        metadata: { app: "oneCart", domain: "products" },
      });
    } catch (error) {
      const { host, port } = getChromaConfigInternal();
      throw new Error(
        `Unable to initialize ChromaDB collection "${collectionName}" at ${host}:${port}. ` +
        `Original error: ${error.message}`
      );
    }
  }
  return cachedCollection;
}

/**
 * Returns a singleton LangChain Chroma vector store.
 * Uses index: getChromaClient() directly — no clientParams or url override needed.
 */
export async function getProductVectorStore() {
  if (!cachedVectorStore) {
    const { collectionName, host, port } = getChromaConfigInternal();
    try {
      await getProductCollection();
      cachedVectorStore = await LangChainChroma.fromExistingCollection(
        getLangChainEmbeddings(),
        {
          index: getChromaClient(),
          collectionName,
        }
      );
    } catch (error) {
      throw new Error(
        `Unable to initialize LangChain Chroma vector store for collection "${collectionName}" at ${host}:${port}. ` +
        `Original error: ${error.message}`
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
