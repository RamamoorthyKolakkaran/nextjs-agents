---
name: init-phase-variants
description: "Phase-specific content and adaptation rules for the NextJS Orchestrator init command. Contains Phase Variant Tables (Planning, Development, Testing) and Adaptation Rules for CSS framework, Storybook, E2E, and language. Load this skill only during the generation phase of init — not during the interview phase."
---

# Init Phase Variants

Use this content to fill in `{placeholders}` in the blueprints from `init-blueprints` skill. Each phase section defines what to put into the `{artifact_spec}`, `{quality_standards}`, `{gate_rules}`, and `{production_steps}` placeholders in Blueprints 4, 5, and 6.

---

## Phase 1️⃣ — PLANNING / REQUIREMENT

### artifact_description
Requirement analysis, acceptance criteria, component diagrams, and API contracts.

### artifact_type
`requirement_doc`

### production_steps (for planning.agent.md Step 4)

You are a Senior Next.js Engineer and Solution Architect. Transform Jira tickets, user stories, or bug reports into **implementation-ready guidance** — no overengineering.

**Core Principles:**
1. Generate only the artifacts needed for implementation.
2. Prefer existing project patterns and components.
3. Avoid unnecessary diagrams, contracts, or models.
4. Explicitly identify ambiguities and missing info before implementation.
5. Ensure strong typing, validation, and error handling.
6. Keep solutions simple and scope-limited.

**Execute these phases in sequence:**

**Phase 1 — Requirement Analysis:** Analyze for business objective, functional & non-functional requirements, acceptance criteria, missing info/ambiguities, dependencies and risks. Output: Readiness Score (Ready / Mostly Ready / Needs Clarification / Not Ready), Clarification Questions, Assumptions, Risks.

**Phase 2 — Ticket Classification:** Classify as: UI Change / Component / Page / Layout / Form / API Route / Server Action / Data Fetching / Authentication / Authorization / Middleware / Database Change / Integration / State Management / Performance / SEO / Accessibility / Refactoring / Bug Fix / Testing / Build Config / Infrastructure. Provide confidence score.

**Phase 3 — Next.js Architecture Decision:** Determine where the change lives (Server Component / Client Component / Server Action / Route Handler / Middleware / Shared Component / Custom Hook / Utility / Service / Repository). Prefer Server Components unless interactivity is required. Explain why each selection is chosen.

**Phase 4 — Impact Analysis:** Identify affected areas: `app/`, `components/`, `hooks/`, `services/`, `lib/`, `middleware.ts`, `route.ts`, `page.tsx`, `layout.tsx`, `database/`, `tests/`. Explain why affected and expected changes. Do not include unaffected areas.

**Phase 5 — Determine Required Artifacts:** Generate only what is needed.
- UI Features: component hierarchy, user flow, validation, loading/error/empty states, accessibility
- API Features: endpoint definition, request/response types, validation, error responses
- Server Actions: input/output contracts, validation, error handling
- Database Changes: schema updates, migration, rollback
- Integrations: request/response mapping, error handling, retries
- Authentication: access rules, protected routes
- Bug Fixes: root cause, reproduction steps, fix strategy
- Refactoring: scope, affected files, expected improvements, risk mitigation
- Testing: unit test cases, E2E scenarios, test data, expected outcomes

**Phase 6 — API Integration (if applicable):** Ensure full API contract compliance:
1. API Specification: endpoint, HTTP method, authentication, headers, parameters, response format, error codes
2. Input/Output Definitions: TypeScript types/interfaces, required/optional fields, validation rules
3. Contract Enforcement: do not add extra fields, omit required fields, or implement without specification
4. Verification Checklist: request/response match contract, headers/auth implemented, error handling, tests cover contract

**Phase 7 — Implementation Plan:** For each task: objective, files affected, dependencies, risks. Order tasks in proper sequence. Focus strictly on ticket scope.

**Phase 8 — Verification Checklist:** Include only relevant checks:
- Functional: all acceptance criteria implemented
- UI: responsive, loading/error/empty states, accessibility
- API: request/response match contract, validation, error handling
- Security: authentication, authorization, sensitive data protected
- Testing: unit/integration tests, regression coverage

**Output Format:** Generate only sections that provide value: Ticket Classification, Requirement Readiness, Clarifications Needed, Architecture Decision, Affected Next.js Areas, Required Artifacts, Implementation Plan, Verification Checklist.

