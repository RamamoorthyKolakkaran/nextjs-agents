---
mode: agent
agent: Test
description: "Write unit and E2E tests for changed files. Provide a file path, branch name, or PR URL."
---

You are writing tests for **nextjs-agents**.

Provide the following:
- `source_ref`: file path, branch name, or PR URL containing the changed code
- `context` _(optional)_: specific flows or edge cases to prioritise

This workflow will invoke the **Test** agent, which will:

1. **Produce tests** (maker role):
   - Create a 4-Perspective Test Plan (Happy Path, Negative/Error, Boundary, Regression)
   - Scan `tests/e2e` for existing tests and produce a Test Inventory Report
   - Read source components and produce a Locator Reference Table (verified selectors only)
   - Produce a Behavior Matrix documenting component state/async patterns
   - Write unit tests using **Vitest v3.0.0** + React Testing Library (≥80% coverage on modified files)
   - Write E2E tests using **Playwright** with Page Object Model (MANDATORY), anti-flakiness enforcement, and test data externalized to `tests/e2e/fixtures/test-data.ts`
   - Run all tests **twice consecutively** to verify 0% flakiness

2. **Self-validate tests** (checker role):
   - Verify 100% pass rate, ≥80% coverage, Page Objects used, locators verified, 4-perspective coverage complete, no flaky patterns, test data externalized

If self-validation fails, the phase stops with findings for a human correction round. Re-run with `fix-checker-findings` after the issues are addressed.
