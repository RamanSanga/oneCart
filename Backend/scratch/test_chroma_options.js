import { ChromaClient } from "chromadb";

async function run() {
  console.log("Creating client with host, port, ssl...");
  const client = new ChromaClient({
    host: "onecart-chroma.onrender.com",
    port: 443,
    ssl: true
  });

  console.log("Testing heartbeat...");
  try {
    const hb = await client.heartbeat();
    console.log("Heartbeat success:", hb);
  } catch (err) {
    console.error("Heartbeat failed!");
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    console.error("Raw Error:", err);
  }
}

run();
