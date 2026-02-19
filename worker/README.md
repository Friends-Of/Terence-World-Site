# TollBit Worker

Deterministic gate for AI-agent monetization.

## Logic

- Exact UA redirect using `src/config/ai-user-agents.json`.
- Behavioral redirect when `H1 AND (H2 OR H3)`:
  - H1: >=4 HTML page requests in 10s, path not starting `/api/`
  - H2: Accept header is text-only (no image/* and no application/*)
  - H3: Missing both `sec-ch-ua` and `sec-fetch-site`
- `?human=true` sets `bypass_bot_check=1` cookie for 1 hour.
- Valid paid token bypasses redirect.

## Ops

- POST `/__ops/complaint` with `{ "ip": "1.2.3.4" }` to increment complaints.
- At >=2 complaints in 24h for an IP, worker adds runtime whitelist and posts Slack alert if configured.
