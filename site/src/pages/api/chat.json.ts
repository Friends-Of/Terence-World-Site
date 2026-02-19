import type { APIRoute } from "astro";
import { search } from "../../rag/retrieval";
import { generateAnswer } from "../../rag/generate";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 14;
const rateMap = new Map<string, { count: number; resetAt: number }>();

const getClientId = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("cf-connecting-ip") ||
  "unknown";

const isRateLimited = (id: string) => {
  const now = Date.now();
  const entry = rateMap.get(id);
  if (!entry || entry.resetAt <= now) {
    rateMap.set(id, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  rateMap.set(id, entry);
  return entry.count > MAX_REQUESTS;
};

export const POST: APIRoute = async ({ request }) => {
  const clientId = getClientId(request);
  if (isRateLimited(clientId)) {
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
  } catch {
    return new Response(JSON.stringify({ error: "Failed to generate response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};