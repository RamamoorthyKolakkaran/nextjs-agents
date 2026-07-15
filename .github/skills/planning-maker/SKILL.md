---
name: planning-maker
description: "Planning Maker skill. Use when producing requirement documents, acceptance criteria, user stories, component diagrams, and API contracts for the planning SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Planning Maker

Load this skill alongside `maker-checker-protocol` when acting as the **Planning Maker**.

## Role

Produce the **planning** phase artifact: requirement documents, acceptance criteria, user stories, component diagrams, and API contracts.

## Required Inputs

- `source_ref`: Jira ticket URL, Jira issue ID, PR URL, or plain-text description
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

Produce **all of the following sections** that are relevant to the ticket type:

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

Provide a **confidence score** for the classification.

### 2. Requirement Readiness

Analyze the ticket for:

- Business objective
- Functional & non-functional requirements
- Acceptance criteria
- Missing information or ambiguities
- Dependencies and risks

Output a **Readiness Score**: Ready / Mostly Ready / Needs Clarification / Not Ready

Include:
- Clarification Questions (if any)
- Assumptions
- Risks

### 3. Architecture Decision

Determine where the change should live:

- Server Component
- Client Component
- Server Action
- Route Handler
- Middleware
- Shared Component / Custom Hook / Utility / Service / Repository

Explain **why** each selection is chosen. Rules:

- Prefer Server Components unless interactivity is required
- Use Server Actions for mutations where appropriate
- Reuse existing components and utilities
- Follow existing project architecture and patterns

### 4. Impact Analysis

Identify affected areas:

- `app/`, `components/`, `hooks/`, `services/`, `lib/`, `middleware.ts`, `route.ts`, `page.tsx`, `layout.tsx`, `database/`, `tests/`

For each, explain **why it's affected** and **expected changes**. Do not include unaffected areas.

### 5. Required Artifacts

Generate **only the artifacts needed** for this ticket:

- **UI Features:** component hierarchy, user flow, validation, loading/error/empty states, accessibility
- **API Features:** endpoint definition, request/response types, validation, error responses
- **Server Actions:** input/output contracts, validation, error handling
- **Database Changes:** schema updates, migration, rollback
- **Integrations:** request/response mapping, error handling, retries
- **Authentication:** access rules, protected routes
- **Bug Fixes:** root cause, reproduction steps, fix strategy
- **Refactoring:** scope, affected files, expected improvements, risk mitigation
- **Testing:** unit test cases, E2E scenarios, test data, expected outcomes

### 6. API Integration (if applicable)

Ensure **full API contract compliance**:

1. API Specification: endpoint, HTTP method, authentication, headers, query/body parameters, response format, error codes, pagination/filtering
2. TypeScript types/interfaces for request/response/error
3. Implementation guidance: service/util file placement, loading/error state handling, typed response mapping
4. Contract enforcement: do not add extra fields, omit required fields, or implement without specification

### 7. Implementation Plan

For each task:

- Objective
- Files affected
- Dependencies
- Risks

Order tasks in proper sequence. Avoid speculative improvements. Focus strictly on ticket scope.

### 8. Verification Checklist

Include only relevant checks:

- **Functional:** all acceptance criteria implemented, expected flows work
- **UI:** responsive, loading/error/empty states, accessibility
- **API:** request/response match contract, validation, error handling
- **Security:** authentication, authorization, sensitive data protected
- **Testing:** unit/integration tests, regression coverage

## Quality Standards

- All acceptance criteria are testable and unambiguous
- Architecture decision is justified with reasoning
- Impact analysis covers all affected files without padding
- API contracts are fully specified with TypeScript types
- Implementation plan is ordered correctly with no missing dependencies
- No speculative improvements beyond ticket scope

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **planning-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
