import type { APIRoute } from "astro";

type TelemetryBody = {
  event?: string;
  properties?: Record<string, unknown>;
};

const getClientId = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("cf-connecting-ip") ||
  "anon";

export const POST: APIRoute = async ({ request }) => {
  let body: TelemetryBody = {};
  try {
    body = (await request.json()) as TelemetryBody;
  } catch {
    body = {};
  }

  const event = typeof body.event === "string" ? body.event : "unknown_event";
  const properties = typeof body.properties === "object" && body.properties ? body.properties : {};

  const apiKey = import.meta.env.POSTHOG_PROJECT_API_KEY ?? process.env.POSTHOG_PROJECT_API_KEY;
  const host = import.meta.env.POSTHOG_HOST ?? process.env.POSTHOG_HOST ?? "https://app.posthog.com";

  if (apiKey) {
    try {
      await fetch(`${host}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          event,
          distinct_id: getClientId(request),
          properties: {
            ...properties,
            $current_url: request.url,
          },
        }),
      });
    } catch {
      // no-op
    }
  }

  return new Response(null, { status: 204 });
};