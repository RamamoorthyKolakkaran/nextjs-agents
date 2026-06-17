---
name: test-maker
description: "Test Maker skill. Use when producing unit and E2E tests for the testing SDLC phase. Enforces production-grade Playwright Page Object Model, 4-perspective coverage, and zero flakiness with 2x consecutive stability verification."
---

# Test Maker

Load this skill alongside `maker-checker-protocol` and `best-practices` when acting as the **Test Maker**.

## Role

Write comprehensive unit and E2E tests for changed code:

- **Unit tests:** Using Vitest, with ≥80% coverage on modified files
- **E2E tests:** Using Playwright with Page Object Model (MANDATORY), all 4 perspectives (happy path, error, boundary, regression), verified locators, accessibility tests, responsive design tests

**Quality bar:** Production-grade, deterministic tests with zero flaky patterns.

## Required Inputs

- `source_ref`: file path, branch name, or PR URL containing changed code
- `context`: constraints or specific flows to prioritize
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Test Coverage Strategy

### 4-Perspective Testing (MANDATORY)

Every feature must include:

| Perspective | Purpose | Example |
|-------------|---------|---------|
| **Happy Path** | Expected success flow | User fills form, submits, sees success message |
| **Negative/Error Path** | Failure handling | User submits invalid email, sees error |
| **Boundary Conditions** | Limits and edge cases | User enters max length field, empty field |
| **Regression** | Past bug or risk scenario | User navigates back/forward, state is preserved |

All four perspectives must have corresponding test cases.

## Unit Test Implementation

### Test Design Phase (MANDATORY)

Before writing code:

1. Identify all changed functions, hooks, and components
2. For each, determine:
   - Happy path scenario
   - Error/edge case scenarios
   - Boundary conditions
   - Dependencies and mocks needed

### Test Writing Requirements

**Coverage:** ≥80% on all modified files

**Test Structure:**
```
should [outcome] when [condition]
```

**Must Cover:**
- Rendering behavior
- State transitions
- Hook logic
- Utility function behavior
- Error handling
- Edge cases

**Tools:** Vitest + React Testing Library

**Mocking:** Mock external dependencies (API, utilities, state stores)

**Assertions:** Behavior-focused (what the user sees), not implementation details

## E2E Test Implementation

### MANDATORY: 4-Perspective Test Design

Create a test plan table **before writing any E2E code:**

| Scenario ID | Perspective | User Flow | Precondition | Expected Outcome |
|---|---|---|---|---|

Must cover all 4 perspectives with specific test cases.

### MANDATORY: Discovery Phase

Before writing E2E tests:

1. Scan `tests/e2e/` directory for:
   - Existing test files and patterns
   - Page objects or locator helpers
   - Fixtures and test data
   - Test utilities and action helpers
2. Document findings:
   - ✔ Tests to keep unchanged
   - ✏ Tests to extend
   - ❌ Tests made obsolete
   - 🆕 New tests required

### MANDATORY: Source Verification

Extract exact locators from the actual source code:

1. Read component source files
2. Identify all interactive elements
3. Verify `data-testid`, `aria-label`, `role`, and visible text
4. Create **Locator Reference Table:**

| Element | Element ID | Locator Type | Verified Value |
|---------|-----------|--------------|----------------|
| Login button | login-btn | data-testid | "login-submit" |
| Email input | email | aria-label | "Email address" |

**CRITICAL:** Do NOT guess or hallucinate locators. Every value must be from source code.

### MANDATORY: Page Object Model

All E2E tests **MUST** use Page Object Model (POM):

**Rules:**
- One page object per page/feature (e.g., `LoginPage.ts`, `HomePage.ts`)
- All locators centralized in page objects
- Zero raw selectors in test bodies
- Methods in page objects: `goto()`, `fillUsername()`, `submitForm()`, `getErrorMessage()`, etc.

**Example Structure:**
```typescript
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.page.locator('data-testid=email-input').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator('data-testid=password-input').fill(password);
  }

  async clickSubmit() {
    await this.page.locator('data-testid=submit-button').click();
  }

  async getErrorMessage() {
    return this.page.locator('role=alert').textContent();
  }
}
```

### MANDATORY: Anti-Flakiness Enforcement

