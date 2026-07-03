/**
 * Simulates EXACTLY what the production backend does on Render.
 * Uses CHROMA_URL env var, parses it, and connects just like vectorStore.js does.
 */
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
dotenv.config();

// Monkey-patch fetch for complete visibility
const origFetch = globalThis.fetch;
globalThis.fetch = async function(input, init) {
  const url = typeof input === "string" ? input : input?.url;
  console.log(`[FETCH] ${init?.method || "GET"} ${url}`);
  try {
    const res = await origFetch(input, init);
    const body = await res.clone().text();
    console.log(`[RESPONSE] ${res.status} ${res.statusText} → ${body.substring(0, 200)}`);
    return res;
  } catch (err) {
    console.error(`[FETCH ERROR] ${err.constructor?.name}: ${err.message}`);
    throw err;
  }
};

async function run() {
  const CHROMA_URL = process.env.CHROMA_URL || "";
  let host, port, ssl;

  if (CHROMA_URL) {
    const parsed = new URL(CHROMA_URL);
    host = parsed.hostname;
    ssl  = parsed.protocol === "https:";
    port = parsed.port ? Number(parsed.port) : (ssl ? 443 : 80);
    console.log(`[CONFIG] CHROMA_URL="${CHROMA_URL}" → host=${host}, port=${port}, ssl=${ssl}`);
  } else {
    host = process.env.CHROMA_HOST || "localhost";
    port = Number(process.env.CHROMA_PORT || 8001);
    ssl  = false;
    console.log(`[CONFIG] No CHROMA_URL, using host=${host}, port=${port}, ssl=${ssl}`);
  }

  const client = new ChromaClient({ host, port, ssl });

  console.log("\n--- HEARTBEAT ---");
  try {
    const hb = await client.heartbeat();
    console.log("Heartbeat OK:", hb);
  } catch (e) {
    console.error("Heartbeat FAILED:", e.message);
  }

  console.log("\n--- getOrCreateCollection ---");
  try {
    const coll = await client.getOrCreateCollection({
      name: "onecart_products",
      embeddingFunction: null,
      metadata: { app: "oneCart" }
    });
    console.log("Collection OK:", coll.name, "id:", coll.id);
    const count = await coll.count();
    console.log("Vector count:", count);
  } catch (e) {
    console.error("Collection FAILED:", e.message);
  }
}

run();
