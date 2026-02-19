# Terence.world v1.0 - Product Requirements Document (Codex Safe v0.3)

## 1) Executive Summary
- Feature name: `Terence.world v1.0 - AI-Native Personal Notebook & Portfolio`
- Owner: `Terence Brasch`
- Reviewers: `Harper (Design)`, `Lucas (Eng)`, `Benjamin (QA/Data)`
- Revision history:
  - `v0.1 - 2026-02-18 (88/95)`
  - `v0.2 - 2026-02-18 (93/95)`
  - `v0.3 - 2026-02-18 (95/95; user precision updates applied)`

Terence.world is the living 0->1 notebook that makes Terence instantly legible as builder-leader to humans while monetizing AI agents via TollBit. It replaces vague resume language with deep proof, voice, and intent-based routing.

## 2) Context & Narrative
Identical to v0.2 (unchanged).

## 3) Goals, Non-Goals, and Principles
### Measurable goals
- `G1`: >=65% human sessions reach flagship project or writing within 30s (PostHog).
- `G2`: AI chat engagement >=18% of human sessions (sessions with >=1 user message). Satisfaction >=70% where:
  - `satisfaction = thumbs_up_sessions / eligible_chat_sessions`
  - `eligible_chat_sessions = sessions with >=3 user messages AND >=1 assistant reply`
- `G3`: TollBit revenue >=$75/mo by day 90.
- `G4`: Lighthouse >=98/100 all pages.
- `G5`: p95 LCP <=1.2s; error rate <0.5%.
- `G6`: 100% content RAG-ready on every deploy.

### Non-goals
Identical to v0.2.

### Product principles
Identical to v0.2.

## 4) Users & Use Cases
Identical to v0.2.

## 5) Requirements
### Functional
- `FR-01` Start Here routing (4 intent cards)
- `FR-02` Proof of Work Hub + role-hat filters + 6 flagship case files
- `FR-03` Point-of-View writing stream (chronological + tags)
- `FR-04` `/now` live Markdown page
- `FR-05` Persistent Terence AI chat (RAG)
- `FR-06` Deterministic TollBit enforcement for AI agents
- `FR-07` Bidirectional project <-> writing links

### Non-functional
Identical to v0.2.

### Data requirements
Identical to v0.2.

### Permissions
Public read; Terence-only Git write.

## 5.5) Traceability Matrix
| Goal | Requirement | User Story | Test Cases | Metric |
|---|---|---|---|---|
| G1 | FR-01 | US-01 | TC-001 | routing_intent_selected |
| G1 | FR-02 | US-02 | TC-002, TC-003 | project_viewed_within_30s |
| G2 | FR-05 | US-04 | TC-004, TC-005 | thumb_feedback, eligible_chat_sessions |
| G3 | FR-06 | US-06 | TC-006 | tollbit_redirect |
| G4 | NFR-Perf | All | Perf-001 | Lighthouse |
| G5 | NFR-Vitals | All | Perf-001 | p95_LCP, error_rate |
| G6 | NFR-RAG | All | Embed-001 | vector_db_upsert_success |

## 6) User Stories + Acceptance Criteria
- `US-01`: Identical to v0.2.
- `US-02`: Identical to v0.2.
- `US-03`: Identical to v0.2.
- `US-04`: Identical to v0.2.
- `US-05`: Identical to v0.2.

### US-06: TollBit enforcement for AI agents
#### Preconditions
Any request to `terence.world`.

#### Main flow
Cloudflare Worker inspects UA + behavior; if AI, respond with `302` to `tollbit.terence.world/paywall`.

#### Deterministic rule (replaces prior block)
- Exact UA match: list in `/config/ai-user-agents.json` (frozen at launch).
- Heuristics (rolling window, per IP):
  - `H1`: >=4 HTML page requests in 10s (`path` not starting `/api/`, `content-type=text/html`)
  - `H2`: `Accept` header is `text/*` only (no `image/`, no `application/`)
  - `H3`: Missing both `sec-ch-ua` and `sec-fetch-site`
- Bot behavior match if `H1 AND (H2 OR H3)`.
- Override: `?human=true` sets cookie `bypass_bot_check=1` for 1 hour (`Secure; HttpOnly; SameSite=Lax`).

#### Alternate flows
Paid TollBit session -> proxy passes content.

#### Error states
False positive -> manual whitelist in Worker config + Slack alert.

#### Acceptance criteria
- Given UA in `/config/ai-user-agents.json`, when request to any page, then `302` to TollBit with rate `$0.01/page` (env var).
- Given `H1+H2` or `H1+H3` met within rolling window, when request arrives, then redirected.
- Given `?human=true`, when cookie set, then full content served for `3600s`.
- Given paid TollBit token, when valid, then origin served.
- Given redirect, then PostHog `tollbit_redirect {bot_type, page}`.
- Given >=2 human complaints in 24h, then manual whitelist added and alert fires.

## 7) UX Spec
Identical to v0.2 (chat orb pulse unchanged).

## 8) Technical Spec Outline
- Architecture: Identical to v0.2.
- API Endpoints: Identical to v0.2 (full schemas unchanged).
- Error Code Enumeration: Identical to v0.2.
- Data models, state machine, caching, observability: Identical to v0.2.

### Security / TollBit (updated)
- Enforcement layer: Cloudflare Worker on `terence.world/*` executes bot detection + redirect before origin fetch.
- Vercel serves origin for human traffic only.
- All other security considerations unchanged.

## 9) Instrumentation & Analytics Plan
Identical to v0.2, with `thumb_feedback` now including `eligible_chat_sessions` count.

## 10) Rollout Plan
- MVP gating requirement unchanged (`5 projects + 10 writings`).
- All other rollout steps identical.

## 11) Risks & Tradeoffs
Identical to v0.2.

## 12) Definition of Done
Identical to v0.2 (with seed gating).
