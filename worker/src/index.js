import aiUserAgents from "../config/ai-user-agents.json" with { type: "json" };
import {
  addComplaint,
  evaluateHeuristics,
  getClientIp,
  hasBypassCookie,
  isPaidTokenValid,
  isWhitelisted,
} from "./detection.js";

const uaList = new Set(aiUserAgents.map((ua) => ua.toLowerCase()));

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const redirectToTollBit = (request, env, botType) => {
  const url = new URL(request.url);
  const paywall = new URL(env.TOLLBIT_PAYWALL_URL || "https://tollbit.terence.world/paywall");
  paywall.searchParams.set("rate", env.TOLLBIT_RATE_PER_PAGE || "0.01");
  paywall.searchParams.set("return_to", url.toString());
  paywall.searchParams.set("bot_type", botType);

  return Response.redirect(paywall.toString(), 302);
};

const withBypassCookie = (response) => {
  const next = new Response(response.body, response);
  next.headers.append(
    "Set-Cookie",
    "bypass_bot_check=1; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Lax"
  );
  return next;
};

const emitRedirectEvent = async (request, env, botType) => {
  const apiKey = env.POSTHOG_PROJECT_API_KEY;
  if (!apiKey) return;

  const host = env.POSTHOG_HOST || "https://app.posthog.com";
  const page = new URL(request.url).pathname;

  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event: "tollbit_redirect",
        distinct_id: getClientIp(request),
        properties: {
          bot_type: botType,
          page,
        },
      }),
    });
  } catch {
    // no-op
  }
};


const fallbackShell = () =>
  new Response(
    "<!doctype html><html><head><meta charset='utf-8'><title>Terence.world</title></head><body><main><h1>Terence.world</h1><p>Static fallback shell.</p></main></body></html>",
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
const originFetch = (request, env) => {
  if (env.ORIGIN_URL) {
    const source = new URL(request.url);
    const next = new URL(env.ORIGIN_URL);
    next.pathname = source.pathname;
    next.search = source.search;
    return fetch(new Request(next.toString(), request));
  }
  return fetch(request);
};

const handleComplaint = async (request, env) => {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const ip = typeof body.ip === "string" ? body.ip : getClientIp(request);
  const count = await addComplaint(ip, env);
  return json({ ok: true, ip, complaints_24h: count });
};

export default {
  async fetch(request, env, ctx) {
    try {
    const url = new URL(request.url);

    if (url.pathname === "/__ops/complaint" && request.method.toUpperCase() === "POST") {
      return handleComplaint(request, env);
    }

    if (url.searchParams.get("human") === "true") {
      const cleaned = new URL(url.toString());
      cleaned.searchParams.delete("human");
      const upstream = await originFetch(new Request(cleaned.toString(), request), env);
      return withBypassCookie(upstream);
    }

    const ip = getClientIp(request);

    if (isWhitelisted(ip, env) || hasBypassCookie(request) || isPaidTokenValid(request)) {
      return originFetch(request, env);
    }

    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    if (uaList.has(ua)) {
      ctx.waitUntil(emitRedirectEvent(request, env, "exact_ua"));
      return redirectToTollBit(request, env, "exact_ua");
    }

    const behavior = evaluateHeuristics(request, url);
    if (behavior.isBot) {
      ctx.waitUntil(emitRedirectEvent(request, env, behavior.botType));
      return redirectToTollBit(request, env, behavior.botType);
    }

    return originFetch(request, env);
    } catch {
      return fallbackShell();
    }
  },
};