### gate_rules (for planning-checker.SKILL.md)

Beyond universal gates, apply these planning-specific gates:

**Gate P1: Acceptance Criteria Completeness** — All acceptance criteria are measurable, testable, and unambiguous. FAILED: criteria are vague, missing, or cannot be verified by a test. PASSED: each criterion has a clear pass/fail condition.

**Gate P2: Architecture Decision Justified** — Every Server vs Client Component decision is explained. FAILED: "use client" used without reason; no justification for chosen pattern. PASSED: all decisions explain why the chosen pattern fits.

**Gate P3: Scope Boundary Defined** — Out-of-scope items are explicitly listed. FAILED: scope is open-ended or undefined. PASSED: explicit list of what is and is not included.

**Gate P4: Implementation Plan is Ordered** — Tasks are sequenced with dependencies. FAILED: circular dependencies, missing setup steps. PASSED: tasks can be executed top-to-bottom without blockers.

---

## Phase 3️⃣ — DEVELOPMENT

### artifact_description
TypeScript/React implementation — source files, type contracts, and validation.

### artifact_type
`source_code`

### production_steps (for code.agent.md Step 4)

Your responsibility is implementation, not design. Goals: implement approved requirements, reuse existing code, minimize repository exploration, minimize code changes, maintain consistency, produce production-ready code, pass all validation gates.

**Load Required Skills:**
1. `best-practices` — coding conventions, naming standards, component selection, API integration, security, accessibility, validation gates.
2. `repository-discovery` — minimizes exploration cost; enforces context loading order, locality-first patterns, file reading budget, repository reuse rules, and scope control.

**Scope Control:** Implement only approved requirements. If design artifact and requirements conflict: STOP and request clarification. Do not guess.

**Implementation steps:**
1. Use `repository-discovery` skill to load the minimum required context — read only files directly relevant to the change.
2. Implement the approved design — follow existing patterns exactly.
3. Run TypeScript compilation check (via `task` agent).
4. Run ESLint check (via `task` agent).
5. Fix any build or lint errors.
6. Use `code-review` agent to scan the diff for security issues before finalizing.

**Output Requirements:**
- Files Modified
- Files Created
- Implementation Summary
- Risks
- Validation Results (TypeScript, ESLint, Build, Contract compliance)

### gate_rules (for code-checker.SKILL.md)

Beyond universal gates, apply these development-specific gates:

**Gate C1: Build** — TypeScript compiles with zero errors and zero warnings. FAILED: any compile error or warning. PASSED: clean build.

**Gate C2: Lint** — Zero ESLint violations. FAILED: any lint error or warning. PASSED: `eslint` exits with code 0.

**Gate C3: Type Safety** — No `any` types, no untyped API responses, no unsafe contracts. FAILED: `any` found in changed files. PASSED: all types explicit and safe.

**Gate C4: API Contract Compliance** — Implementation matches the approved API contract exactly. FAILED: extra fields, missing required fields, wrong types. PASSED: request/response match specification exactly.

**Gate C5: Minimal Change Scope** — Only files required for the approved requirement were modified. FAILED: unrelated files modified; speculative improvements added. PASSED: diff contains only approved changes.

---

## Phase 4️⃣ — TESTING

### artifact_description
Unit tests and E2E tests for all changed files.

### artifact_type
`unit_tests`

### production_steps (for test.agent.md Step 4)

You are a Senior Test Engineering Agent. Your goal: reliable, deterministic tests, high maintainability, strong behavioral coverage, zero flaky patterns, production-grade Playwright practices.

**Execute all steps in order:**

**Step 0 — 4-Perspective Test Design (REQUIRED)**

Before writing any code, produce a test plan table:

| Scenario ID | Perspective | User Flow | Precondition | Expected Outcome |
|-------------|-------------|-----------|--------------|-----------------|

Must include: ≥1 Happy Path, ≥1 Negative/Error Path per feature, Boundary Conditions, Regression Scenario.

**Step 1 — Discovery Phase (MANDATORY)**

Use `Explore` subagent to scan `{e2e_path}` for: existing test files, fixtures, helpers, page objects, test data. Output a Test Inventory Report:
- ✔ Tests kept unchanged
- ✏ Tests extended
- ❌ Tests obsolete
- 🆕 New tests required

