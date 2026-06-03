---
name: pr-maker
description: "PR Maker skill. Use when producing PR description with risk assessment and rollback plan for the review SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# PR Maker

Load this skill alongside `maker-checker-protocol` when acting as the **PR Maker**.

## Role

Produce the **review** phase artifact: PR description with risk assessment and rollback plan.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

- **PR Title:** Format: `[PROJ-123] Brief feature name` (ticket ID + 1-line summary)
- **Summary:** What changed, why, user impact (2-3 sentences)
- **Change list:** Categorize as Features / Bug fixes / Refactoring / Docs / Tests
- **Risk assessment:** Assign P0/P1/P2 to each change area (see definitions below)
- **Testing evidence:** Link to test results, coverage report, E2E run summary
- **Rollback plan:** Step-by-step revert procedure; include rollback testing checklist if needed
- **Checklist:** All items marked ✅ before merge

### Risk Definitions

- **P0** = Data loss, security breach, auth bypass, production outage, breaking API change affecting multiple clients — mitigation required
- **P1** = Performance regression, user flow breakage, significant DB schema change with migration — requires rollback testing
- **P2** = Non-critical UI change, internal refactor, dependency upgrade, docs update — no rollback required

## Quality Standards

- ✅ PR title format: `[PROJ-123] Feature name` — references ticket, is descriptive
- ✅ Risk assessment complete: Every changed area marked P0/P1/P2 with justification
- ✅ No P0/P1 unmitigated: Any P0/P1 has documented mitigation or marked as accepted risk
- ✅ Testing evidence provided: Unit test coverage % + E2E test run summary linked
- ✅ Rollback plan actionable: Clear step-by-step undo; includes env var rollback if DB migrations present
- ✅ Rollback testability: Rollback tested in staging or defined as prerequisite
- ✅ Checklist all passed: Every pre-merge item verified

## Production Steps

1. Read all changed files using Explore subagent
2. **PR step 1 — Title:** Format as `[TICKET-ID] One-line feature name`
3. **PR step 2 — Summary:** Explain what changed and user benefit (2-3 sentences)
4. **PR step 3 — Change list:** Organize by category (Features / Fixes / Refactoring / Tests / Docs)
5. **PR step 4 — Risk assessment:** Assign P0/P1/P2 to each area; document P0/P1 mitigations
6. **PR step 5 — Testing evidence:** Include unit test coverage %, E2E test run summary, CI results link
7. **PR step 6 — Rollback plan:** Write step-by-step rollback procedure; include rollback steps if DB migrations exist
8. **PR step 7 — Checklist:** Confirm lint passed, tests pass, coverage ≥80%, no unresolved P0/P1, rollback tested

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **pr-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
