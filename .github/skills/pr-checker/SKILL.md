---
name: pr-checker
description: "PR Checker skill. Use when validating PR description with risk assessment and rollback plan from pr-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# PR Checker

Load this skill alongside `maker-checker-protocol` when acting as the **PR Checker**.

## Role

Validate the **review** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `pr-maker`.
2. For each gate rule defined below, evaluate the maker artifact individually and mark it ✅ **PASSED** or ❌ **FAILED**.
3. Present the full validation checklist to the user (see Output Format below).
4. **If any gate is ❌ FAILED:**
   - Stop immediately — do not proceed.
   - Highlight every failed item with its gate name, the specific issue found, and remediation guidance.
   - Ask the user: _"Validation failed. Please correct the ❌ items above and re-run this phase."_
   - Do **not** apply automatic fixes.
5. **If all gates are ✅ PASSED:**
   - Ask the user: _"All checks passed. Do you approve moving to the next step? (yes / no)"_
   - Wait for explicit **yes** before continuing. If the user replies **no**, stop and await further instruction.
6. Determine `gate_result`: **pass** (all gates clear) or **fail** (any gate failed).
7. Return the output envelope only after user approval.

## Gate Rules

- ✅ PR title format: Title matches `[TICKET-ID] Feature name` pattern — contains a ticket reference and a concise description
- ✅ Risk assessment complete: Every changed area has a P0/P1/P2 rating with written justification
- ✅ No unmitigated P0/P1: All P0 and P1 items have a documented mitigation strategy or are explicitly marked as accepted risk with sign-off
- ✅ Testing evidence provided: Unit test coverage % is stated; E2E test run summary is linked or included; CI status referenced
- ✅ Rollback plan actionable: Each step is a single, verifiable command or check; env var rollback included if schema migrations present
- ✅ Rollback testability: Rollback procedure has been tested in staging or is defined as a prerequisite for merge
- ✅ Checklist complete: All pre-merge checklist items verified (lint pass, tests pass, coverage ≥80%, no unresolved P0/P1)

## Output Format

Always present a checklist table before returning the output envelope:

```
### PR Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | PR title format | ✅ PASSED | — |
| 2 | No unmitigated P0/P1 | ❌ FAILED | Auth bypass risk marked P0 with no mitigation — remediation: document mitigation or mark as accepted risk with sign-off |

**Overall: ✅ ALL PASSED** / **❌ FAILED (N issue(s) found)**
```

**If any item is ❌ FAILED:**
> "Validation failed. Please correct all ❌ items above and re-run this phase before proceeding."
> Stop here.

**If all items are ✅ PASSED:**
> "All checks passed. Do you approve moving to the next step? (yes / no)"
> Wait for explicit user approval before returning the output envelope.

Return the output envelope with:
- `status`: `reviewed` (pass) or `needs-fix` (fail)
- `findings`: list of failed gates with remediation steps
- `gate_result`: `pass` or `fail`
- `next_action` and `next_agent`
