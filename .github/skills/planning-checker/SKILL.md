---
name: planning-checker
description: "Planning Checker skill. Use when validating requirement documents, acceptance criteria, and implementation plans from planning-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Planning Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Planning Checker**.

## Role

Validate the **planning** artifact against the gate rules defined in `maker-checker-protocol` plus the phase-specific gates below.

## Validation Steps

1. Load the output envelope from `planning-maker`.
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

#### Gate 6: Requirement Readiness

**Definition:** All acceptance criteria are testable, unambiguous, and sufficient for a developer to implement without guessing.

**Validation:**
- ✅ **PASSED:** Every acceptance criterion has a clear pass/fail condition; no criterion uses vague language ("should work", "behaves correctly")
- ❌ **FAILED:** Any criterion is vague, missing, or untestable

**Remediation:** Rewrite vague criteria as: "Given [condition], when [action], then [expected outcome]."

#### Gate 7: Architecture Justification

**Definition:** The architecture decision section identifies the correct Next.js primitives (Server Component, Client Component, Server Action, Route Handler, etc.) with explicit reasoning.

**Validation:**
- ✅ **PASSED:** Each selected primitive is justified; no `"use client"` added without a valid reason (browser API, event handler, React hook)
- ❌ **FAILED:** Client Component chosen without justification; Server Action not considered for mutations

**Remediation:** Revisit the Server vs Client Components rules in `best-practices`. Justify each decision explicitly.

#### Gate 8: Impact Analysis Accuracy

**Definition:** All affected files/directories are identified; no relevant areas are omitted and no unrelated areas are included.

**Validation:**
- ✅ **PASSED:** Affected areas list is complete and tightly scoped to the ticket
- ❌ **FAILED:** Missing affected files; unrelated files listed without justification

**Remediation:** Re-read the ticket requirements and cross-check with the file structure in `project-config`.

#### Gate 9: API Contract Completeness (if applicable)

**Definition:** If the ticket involves API integration, the contract is fully specified with TypeScript types for request, response, and error shapes.

**Validation:**
- ✅ **PASSED:** Endpoint, method, auth, request type, response type, and error type are all defined
- ✅ **PASSED (N/A):** No API integration in this ticket
- ❌ **FAILED:** Any required contract field is missing or uses `any`

**Remediation:** Complete the API specification before proceeding to implementation.

#### Gate 10: Scope Containment

**Definition:** The implementation plan addresses only the approved ticket scope — no speculative improvements, refactors, or out-of-scope additions.

**Validation:**
- ✅ **PASSED:** Every task in the implementation plan maps directly to an acceptance criterion
- ❌ **FAILED:** Tasks exist that have no corresponding acceptance criterion

**Remediation:** Remove or defer all out-of-scope tasks. If the extra work is valuable, raise a separate ticket.

## Output Format

Always present a checklist table before returning the output envelope:

```
### Planning Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Completeness | ✅ PASSED | — |
| 2 | Clarity | ✅ PASSED | — |
| 3 | Correctness | ✅ PASSED | — |
| 4 | Consistency | ✅ PASSED | — |
| 5 | Standards Compliance | ✅ PASSED | — |
| 6 | Requirement Readiness | ✅ PASSED | — |
| 7 | Architecture Justification | ✅ PASSED | — |
| 8 | Impact Analysis Accuracy | ✅ PASSED | — |
| 9 | API Contract Completeness | ✅ PASSED | — |
| 10 | Scope Containment | ✅ PASSED | — |

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