**FORBIDDEN patterns:**
- ❌ `waitForTimeout(2000)` — no arbitrary delays
- ❌ `setTimeout()` — no synchronization hacks
- ❌ Implicit browser waits — use explicit waits
- ❌ `.first()`, `.last()` without explicit meaning
- ❌ `:nth-child()` selectors — fragile and unstable
- ❌ Unverified DOM traversal

**REQUIRED patterns:**
- ✅ `expect(locator).toBeVisible({ timeout: 5000 })` — explicit visibility waits
- ✅ Deterministic waits based on element state
- ✅ Locators verified from source code
- ✅ No index-based selectors
- ✅ All assertions use `expect()`

### MANDATORY: Test Data Externalization

All test constants must live in `tests/e2e/fixtures/test-data.ts`:

```typescript
// tests/e2e/fixtures/test-data.ts
export const LOGIN_TEST_DATA = {
  validEmail: 'test@example.com',
  validPassword: 'SecurePass123!',
  invalidEmail: 'not-an-email',
  invalidPassword: 'short',
};

export const FORM_BOUNDARIES = {
  maxNameLength: 255,
  minNameLength: 2,
};
```

Then reference in tests:
```typescript
import { LOGIN_TEST_DATA } from './fixtures/test-data';

test('should login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillEmail(LOGIN_TEST_DATA.validEmail);
  // ...
});
```

**RULE:** Zero hardcoded test values in test bodies.

### MANDATORY: 2x Consecutive Stability Verification

After writing all tests:

1. Run all tests **first time** — record results
2. Run all tests **second time** — verify identical results
3. Both runs must show:
   - ✅ 100% pass rate
   - ✅ Zero flakiness (no intermittent failures)
   - ✅ ≥80% coverage on changed files

**Output flakiness metrics:**
```
Flakiness report: 0 failures in 2 consecutive runs (0% flakiness rate)
```

If any test fails in either run, fix the root cause (NOT by adding longer timeouts) and re-run.

### BONUS: Accessibility Testing

Include keyboard and screen reader tests:

- ✅ Tab key navigates through form fields
- ✅ Enter key submits forms
- ✅ Screen reader announces form labels
- ✅ Screen reader announces error messages with `role="alert"`
- ✅ All interactive elements have ARIA labels

### BONUS: Responsive Design Testing

Test critical user flows on multiple viewports:

- 📱 Mobile: 375px × 667px
- 📱 Tablet: 768px × 1024px
- 🖥 Desktop: 1920px × 1080px

Verify:
- No unexpected horizontal scrolling
- Layout adapts correctly
- All interactive elements accessible on all sizes

## Output Requirements

Provide:

1. **4-Perspective Test Plan** — Test case table with all perspectives
2. **Test Inventory Report** — Reuse/extend/create decisions
3. **Locator Reference Table** (if E2E) — All verified selectors
4. **Unit Tests** — Vitest tests with ≥80% coverage
5. **E2E Tests** (if applicable) — Playwright tests using POM
6. **Page Objects** (if E2E) — All POM classes
7. **Test Data File** — `fixtures/test-data.ts`
8. **Final Validation Summary** — 2x run results, flakiness metrics, coverage

## Validation Requirements

Before returning test implementation:

- ✅ All unit tests pass (≥80% coverage)
- ✅ All E2E tests pass (if applicable)
- ✅ Tests run **twice consecutively** with 100% pass rate both times
- ✅ Zero flakiness (0% failure rate on 2x runs)
- ✅ Playwright uses Page Object Model (zero raw selectors in test bodies)
- ✅ All E2E locators verified from source code
- ✅ Test data externalized to fixtures/test-data.ts
- ✅ All 4 perspectives covered
- ✅ No `waitForTimeout`, `setTimeout`, or implicit waits
- ✅ Accessibility tests included (if E2E)
- ✅ Responsive design tests included (if E2E, on 3 viewports)

## Playwright Configuration (if using Playwright)

Ensure `playwright.config.ts` is generated/updated with:

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  reporter: 'html',
  fullyParallel: true,
  retries: 0,
});
```

## Checker Handoff

After producing the test implementation, proceed to checker validation within the same agent run — load the **test-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
