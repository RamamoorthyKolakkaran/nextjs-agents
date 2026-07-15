---
name: init-blueprints
description: "File content blueprints for the NextJS Orchestrator init command. Contains all 6 blueprint templates (maker-checker-protocol, best-practices, project-config, phase-skill-maker, phase-skill-checker, sub-agent) and prompt blueprints. Load this skill only during the generation phase of init — not during the interview phase."
---

# Init Blueprints

Use these blueprints to generate the content of each file during the `init` generation phase. Replace `{placeholders}` with values from the gathered answers. Expand phase-specific content using the **Phase Variant Tables** in `init-phase-variants` skill.

---

## Blueprint 1 — `maker-checker-protocol/SKILL.md`

````markdown
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
    "files_changed": ["file1.ts", "file2.tsx"],
    "files_created": ["file3.ts"],
    "checklist_items": ["item1", "item2"]
  },
  "quality_checks": {
    "completeness": { "gate": "completeness", "status": "✅ PASSED | ❌ FAILED", "finding": "..." },
    "clarity": { "gate": "clarity", "status": "✅ PASSED | ❌ FAILED", "finding": "..." },
    "correctness": { "gate": "correctness", "status": "✅ PASSED | ❌ FAILED", "finding": "..." },
    "consistency": { "gate": "consistency", "status": "✅ PASSED | ❌ FAILED", "finding": "..." },
    "standards_compliance": { "gate": "standards_compliance", "status": "✅ PASSED | ❌ FAILED", "finding": "..." }
  },
  "findings": [
    { "gate": "gate_name", "severity": "critical|high|medium", "issue": "...", "remediation": "..." }
  ],
  "next_action": "proceed_to_next_phase | request_user_approval | request_revision",
  "next_agent": "agent_name_or_null",
  "notes": "any additional context for the next phase"
}
```

---

## Universal Gate Rules

### Gate 1: Completeness

| Artifact Type | Required Sections |
|---|---|
| Requirement doc | Title, Acceptance Criteria, Scope, Out of Scope, Test Cases, Risk Assessment |
| Component diagram | Components, Relationships, Data Flow, API Endpoints |
| API contract | Endpoint, Method, Auth, Request Schema, Response Schema, Error Schema |
| Source code | Implementation, Type annotations, No TODOs or FIXMEs |
| Unit tests | Happy path, edge cases, error cases, security scenarios |
| E2E tests | User flows, error paths, recovery paths |

**FAILED:** Any required section is missing or empty. **PASSED:** All present with meaningful content.

### Gate 2: Clarity
**PASSED:** Language is clear, jargon is explained, code is readable. **FAILED:** Vague wording, unclear logic, ambiguous instructions.

### Gate 3: Correctness
Verify technical soundness: compiles, tests pass, matches specification exactly. **FAILED:** Technical errors, logic flaws, incomplete implementation.

### Gate 4: Consistency

| Artifact | Must Align With |
|---|---|
| Component diagram | Requirement doc |
| API contract | Component diagram |
| Source code | API contract |
| Unit tests | Source code |
| E2E tests | Acceptance criteria |

### Gate 5: Standards Compliance
Naming conventions, file structure, ESLint + TypeScript strict rules, project language, no security violations, no accessibility regressions.

---

## Checker Validation Workflow

1. Load the output envelope from the maker artifact.
2. Validate each gate independently — record ✅ PASSED or ❌ FAILED + finding.
3. Present checklist table to user.
4. **If any gate ❌ FAILED:** Stop immediately, highlight failed items with remediation, ask user to fix and re-run.
5. **If all ✅ PASSED:** Ask user: _"All checks passed. Do you approve moving to the next step? (yes / no)"_ — wait for explicit yes.
6. Return approved envelope with `status: reviewed`, `gate_result: pass`.

## Maker Responsibilities
1. Understand `source_ref`, `context`, and any `previous_output` findings.
2. If `previous_output` is not null: apply all remediation items first.
3. Produce artifact, wrap in Output Envelope, invoke checker workflow immediately.

## Checker Responsibilities
1. Load the envelope, validate all gates, record results.
2. Stop on any failure, get user approval on pass, return envelope only after approval.

## Phase-Specific Gates
Universal gates apply to all phases. Each phase defines additional gates in its `-checker` skill. All gates must pass.
````

---

## Blueprint 2 — `best-practices/SKILL.md`

````markdown
---
name: best-practices
description: "NextJS coding conventions and naming standards. Load this skill in the code agent to enforce project-wide best practices."
---

# NextJS Best Practices

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| React components | PascalCase | `ProductCard`, `CheckoutForm` |
| Custom hooks | camelCase prefixed with `use` | `useCartItems`, `useAuth` |
| Utility functions | camelCase | `formatPrice`, `buildApiUrl` |
| TypeScript types/interfaces | PascalCase | `CartItem`, `ApiResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| File names | kebab-case | `product-card.tsx`, `use-cart.ts` |
| Test files | same name + `.test` or `.spec` suffix | `product-card.test.tsx` |

