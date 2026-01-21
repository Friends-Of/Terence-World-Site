import type { APIRoute } from "astro";
import { search } from "../../rag/retrieval";
import { generateAnswer } from "../../rag/generate";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const isRateLimited = (key: string) => {
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  rateLimit.set(key, entry);
  return entry.count > RATE_LIMIT_MAX;
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (isRateLimited(clientAddress || "unknown")) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { message?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (message.length > 2000) {
    return new Response(JSON.stringify({ error: "Message too long." }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const chunks = await search(message, 5);
    const response = await generateAnswer(message, chunks);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("chat api error", error);
    return new Response(JSON.stringify({ error: "Failed to generate response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
