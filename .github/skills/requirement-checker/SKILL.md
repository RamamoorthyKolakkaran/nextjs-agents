---
name: requirement-checker
description: "Requirement Checker skill. Use when validating acceptance criteria, user stories, scope boundaries, and test mapping from requirement-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Requirement Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Requirement Checker**.

## Role

Validate the **requirement** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `requirement-maker`.
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

- ✅ No vague language: Ban "improve", "optimize", "better", "enhance", "fast", "easy", "responsive", "robust", "scalable" without quantified measures
- ✅ All independently testable: Each criterion verifiable without requiring another to pass first
- ✅ No implementation details: Outcomes not tech choices
- ✅ Scope is clear: OUT-OF-SCOPE and NON-FUNCTIONAL items are explicitly listed
- ✅ Dependencies tracked: All blocking/blocked-by relationships identified
- ✅ Test coverage mapped: Every criterion has ≥1 test scenario row with precondition and expected outcome
- ✅ ≥3 SMART criteria: Minimum three criteria present, each with WHO, WHAT, and MEASURABLE outcome
- ✅ Format consistent: All criteria use the same format (User Story or Gherkin — not mixed)

## Output Format

Always present a checklist table before returning the output envelope:

```
### Requirement Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | No vague language | ✅ PASSED | — |
| 2 | All independently testable | ❌ FAILED | Criterion 2 depends on Criterion 1 — remediation: rewrite as standalone |

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
