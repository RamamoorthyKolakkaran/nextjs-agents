---
name: design-checker
description: "Design Checker skill. Use when validating component diagram, API contract, security checklist, and performance constraints from design-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Design Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Design Checker**.

## Role

Validate the **design** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `design-maker`.
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

- ✅ No circular dependencies: Component graph is acyclic — trace all import chains and confirm no loops
- ✅ Follows Next.js App Router patterns: Server/Client split correct; data fetching only in Server Components
- ✅ API types complete: All request/response shapes defined with `interface` or `type`; zero `any` types
- ✅ Security identified: OWASP Top 10 risks listed with specific mitigations for each
- ✅ Accessibility addressed: WCAG 2.1 AA compliance path explicitly defined
- ✅ Performance budgeted: Load time target and bundle size impact both quantified
- ✅ Breaking changes identified: All breaking API/schema changes explicitly listed
- ✅ Breaking changes mitigated: Each breaking change has a backward-compat strategy or defined migration window
- ✅ Storybook noted: Component diagram indicates which shared UI components require a `.stories.tsx` file

## Output Format

Always present a checklist table before returning the output envelope:

```
### Design Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | No circular dependencies | ✅ PASSED | — |
| 2 | App Router patterns | ❌ FAILED | UserCard fetches data client-side — remediation: move fetch to parent Server Component |

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
