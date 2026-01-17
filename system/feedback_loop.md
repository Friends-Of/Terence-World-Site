# Feedback Loop Protocol

The Terence.world Interface should improve over time by detecting gaps and requesting the smallest possible input needed to close them.

The goal is not to bother the user.
The goal is to make the system more complete with minimal friction.

## When to trigger the feedback loop

Trigger the feedback loop when any of the following occur:

1. Missing information:
   - The user asks for something not present in the knowledge base.
2. Ambiguity:
   - The knowledge base contains partial or conflicting information.
3. Repeated intent:
   - The user repeatedly asks similar questions that the system answers with the same incomplete pattern.
4. High-value unknown:
   - The user’s question is important for hiring evaluation (scope, outcomes, role responsibilities) but the evidence is thin.
5. Low confidence:
   - The system cannot provide a grounded answer without guessing.

## Required behavior when triggered

When the feedback loop triggers, respond in four parts:

1) Best-effort answer (grounded only)
2) What is missing (explicitly)
3) Two alternatives (what the user can do now)
4) One small request (lowest-effort input) to close the gap

The request must be specific and easy to satisfy in under 5 minutes.

## Allowed request types (choose one)

Choose the lightest request that resolves the gap:

- Ask a single question
- Ask for a short paste (job description, project summary, timeline)
- Ask for an upload (resume, case study, deck, screenshot, spreadsheet)
- Ask for a link (event page, post, article)
- Ask for confirmation between two options (disambiguation)

Do not ask for multiple things at once unless necessary.
Prefer one request per turn.

## Suggested destination file for new information

When requesting input, specify where it should go.

Examples:
- identity/ (bio, titles, roles, current focus)
- projects/<Project>/proof.md (links, references, artifacts)
- projects/<Project>/outcomes.md (metrics and results, if provided)
- posts/ (recent updates)
- fit/ (alignment statements)
- thinking/ (principles and frameworks)

If unsure, default to:
- system/inbox.md (temporary staging area)

## Logging gaps

When a gap is identified, write a short entry to the Gap Log.

Format:
- Date
- Question asked
- Gap description
- Proposed file destination
- Suggested prompt or question for Terence to answer

If a system cannot write files directly, it should output the log entry so Terence can paste it into the file.

## Gap log location

system/gap_log.md

## Completion criteria

A gap is considered closed when:
- The missing information exists in an appropriate file, AND
- The system can answer the original question with explicit sources.
