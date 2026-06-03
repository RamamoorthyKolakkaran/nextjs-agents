---
name: test-maker
description: "Test Maker skill. Use when producing unit and E2E test files with 4-perspective coverage for the testing SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Test Maker

Load this skill alongside `maker-checker-protocol` when acting as the **Test Maker**.

## Role

Produce the **testing** phase artifact: unit and E2E test files with 4-perspective coverage.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## E2E Creation Process (Playwright)

Mandatory steps in this order when writing Playwright E2E tests:

1. **4-Perspective Design** — Before writing any code, produce a test case table:
   | Scenario ID | Perspective | User Flow | Precondition | Expected Outcome |
   Cover all four: Happy Path, Negative/Error, Boundary Conditions, and Regression.

2. **Mandatory Discovery** — Use Explore subagent to scan `tests/e2e` for:
   - Existing test files
   - Locator helpers and action helpers
   - Fixtures and test data
   Output a **Discovery Report** categorizing each asset as:
   - Reusing (unchanged from baseline)
   - Extending (adding new scenarios to existing test)
   - Creating new
   Require user confirmation ("Review the inventory above. Proceed? (yes / no)") before touching any file.

3. **Source Verification** — Use Explore subagent to read actual source component files. Extract exact `aria-label`, `data-testid`, `role`, and visible text strings. NEVER guess locators. Create a Locator Reference table: Element | Locator Type | Verified Value.

4. **Implement following existing patterns** — Follow the layer structure and naming conventions already present in `tests/e2e`. Reuse all discovered assets (helpers, fixtures, action objects).

5. **Run and verify** — Run all tests and confirm they pass before emitting the maker output. Rerun 3× to check for flakiness.

## Output Artifact

- **Unit tests (Vitest):** Test files for all changed functions, components, hooks; coverage ≥80%
  - Test naming: "should [outcome] when [condition]" (outcome-focused)
- **E2E tests (Playwright):** User workflow coverage end-to-end in `tests/e2e`
  - Source-verified locators only; PageObject or Actor pattern (no raw selectors in test bodies)
  - Coverage: Happy path + Error cases + Boundary conditions
- **Anti-patterns:** No `waitForTimeout()`, no hardcoded delays, no brittle selectors (`nth-child`, index-based), no implicit waits
- **4-perspective design:** Happy Path | Negative/Error | Boundary Condition | Regression

## Quality Standards

- ✅ All tests executable: Both unit and E2E suites run without setup errors
- ✅ All tests pass: 100% pass rate; no flaky tests (root-cause retries)
- ✅ Changed files covered: ≥80% code coverage for modified source files
- ✅ Test names outcome-focused: Describe user behavior not implementation
- ✅ No brittle selectors: All E2E locators verified from source code (aria-label, data-testid, role, text)
- ✅ No anti-patterns: No `waitForTimeout`, `setTimeout`, `.first()` without specificity, or `page.evaluate()` internals
- ✅ Discovery honored: Existing test helpers reused; no duplicate fixtures
- ✅ 4-perspective coverage: ≥1 Happy Path + ≥1 Error/Negative per feature; boundary/regression identified

## Production Steps

1. **Step 0 — 4-Perspective Design (mandatory):** Create test case table with Scenario ID | Perspective | User Flow | Precondition | Expected Outcome
   - Minimum: ≥1 Happy + ≥1 Negative per requirement; add Boundary/Regression where applicable
2. **Step 1 — Discovery (MANDATORY):** Scan `tests/e2e` for existing test files, locator helpers, action helpers, fixtures
   - Output **Test Inventory Report** with items categorized as: kept unchanged / extended / obsolete / new
   - Require user confirmation: "Review the inventory above. Proceed? (yes / no)"
3. **Step 2 — Source verification (MANDATORY):** Read actual source component files; extract exact `aria-label`, `data-testid`, `role`, visible text
   - Create Locator Reference table: Element | Locator Type | Verified Value
4. **Step 3 — Unit tests:** Write tests using Vitest for all changed functions/components
   - Use naming: "should [outcome] when [condition]"; achieve ≥80% coverage
5. **Step 4 — E2E tests:** Write Playwright tests following patterns from `tests/e2e`
   - Use Actor or PageObject pattern; cover all 4 perspectives; no anti-patterns
6. **Step 5 — Run & verify:** Run all tests; verify ≥80% coverage; fix failures; rerun 3× to check for flakiness

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **test-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
