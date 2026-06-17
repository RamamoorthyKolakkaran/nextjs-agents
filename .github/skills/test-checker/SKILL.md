---
name: test-checker
description: "Test Checker skill. Use when validating unit and E2E tests from test-maker. Applies production-grade Playwright validation rules, Page Object Model enforcement, and 2x stability verification."
---

# Test Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Test Checker**.

## Role

Validate the **test** artifacts against the gate rules defined in `maker-checker-protocol`, plus phase-specific gates below.

## Validation Steps

1. Load the output envelope from `test-maker`.
2. For each gate rule defined below, evaluate the test artifact individually and mark it ✅ **PASSED** or ❌ **FAILED**.
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

## Universal Gate Rules

See `maker-checker-protocol` skill for the universal gates:

1. **Completeness** — All required sections present
2. **Clarity** — Tests are understandable and well-organized
3. **Correctness** — Tests accurately verify behavior
4. **Consistency** — Tests align with changed code
5. **Standards Compliance** — Tests follow project conventions

## Phase-Specific Gates — Testing

These gates apply **only** to test artifacts.

### Gate 6: Unit Test Coverage

**Definition:** Unit tests achieve ≥80% coverage on all modified files.

**Validation:**

- Run Vitest with coverage reporter: `vitest --coverage`
- Coverage on all modified files: ≥80%
- All public functions have test cases
- Happy path, edge cases, and error scenarios covered

**FAILED:**
- Coverage < 80% on modified files
- Public functions missing test cases
- No error case coverage

**PASSED:**
- Coverage ≥80% on modified files
- All public functions tested
- Happy path + edge cases + errors covered

### Gate 7: Unit Test Execution

**Definition:** All unit tests pass without errors.

**Validation:**

- Run `npm run test` or equivalent
- 100% pass rate
- No test setup errors
- No test timeouts

**FAILED:**
- Test failures present
- Setup errors
- Timeouts

**PASSED:**
- 100% of tests pass
- Zero errors or warnings
- All assertions pass

### Gate 8: E2E Test Execution

**Definition:** All E2E tests pass without errors (if E2E tests exist).

**Validation:**

- Run Playwright: `npx playwright test`
- 100% pass rate
- No test setup errors
- No timeouts or flakiness

**FAILED:**
- E2E test failures present
- Setup errors
- Timeouts

**PASSED:**
- 100% of E2E tests pass
- Zero errors
- Tests are stable

### Gate 9: Page Object Model (MANDATORY for Playwright)

**Definition:** All Playwright E2E tests use Page Object Model with zero raw selectors in test bodies.

**Validation:**

- All test files use page object classes
- All locators are defined in page objects
- Test bodies contain NO raw locators (no `page.locator()` in tests)
- Test bodies call page object methods only
- One page object per page/feature

**FAILED:**
- Raw locators found in test bodies
- Locators scattered across multiple files
- No page object structure

**PASSED:**
- All locators centralized in page objects
- Test bodies use page object methods only
- Clear POM architecture

### Gate 10: Locator Verification

**Definition:** All E2E locators are verified from actual source code (not guessed).

**Validation:**

- Locator Reference Table exists
- Every locator value is traceable to source code
- `data-testid` values verified in source
- `aria-label` values verified in source
- `role` attributes verified in source
- No hallucinated or guessed selectors

**FAILED:**
- Locators not traceable to source
- Guessed attribute values
- Mismatched selector values

**PASSED:**
- All locators verified from source
- Locator Reference Table complete
- No guessing

### Gate 11: 4-Perspective Coverage

**Definition:** Tests cover happy path, error cases, boundary conditions, and regression scenarios.

**Validation:**

- Test plan table includes ≥1 happy path scenario
- Test plan table includes ≥1 negative/error scenario
- Boundary condition tests present
- Regression test scenario present
- Each scenario has corresponding test code

**FAILED:**
- Missing any of the 4 perspectives
- No test code for documented scenarios
- Incomplete coverage

**PASSED:**
- All 4 perspectives documented
- Test code exists for each scenario
- Complete coverage

### Gate 12: Anti-Flakiness Enforcement

**Definition:** No flaky patterns detected; all tests are deterministic.

**Validation:**

- No `waitForTimeout()` calls
- No `setTimeout()` for synchronization
- No implicit browser waits
- No `.first()` or `.last()` without explicit meaning
- No `:nth-child()` selectors
- All waits use `expect()` with explicit timeouts
- All assertions are deterministic

**FAILED:**
- `waitForTimeout()` or `setTimeout()` found
- Index-based or fragile selectors
- Non-deterministic wait patterns

**PASSED:**
- All waits use `expect()` with explicit timeouts
- All selectors verified and stable
- Deterministic patterns only

### Gate 13: Test Data Externalization

**Definition:** All test data constants are centralized in `tests/e2e/fixtures/test-data.ts`.

**Validation:**

- `fixtures/test-data.ts` exists
- All test constants defined in the fixtures file
- No hardcoded test values in test bodies
- Tests import from `fixtures/test-data`

**FAILED:**
- Hardcoded test values in test bodies
- No centralized test data file
- Test data scattered across files

