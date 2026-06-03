---
name: deploy-checker
description: "Deploy Checker skill. Use when validating release notes and verified rollback plan from deploy-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Deploy Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Deploy Checker**.

## Role

Validate the **deployment** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `deploy-maker`.
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

- ✅ All env vars documented: Every NEW or CHANGED env var is listed with name, type, required/optional flag, and validation rule
- ✅ All env vars verified: Each required env var is confirmed to already exist in staging and production config — not created on-the-fly during deploy
- ✅ No unmitigated breaking changes: All breaking API or schema changes have a backward-compat strategy or defined migration window
- ✅ Rollback plan actionable: Each rollback step is a single, verifiable command or check; env var rollback included if migrations are present
- ✅ Rollback dry-run executed: Evidence that rollback command was tested without applying state change
- ✅ Full rollback tested in staging: Rollback executed on staging environment; data confirmed restored to pre-deploy state; validation checks documented
- ✅ Rollback forward documented: "Rollback rollback" procedure — how to roll forward again — is documented
- ✅ Monitoring defined: Key metrics identified (error rate, latency, feature usage) with specific alert thresholds set
- ✅ Rollback criteria explicit: Rollback trigger conditions are specific and measurable (e.g., "error rate >5% for 5 min") — not vague ("if issues occur")
- ✅ Production readiness gates: All PR1–PR10 gates from `maker-checker-protocol` confirmed passed before proceeding

## Output Format

Always present a checklist table before returning the output envelope:

```
### Deploy Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | All env vars documented | ✅ PASSED | — |
| 2 | Rollback tested in staging | ❌ FAILED | No evidence of staging rollback test — remediation: execute rollback on staging and attach log |

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
