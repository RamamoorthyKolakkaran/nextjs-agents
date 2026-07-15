---
name: code-checker
description: "Development Checker skill. Use when validating TypeScript/React source code from code-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Code Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Code Checker**.

## Role

Validate the **development** artifact against the gate rules defined in `maker-checker-protocol` plus the phase-specific gates below.

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

### Universal Gates (from maker-checker-protocol)

Apply all 5 universal gates: Completeness, Clarity, Correctness, Consistency, Standards Compliance.

### Phase-Specific Gates

#### Gate 6: TypeScript Compilation

**Definition:** The implementation compiles with no errors or warnings under strict TypeScript settings.

**Validation:**
- ✅ **PASSED:** `tsc --noEmit` exits with code 0; no type errors reported
- ❌ **FAILED:** Any TypeScript compilation error exists

**Remediation:** Fix all TypeScript errors; ensure all strict flags remain enabled in `tsconfig.json`.

#### Gate 7: ESLint Zero Violations

**Definition:** The implementation has zero ESLint violations.

**Validation:**
- ✅ **PASSED:** `eslint` exits with code 0 for all changed files
- ❌ **FAILED:** Any ESLint violation exists

**Remediation:** Fix all ESLint violations; do not suppress rules with `// eslint-disable` comments unless explicitly approved.

#### Gate 8: Type Safety

**Definition:** No `any` types; no untyped API responses; no unsafe type assertions.

**Validation:**
- ✅ **PASSED:** No `any` in changed files; all API responses are typed with explicit interfaces
- ❌ **FAILED:** `any` found; untyped response objects; unsafe `as` casts without type guards

**Remediation:** Replace `any` with `unknown` + type guards; define explicit TypeScript interfaces for all API contracts.

#### Gate 9: Contract Compliance

**Definition:** The implementation matches the approved design contract exactly — no undocumented behavior, no missing acceptance criteria.

**Validation:**
- ✅ **PASSED:** Every acceptance criterion has a corresponding implementation; no extra behavior added
- ❌ **FAILED:** Any criterion unimplemented; extra behavior added without approval

**Remediation:** Implement all remaining criteria; remove or defer unapproved additions.

#### Gate 10: Security

**Definition:** The implementation follows secure coding practices from `best-practices`.

**Validation:**
- ✅ **PASSED:** Inputs validated; auth enforced; no secrets/PII logged; outputs sanitized
- ❌ **FAILED:** Missing input validation; missing auth check; sensitive data logged; unsafe output

**Remediation:** Add validation at all system boundaries; add auth enforcement; remove all logging of sensitive data.

#### Gate 11: Accessibility

**Definition:** No accessibility regressions introduced.

**Validation:**
- ✅ **PASSED:** All form inputs have labels; all interactive elements keyboard-accessible; correct ARIA attributes
- ❌ **FAILED:** Missing labels; non-keyboard-accessible controls; incorrect ARIA

**Remediation:** Add missing `<label>` associations; ensure `tabIndex` and keyboard handlers on custom controls; fix ARIA attributes.

#### Gate 12: Styling Compliance

**Definition:** All styles use Tailwind CSS v4 utility classes — no inline `style={{}}` props.

**Validation:**
- ✅ **PASSED:** No `style={{}}` props in changed files; conditional classes use `cn()` or `clsx()`
- ❌ **FAILED:** Inline `style={{}}` props found

**Remediation:** Replace inline styles with equivalent Tailwind utility classes.

#### Gate 13: Code Cleanliness

**Definition:** No debug artifacts left in production code.

**Validation:**
- ✅ **PASSED:** No `console.log`, `console.error`, `debugger`, TODO, or FIXME in changed files
- ❌ **FAILED:** Any debug artifact found

**Remediation:** Remove all debug artifacts before submission.

## Output Format

Always present a checklist table before returning the output envelope:

```
### Code Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Completeness | ✅ PASSED | — |
| 2 | Clarity | ✅ PASSED | — |
| 3 | Correctness | ✅ PASSED | — |
| 4 | Consistency | ✅ PASSED | — |
| 5 | Standards Compliance | ✅ PASSED | — |
| 6 | TypeScript Compilation | ✅ PASSED | — |
| 7 | ESLint Zero Violations | ✅ PASSED | — |
| 8 | Type Safety | ✅ PASSED | — |
| 9 | Contract Compliance | ✅ PASSED | — |
| 10 | Security | ✅ PASSED | — |
| 11 | Accessibility | ✅ PASSED | — |
| 12 | Styling Compliance | ✅ PASSED | — |
| 13 | Code Cleanliness | ✅ PASSED | — |

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
