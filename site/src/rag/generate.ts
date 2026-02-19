import OpenAI from "openai";
import type { ChatLink, RagChunk } from "./types";

const chatModel = import.meta.env.OPENAI_CHAT_MODEL ?? process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";

let client: OpenAI | null = null;
const getClient = () => {
  const key = import.meta.env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!key) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
};

const dedupeLinks = (chunks: RagChunk[]): ChatLink[] => {
  const seen = new Set<string>();
  const links: ChatLink[] = [];
  for (const chunk of chunks) {
    const href = chunk.routeHint;
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push({ href, label: chunk.title });
    if (links.length >= 4) break;
  }
  return links;
};

const fallbackAnswer = (message: string, chunks: RagChunk[]) => {
  if (!chunks.length) {
    return "I do not have grounded context for that yet. Try asking about Start Here, Proof Hub, writing, or the TollBit worker.";
  }
  const evidence = chunks
    .slice(0, 3)
    .map((chunk, idx) => `${idx + 1}. ${chunk.title}: ${chunk.text.slice(0, 180).trim()}...`)
    .join("\n");

  return `Grounded summary for: \"${message}\"\n\n${evidence}`;
};

export const generateAnswer = async (message: string, chunks: RagChunk[]) => {
  const links = dedupeLinks(chunks);
  const openai = getClient();

  if (!openai) {
    return {
      answer: fallbackAnswer(message, chunks),
      links,
    };
  }

  const context = chunks
    .map((chunk, index) => `(${index + 1}) ${chunk.title} [${chunk.routeHint}]\n${chunk.text}`)
    .join("\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: chatModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are Terence AI. Be concise, direct, and grounded in provided context. If uncertain, say so and point to likely pages.",
        },
        {
          role: "user",
          content: `Question: ${message}\n\nContext:\n${context}`,
        },
      ],
    });

    return {
      answer: completion.choices[0]?.message?.content?.trim() || fallbackAnswer(message, chunks),
      links,
    };
  } catch {
    return {
      answer: fallbackAnswer(message, chunks),
      links,
    };
  }
};
