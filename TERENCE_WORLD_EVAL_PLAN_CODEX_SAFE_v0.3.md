# Terence.world v1.0 - Quality Evaluation Plan (Codex Safe v0.3)

## 1) Quality Bar
Identical to v0.2.

## 2) Test Strategy
- Coverage per FR: 100% unit on logic functions.
- Each FR has >=2 Playwright E2E tests covering all ACs (including new US-06 heuristics).
- Overall targets: unit `92%`, E2E `85%`.

## 3) Acceptance Test Suite
- `FR-06 -> TC-006` E2E:
  - Scenario: `TollBit deterministic redirect - exact UA, H1+H2, H1+H3, ?human=true override`
  - Validation performed with mocked Cloudflare Worker.
- All `68` cases remain traceable.
- New test cases added for H1/H2/H3 combinations.

## 4) Reliability / Chaos
- Chaos tests now explicitly include:
  - `Cloudflare Worker offline -> fallback static shell`
  - `rolling window counter accuracy under load`

## 5) Data & Analytics Validation
- Day-0 dashboard tracks `eligible_chat_sessions` and satisfaction exactly as defined in PRD goal `G2`.

## 6) Regression Control
- Preserve existing v0.2 regressions/guardrails.
- Add deterministic assertions around redirect decisions:
  - exact-UA list branch
  - heuristic branch (`H1 AND (H2 OR H3)`)
  - human override cookie branch
  - paid token pass-through branch

## 7) Observability Validation
- Confirm events and dimensions:
  - `tollbit_redirect {bot_type, page}`
  - `thumb_feedback` includes `eligible_chat_sessions`
- Alert validation:
  - verify complaint threshold flow (`>=2 complaints / 24h`) triggers whitelist + Slack alert.

## 8) Performance Validation
- Keep v0.2 perf suite.
- Explicitly retain gates:
  - Lighthouse >=98/100 all pages
  - p95 LCP <=1.2s
  - error rate <0.5%

## 9) Rollout Readiness Checks
- MVP content gate unchanged: `5 projects + 10 writings`.
- RAG readiness gate unchanged: `100% content RAG-ready` each deploy.

## 10) Post-Launch Evaluation
- Day-0/Day-7/Day-30 review includes:
  - human routing speed (`<=30s` to project/writing)
  - chat engagement (`>=18%`)
  - satisfaction (`thumbs_up_sessions / eligible_chat_sessions`, target `>=70%`)
  - TollBit revenue progress (`$75/mo by day 90`)