## File Structure
- Co-locate component files with their test files
- One component per file
- Page components in `app/`, shared UI in `components/`, hooks in `hooks/`, utils in `lib/` or `utils/`

## Server vs Client Components
- Default to **Server Components** — add `"use client"` only for browser APIs, React hooks, or event handlers
- Never add `"use client"` to layout/page components unless strictly necessary
- Keep data fetching in Server Components; pass data as props to Client Components

## TypeScript Standards
- No `any` types — use `unknown` with type guards
- Explicit return types on all exported functions and components
- `interface` for object shapes; `type` for unions/intersections/aliases
- All `tsconfig.json` strict flags must remain enabled

## Import Order
1. React and Next.js imports
2. Third-party library imports
3. Internal absolute imports (`@/components/...`)
4. Relative imports (`./`, `../`)
5. Type-only imports (`import type { ... }`) — always last

## Styling — {css_framework}

{css_framework_rules}

## Storybook

{storybook_rules}

## Exports
- Prefer **named exports** — exception: Next.js page, layout, loading, and error files require default exports

## Component Selection
Prefer Server Components, Server Actions, existing patterns. Use Client Components only when user interaction, browser APIs, or local state is required.

## API Integration Rules
Verify: endpoint, method, auth, request/response/error contracts before implementing. No `any`, no untyped API responses. Follow existing `services/`, `api/`, or `lib/api/` conventions.

## State Management
Reuse the project's existing state management solution. Do not introduce new libraries.

## Security Requirements
Required: input validation, authentication, authorization, CSRF protection, secure error handling.
Never: log tokens, passwords, secrets, PII, or expose internal errors.

## Constants and Configuration
No magic strings — extract to constants/config modules. No hardcoded API URLs, secrets, or feature flags — use environment variables.

## Accessibility Requirements
Required: form labels, keyboard accessibility, correct ARIA attributes, accessible interactive controls.

## File Creation Rules
Prefer modifying existing files. Create new files only when no existing file can be extended.

## Code Cleanliness
Remove before completion: `console.log`, `console.error`, `debugger`, TODO, FIXME.

## Validation Gates

| Gate | Requirement |
|------|-------------|
| Build | TypeScript compiles, no errors/warnings |
| Lint | Zero ESLint violations |
| Type Safety | No `any`, no untyped API responses |
| Security | Validation + auth + authorization implemented |
| Accessibility | No regressions |
| Contract Compliance | All acceptance criteria implemented, API matches specification |
````

---

## Blueprint 3 — `project-config/SKILL.md`

````markdown
---
name: project-config
description: "Project-specific configuration for {app_name}. Single source of truth for app name, E2E setup, language, key paths, and team conventions. Load this skill in every agent alongside maker-checker-protocol. Extend via the train command as the project evolves."
---

