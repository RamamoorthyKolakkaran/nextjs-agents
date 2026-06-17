---
mode: agent
agent: Test
description: "Write unit and E2E tests for changed files. Provide a file path, branch name, or PR URL. Enforces Playwright Page Object Model, 4-perspective coverage, anti-flakiness, and 2x consecutive stability verification."
---

You are writing tests for **nextjs-agents**.

## How to Start

Provide the following:

- `source_ref`: file path, branch name, or PR URL containing the changed code
- `context` _(optional)_: specific user flows or edge cases to prioritize

## What This Does

The **Test** agent will:

1. **Analyze changed code** — Identify all modified functions, components, and hooks
2. **Plan test coverage** — Create a 4-perspective test plan (happy path, error, boundary, regression)
3. **Write unit tests** — Using Vitest with ≥80% coverage on modified files
4. **Write E2E tests** — Using Playwright with:
   - Page Object Model (MANDATORY) — All locators centralized, zero raw selectors in test bodies
   - Verified locators from source code (no guessing)
   - 4-perspective coverage (happy, error, boundary, regression)
   - Accessibility tests (keyboard navigation, screen reader)
   - Responsive design tests (375px, 768px, 1920px viewports)
   - Test data externalization (fixtures/test-data.ts)
   - **2x consecutive stability verification** — Tests must pass 100% on both runs with 0% flakiness
4. **Self-validate all tests** — Checker runs 18 gate validations including:
   - Coverage ≥80% on unit tests
   - 100% pass rate on unit and E2E tests
   - Page Object Model enforcement
   - Locator verification from source
   - 4-perspective coverage complete
   - Anti-flakiness (no timeouts or implicit waits)
   - Test data properly externalized
   - 2x stability verification (0% flakiness)
   - Accessibility tests present
   - Responsive design tests present
   - Playwright configuration complete

## Quality Bar

All tests must meet these standards:

| Requirement | Standard |
|---|---|
| Unit test coverage | ≥80% on modified files |
| Test pass rate | 100% (both consecutive runs) |
| Flakiness | 0% (no failures across 2 runs) |
| E2E test structure | Page Object Model (MANDATORY) |
| Locators | Verified from source code (no guessing) |
| Test perspectives | 4-perspective coverage complete (happy, error, boundary, regression) |
| Anti-flakiness | No `waitForTimeout`, `setTimeout`, or implicit waits |
| Accessibility | Keyboard navigation and screen reader tests included |
| Responsive | 3 viewports tested (375px, 768px, 1920px) |

## Approval Gates

Your tests must pass:

- ✅ **Unit Test Coverage** — ≥80% on modified files
- ✅ **Unit Test Execution** — 100% pass rate
- ✅ **E2E Test Execution** — 100% pass rate (if E2E exists)
- ✅ **Page Object Model** — All locators centralized (if using Playwright)
- ✅ **Locator Verification** — All locators verified from source (if using Playwright)
- ✅ **4-Perspective Coverage** — Happy path + error + boundary + regression
- ✅ **Anti-Flakiness** — No flaky patterns detected
- ✅ **Test Data Externalization** — All constants in fixtures/test-data.ts (if E2E)
- ✅ **2x Stability Verification** — 0% flakiness on 2 consecutive runs
- ✅ **Component Behavior Alignment** — Proper async waits for state updates
- ✅ **Accessibility (BONUS)** — Keyboard and screen reader tests
- ✅ **Responsive Design (BONUS)** — 3 viewports tested
- ✅ **Playwright Configuration** — Full config with all browsers and mobile devices

## Example Output

The Test agent will produce:

1. **Test Plan Table** — All scenarios mapped to test code
2. **Test Inventory** — Reuse/extend/create decisions
3. **Locator Reference Table** — All verified selectors from source
4. **Unit Tests** — `.test.tsx` files with ≥80% coverage
5. **E2E Tests** — Playwright spec files using Page Objects
6. **Page Objects** — One per page/feature with centralized locators
7. **Test Data File** — `tests/e2e/fixtures/test-data.ts`
8. **Validation Summary** — 2x run results, flakiness metrics, coverage

---

**Ready to write tests?** Provide `source_ref` (file path, branch, or PR URL) and optional `context`, and the Test agent will begin test generation.
