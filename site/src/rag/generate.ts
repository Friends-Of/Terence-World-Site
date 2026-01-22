import OpenAI from "openai";
import type { Chunk } from "./retrieval";

export type ChatResponse = {
  answer: string;
  links: { href: string; label: string }[];
  citations: { id: string; title: string; routeHint: string; excerpt: string }[];
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

const chatModel =
  import.meta.env.OPENAI_CHAT_MODEL ?? process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";

const ALLOWLIST = new Map<string, string>([
  ["/projects/fireside", "Fireside"],
  ["/projects/goodies", "Goodies"],
  ["/fit", "Fit"],
  ["/system", "System"],
  ["/about", "About"],
]);

const truncate = (text: string, max = 360) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};

const buildLinks = (chunks: Chunk[]) => {
  const seen = new Set<string>();
  const links: { href: string; label: string }[] = [];
  for (const chunk of chunks) {
    const href = chunk.routeHint;
    if (!ALLOWLIST.has(href) || seen.has(href)) continue;
    seen.add(href);
    links.push({ href, label: ALLOWLIST.get(href) || href });
  }
  return links.slice(0, 3);
};

const buildCitations = (chunks: Chunk[]) =>
  chunks.slice(0, 3).map((chunk) => ({
    id: chunk.id,
    title: chunk.title,
    routeHint: chunk.routeHint,
    excerpt: truncate(chunk.text, 320),
  }));

const buildContext = (chunks: Chunk[]) =>
  chunks
    .slice(0, 5)
    .map((chunk) => `[${chunk.id}] ${truncate(chunk.text, 500)}`)
    .join("\n");

export const generateAnswer = async (query: string, chunks: Chunk[]): Promise<ChatResponse> => {
  if (!chunks.length) {
    return {
      answer: "I can answer about Fireside, Goodies, Fit, or System. Try one of the suggestions.",
      links: [],
      citations: [],
    };
  }

  const systemPrompt =
    "You are a concise assistant for terence.world. Answer using only the provided context. " +
    "If the context is insufficient, say so and suggest where to look. Keep answers short.";

  const context = buildContext(chunks);
  const userPrompt = `Context:\n${context}\n\nQuestion: ${query}`;

  const completion = await getClient().chat.completions.create({
    model: chatModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 220,
  });

  const answer = completion.choices[0]?.message?.content?.trim() || "";

  return {
    answer: answer || "I can answer about Fireside, Goodies, Fit, or System. Try one of the suggestions.",
    links: buildLinks(chunks),
    citations: buildCitations(chunks),
  };
};
