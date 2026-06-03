---
name: test-checker
description: "Test Checker skill. Use when validating unit and E2E test files with 4-perspective coverage from test-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Test Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Test Checker**.

## Role

Validate the **testing** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `test-maker`.
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

### General Test Quality
- ✅ All tests pass: 100% pass rate confirmed; no flaky tests (rerun 3× to verify)
- ✅ Coverage ≥80%: Code coverage for all changed source files meets or exceeds 80%
- ✅ Test names outcome-focused: Names follow "should [outcome] when [condition]" — describe user behavior not implementation steps
- ✅ 4-perspective coverage: ≥1 Happy Path and ≥1 Negative/Error case per feature; boundary/regression scenarios identified

### Playwright E2E Specific
- ✅ Discovery Report produced: Test inventory report was generated before writing tests; existing assets catalogued
- ✅ Existing assets reused: Previously discovered helpers, fixtures, and action objects are reused where applicable — no duplicate implementations
- ✅ All locators source-verified: Every E2E locator was extracted from actual source component files (`aria-label`, `data-testid`, `role`, visible text) — no guessed or assumed selectors
- ✅ No brittle selectors: No use of `nth-child`, index-based selectors, or `.first()` without additional specificity
- ✅ No anti-patterns: Zero occurrences of `waitForTimeout()`, `setTimeout()`, hardcoded delays, or `page.evaluate()` for internal state assertions
- ✅ PageObject or Actor pattern: No raw selectors written directly in test body — locators encapsulated in page objects or actor helpers

## Output Format

Always present a checklist table before returning the output envelope:

```
### Test Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | All tests pass | ✅ PASSED | — |
| 2 | Coverage ≥80% | ❌ FAILED | Changed file user-card.tsx at 62% — remediation: add tests for error states |
| 3 | All locators source-verified | ✅ PASSED | — |

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
