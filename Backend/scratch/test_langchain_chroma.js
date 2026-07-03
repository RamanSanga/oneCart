import { ChromaClient } from "chromadb";
import { Chroma as LangChainChroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const client = new ChromaClient({
    host: "onecart-chroma.onrender.com",
    port: 443,
    ssl: true
  });

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "text-embedding-004",
  });

  console.log("Testing LangChain Chroma fromExistingCollection...");
  try {
    const store = await LangChainChroma.fromExistingCollection(
      embeddings,
      {
        index: client,
        collectionName: "onecart_products",
      }
    );
    console.log("LangChain store success!");
    
    // Fetch doc count
    const count = await store.collection.count();
    console.log("Product count:", count);
  } catch (err) {
    console.error("LangChain store failed!");
    console.error(err);
  }
}

run();
