/**
 * Debug script: intercepts all fetch calls made by chromadb SDK
 * and logs the exact URL, method, headers, and response code.
 */
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
dotenv.config();

// Monkey-patch global fetch to intercept every request chromadb makes
const originalFetch = globalThis.fetch;
globalThis.fetch = async function(input, init) {
  const url = typeof input === "string" ? input : input?.url;
  console.log("\n--- INTERCEPTED FETCH ---");
  console.log("URL:", url);
  console.log("Method:", init?.method || "GET");
  console.log("Headers:", JSON.stringify(init?.headers || {}, null, 2));
  if (init?.body) console.log("Body:", init.body);

  let res;
  try {
    res = await originalFetch(input, init);
    console.log("Response Status:", res.status, res.statusText);
    const bodyText = await res.clone().text();
    console.log("Response Body:", bodyText);
    console.log("--- END ---\n");
    return res;
  } catch (err) {
    console.error("Fetch threw exception:", err.message);
    throw err;
  }
};

async function run() {
  console.log("=== Testing chromadb@3.5.0 full flow ===");
  console.log("CHROMA_URL:", process.env.CHROMA_URL || "(not set)");
  console.log("CHROMA_HOST:", process.env.CHROMA_HOST || "(not set)");
  console.log("CHROMA_PORT:", process.env.CHROMA_PORT || "(not set)");

  const host   = "onecart-chroma.onrender.com";
  const port   = 443;
  const ssl    = true;

  console.log(`\nCreating ChromaClient with host=${host}, port=${port}, ssl=${ssl}`);

  const client = new ChromaClient({ host, port, ssl });

  try {
    const hb = await client.heartbeat();
    console.log("\n✅ Heartbeat OK:", hb);
  } catch (e) {
    console.error("\n❌ Heartbeat FAILED:", e.message);
  }

  try {
    const coll = await client.getOrCreateCollection({ name: "onecart_products", embeddingFunction: null });
    console.log("\n✅ Collection OK:", coll.name);
  } catch (e) {
    console.error("\n❌ Collection FAILED:", e.message);
  }
}

run();
