---
mode: agent
agent: Planning
description: "Implement a feature end-to-end from a Jira ticket or plain description through all enabled SDLC phases: Planning → Development → Testing. Each phase agent runs its internal maker→checker loop and requires your explicit approval before the next phase begins."
---

You are implementing a feature for **nextjs-agents** through the full SDLC pipeline.

## How to Start

Provide the following:

- `source_ref`: Jira ticket URL (e.g., `https://yourorg.atlassian.net/browse/PROJ-123`), Jira issue ID (e.g., `PROJ-123`), or plain-text description of the feature
- `context` _(optional)_: constraints, design decisions, out-of-scope items, or deployment notes

**If `source_ref` is a Jira URL or ID**, the Planning agent will fetch the ticket, extract requirements, acceptance criteria, and priority, then use that as the authoritative source for all downstream phases.

## The SDLC Pipeline

This workflow runs all enabled SDLC phases in sequence. Each phase agent runs its internal maker→checker loop and requires your explicit approval before moving to the next phase:

| # | Phase | Agent | Produces |
|---|-------|-------|----------|
| 1 | Planning | **Planning** | Requirement analysis + Acceptance criteria + Component diagrams + API contracts |
| 2 | Development | **Code** | TypeScript/React implementation in correct files |
| 3 | Testing | **Test** | Unit tests (Vitest, ≥80% coverage) + E2E tests (Playwright with Page Object Model) |

## Maker-Checker Workflow

Each phase follows the same pattern:

1. **Maker Role** — Produces the phase artifact
2. **Checker Role** — Validates using gate rules
3. **Your Approval** — Explicit yes/no to proceed
4. **Next Phase** — If approved, hands off to next phase

If a phase fails validation:
- You must correct the ❌ issues
- Re-run the phase to re-validate
- After 2 failed correction rounds, findings are escalated

## Approval Gates

All artifact artifacts must pass:

- ✅ **Completeness** — All required sections present
- ✅ **Clarity** — Writing is clear and unambiguous
- ✅ **Correctness** — Technically sound
- ✅ **Consistency** — Aligns with prior outputs
- ✅ **Standards Compliance** — Follows project conventions
- ✅ **Phase-specific gates** — Planning/Code/Test specific validations

## Success Criteria

A complete feature implementation will have:

- ✅ Planning phase: Approved requirements + acceptance criteria + architecture decisions
- ✅ Development phase: Approved implementation code (passes TypeScript, ESLint, build)
- ✅ Testing phase: Approved unit tests (≥80% coverage) + E2E tests (100% pass rate, 0% flakiness on 2x runs)

---

**Ready to start?** Provide `source_ref` and optional `context`, and the Pipeline will begin with the Planning phase.
