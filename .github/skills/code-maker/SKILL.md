---
name: code-maker
description: "Development Maker skill. Use when producing TypeScript/React source code implementing approved requirements for the development SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Code Maker

Load this skill alongside `maker-checker-protocol`, `best-practices`, and `repository-discovery` when acting as the **Code Maker**.

## Role

Produce the **development** phase artifact: TypeScript/React source code implementing the approved requirements from the planning phase.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Core Principles

1. Implement **only** approved requirements — no extras, speculative improvements, or refactoring
2. Reuse existing code when practical (enforced by `repository-discovery` skill)
3. Minimize repository exploration and code changes
4. Maintain consistency with existing patterns
5. Produce production-ready code that passes all validation gates

If the design artifact and requirements conflict: **STOP and request clarification.** Do not guess.

## Output Artifact

Produce:

### Files Modified

List every file changed, with a one-line description of what changed and why.

### Files Created

List every new file, with a one-line justification for why it could not be an extension of an existing file.

### Implementation Summary

Describe what was implemented:
- Which acceptance criteria are addressed
- Which architectural primitives were used (Server Component, Client Component, Server Action, etc.)
- Key design decisions made during implementation

### TypeScript Implementation

Implement the approved design:

- No `any` types — use `unknown` with type guards where needed
- Explicit return types on all exported functions and components
- `interface` for object shapes; `type` for unions, intersections, aliases
- All strict TypeScript flags respected

### Component Rules

- Default to **Server Components** — add `"use client"` only when browser APIs, React hooks, or event handlers are needed
- Keep data fetching in Server Components; pass data as props to Client Components
- Named exports for all components except Next.js page/layout/loading/error files (default exports required)

### Styling

- Use Tailwind CSS v4 utility classes exclusively — no `style={{}}` inline props
- Use `cn()` or `clsx()` for conditional class merging
- Extract repeated class combinations into component variants if the same pattern appears 3+ times

### API Integration (if applicable)

- Follow existing service/api/lib patterns — do not place API calls directly in UI components
- Use strongly typed request/response/error contracts — no untyped API responses
- Never invent API behavior — if the contract is unclear, stop and ask

### Security

- Validate all inputs at system boundaries
- Enforce authentication and authorization
- Never log tokens, passwords, secrets, PII, or internal system errors
- Sanitize outputs where applicable

### Accessibility

- All form inputs must have labels
- All interactive elements must be keyboard accessible
- Correct ARIA attributes on custom interactive controls

### Risks

List any implementation risks, trade-offs made, or known limitations.

### Validation Results

Report the outcome of each gate before submitting:

| Gate | Status | Notes |
|------|--------|-------|
| TypeScript compiles | ✅ / ❌ | — |
| ESLint zero violations | ✅ / ❌ | — |
| No `any` types | ✅ / ❌ | — |
| API contract matched | ✅ / ❌ | — |
| Security checks | ✅ / ❌ | — |
| Accessibility | ✅ / ❌ | — |
| No debug artifacts | ✅ / ❌ | — |

## Quality Standards

- TypeScript compiles with no errors or warnings
- Zero ESLint violations
- No `any` types; no untyped API responses
- All acceptance criteria implemented
- No undocumented behavior added
- API implementation matches specification exactly
- No `console.log`, `console.error`, `debugger`, TODO or FIXME comments
- Tailwind CSS v4 utility classes only — no inline styles

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **code-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
