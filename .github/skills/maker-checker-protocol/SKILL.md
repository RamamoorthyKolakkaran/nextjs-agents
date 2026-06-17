---
name: maker-checker-protocol
description: "Shared input/output envelope and gate rules for all Maker/Checker SDLC agents. Load this skill first in every maker and checker agent."
---

# Maker-Checker Protocol

This skill defines the **shared communication envelope** and **universal gate rules** used by all phases (planning, development, testing). Every maker produces this envelope; every checker validates against it.

## The Maker-Checker Cycle

Every SDLC phase follows this cycle:

1. **Maker Role** produces an artifact (requirements doc, component diagram, source code, test file, etc.)
2. **Maker** wraps output in the **Output Envelope** (see below)
3. **Checker Role** validates each field against **Gate Rules** (see below)
4. **Checker** runs all gates:
   - ✅ PASSED gates → continue
   - ❌ FAILED gates → return findings to maker; ask user to fix and re-run
5. After all gates pass and user approves, **Checker** returns the approved envelope to the next phase

---

## Output Envelope

Every maker must produce output wrapped in this envelope structure. The checker validates **every field** against the corresponding gate rules.

### Envelope Structure

```json
{
  "phase": "planning|development|testing|review|deployment",
  "timestamp": "ISO 8601 datetime",
  "source_ref": "ticket_id|pr_url|file_path",
  "status": "draft|ready-for-review|reviewed|needs-fix",
  "gate_result": "pass|fail",
  
  "artifact": {
    "type": "requirement_doc|component_diagram|api_contract|source_code|unit_tests|e2e_tests|pr_description|release_notes",
    "content": "artifact content (markdown, code, or structured data)",
    "files_changed": ["file1.ts", "file2.tsx", "..."],
    "files_created": ["file3.ts", "..."],
    "checklist_items": ["item1", "item2", "..."]
  },
  
  "quality_checks": {
    "completeness": {
      "gate": "completeness",
      "status": "✅ PASSED | ❌ FAILED",
      "finding": "all required sections present | missing: X, Y, Z"
    },
    "clarity": {
      "gate": "clarity",
      "status": "✅ PASSED | ❌ FAILED",
      "finding": "writing is clear and unambiguous | unclear sections: ..."
    },
    "correctness": {
      "gate": "correctness",
      "status": "✅ PASSED | ❌ FAILED",
      "finding": "technically sound | errors found: ..."
    },
    "consistency": {
      "gate": "consistency",
      "status": "✅ PASSED | ❌ FAILED",
      "finding": "aligns with prior phase outputs | conflicts: ..."
    },
    "standards_compliance": {
      "gate": "standards_compliance",
      "status": "✅ PASSED | ❌ FAILED",
      "finding": "follows project standards | violations: ..."
    }
  },
  
  "findings": [
    {
      "gate": "gate_name",
      "severity": "critical|high|medium",
      "issue": "description of what failed",
      "remediation": "specific action to fix"
    }
  ],
  
  "next_action": "proceed_to_next_phase | request_user_approval | request_revision",
  "next_agent": "agent_name_or_null",
  "notes": "any additional context for the next phase"
}
```

---

## Universal Gate Rules

These gates apply to **every phase** and **every maker artifact**. The checker validates each gate independently and records the result (✅ PASSED or ❌ FAILED) in the `quality_checks` section above.

### Gate 1: Completeness

**Definition:** The artifact contains all required sections and information for its type.

**Validation:** For each artifact type, verify:

| Artifact Type | Required Sections | Validation |
|---|---|---|
| Requirement doc | Title, Acceptance Criteria, Scope, Out of Scope, Test Cases, Risk Assessment | All sections present with substantive content |
| Component diagram | Components, Relationships, Data Flow, API Endpoints | All elements drawn; all interactions labeled |
| API contract | Endpoint, Method, Auth, Request Schema, Response Schema, Error Schema | All fields defined with examples |
| Source code | Implementation, Type annotations, Comments where needed, No TODOs or FIXMEs | Compiles, passes linter, follows conventions |
| Unit tests | Test cases cover: happy path, edge cases, error cases, security scenarios | All test cases execute and pass |
| E2E tests | User flows covered, error paths covered, recovery paths covered | All tests execute and pass |

**FAILED:** Any required section is missing or empty.
**PASSED:** All required sections present with meaningful content.

### Gate 2: Clarity

**Definition:** The artifact is written clearly and unambiguously; any reader can understand it without external explanation.

**Validation:**

- ✅ **PASSED:** Language is clear, jargon is explained, diagrams are labeled, code is readable
- ❌ **FAILED:** Vague wording, unexplained abbreviations, unclear logic, ambiguous instructions

**Remediation:** Rewrite unclear sections; add diagrams or examples for complex concepts.

### Gate 3: Correctness

**Definition:** The artifact is technically sound and implements the requirements accurately.

**Validation:**

- For **requirements:** Do acceptance criteria match the ticket/brief? Are test cases viable?
- For **design:** Do API contracts match the requirements? Do component relationships make sense?
- For **code:** Does it compile? Do tests pass? Does it match the design contract?
- For **tests:** Do tests actually exercise the functionality? Do they catch real bugs?

