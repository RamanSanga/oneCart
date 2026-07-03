import { ChromaClient } from "chromadb";
import { Chroma as LangChainChroma } from "@langchain/community/vectorstores/chroma";
import { getLangChainEmbeddings } from "./embedding.js";

let cachedClient;
let cachedCollection;
let cachedVectorStore;

/**
 * Reads Chroma configuration environment variables and returns a unified absolute URL endpoint.
 */
function getChromaConfigInternal() {
  const CHROMA_URL = process.env.CHROMA_URL || "";
  const CHROMA_HOST = process.env.CHROMA_HOST || "localhost";
  const CHROMA_PORT = Number(process.env.CHROMA_PORT || 8001);
  const CHROMA_SSL  = String(process.env.CHROMA_SSL || "false").toLowerCase() === "true";

  let resolvedUrl = CHROMA_URL;
  if (!resolvedUrl) {
    const protocol = CHROMA_SSL ? "https" : "http";
    resolvedUrl = `${protocol}://${CHROMA_HOST}:${CHROMA_PORT}`;
  }

  const CHROMA_TENANT          = process.env.CHROMA_TENANT || "default_tenant";
  const CHROMA_DATABASE        = process.env.CHROMA_DATABASE || "default_database";
  const CHROMA_COLLECTION_NAME = process.env.CHROMA_COLLECTION_NAME || process.env.CHROMA_PRODUCTS_COLLECTION || "onecart_products";

  return {
    url: resolvedUrl,
    tenant: CHROMA_TENANT,
    database: CHROMA_DATABASE,
    collectionName: CHROMA_COLLECTION_NAME,
  };
}

export function getChromaClient() {
  if (!cachedClient) {
    const config = getChromaConfigInternal();
    cachedClient = new ChromaClient({
      path: config.url,
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
        `Unable to initialize ChromaDB collection "${config.collectionName}" at ${config.url}. Original error: ${error.message}`
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
          url: config.url,
        }
      );
    } catch (error) {
      throw new Error(
        `Unable to initialize LangChain Chroma vector store for collection "${config.collectionName}" at ${config.url}. Original error: ${error.message}`
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
