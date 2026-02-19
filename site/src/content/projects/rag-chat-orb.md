---
title: RAG Chat Orb
summary: Persistent AI chat that answers from project and writing context with source links.
publishedAt: 2026-02-15
roleHats:
  - Builder
  - Operator
tags:
  - ai
  - rag
relatedWriting:
  - production-rag-minimums
  - grounding-over-style
heroMetric: 81% of chat answers included at least one source citation.
---

Chat uses retrieval-first grounding and keeps session context on-device for continuity.

## Build notes

- Transcript persists in localStorage.
- API route returns answer plus source links.
- Thumb feedback captures satisfaction signal.

## Outcome

Users can ask direct questions and still verify the answer trail.
