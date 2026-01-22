import OpenAI from "openai";
import indexData from "./index.json";

export type Chunk = {
  id: string;
  title: string;
  sourcePath: string;
  routeHint: string;
  text: string;
  embedding: number[];
};

type RagIndex = {
  version: number;
  createdAt: string;
  chunks: Chunk[];
};

const getApiKey = () => import.meta.env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;

let client: OpenAI | null = null;

const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
};

const embedModel =
  import.meta.env.OPENAI_EMBED_MODEL ??
  process.env.OPENAI_EMBED_MODEL ??
  "text-embedding-3-small";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

const cosineSimilarity = (a: number[], b: number[]) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    const av = a[i];
    const bv = b[i] || 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const embedQuery = async (text: string): Promise<number[]> => {
  const cleaned = normalize(text).slice(0, 2000);
  const response = await getClient().embeddings.create({
    model: embedModel,
    input: cleaned,
  });
  return response.data[0].embedding;
};

export const search = async (query: string, k = 5): Promise<Chunk[]> => {
  const index = indexData as RagIndex;
  if (!index.chunks || index.chunks.length === 0) {
    return [];
  }
  const queryEmbedding = await embedQuery(query);
  const scored = index.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((item) => item.chunk);
};
