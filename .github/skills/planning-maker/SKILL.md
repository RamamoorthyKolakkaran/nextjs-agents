---
name: planning-maker
description: "Planning Maker skill. Use when producing requirement analysis, acceptance criteria, component diagrams, and API contracts for the planning SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Planning Maker

Load this skill alongside `maker-checker-protocol` when acting as the **Planning Maker**.

## Role

Produce the **planning** phase artifacts:

- Requirement readiness assessment
- Acceptance criteria verification
- Component diagrams (Mermaid)
- API contracts (typed endpoints and schemas)
- Implementation guidance and risks

## Required Inputs

- `source_ref`: Jira ticket URL, Jira issue ID (e.g., `PROJ-123`), or plain-text description
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact Structure

Produce a planning document with these sections:

### 1. Ticket Classification

Classify the ticket type (one or more):

- UI Change / Component / Page / Layout
- Form Implementation
- API Route / Server Action / Data Fetching
- Authentication / Authorization
- Middleware
- Database Change
- Integration
- State Management / Performance / SEO / Accessibility
- Refactoring / Bug Fix / Testing / Build Config / Infrastructure

Provide **confidence score** for classification.

### 2. Requirement Readiness

Assess whether the ticket is ready for implementation:

- **Ready** — All requirements clear, acceptance criteria defined, no blockers
- **Mostly Ready** — Minor clarifications needed but implementation can proceed
- **Needs Clarification** — Key information missing; implementation blocked
- **Not Ready** — Significant rework needed; ticket rejected

### 3. Clarification Questions

If readiness is not **Ready**, list specific questions to the user:

- What exactly is the expected behavior?
- What are the acceptance criteria?
- What data models are involved?
- What error cases must be handled?
- What constraints or dependencies exist?

### 4. Architecture Decision

Determine where the code should live in the Next.js App Router:

- **Server Component** — For read-only, data-fetching components
- **Client Component** — For interactive or stateful components
- **Server Action** — For mutations (form submissions, data updates)
- **Route Handler** — For API endpoints or webhooks
- **Middleware** — For request/response interception
- **Custom Hook** — For shared state or effect logic
- **Utility Function** — For reusable business logic
- **Service/Repository** — For data access layers

For each decision, explain **why** it was chosen based on the feature requirements.

### 5. Affected Next.js Areas

Identify which parts of the codebase will be impacted:

- `app/` (pages, layouts)
- `components/` (UI components)
- `hooks/` (custom hooks)
- `lib/` or `utils/` (utilities, services)
- `types/` (type definitions)
- `middleware.ts`
- Database or ORM layer
- Tests

For each, explain **why** and **what changes** are expected.

### 6. Required Artifacts

Specify which artifacts are needed before implementation:

- **Acceptance criteria** (user-facing requirements)
- **API contract** (if API changes are needed)
- **Component diagram** (if new component hierarchy is needed)
- **Type definitions** (if new data models are needed)
- **Test cases** (list of scenarios to test)
- **Security considerations** (auth, validation, secrets)

### 7. Implementation Plan

Sequence the implementation tasks:

1. **Objective** — What is this task doing?
2. **Files affected** — Which files will change?
3. **Dependencies** — Does this task depend on others?
4. **Risks** — What could go wrong?

### 8. Verification Checklist

List the checks that will confirm the feature is complete:

- **Functional** — All acceptance criteria implemented?
- **UI/UX** — Responsive, loading/error states, accessibility?
- **API** — Request/response contracts match the spec?
- **Security** — Authentication, authorization, secrets protected?
- **Performance** — No unnecessary re-renders, efficient queries?
- **Testing** — Unit and E2E tests written and passing?

## Quality Standards

All planning artifacts must meet these standards:

### Clarity
- Requirements are written in plain language
- Acceptance criteria are unambiguous and testable
- Diagrams are labeled and relationships are clear
- API contracts show examples for every endpoint

### Completeness
- All acceptance criteria are documented
- All affected system areas are identified
- All risks are surface-level identified
- All assumptions are stated

### Correctness
- Requirements align with the ticket description
- Architecture decisions are appropriate for Next.js
- Implementation plan is logically sequenced
- No contradictions between sections

### Consistency
- Architecture decisions follow Next.js conventions
- Terminology matches project standards
- References to existing code are accurate

## Checker Handoff

After producing the planning artifact, proceed to checker validation within the same agent run — load the **planning-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
