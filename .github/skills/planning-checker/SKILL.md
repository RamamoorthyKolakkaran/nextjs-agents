---
name: planning-checker
description: "Planning Checker skill. Use when validating requirement analysis and acceptance criteria from planning-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# Planning Checker

Load this skill alongside `maker-checker-protocol` when acting as the **Planning Checker**.

## Role

Validate the **planning** artifacts against the gate rules defined in `maker-checker-protocol`, plus phase-specific gates below.

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

## Universal Gate Rules

See `maker-checker-protocol` skill for the universal gates:

1. **Completeness** — All required sections present
2. **Clarity** — Writing is clear and unambiguous
3. **Correctness** — Requirements are technically sound
4. **Consistency** — No contradictions with prior outputs
5. **Standards Compliance** — Follows project conventions

## Phase-Specific Gates — Planning

These gates apply **only** to planning artifacts.

### Gate 6: Acceptance Criteria Definition

**Definition:** Acceptance criteria are clearly defined, testable, and measurable.

**Validation:**

- Each criterion follows the format: "Given [context], When [action], Then [outcome]"
- Criteria are testable (not vague like "should work well")
- Criteria cover happy path AND edge cases
- Criteria are independent (no cascading dependencies)
- Success is measurable (can verify with automated or manual tests)

**FAILED:**
- Acceptance criteria missing
- Criteria are vague or untestable
- Criteria mix happy path and error cases without clear separation
- No way to verify completion

**PASSED:**
- All criteria follow BDD format or are clearly testable
- Both happy path and edge cases covered
- Each criterion is independent and measurable

### Gate 7: Risk Assessment

**Definition:** Key risks and blockers are identified.

**Validation:**

- All architectural decisions are justified
- Integration dependencies are documented
- Security/auth implications are noted
- Performance implications are noted
- Breaking changes are identified

**FAILED:**
- No risk assessment present
- Risks identified but not mitigated
- Missing security or performance considerations

**PASSED:**
- Risks identified and mitigations proposed
- Architecture decisions have rationale
- Integration points documented

### Gate 8: API Contract Completeness (if applicable)

**Definition:** If API changes are needed, the contract is fully specified.

**Validation:**

- Endpoint URL and HTTP method specified
- Request schema defined with types and examples
- Response schema defined with types and examples
- Error responses documented
- Authentication/authorization requirements stated
- Rate limiting or quota information included (if applicable)

**FAILED:**
- API contract is incomplete
- Missing request or response schema
- No examples provided
- Error cases not documented

**PASSED:**
- All contract fields defined
- Examples provided for all scenarios
- Error responses documented
- Types are explicit (no `any`)

### Gate 9: Component Hierarchy Clarity (if applicable)

**Definition:** If UI changes are needed, component structure is clear.

**Validation:**

- Component diagram exists (if complex UI changes)
- Relationships between components documented
- Data flow between components clear
- State management approach specified
- Props/interfaces documented for key components

**FAILED:**
- No component diagram for complex changes
- Relationships unclear
- Data flow ambiguous

**PASSED:**
- Diagram clearly shows all components and relationships
- Data flow is explicit
- State management strategy documented

### Gate 10: Implementation Feasibility

**Definition:** The implementation plan is realistic and achievable.

**Validation:**

- Tasks are logically sequenced
- Dependencies between tasks are clear
- No circular dependencies
- Existing code/patterns are referenced where applicable
- Time/complexity estimate is provided (if relevant)

**FAILED:**
- Implementation plan has logical flaws
- Circular dependencies
- Ignores existing patterns without justification

**PASSED:**
- Tasks are properly sequenced
- Dependencies are clear
- Existing patterns are referenced
- Plan is realistic

## Output Format

Always present a checklist table before returning the output envelope:

```
### Planning Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | Completeness | ✅ PASSED | All required sections present |
| 2 | Clarity | ✅ PASSED | Writing is clear and well-organized |
| 3 | Correctness | ✅ PASSED | Requirements align with ticket description |
| 4 | Consistency | ✅ PASSED | Architecture decisions follow conventions |
| 5 | Standards Compliance | ✅ PASSED | Terminology matches project standards |
| 6 | Acceptance Criteria Definition | ❌ FAILED | Criteria are vague and not testable |
| 7 | Risk Assessment | ✅ PASSED | Risks identified with mitigations |
| 8 | API Contract Completeness | ✅ PASSED | (N/A for this ticket) |
| 9 | Component Hierarchy Clarity | ✅ PASSED | Diagram shows all relationships clearly |
| 10 | Implementation Feasibility | ✅ PASSED | Tasks logically sequenced |

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
- `next_action` and `next_agent`: Should point to the next phase (development or code agent)
