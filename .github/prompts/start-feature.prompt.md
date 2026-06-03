---
mode: agent
agent: Requirement
description: "Implement a feature end-to-end from a Jira ticket or plain description through all 6 SDLC phases: Planning → Design → Development → Testing → Review → Deployment."
---

You are implementing a feature for **next-js-agents** through the full SDLC pipeline.

Provide the following to begin:
- `source_ref`: Jira ticket URL (e.g. `https://yourorg.atlassian.net/browse/PROJ-123`), Jira issue ID (e.g. `PROJ-123`), or plain-text description of the feature
- `context` _(optional)_: constraints, design decisions, out-of-scope items, or deployment notes

**If `source_ref` is a Jira URL or ID**, the first agent will fetch the ticket, extract requirements, acceptance criteria, and priority, then use that as the authoritative source for all downstream phases.

This workflow runs all enabled SDLC phases in sequence. Each phase agent runs its internal maker→checker loop and requires your explicit approval before the next phase begins:

| # | Phase | Agent | Produces |
|---|-------|-------|----------|
| 1 | Planning | **Requirement** | Acceptance criteria + user stories linked to the ticket |
| 2 | Design | **Design** | Component diagram (Mermaid) + typed API contract |
| 3 | Development | **Code** | TypeScript/React implementation in the correct source files |
| 4 | Testing | **Test** | Unit tests (Vitest) + E2E tests (Playwright) for the changed code |
| 5 | Review | **PR** | PR description with risk assessment (P0/P1/P2) + rollback plan |
| 6 | Deployment | **Deploy** | Release notes + rollback procedure |

> If self-validation fails twice in any phase, that phase stops and presents findings for human correction. Use the `fix-checker-findings` prompt to re-enter the fix loop for that phase, then continue.
