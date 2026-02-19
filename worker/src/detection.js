const windowStore = new Map();
const complaints = new Map();
const runtimeWhitelist = new Set();

export const REQUEST_WINDOW_MS = 10_000;
export const REQUEST_THRESHOLD = 4;

export const parseCookies = (cookieHeader = "") => {
  const parsed = {};
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [k, ...rest] = pair.trim().split("=");
    if (!k) continue;
    parsed[k] = rest.join("=");
  }
  return parsed;
};

export const getClientIp = (request) =>
  request.headers.get("cf-connecting-ip") ||
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

export const isHtmlPageRequest = (request, pathname) => {
  if (!request.method || request.method.toUpperCase() !== "GET") return false;
  if (pathname.startsWith("/api/")) return false;
  const accept = (request.headers.get("accept") || "").toLowerCase();
  return accept.includes("text/html") || accept.includes("text/");
};

export const recordHtmlRequest = (ip, now, isHtml) => {
  if (!isHtml) return 0;
  const existing = windowStore.get(ip) || [];
  const recent = existing.filter((ts) => now - ts <= REQUEST_WINDOW_MS);
  recent.push(now);
  windowStore.set(ip, recent);
  return recent.length;
};

export const evaluateHeuristics = (request, url, now = Date.now()) => {
  const ip = getClientIp(request);
  const isHtml = isHtmlPageRequest(request, url.pathname);
  const htmlCount = recordHtmlRequest(ip, now, isHtml);

  const accept = (request.headers.get("accept") || "").toLowerCase();
  const hasImage = accept.includes("image/");
  const hasApplication = accept.includes("application/");
  const hasText = accept.includes("text/") || accept.includes("text/html");

  const h1 = htmlCount >= REQUEST_THRESHOLD;
  const h2 = hasText && !hasImage && !hasApplication;
  const h3 = !request.headers.has("sec-ch-ua") && !request.headers.has("sec-fetch-site");

  const isBot = h1 && (h2 || h3);
  const botType = h1 && h2 ? "heuristic_h1_h2" : h1 && h3 ? "heuristic_h1_h3" : "none";

  return { ip, h1, h2, h3, isBot, botType };
};

export const hasBypassCookie = (request) => {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  return cookies.bypass_bot_check === "1";
};

export const isPaidTokenValid = (request) => {
  const headerToken = request.headers.get("x-tollbit-token");
  const queryToken = new URL(request.url).searchParams.get("tollbit_token");
  const token = headerToken || queryToken || "";
  return token.length >= 12;
};

export const isWhitelisted = (ip, env) => {
  if (runtimeWhitelist.has(ip)) return true;
  const raw = typeof env.MANUAL_WHITELIST === "string" ? env.MANUAL_WHITELIST : "";
  if (!raw) return false;
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(ip);
};

export const addComplaint = async (ip, env) => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const existing = complaints.get(ip) || [];
  const recent = existing.filter((ts) => now - ts <= oneDay);
  recent.push(now);
  complaints.set(ip, recent);

  if (recent.length >= 2) {
    runtimeWhitelist.add(ip);
    const webhook = env.SLACK_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `TollBit false-positive threshold hit for ${ip}. Runtime whitelist applied.`,
          }),
        });
      } catch {
        // no-op
      }
    }
  }

  return recent.length;
};

export const resetState = () => {
  windowStore.clear();
  complaints.clear();
  runtimeWhitelist.clear();
};
