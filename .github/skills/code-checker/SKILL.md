---
name: code-checker
description: "Code Checker skill. Use when validating TypeScript/React implementation from code-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Code Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Code Checker**.

## Role

Validate the **code** artifacts against the gate rules defined in `maker-checker-protocol`, plus phase-specific gates below.

## Validation Steps

1. Load the output envelope from `code-maker`.
2. For each gate rule defined below, evaluate the code artifact individually and mark it ✅ **PASSED** or ❌ **FAILED**.
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
2. **Clarity** — Code is readable and self-explanatory
3. **Correctness** — Implementation is technically sound
4. **Consistency** — Code aligns with prior design outputs
5. **Standards Compliance** — Follows `best-practices` and project conventions

## Phase-Specific Gates — Code

These gates apply **only** to code artifacts.

### Gate 6: Compilation

**Definition:** TypeScript code compiles without errors or warnings.

**Validation:**

- Run `npm run build` (or equivalent TypeScript compilation)
- Zero compilation errors
- Zero warnings (unless explicitly allowed by project configuration)
- Type checking passes in strict mode

**FAILED:**
- Compilation errors present
- Build warnings that indicate type safety issues
- Implicit `any` types detected

**PASSED:**
- Clean compilation with zero errors
- No warnings related to type safety
- All types are explicit

### Gate 7: Linting

**Definition:** Code passes ESLint and follows all project style rules.

**Validation:**

- Run `npm run lint` (or equivalent ESLint check)
- Zero ESLint violations
- Code follows naming conventions from `best-practices`
- Proper import order and organization

**FAILED:**
- ESLint violations present
- Naming convention violations
- Import order violations

**PASSED:**
- Zero ESLint violations
- Naming follows conventions
- Imports properly organized

### Gate 8: Type Safety

**Definition:** All code is properly typed with no unsafe patterns.

**Validation:**

- No `any` types (use `unknown` with type guards if needed)
- No untyped API responses
- All function parameters have explicit types
- All function return types are explicit
- No implicit type conversions
- TypeScript strict mode enabled

**FAILED:**
- `any` types found
- Missing type annotations
- Untyped external data (API responses, props, etc.)

**PASSED:**
- All code is properly typed
- No unsafe patterns
- Strict mode compliance

### Gate 9: Security

**Definition:** Code follows security best practices.

**Validation:**

- Input validation implemented on all user inputs
- Authentication checks present where required
- No hardcoded secrets or API keys
- No XSS vulnerabilities (proper escaping/sanitization)
- No SQL injection vulnerabilities (if using database)
- Sensitive data not logged
- CSRF protection where applicable

**FAILED:**
- Missing input validation
- Hardcoded secrets present
- XSS or injection vulnerabilities
- Sensitive data logged

**PASSED:**
- All inputs validated
- No hardcoded secrets
- No known vulnerabilities
- Proper authentication/authorization

### Gate 10: Accessibility

**Definition:** Code does not introduce accessibility regressions.

**Validation:**

- Form fields have proper labels
- Interactive elements are keyboard-accessible
- Proper ARIA attributes used where needed
- Color contrast is sufficient (if styling changes)
- Content is screen reader friendly
- Focus management is appropriate

**FAILED:**
- Missing form labels
- Non-keyboard-accessible interactive elements
- Missing ARIA attributes
- Screen reader compatibility issues

**PASSED:**
- All interactive elements are accessible
- Proper labels and ARIA attributes
- Keyboard navigation works
- Screen reader compatible

### Gate 11: Contract Compliance

**Definition:** Implementation matches the approved design/API contract exactly.

**Validation:**

- All acceptance criteria are implemented
- Function signatures match the contract
- Request/response types match the contract
- Error handling matches the contract
- No undocumented features added
- No breaking changes to public APIs

**FAILED:**
- Acceptance criteria not fully implemented
- Function signatures differ from contract
- Missing error cases
- Undocumented behavior added

**PASSED:**
- All acceptance criteria implemented
- Matches contract exactly
- All error cases handled
- No scope creep

### Gate 12: Code Quality (Best Practices)

**Definition:** Code follows project best practices from `best-practices` skill.

**Validation:**

- Tailwind CSS used (no inline styles)
- Proper component composition (prefer Server Components)
- Reuses existing utilities and patterns
- Minimal file creation (extends existing where possible)
- No debugging code (console.log, debugger, TODO, FIXME)
- Proper error handling
- Appropriate performance patterns

**FAILED:**
- Inline styles present
- Unnecessary Client Components
- Debugging code present
- Inefficient patterns

**PASSED:**
- Follows all best practices
- Proper component selection
- Code is clean and production-ready

## Output Format

Always present a checklist table before returning the output envelope:

```
### Code Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Completeness | ✅ PASSED | All required sections present |
| 2 | Clarity | ✅ PASSED | Code is well-organized and readable |
| 3 | Correctness | ✅ PASSED | Logic is sound and correct |
| 4 | Consistency | ✅ PASSED | Matches design contract |
| 5 | Standards Compliance | ✅ PASSED | Follows naming and organization conventions |
| 6 | Compilation | ✅ PASSED | TypeScript compiles without errors |
| 7 | Linting | ✅ PASSED | Zero ESLint violations |
| 8 | Type Safety | ✅ PASSED | All code properly typed |
| 9 | Security | ✅ PASSED | Input validation and auth checks in place |
| 10 | Accessibility | ✅ PASSED | No accessibility regressions |
| 11 | Contract Compliance | ❌ FAILED | Acceptance criterion "X" not implemented |
| 12 | Code Quality | ✅ PASSED | Follows all best practices |

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
- `next_action` and `next_agent`: Should point to the testing phase
