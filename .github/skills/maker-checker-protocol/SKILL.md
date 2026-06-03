---
name: maker-checker-protocol
description: "Shared input/output envelope and gate rules for all Maker/Checker SDLC agents. Load this skill first in every maker and checker agent."
---

# Maker/Checker Protocol

This skill defines the shared data contract used by every SDLC Maker and Checker agent.

## Input Envelope

Every agent receives:

| Field | Type | Description |
|-------|------|-------------|
| `artifact_type` | string | requirement \| design \| code \| test \| pr \| deploy |
| `source_ref` | string | Jira ticket ID, PR URL, branch name, or file path |
| `context` | string | Additional context or constraints |
| `previous_output` | object | Output from a prior checker iteration (null on first run) |

> **Phase is never required as input.** Each agent knows its own phase by identity. The `code` agent always sets `phase: development`; it uses `role: maker` for intermediate output (artifact draft) and `role: checker` for the final validated output. No caller needs to supply either value.

## Output Envelope

Every agent must produce:

| Field | Values | Description |
|-------|--------|-------------|
| `phase` | string | Inferred by the agent from its own identity (e.g., `development` for the `code` agent) |
| `role` | string | `maker` for intermediate output; `checker` for final validated output |
| `status` | draft \| reviewed \| approved \| rejected \| needs-fix | Current state of the artifact |
| `artifacts` | array | Paths or inline content of produced files/documents |
| `findings` | array | Issues found (checker) or notes (maker) |
| `gate_result` | pass \| fail | Whether the phase quality gate passed |
| `next_action` | proceed \| fix \| escalate | What happens next |
| `next_agent` | string | Name of the agent to invoke next |
| `iteration` | number | Correction attempt count (0 = first run, 1 = first fix, 2+ = escalate) |

## Fix Loop Rule

- Checker returns `gate_result: fail` → **stop and present the checklist to the user** → User corrects issues → Checker re-validates on next invocation.
- **Maximum 2 correction rounds** (iteration 0 → 1 → 2) before escalating to a human.
- Checker MUST increment `iteration` in output: `iteration = (previous_output?.iteration ?? -1) + 1`
- If iteration ≥ 2 on re-invoke: escalate without re-validating
- On escalation: produce a structured findings report listing all unresolved gates and stop.
- Checkers **never auto-fix** — they surface failures as a checklist and wait for the user to act.
- Every step transition requires **explicit user approval** ("yes / no") before proceeding.

## Escalation Rules (When Checkers Stop & Ask for Human Help)

**Automatic Escalation (Do not proceed without human review):**
- Iteration ≥ 2: Same phase failed twice → Stop, produce escalation report
- Any P0 unmitigated (in PR phase): Never auto-proceed → Must have explicit human approval
- Breaking changes without mitigation: Must have explicit human approval
- Test coverage < 80% in production code: Must have explicit human approval + risk acceptance
- Jira fetch fails: Must have explicit manual ticket content before proceeding

**Escalation Report Format:**
```json
{
  "phase": "{phase}",
  "status": "escalated",
  "gate_result": "fail",
  "iteration": 2,
  "unresolved_gates": [
    { "gate_id": "T3", "issue": "Only 1 happy path test; need error cases", "remediation": "Add ≥1 error/boundary case per requirement" },
    { "gate_id": "C4", "issue": "Magic string found: 'user_profile_url' in 3 places", "remediation": "Extract to constants.ts" }
  ],
  "human_action_required": "Please address all ❌ items and re-run the phase",
  "next_action": "human-review"
}
```

**Human Approval Points:**
- Always ask: "Do you approve [action]? (yes / no)" before proceeding past escalation
- If "no": Stop and wait for further instruction
- If "yes": Proceed to next step (only after explicit user approval)

## Phase Gate Rules

| Phase | Maker must produce | Checker gate must pass |
|-------|--------------------|------------------------|
| Planning | ≥3 SMART acceptance criteria | No ambiguous criteria; all are testable |
| Design | Component diagram + API contract | No circular deps; follows App Router patterns |
| Development | Compiles; no lint errors | OWASP Top 10 clean; naming conventions; no magic strings |
| Testing | All tests pass; changed files covered | Layer compliance; no anti-patterns (no `waitForTimeout`) |
| Review | PR description with risk assessment | All checklist items pass; no P0/P1 bugs |
| Deployment | Release notes + rollback plan | Env vars verified; no unmitigated breaking changes |

---

## Master Quality Gates Reference

Quick reference: All gates across 6 phases (🔴 = Must Pass | 🟡 = High Priority | 🟢 = Medium):