# Project Configuration — {app_name}

## Application

| Field | Value |
|-------|-------|
| **Name** | {app_name} |
| **Framework** | NextJS App Router |
| **CSS framework** | {css_framework} |
| **Response language** | {language} |

## Testing

| Field | Value |
|-------|-------|
| **Unit test runner** | {unit_test_runner} |
| **E2E test runner** | {e2e_runner} |
| **E2E test path** | {e2e_path} |
| **E2E setup exists** | {e2e_exists} |

## Key Paths

> Extend via `train` command.

| Path | Location |
|------|---------|
| Source root | _(add via train)_ |
| Components | _(add via train)_ |
| Hooks | _(add via train)_ |
| Utilities / lib | _(add via train)_ |
| API routes | _(add via train)_ |
| Public assets | _(add via train)_ |

## Project Conventions

> Extend via `train` command.

| Convention | Value |
|-----------|-------|
| Component library | _(add via train)_ |
| State management | {state_mgmt} |
| Storybook | {storybook} |
| API layer / client | _(add via train)_ |
| Auth pattern | _(add via train)_ |
| Form validation | _(add via train)_ |
| Feature flags | _(add via train)_ |
| Environment config | _(add via train)_ |

## How to Extend

Run `train` on the NextJS Orchestrator and target `project-config`. Changes are available to all agents on their next invocation.

## Phases

| Phase | Enabled | Notes |
|-------|---------|-------|
| planning | ✅ enabled | Requirement writing, acceptance criteria, component diagrams, API contracts |
| development | ✅ enabled | TypeScript/React implementation |
| testing | ✅ enabled | Unit tests and E2E tests |

> To disable a phase: change `✅ enabled` to `❌ disabled` via `train`.
> Disabled phase agents respond: `"Phase {phase} is disabled in project-config. Skipping."`
````

---

## Blueprint 4 — Phase Skill (Maker)

_Apply for: `planning-maker`, `code-maker`, `test-maker`. Fill in phase-specific content from `init-phase-variants` skill._

````markdown
---
name: {phase}-maker
description: "{Phase} Maker skill. Use when producing {artifact_description} for the {phase} SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# {Phase} Maker

Load this skill alongside `maker-checker-protocol` when acting as the **{Phase} Maker**.

_For code-maker: Also load `repository-discovery` skill._
_For test-maker: Load `best-practices` skill for test naming and structure conventions._

## Role

Produce the **{phase}** phase artifact: {artifact_description}.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

{artifact_spec — from init-phase-variants skill}

## Quality Standards

{quality_standards — from init-phase-variants skill}

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **{phase}-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
````

---

## Blueprint 5 — Phase Skill (Checker)

_Apply for: `planning-checker`, `code-checker`, `test-checker`._

````markdown
---
name: {phase}-checker
description: "{Phase} Checker skill. Use when validating {artifact_description} from {phase}-maker. Applies gate rules and returns pass/fail with actionable findings."
---

# {Phase} Checker

Load this skill alongside `maker-checker-protocol` when acting as the **{Phase} Checker**.

## Role

Validate the **{phase}** artifact against the gate rules defined in `maker-checker-protocol`.

## Validation Steps

1. Load the output envelope from `{phase}-maker`.
2. For each gate rule defined below, evaluate the maker artifact individually and mark it ✅ **PASSED** or ❌ **FAILED**.
3. Present the full validation checklist to the user.
4. **If any gate is ❌ FAILED:** Stop immediately, highlight failed items with remediation, ask user to fix and re-run.
5. **If all gates are ✅ PASSED:** Ask user: _"All checks passed. Do you approve moving to the next step? (yes / no)"_ Wait for explicit yes.
6. Determine `gate_result`: **pass** or **fail**.
7. Return the output envelope only after user approval.

## Gate Rules

{gate_rules — from init-phase-variants skill}

## Output Format

