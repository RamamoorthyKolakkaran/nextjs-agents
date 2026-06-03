---
name: requirement-maker
description: "Requirement Maker skill. Use when producing acceptance criteria, user stories, scope boundaries, and test mapping for the requirement SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Requirement Maker

Load this skill alongside `maker-checker-protocol` when acting as the **Requirement Maker**.

## Role

Produce the **requirement** phase artifact: acceptance criteria, user stories, scope boundaries, and test mapping.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

- ≥3 SMART criteria with WHO, WHAT, and MEASURABLE outcome
- **Format options (choose one):**
  - User Story: "As a [user type] I want [feature] so that [benefit]"
  - Gherkin: "Given [state] When [action] Then [result]"
- **Scope Section:** Explicit OUT-OF-SCOPE list + NON-FUNCTIONAL requirements (performance, accessibility, security)
- **Dependencies:** Track blocking/blocked-by relationships and external system dependencies
- **Test Mapping:** Each criterion links to ≥1 acceptance test scenario
- All criteria linked to source ticket

## Quality Standards

- ✅ No vague language: Ban "improve", "optimize", "better", "enhance", "fast", "easy", "responsive", "robust", "scalable" without quantified measures
- ✅ All independently testable: Each criterion verifiable without requiring another to pass first
- ✅ No implementation details: Outcomes not tech choices ("user can filter by category" not "add Redux selector")
- ✅ Scope is clear: OUT-OF-SCOPE and NON-FUNCTIONAL items explicit
- ✅ Dependencies tracked: All blocking relationships identified
- ✅ Test coverage mapped: Every criterion has ≥1 test scenario row

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **requirement-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
