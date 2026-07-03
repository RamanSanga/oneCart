import { ChromaClient } from "chromadb";

async function run() {
  const client = new ChromaClient({
    path: "https://onecart-chroma.onrender.com"
  });

  console.log("Testing heartbeat...");
  try {
    const hb = await client.heartbeat();
    console.log("Heartbeat success:", hb);
  } catch (err) {
    console.error("Heartbeat failed!");
    console.error(err);
  }

  console.log("\nTesting getOrCreateCollection...");
  try {
    const coll = await client.getOrCreateCollection({
      name: "onecart_products"
    });
    console.log("Collection success:", coll.name);
  } catch (err) {
    console.error("Collection failed!");
    console.error(err);
  }
}

run();