```
### {Phase} Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | <gate name> | ✅ PASSED | — |
| 2 | <gate name> | ❌ FAILED | <issue — remediation: ...> |

**Overall: ✅ ALL PASSED** / **❌ FAILED (N issue(s) found)**
```

If ❌ FAILED: "Validation failed. Please correct all ❌ items above and re-run this phase before proceeding."
If ✅ ALL PASSED: "All checks passed. Do you approve moving to the next step? (yes / no)"

Return envelope with `status`, `findings`, `gate_result`, `next_action`, `next_agent`.
````

---

## Blueprint 6 — Sub-Agent (Combined Phase Agent)

_Apply for: `planning`, `code`, `test`. Each agent handles maker + checker roles internally._

````markdown
---
name: "{Phase}"
description: "Handles the full {phase} SDLC phase for {app_name}: produces the artifact (maker role) then self-validates it (checker role) using the {phase}-maker and {phase}-checker skills. Runs the complete maker→checker loop internally."
sdlc-phase: {phase}
artifact-type: {artifact_type}
tools: [read, search, edit, todo, agent]
agents: ["Explore", "task", "code-review"]
---

You are the **{Phase}** agent in the SDLC pipeline for **{app_name}**.

Your job: produce the {phase} artifact (maker role), then self-validate it (checker role) — all in one run.

## Agent Chain Routing (this agent)

| Task | Agent |
|---|---|
| Read source files, scan directories, Q&A | `Explore` |
| Run shell commands (build, lint, test) | `task` |
| Review diffs and files for bugs/security | `code-review` |

## Step 1 — Load Skills

1. Load `maker-checker-protocol` skill.
2. Load `project-config` skill.
3. _(If {phase} = code)_ Load `repository-discovery` skill.
4. Load `{phase}-maker` skill.
5. Load `{phase}-checker` skill.

## Step 2 — Phase Enabled Check

Read the **Phases** table in `project-config`.
- If `{phase}` is `✅ enabled` — continue.
- If `{phase}` is `❌ disabled` — respond: `"Phase {phase} is disabled in project-config for {app_name}. Skipping."` and stop.

## Step 3 — Accept Input

Parse the input envelope:
- `source_ref`: Jira ticket URL/ID, PR URL, branch name, or file path
- `context`: constraints
- `previous_output`: prior findings (null = first run)

**Jira URL/ID resolution:** If `source_ref` matches a Jira URL or bare ID (`[A-Z]+-[0-9]+`), fetch the issue, extract Summary, Description, Acceptance Criteria, Priority, Labels. Store as `{jira_content}`. If fetching fails, stop and ask user to provide content manually.

If `previous_output` contains findings, apply all findings as fixes before generating.

## Step 4 — Maker: Produce Artifact

{production_steps — from init-phase-variants skill}

Emit the intermediate maker output:

```json
{
  "phase": "{phase}",
  "role": "maker",
  "status": "draft",
  "artifacts": ["<list of created files or content>"],
  "findings": [],
  "gate_result": null
}
```

Ask: _"Maker artifact produced (see above). Do you approve moving to checker validation? (yes / no)"_
Wait for explicit yes before proceeding.

## Step 5 — Checker: Self-Validate Artifact

Using rules from `{phase}-checker` skill, evaluate each gate individually and present checklist:

```
### {Phase} Checker Results

| # | Gate | Result | Notes |
|---|------|--------|-------|
| 1 | <gate name> | ✅ PASSED | — |
| 2 | <gate name> | ❌ FAILED | <issue — remediation: ...> |

**Overall: ✅ ALL PASSED** / **❌ FAILED (N issue(s) found)**
```

**If any gate ❌ FAILED:** Stop immediately, highlight each failure with remediation, tell user to fix and re-run. Do not apply automatic fixes. Increment failure iteration count. If iteration ≥ 2, escalate.

