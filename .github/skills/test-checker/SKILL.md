---
name: test-checker
description: "Testing Checker skill. Use when validating unit tests and E2E tests from test-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Test Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Test Checker**.

## Role

Validate the **testing** artifact against the gate rules defined in `maker-checker-protocol` plus the phase-specific gates below.

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

### Universal Gates (from maker-checker-protocol)

Apply all 5 universal gates: Completeness, Clarity, Correctness, Consistency, Standards Compliance.

### Phase-Specific Gates

#### Gate 6: Test Execution — 100% Pass Rate

**Definition:** All tests execute and pass on both consecutive runs.

**Validation:**
- ✅ **PASSED:** 100% pass rate confirmed across 2 consecutive runs; Final Validation Summary present
- ❌ **FAILED:** Any test failure; Final Validation Summary missing; only 1 run reported

**Remediation:** Fix failing tests; re-run twice; report both run results in the summary.

#### Gate 7: Coverage ≥ 80% on Modified Files

**Definition:** Unit test coverage meets the 80% minimum on all modified source files.

**Validation:**
- ✅ **PASSED:** Coverage report shows ≥80% on each modified file
- ❌ **FAILED:** Any modified file below 80% coverage; coverage not reported

**Remediation:** Add test cases for the uncovered branches and edge cases.

#### Gate 8: Page Object Model (MANDATORY for Playwright)

**Definition:** All E2E tests use Page Object Model — zero raw selectors in test bodies.

**Validation:**
- ✅ **PASSED:** All locators are defined in page objects under `tests/e2e/pages/` or `tests/e2e/page-objects/`; no raw selectors (`page.locator()`, `page.$()`) in test body files
- ❌ **FAILED:** Any raw selector found in a test body; any locator not centralized in a page object

**Remediation:** Move all raw selectors to page object methods; reference only page object methods in test bodies.

#### Gate 9: Locator Verification

**Definition:** All locators are verified from actual source code — no guessed or hallucinated attributes.

**Validation:**
- ✅ **PASSED:** Locator Reference Table present; every locator traced to a verified `data-testid`, `aria-label`, `role`, or visible text in source
- ❌ **FAILED:** Locator Reference Table missing; any locator not verified from source (e.g., guessed `data-testid` values)

**Remediation:** Re-read source components; extract real attribute values; update Locator Reference Table.

#### Gate 10: 4-Perspective Coverage

**Definition:** Every feature under test has at least one test case per perspective: Happy Path, Negative/Error, Boundary, Regression.

**Validation:**
- ✅ **PASSED:** Test Plan table present with ≥1 case per perspective
- ❌ **FAILED:** Any perspective missing for any feature

**Remediation:** Add missing perspective test cases to the test plan and implement them.

#### Gate 11: Anti-Flakiness

**Definition:** No forbidden flaky patterns exist in any test file.

**Validation:**
- ✅ **PASSED:** No `waitForTimeout`, `setTimeout`, implicit waits, `nth-child` selectors, `.first()`, `.last()` without explicit meaning; all assertions use `expect()` with explicit timeouts
- ❌ **FAILED:** Any forbidden pattern found

**Remediation:** Replace each forbidden pattern with a deterministic Playwright wait strategy (`expect(locator).toBeVisible({ timeout: 5000 })`).

#### Gate 12: Test Data Externalization

**Definition:** All test constants are stored in `tests/e2e/fixtures/test-data.ts` — none hardcoded in test bodies.

**Validation:**
- ✅ **PASSED:** `tests/e2e/fixtures/test-data.ts` exists; all literal test strings/values reference imported constants
- ❌ **FAILED:** Hardcoded test strings in test bodies; fixture file missing

**Remediation:** Create `tests/e2e/fixtures/test-data.ts`; extract all inline test values to named constants; import them in test files.

#### Gate 13: Zero Flakiness (2x Consecutive Runs)

**Definition:** Both consecutive test runs passed with 0% flakiness.

**Validation:**
- ✅ **PASSED:** Validation Summary confirms 0 failures in 2 consecutive runs
- ❌ **FAILED:** Any intermittent failure across runs; only 1 run reported

**Remediation:** Investigate root cause of intermittent failure; fix without using `waitForTimeout` hacks.

#### Gate 14: Behavior Matrix Present

**Definition:** A Behavior Matrix documenting component state triggers and async patterns was created before writing E2E tests.

**Validation:**
- ✅ **PASSED:** Behavior Matrix table present in output, covering state changes, DOM effects, and async operations
- ❌ **FAILED:** Behavior Matrix missing

**Remediation:** Analyze component source code and produce the Behavior Matrix before writing any E2E assertions.

## Output Format

Always present a checklist table before returning the output envelope:

```
### Test Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Completeness | ✅ PASSED | — |
| 2 | Clarity | ✅ PASSED | — |
| 3 | Correctness | ✅ PASSED | — |
| 4 | Consistency | ✅ PASSED | — |
| 5 | Standards Compliance | ✅ PASSED | — |
| 6 | Test Execution — 100% Pass Rate | ✅ PASSED | — |
| 7 | Coverage ≥ 80% on Modified Files | ✅ PASSED | — |
| 8 | Page Object Model (MANDATORY) | ✅ PASSED | — |
| 9 | Locator Verification | ✅ PASSED | — |
| 10 | 4-Perspective Coverage | ✅ PASSED | — |
| 11 | Anti-Flakiness | ✅ PASSED | — |
| 12 | Test Data Externalization | ✅ PASSED | — |
| 13 | Zero Flakiness (2x Runs) | ✅ PASSED | — |
| 14 | Behavior Matrix Present | ✅ PASSED | — |

**Overall: ✅ ALL PASSED**
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
