---
title: TollBit Gateway Worker
summary: Deterministic agent monetization via exact UA list and behavioral heuristics.
publishedAt: 2026-02-14
roleHats:
  - Builder
  - Operator
tags:
  - cloudflare
  - monetization
relatedWriting:
  - bot-detection-without-handwaving
  - monetizing-open-content-without-harming-humans
heroMetric: 100% deterministic redirect behavior in TC-006 matrix.
---

A Cloudflare Worker runs bot detection before origin fetch and redirects likely AI-agent traffic to TollBit.

## Build notes

- Exact UA matches are frozen for launch.
- Heuristic branch is H1 AND (H2 OR H3).
- Human override cookie bypasses checks for one hour.

## Outcome

Agent access is monetized with explicit logic and auditable events.