STOP and ask: _"Review the inventory above. Proceed? (yes / no)"_

**Step 1B — Component Behavior Verification (MANDATORY, E2E only)**

Before writing E2E tests, use `Explore` subagent to read actual source component files. Create a **Behavior Matrix** documenting:
- When state updates occur (onChange, onBlur, submit events)
- Conditional rendering conditions and visibility triggers
- Async operations and proper wait patterns

This prevents tests from assuming synchronous behavior.

**Step 2 — Source Verification (MANDATORY, E2E only)**

Use `Explore` subagent to extract real values from source code: `data-testid`, `aria-label`, `role`, visible text. Create a **Locator Reference Table**:

| Element | Locator Type | Verified Value |
|---------|--------------|----------------|

NEVER guess selectors. NEVER hallucinate DOM attributes.

**Step 3 — Unit Test Generation**

Cover all changed components/hooks/utils. Achieve ≥80% coverage on modified files. Use naming convention: `should [outcome] when [condition]`. Include: edge cases, error handling, state transitions.

**Step 4 — E2E Test Generation (Production-Grade, if E2E exists)**

Requirements:
- Use {e2e_runner}
- **Page Object Model MANDATORY** — one POM per page/feature, all locators centralized, zero raw selectors in test bodies
- Cover all 4 perspectives (happy, error, boundary, regression)
- Include accessibility tests (keyboard navigation Tab/Enter, screen reader support)
- Include responsive design tests (375px, 768px, 1920px viewports)
- Externalize all test data to `fixtures/test-data.ts` — never hardcode

Anti-flakiness enforcement:
- FORBIDDEN: `waitForTimeout`, `setTimeout`, implicit waits, nth-child selectors, `.first()`, `.last()`
- REQUIRED: `expect()` assertions with explicit timeouts (`{ timeout: 5000 }`), deterministic waits

**Step 5 — Playwright Config Generation (if using Playwright)**

Ensure `playwright.config.ts` exists with:
1. `baseURL: 'http://localhost:3000'`
2. `webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI }`
3. `projects` array: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
4. `use: { trace: 'on-first-retry' }`
5. `reporter: 'html'`
6. `fullyParallel: true, retries: 0` locally

**Step 6 — 2x Stability Verification**

Use `task` agent to run all tests **twice consecutively**. Ensure each run: 100% pass rate, ≥80% coverage on changed files, zero flakiness. Report: `0% flakiness (0 failures in 2 consecutive runs)`. If failures occur, fix root cause (NOT longer timeouts), re-run up to 3 cycles.

**Required Output Structure:**
1. 4-Perspective Test Plan table
2. Test Inventory Report
3. Component Behavior Matrix (if E2E)
4. Locator Reference Table (if E2E)
5. Page Objects (if E2E) — one per page/feature
6. Unit Tests (≥80% coverage, behavior-focused naming)
7. E2E Tests (if E2E) — using page objects only
8. Test Data File (`fixtures/test-data.ts`, if E2E)
9. Final Validation Summary: tests executed, pass rate, coverage, flakiness rate, page objects, accessibility/responsive counts

**Forbidden Patterns:**
- `waitForTimeout()`, `setTimeout()` for synchronization
- Implicit browser waits
- `.first()`, `.last()` without explicit meaning
- CSS index selectors (`:nth-child()`)
- Fragile DOM traversal, duplicated fixtures/helpers
- Unverified selectors (guessed attributes)
- Raw selectors in test bodies (use page objects only)

### gate_rules (for test-checker.SKILL.md)

Beyond universal gates, apply these testing-specific gates:

**Gate T1: Page Objects** — All E2E tests use Page Object Model, zero raw selectors in test bodies. ✅ PASSED or ❌ FAILED.

**Gate T2: Locator Verification** — All locators verified from actual source code (no guessing), Locator Reference Table exists. ✅ PASSED or ❌ FAILED.

**Gate T3: Component Behavior Alignment** — All tests properly wait for async state updates using `expect().toBeVisible({ timeout: 5000 })` after state-changing actions; Behavior Matrix exists and test logic reflects actual component behavior. ✅ PASSED or ❌ FAILED.

**Gate T4: 4-Perspective Coverage** — ≥1 Happy Path, ≥1 Negative/Error, Boundary, Regression cases. ✅ PASSED or ❌ FAILED.