**FAILED:** Technical errors, logic flaws, missing error handling, incomplete implementation.
**PASSED:** No technical errors; implementation matches specification exactly.

### Gate 4: Consistency

**Definition:** The artifact aligns with all prior phase outputs. No contradictions.

**Validation:**

| Artifact Type | Must Align With | Check For |
|---|---|---|
| Component diagram | Requirement doc | All acceptance criteria addressable by components? |
| API contract | Component diagram | All data flows have matching endpoints? |
| Source code | API contract | Implementation matches endpoint signatures exactly? |
| Unit tests | Source code | All public functions have test cases? |
| E2E tests | Acceptance criteria | All acceptance criteria have corresponding E2E tests? |

**FAILED:** Contradicts prior phase outputs; misaligns with acceptance criteria.
**PASSED:** Fully aligned; no contradictions.

### Gate 5: Standards Compliance

**Definition:** The artifact follows project-wide conventions, naming standards, and quality rules defined in `project-config` and `best-practices`.

**Validation:**

- Naming conventions respected (camelCase, PascalCase, UPPER_SNAKE_CASE as defined)
- File structure follows conventions (co-located tests, proper directory layout)
- Code style matches ESLint + TypeScript strict rules
- Comments and documentation use the project's language setting
- No security violations (no hardcoded secrets, no XSS risks, etc.)
- No accessibility regressions (ARIA labels, keyboard nav, color contrast)
- No performance red flags (unnecessary re-renders, O(n²) algorithms, etc.)

**FAILED:** Violates any convention or standard defined in `best-practices` or `project-config`.
**PASSED:** Fully compliant with all standards.

---

## Checker Validation Workflow

When acting as the checker, follow this exact workflow:

### Step 1: Load the Envelope

Receive the output envelope from the maker artifact.

### Step 2: Validate Each Gate Independently

For each universal gate (Completeness, Clarity, Correctness, Consistency, Standards Compliance):

1. Evaluate the artifact against the gate definition
2. Record: `status` (✅ PASSED or ❌ FAILED)
3. Record: `finding` (concise description of what passed or what failed)

Phase-specific gates are defined in the phase's `-checker` skill and follow this same pattern.

### Step 3: Display Results

Present a checklist table to the user:

```markdown
### Validation Results

| # | Gate | Status | Finding |
|---|------|--------|---------|
| 1 | Completeness | ✅ PASSED | All required sections present |
| 2 | Clarity | ❌ FAILED | API response schema uses undocumented field names |
| 3 | Correctness | ✅ PASSED | Implementation matches design contract |
| 4 | Consistency | ✅ PASSED | Aligns with prior phase outputs |
| 5 | Standards Compliance | ✅ PASSED | Follows naming conventions and best practices |

**Overall Result: ❌ FAILED (1 issue found)**
```

### Step 4: Handle Failures

If any gate shows ❌ FAILED:

1. Stop immediately — do not proceed
2. For each failed gate:
   - State the gate name
   - Explain the specific issue found
   - Provide remediation guidance (specific action to fix)
3. Ask the user:
   > "Validation failed. Please correct the ❌ items above and re-run this phase."
4. Discard the envelope — do not return it
5. Wait for user to re-run the phase with fixes

### Step 5: Handle Passes

If all gates show ✅ PASSED:

1. Ask the user for explicit approval:
   > "All checks passed. Do you approve moving to the next step? (yes / no)"
2. **Wait for the user's reply:**
   - If user replies **yes**: Continue to Step 6
   - If user replies **no**: Stop and await further instruction
3. Do not proceed without explicit user approval

### Step 6: Return the Approved Envelope

Set the envelope status to `reviewed` and return it to the next phase:

```json
{
  "phase": "...",
  "status": "reviewed",
  "gate_result": "pass",
  "quality_checks": { ... },
  "findings": [],
  "next_action": "proceed_to_next_phase",
  "next_agent": "..." 
}
```

## Maker Responsibilities

When acting as the maker:

1. **Understand the Input:** Read `source_ref`, `context`, and any `previous_output` from prior checker findings
2. **If previous_output is not null:** Apply all remediation items from the checker before producing new artifact
3. **Produce the Artifact:** Create the artifact according to phase-specific guidelines
4. **Wrap in Envelope:** Return the artifact in the **Output Envelope** structure above
5. **Do Not Skip Validation:** Immediately invoke the checker workflow — do not skip validation


## Checker Responsibilities

When acting as the checker:

1. **Load the Envelope:** Receive the maker's output envelope
2. **Validate Each Gate:** Apply all universal gates (see section above)
3. **Record Results:** For each gate, record status (✅ or ❌) and finding
4. **Stop on Failure:** If any gate fails, stop immediately and return findings
5. **Get User Approval:** If all gates pass, request explicit user approval before proceeding
6. **Return Envelope:** Only return the approved envelope after user approval

## Phase-Specific Gates

Universal gates apply to all phases. Each phase also defines **phase-specific gates** in its `-checker` skill file. Those gates are appended to the universal gates and follow the same validation workflow.

Example: The `code-checker` skill defines additional gates for compilation, linting, and type safety that apply only to code artifacts. The `planning-checker` skill defines additional gates for acceptance criteria completeness and test coverage that apply only to requirement artifacts.

All gates (universal + phase-specific) must pass before the envelope is approved.
