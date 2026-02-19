import OpenAI from "openai";
import indexData from "./index.json";
import type { RagChunk, RagIndex } from "./types";

const embedModel = import.meta.env.OPENAI_EMBED_MODEL ?? process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";

let client: OpenAI | null = null;
const getClient = () => {
  const key = import.meta.env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!key) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2);

const lexicalScore = (query: string, chunk: RagChunk) => {
  const terms = tokenize(query);
  if (!terms.length) return 0;
  const tokenSet = new Set(chunk.tokens);
  let score = 0;
  for (const term of terms) {
    if (tokenSet.has(term)) score += 1;
  }
  if (chunk.text.toLowerCase().includes(query.toLowerCase().slice(0, 42))) {
    score += 1.25;
  }
  return score / Math.max(terms.length, 1);
};

const cosine = (a: number[], b: number[]) => {
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

const embedQuery = async (query: string): Promise<number[] | null> => {
  const openai = getClient();
  if (!openai) return null;
  const response = await openai.embeddings.create({
    model: embedModel,
    input: query.slice(0, 2000),
  });
  return response.data[0]?.embedding ?? null;
};

export const search = async (query: string, k = 5): Promise<RagChunk[]> => {
  const index = indexData as RagIndex;
  if (!index?.chunks?.length) return [];

  const hasEmbeddings = index.chunks.some((chunk) => Array.isArray(chunk.embedding) && chunk.embedding.length > 0);

  if (hasEmbeddings) {
    const queryEmbedding = await embedQuery(query);
    if (queryEmbedding) {
      return [...index.chunks]
        .map((chunk) => ({
          chunk,
          score: Array.isArray(chunk.embedding) ? cosine(queryEmbedding, chunk.embedding) : 0,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map((item) => item.chunk);
    }
  }

  return [...index.chunks]
    .map((chunk) => ({ chunk, score: lexicalScore(query, chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((item) => item.chunk);
};