**PASSED:**
- All constants in `fixtures/test-data.ts`
- Zero hardcoded values in tests
- Clean, maintainable structure

### Gate 14: 2x Consecutive Stability Verification

**Definition:** Tests pass 100% on two consecutive runs with zero flakiness.

**Validation:**

- Run all tests (unit + E2E) **first time** — 100% pass
- Run all tests **second time** — 100% pass
- Flakiness rate: 0% (0 failures in 2 runs)
- Same results both runs

**FAILED:**
- Any test fails in either run
- Flakiness rate > 0%
- Inconsistent results between runs

**PASSED:**
- 100% pass rate on both runs
- 0% flakiness
- Identical results both runs

### Gate 15: Component Behavior Alignment

**Definition:** E2E tests properly wait for async state updates and reflect actual component behavior.

**Validation:**

- Behavior matrix exists documenting when state updates occur
- Tests use appropriate waits after state-changing actions
- Tests wait for visibility/DOM updates before assertions
- No immediate assertions after `onChange`, `onBlur`, or `click` events without waits
- Async operations properly awaited

**FAILED:**
- Tests make immediate assertions after state changes
- Missing waits for async updates
- Tests assume synchronous behavior incorrectly

**PASSED:**
- Tests properly wait for state updates
- Behavior matrix documents async behavior
- All async operations properly handled

### Gate 16: BONUS — Accessibility Testing

**Definition:** E2E tests include keyboard navigation and screen reader compatibility tests.

**Validation:**

- Keyboard navigation tests present (Tab key, Enter key)
- Screen reader support tests present
- ARIA labels verified in tests
- Form labels tested
- Error messages tested for `role="alert"`

**FAILED:**
- No keyboard navigation tests
- No screen reader tests
- Missing ARIA attribute verification

**PASSED:**
- Keyboard and screen reader tests included
- ARIA attributes verified
- Full accessibility coverage

### Gate 17: BONUS — Responsive Design Testing

**Definition:** E2E tests verify critical flows on multiple viewports (375px, 768px, 1920px).

**Validation:**

- Tests run on mobile viewport (375px × 667px)
- Tests run on tablet viewport (768px × 1024px)
- Tests run on desktop viewport (1920px × 1080px)
- No unexpected horizontal scrolling on any viewport
- Layout adapts correctly on all sizes

**FAILED:**
- Only single viewport tested
- Responsive failures on any viewport
- Horizontal scrolling issues

**PASSED:**
- Multiple viewports tested
- Layout responsive on all sizes
- No scrolling issues

### Gate 18: Playwright Configuration

**Definition:** Playwright configuration file is properly set up for the project.

**Validation:**

- `playwright.config.ts` exists
- `baseURL: 'http://localhost:3000'` configured
- `webServer` config enables auto-start of dev server
- Projects array includes multiple browsers (Chromium, Firefox, WebKit)
- Projects include mobile devices (Mobile Chrome, Mobile Safari)
- `trace: 'on-first-retry'` configured for debugging
- `reporter: 'html'` configured
- `retries: 0` for CI/local testing
- `fullyParallel: true` for performance

**FAILED:**
- Configuration missing or incomplete
- Missing dev server auto-start
- Missing browser/device configurations

**PASSED:**
- Playwright config is complete
- All browsers and devices configured
- Dev server auto-start enabled

## Output Format

Always present a checklist table before returning the output envelope:

```
### Test Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Completeness | ✅ PASSED | All test files present |
| 2 | Clarity | ✅ PASSED | Tests are well-organized |
| 3 | Correctness | ✅ PASSED | Tests accurately verify behavior |
| 4 | Consistency | ✅ PASSED | Tests align with changed code |
| 5 | Standards Compliance | ✅ PASSED | Follows test naming conventions |
| 6 | Unit Test Coverage | ✅ PASSED | ≥80% coverage on modified files |
| 7 | Unit Test Execution | ✅ PASSED | 100% pass rate |
| 8 | E2E Test Execution | ✅ PASSED | 100% pass rate |
| 9 | Page Object Model | ✅ PASSED | All locators centralized in POMs |
| 10 | Locator Verification | ✅ PASSED | All locators verified from source |
| 11 | 4-Perspective Coverage | ✅ PASSED | All 4 perspectives covered |
| 12 | Anti-Flakiness | ✅ PASSED | No flaky patterns detected |
| 13 | Test Data Externalization | ✅ PASSED | All constants in fixtures/test-data.ts |
| 14 | 2x Stability Verification | ❌ FAILED | Test X failed on second run (flakiness detected) |
| 15 | Component Behavior Alignment | ✅ PASSED | Proper async waits implemented |
| 16 | Accessibility (BONUS) | ✅ PASSED | Keyboard and screen reader tests included |
| 17 | Responsive Design (BONUS) | ✅ PASSED | 3 viewports tested |
| 18 | Playwright Configuration | ✅ PASSED | Config complete with all browsers |

**Overall: ❌ FAILED (1 issue found)**
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
- `next_action` and `next_agent`: Should point to the review/PR phase (next phase if available)