| Gate ID | Phase | Type | Gate Name | Requirement |
|---------|-------|------|-----------|-------------|
| R1 | Planning | 🔴 | No vague language | Ban: improve, optimize, enhance, robust, scalable (unquantified) |
| R2 | Planning | 🔴 | Independent testability | Each criterion passes/fails independently |
| R3 | Planning | 🔴 | No implementation details | Outcomes only, no tech choices |
| R4 | Planning | 🔴 | Scope clarity | Explicit OUT-OF-SCOPE and NON-FUNCTIONAL sections |
| D1 | Design | 🔴 | No circular deps | Component graph is acyclic |
| D2 | Design | 🔴 | NextJS compliance | Server/Client split correct; proper data-fetching |
| D3 | Design | 🔴 | Type safety | All API types defined; no `any` types |
| D4 | Design | 🟡 | Security | OWASP Top 10 risks listed with mitigations |
| D5 | Design | 🟡 | Performance budgeted | Load time + bundle size targets defined |
| D6 | Design | 🟡 | Accessibility path | WCAG 2.1 AA compliance steps defined |
| D7 | Design | 🟡 | Breaking changes | Identified and mitigated |
| C1 | Development | 🔴 | Compiles | No TypeScript errors |
| C2 | Development | 🔴 | ESLint clean | Zero lint violations |
| C3 | Development | 🔴 | No debug output | No console.log(), debugger in production |
| C4 | Development | 🟡 | No magic strings | All user-visible strings are named constants |
| C5 | Development | 🟡 | Config externalized | URLs, flags, timeouts from env vars |
| C6 | Development | 🟡 | OWASP safe | Input validation, CSRF tokens, auth checks |
| C7 | Development | 🟢 | Build success | No warnings or errors |
| T1 | Testing | 🔴 | All tests pass | 100% pass rate; no flaky tests |
| T2 | Testing | 🔴 | Coverage | ≥80% code coverage on changed files |
| T3 | Testing | 🟡 | 4-perspective | ≥1 Happy + ≥1 Error + Boundary/Regression identified |
| T4 | Testing | 🟡 | No brittle selectors | All E2E locators verified from source |
| T5 | Testing | 🟡 | No anti-patterns | No waitForTimeout, no hardcoded delays |
| P1 | Review | 🔴 | PR title format | `[TICKET-ID] One-line description` |
| P2 | Review | 🔴 | Risk assessment | Every area marked P0/P1/P2 with justification |
| P3 | Review | 🔴 | No unmitigated P0/P1 | All critical risks have documented mitigations |
| P4 | Review | 🟡 | Test evidence | Coverage %, E2E summary, CI results linked |
| P5 | Review | 🟡 | Rollback actionable | Step-by-step procedure tested in staging |
| P6 | Review | 🟡 | Checklist complete | All pre-merge items verified |
| DP1 | Deployment | 🔴 | Env vars verified | All required vars pre-configured in prod |
| DP2 | Deployment | 🔴 | No unmitigated breaking | Breaking changes have backward-compat or migration window |
| DP3 | Deployment | 🟡 | Rollback tested | Procedure executed in staging; confirmed to work |
| DP4 | Deployment | 🟡 | Monitoring | Key metrics + alert thresholds defined |
| DP5 | Deployment | 🟡 | Rollback criteria explicit | Specific measurable thresholds (not vague) |

**Agent Usage:** When validating, map each gate rule to this reference. If gate is missing, escalate.

---

## Production Readiness Gates (Final Approval)

Before Deploy phase executes, confirm ALL of these:

| Gate | Check | Status | Notes |
|------|-------|--------|-------|
| **PR1** | Planning phase complete? | ✅ MUST PASS | At least ≥3 SMART criteria approved |
| **PR2** | Design phase complete? | ✅ MUST PASS | Component diagram + API contract approved |
| **PR3** | Development phase complete? | ✅ MUST PASS | All code compiles; ESLint clean |
| **PR4** | Testing phase complete? | ✅ MUST PASS | 100% tests pass; ≥80% coverage |
| **PR5** | PR review complete? | ✅ MUST PASS | Risk assessment done; P0/P1 mitigated |
| **PR6** | No P0 unmitigated? | ✅ MUST PASS | All security/data-loss risks documented as "accepted" or "mitigated" |
| **PR7** | Rollback tested? | ✅ MUST PASS | Procedure executed in staging; confirmed to restore previous state |
| **PR8** | Monitoring configured? | ✅ MUST PASS | Key metrics + alert thresholds defined |
| **PR9** | All gates passed? | ✅ MUST PASS | Check Master Quality Gates Reference (above) — zero 🔴 failures |
| **PR10** | User explicitly approved? | ✅ MUST PASS | Last approval: "Are you ready to deploy? (yes / no)" |

**Deploy Phase Requirement:**
If ANY gate is ❌ FAILED, Deploy agent must STOP immediately and respond:
> "Production readiness check failed on gate(s): [list failed gates]. Address these and re-run before deployment is allowed."

---

## Inter-Phase Handoff Checklist

When transitioning from one phase to the next:

**Before proceeding to next phase, checklist:**
- [ ] Current phase `status: approved` in output envelope
- [ ] All artifacts from current phase are accessible (no dead links)
- [ ] User explicitly approved: "Do you approve proceeding to [next phase name]? (yes / no)"
- [ ] Next agent has all required skills loaded (maker-checker-protocol + project-config + phase-specific)
- [ ] `previous_output` from current phase has been passed to next agent's input

**Agent Handoff Message Template:**
> "Phase [CURRENT] complete ✅ All gates passed.
>
> Ready to move to Phase [NEXT]: [Description]
>
> Do you approve? (yes / no)"

**If user says "no":**
- STOP immediately
- Do not invoke next agent
- Wait for user to provide updated requirements or context

**If user says "yes":**
- Invoke next phase agent
- Pass `previous_output` containing all artifacts and findings
- Next agent begins with Step 1 (load skills)