**If all ✅ PASSED:** Ask: _"All checks passed. Do you approve proceeding to the next phase? (yes / no)"_ Wait for explicit yes.

## Step 6 — Correction Round (if needed)

Accept corrected artifact via `previous_output`, re-run all gates from scratch. If still failing after round 2 (iteration ≥ 2): produce escalation report listing all unresolved gates and stop.

## Step 7 — Return Final Output Envelope

```json
{
  "phase": "{phase}",
  "role": "checker",
  "status": "<approved|needs-fix>",
  "artifacts": ["<final artifact paths or content>"],
  "findings": ["<any remaining issues>"],
  "gate_result": "<pass|fail>",
  "next_action": "<proceed|escalate>",
  "next_agent": "<next phase agent name, or human>"
}
```

> `phase` is hardcoded to this agent's own phase — never read from user input.

## Constraints

- NEVER skip self-validation.
- NEVER apply more than 2 fix iterations — escalate to human after round 2.
- ONLY produce the {phase} artifact.
- If phase is disabled in `project-config`, stop immediately.
- Language for all responses: {language}
````

---

## Prompt Blueprint 1 — `start-feature.prompt.md`

````markdown
---
mode: agent
agent: Requirement
description: "Implement a feature end-to-end from a Jira ticket or plain description through all SDLC phases: Planning → Design → Development → Testing → Review → Deployment."
---

You are implementing a feature for **{app_name}** through the full SDLC pipeline.

Provide:
- `source_ref`: Jira ticket URL, Jira ID (e.g. `PROJ-123`), or plain-text description
- `context` _(optional)_: constraints, design decisions, out-of-scope items

**If `source_ref` is a Jira URL or ID**, the first agent fetches the ticket, extracts requirements and acceptance criteria, and uses that as the authoritative source.

| # | Phase | Agent | Produces |
|---|-------|-------|----------|
| 1 | Planning | **Requirement** | Acceptance criteria + user stories |
| 2 | Design | **Design** | Component diagram + typed API contract |
| 3 | Development | **Code** | TypeScript/React implementation |
| 4 | Testing | **Test** | Unit tests + E2E tests |
| 5 | Review | **PR** | PR description with risk assessment (P0/P1/P2) |
| 6 | Deployment | **Deploy** | Release notes + rollback procedure |

> If self-validation fails twice in any phase, use `fix-checker-findings` prompt to re-enter the fix loop.
````

---

## Prompt Blueprint 2 — `write-tests.prompt.md`

````markdown
---
mode: agent
agent: Test
description: "Write unit and E2E tests for changed files. Provide a file path, branch name, or PR URL."
---

You are writing tests for **{app_name}**.

Provide:
- `source_ref`: file path, branch name, or PR URL containing the changed code
- `context` _(optional)_: specific flows or edge cases to prioritise

This workflow invokes the **Test** agent — reads changed source files, writes unit tests using the configured unit test runner, adds E2E tests when the project has an E2E setup, then self-validates all tests pass with no anti-patterns.

If self-validation fails, use `fix-checker-findings` prompt after addressing the issues.
````

---

## Prompt Blueprint 5 — `fix-checker-findings.prompt.md`

````markdown
---
mode: agent
description: "Re-invoke a phase agent with prior findings to apply fixes. Use when a phase agent has returned gate failures."
---

You are re-entering the fix loop for **{app_name}**.

Provide:
- `artifact_type`: `requirement` / `design` / `code` / `test` / `pr` / `deploy`
- `source_ref`: the original ticket, PR URL, branch, or file path
- `previous_output`: paste the failing output envelope (JSON) with `findings` and `gate_result: fail`

| artifact_type | Agent invoked |
|--------------|---------------|
| `requirement` | Requirement |
| `design` | Design |
| `code` | Code |
| `test` | Test |
| `pr` | PR |
| `deploy` | Deploy |

> This counts as fix iteration 2. If self-validation fails again, findings are escalated to a human.
````
