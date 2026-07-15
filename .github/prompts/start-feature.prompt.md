---
mode: agent
agent: Planning
description: "Implement a feature end-to-end from a Jira ticket or plain description through all SDLC phases: Planning → Development → Testing."
---

You are implementing a feature for **nextjs-agents** through the full SDLC pipeline.

Provide the following to begin:
- `source_ref`: Jira ticket URL (e.g. `https://yourorg.atlassian.net/browse/PROJ-123`), Jira issue ID (e.g. `PROJ-123`), or plain-text description of the feature
- `context` _(optional)_: constraints, design decisions, out-of-scope items, or deployment notes

**If `source_ref` is a Jira URL or ID**, the Planning agent will fetch the ticket, extract requirements, acceptance criteria, and priority, then use that as the authoritative source for all downstream phases.

This workflow runs all enabled SDLC phases in sequence. Each phase agent runs its internal maker→checker loop and requires your explicit approval before the next phase begins:

| # | Phase | Agent | Produces |
|---|-------|-------|----------|
| 1 | Planning | **Planning** | Ticket classification, requirement readiness, architecture decision, impact analysis, implementation plan |
| 2 | Development | **Code** | TypeScript/React implementation in the correct source files |
| 3 | Testing | **Test** | Unit tests (Vitest) + E2E tests (Playwright) for the changed code |

> If self-validation fails twice in any phase, that phase stops and presents findings for human correction. Use the `fix-checker-findings` prompt to re-enter the fix loop for that phase, then continue.

**Agent chaining is automatic** — each agent passes its approved output envelope to the next phase. You only need to approve transitions between phases.