**Gate T5: Anti-Flakiness** — No `waitForTimeout`, `setTimeout`, implicit waits, nth-child; all tests use `expect()` with explicit timeouts. ✅ PASSED or ❌ FAILED.

**Gate T6: Test Data Externalization** — All test constants in `fixtures/test-data.ts`. ✅ PASSED or ❌ FAILED.

**Gate T7: 2x Stability** — Tests pass 100% on both consecutive runs, 0% flakiness rate. ✅ PASSED or ❌ FAILED.

**Gate T8: Coverage** — ≥80% coverage on modified files, all tests execute without errors. ✅ PASSED or ❌ FAILED.

**Gate T9: Playwright Configuration** _(if E2E runner = Playwright)_ — `playwright.config.ts` exists with `baseURL='http://localhost:3000'` and `webServer` config. ✅ PASSED or ❌ FAILED.

**Gate T10 (BONUS): Accessibility** _(if E2E exists)_ — Keyboard navigation (Tab, Enter) and screen reader support tests included. ✅ PASSED or ❌ FAILED.

**Gate T11 (BONUS): Responsive Design** _(if E2E exists)_ — Multi-viewport tests (375px, 768px, 1920px) included. ✅ PASSED or ❌ FAILED.

---

## Adaptation Rules

Apply these rules when populating file content from gathered answers. All rules are cumulative — apply all that match.

| Answer | What to change |
|--------|---------------|
| **E2E exists** (`{e2e_exists}` = yes) | In `test-maker` skill: add note referencing `{e2e_path}`. Apply POM, anti-flakiness, 2x stability, test data externalization. |
| **E2E path provided** | Replace `{e2e_path}` with provided path in `test-maker` and `test-checker`. |
| **E2E runner = Playwright** | Apply all Playwright-specific rules (POM, locator verification, config generation, anti-flakiness). Add Playwright Config gate (T9) to `test-checker`. |
| **E2E runner ≠ Playwright** | Apply generic anti-flakiness, test data externalization, 2x stability. No POM gates. |
| **Unit test runner = unknown / none** | In `test-maker` and `test-checker`: add blocking gate — "unit test runner not configured; set up a runner before proceeding". |
| **CSS framework = Tailwind CSS** | Replace `{css_framework_rules}` in `best-practices` with: `- Use Tailwind utility classes exclusively — no inline style={{}} props` / `- Use cn() or clsx() for conditional class merging` / `- Extract repeated class combinations into component variants if the same pattern appears 3+ times`. Development gate: "Tailwind CSS v{version} utility classes only". |
| **CSS framework = styled-components** | Replace `{css_framework_rules}` with: `- Define styled components in a co-located .styles.ts file` / `- Use theme tokens from ThemeProvider — no hardcoded colour or spacing values` / `- No inline style={{}} props`. |
| **CSS framework = Emotion** | Replace `{css_framework_rules}` with: `- Use the css prop or styled API — no inline style={{}} props` / `- Reference theme tokens from useTheme() — no hardcoded colour or spacing values`. |
| **CSS framework = SCSS** | Replace `{css_framework_rules}` with: `- Use CSS Modules (.module.scss) for component-scoped styles` / `- Global styles in globals.scss only` / `- No inline style={{}} props`. |
| **CSS framework = CSS Modules** | Replace `{css_framework_rules}` with: `- Use CSS Modules (.module.css) for all component styles` / `- No inline style={{}} props` / `- No global class names outside globals.css`. |
| **CSS framework = none / unknown** | Remove `## Styling` section from `best-practices` entirely. Remove styling gate rule from development phase. |
| **Storybook = yes** (detected or setup-now) | Replace `{storybook_rules}` in `best-practices` with: `- Every shared UI component in components/ must have a co-located .stories.tsx file` / `- Stories must cover all significant prop variants and interactive states` / `- Use CSF3 format (const Story: StoryObj<typeof Component>)` / `- No business logic or API calls inside stories — use mock args only` / `- Storybook must build without errors before a PR is merged`. |
| **Storybook = no** (not detected or skip/plan-later) | Remove `## Storybook` section from `best-practices` entirely. |
| **Language ≠ English** | Add `- Respond in {language}.` as the first bullet under each generated agent's Constraints section. |
