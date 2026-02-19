# Terence.world v1.0

Fresh implementation of the AI-native personal notebook and portfolio defined in `TERENCE_WORLD_PRD_CODEX_SAFE_v0.3.md`.

## Run

1. `cd site`
2. `npm install`
3. `npm run dev`

## Build

- `npm run rag:build` generates `src/rag/index.json` from public content.
- `npm run build` runs the RAG build and compiles the Astro app.

## Env vars

- `OPENAI_API_KEY` optional; enables LLM responses for chat.
- `OPENAI_CHAT_MODEL` optional, default `gpt-4o-mini`.
- `PUBLIC_POSTHOG_KEY` optional; enables client capture if PostHog is loaded.
- `POSTHOG_PROJECT_API_KEY` optional; enables server-side event forwarding from API routes.
- `POSTHOG_HOST` optional, default `https://app.posthog.com`.

## Worker

Cloudflare TollBit gate is in `../worker`.
