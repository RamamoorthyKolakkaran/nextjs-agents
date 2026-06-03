---
name: code-checker
description: "Code Checker skill. Use when validating TypeScript source files and React components from code-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Code Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Code Checker**.

## Role

Validate the **development** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `code-maker`.
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

- ✅ Compiles: No TypeScript errors — confirm `tsc --noEmit` passes
- ✅ ESLint clean: Zero lint violations — confirm `eslint` passes with no warnings or errors
- ✅ No console output: Scan all changed files for `console.log()`, `console.error()`, `debugger` — none found in production code
- ✅ No TODOs: Scan for `TODO`, `FIXME`, `HACK` — none present in changed files
- ✅ Magic strings eliminated: All user-visible strings, route paths, and config keys are named constants — no inline string literals
- ✅ Config externalized: No hardcoded API URLs, feature flag values, or timeouts — all use env vars or config imports
- ✅ OWASP Top 10 safe: Input validation present; output encoding in place; auth checks on protected routes; no secrets in logs
- ✅ Naming conventions: PascalCase components, camelCase functions/hooks, UPPER_SNAKE_CASE constants, kebab-case file names
- ✅ Tailwind CSS v4 only: No `style={{}}` props; conditional classes use `cn()` or `clsx()`
- ✅ Accessibility compliance: Form labels present; ARIA attributes correct; no accessibility regressions
- ✅ Build passes: `next build` completes with no warnings or errors

## Output Format

Always present a checklist table before returning the output envelope:

```
### Code Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Compiles | ✅ PASSED | — |
| 2 | No magic strings | ❌ FAILED | 'user_profile_url' hardcoded in 3 places — remediation: extract to constants.ts |

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
