---
name: test-maker
description: "Testing Maker skill. Use when producing unit tests and E2E tests for changed code in the testing SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Test Maker

Load this skill alongside `maker-checker-protocol` and `best-practices` when acting as the **Test Maker**.

## Role

Produce the **testing** phase artifact: unit tests and E2E tests for all changed code.

## Required Inputs

- `source_ref`: file path, branch name, or PR URL containing the changed code
- `context`: specific flows or edge cases to prioritise
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

---

## Mandatory Testing Workflow

### Step 0 — 4-Perspective Test Design (REQUIRED before writing any code)

Create a test plan table:

| Scenario ID | Perspective | User Flow | Precondition | Expected Outcome |
|-------------|-------------|-----------|--------------|-----------------|

Must include at minimum:
- ≥1 **Happy Path** — expected success flow
- ≥1 **Negative / Error Path** — failure handling
- ≥1 **Boundary Condition** — limits, edge cases
- ≥1 **Regression Scenario** — past bug or known risk scenario

### Step 1 — Discovery Phase (MANDATORY before writing tests)

Delegate to **Explore** subagent to scan:

- `tests/e2e` — existing E2E test files, page objects, fixtures, helpers
- Unit test files co-located with changed source files
- Existing test data files

**Output: Test Inventory Report**

| File | Status | Action |
|------|--------|--------|
| `existing-test.spec.ts` | ✔ Kept | No change |
| `old-flow.spec.ts` | ✏ Extended | Add new scenario |
| `obsolete.spec.ts` | ❌ Obsolete | Remove or archive |
| `new-feature.spec.ts` | 🆕 New | Create |

⚠️ STOP and ask:
> "Review the inventory above. Proceed? (yes / no)"

If **no** → request clarification before continuing.

### Step 2 — Source Verification (MANDATORY before writing E2E tests)

Delegate to **Explore** subagent to read actual Next.js source components.

Extract only **real, verified** values:
- `data-testid` attributes
- `aria-label` attributes
- `role` attributes
- Visible text (last resort only)

**Output: Locator Reference Table**

| Element | Locator Type | Verified Value |
|---------|--------------|----------------|
| Submit button | `data-testid` | `submit-btn` |
| Error message | `role` | `alert` |

❌ Do NOT guess selectors
❌ Do NOT hallucinate DOM attributes
❌ Only use locators verified from actual source code

### Step 2B — Component Behavior Verification (MANDATORY)

Before writing E2E tests, analyze component behavior from source code:

Create a **Behavior Matrix**:

| Trigger | State Change | DOM Effect | Async? |
|---------|-------------|-----------|--------|
| `onChange` on input | Updates controlled state | Field value updates | No |
| Form `onSubmit` | Loading state | Button disabled | Yes |
| API response | Data state | List renders | Yes |

This prevents tests from assuming synchronous behavior and identifies the correct wait patterns for Playwright.

### Step 3 — Unit Test Generation

**Requirements:**
- Cover all changed components, hooks, and utilities
- Minimum **80% coverage on modified code**
- Use behavior-focused naming: `should [outcome] when [condition]`

**Must cover:**
- Rendering behavior
- State transitions
- Hook logic
- Utility functions
- Edge cases and error handling

**Test runner:** Vitest v3.0.0 + React Testing Library

### Step 4 — E2E Test Generation (Production-Grade Playwright)

**Test runner:** Playwright

#### ⚠️ MANDATORY: Page Object Model

- ALL E2E tests MUST use Page Object Model (POM) or Actor pattern
- Zero raw selectors in test bodies — all locators centralized in page objects
- One page object per page/feature (e.g., `LoginPage.ts`, `CheckoutPage.ts`)
- Page object methods: `goto()`, `fillUsername()`, `submitForm()`, `getErrorMessage()`, etc.
- Place page objects in `tests/e2e/pages/` or `tests/e2e/page-objects/`

#### ⚠️ MANDATORY: Anti-Flakiness Enforcement

**FORBIDDEN:**
- `waitForTimeout()`
- `setTimeout()` for synchronization
- Implicit browser waits
- `.first()`, `.last()` without explicit meaning
- CSS index selectors (`:nth-child()`)
- Fragile DOM traversal

**REQUIRED:**
- `expect()` assertions with explicit timeouts (`{ timeout: 5000 }`)
- Playwright's auto-wait on visibility
- Deterministic waits based on element state

#### ⚠️ MANDATORY: Test Data Externalization

- Create `tests/e2e/fixtures/test-data.ts` for all test constants
- All test data referenced from constants file — never hardcoded in test bodies
- Example: `import { LOGIN_TEST_DATA } from '../fixtures/test-data'`

#### ✨ BONUS: Accessibility Tests

- Include keyboard navigation tests (Tab, Enter keys)
- Include screen reader support tests (role attributes, aria-label)
- Verify error messages have `role="alert"`

#### ✨ BONUS: Responsive Design Tests

Test critical user flows on:
- Mobile: 375px × 667px
- Tablet: 768px × 1024px
- Desktop: 1920px × 1080px

### Step 5 — 2x Stability Verification (MANDATORY)

After writing all tests:

- Run all tests **TWICE consecutively**
- Both runs must achieve:
  - 100% pass rate
  - ≥80% coverage on changed files
  - 0% flakiness (no intermittent failures)

**If failures occur:**
- Fix root cause — never use longer timeouts as a hack
- Re-run up to 3 cycles
- Achieve stability before submitting

**Output: Final Validation Summary**

```
✅ Tests executed: X unit, Y E2E
✅ Pass rate: 100% (both runs)
✅ Coverage: ≥80% on changed files
✅ Flakiness: 0% (0 failures in 2 consecutive runs)
✅ Page Objects: Y objects created with Z verified locators
✅ Accessibility: K keyboard/screen reader tests
✅ Responsive: 3 viewports tested
```

---

## Required Output Structure

Always produce all of the following:

1. **4-Perspective Test Plan** (test case table)
2. **Test Inventory Report** (reuse/extend/create decisions)
3. **Locator Reference Table** (all verified selectors)
4. **Behavior Matrix** (component state/trigger analysis)
5. **Page Objects** (one per page/feature, centralized locators)
6. **Unit Tests** (≥80% coverage, behavior-focused)
7. **E2E Tests** (POM only, all 4 perspectives, fixtures)
8. **Test Data File** (`tests/e2e/fixtures/test-data.ts`)
9. **Final Validation Summary** (2x runs, 100% pass, 0% flakiness)

## Quality Standards

- ✅ 4-Perspective coverage complete (happy, error, boundary, regression)
- ✅ Page Object Model used — zero raw selectors in test bodies
- ✅ All locators verified from source code — no guessing
- ✅ Anti-flakiness: no `waitForTimeout`, `setTimeout`, nth-child selectors
- ✅ Test data externalized to `fixtures/test-data.ts`
- ✅ ≥80% coverage on all modified files
- ✅ 100% pass rate across 2 consecutive runs
- ✅ Behavior Matrix created to prevent async assumption errors

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **test-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
