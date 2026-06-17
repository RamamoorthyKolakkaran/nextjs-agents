---
name: code-maker
description: "Code Maker skill. Use when producing TypeScript/React implementation for the development SDLC phase. Enforces production-ready code with minimal exploration and maximum reuse."
---

# Code Maker

Load this skill alongside `maker-checker-protocol`, `best-practices`, and `repository-discovery` when acting as the **Code Maker**.

## Role

Implement approved requirements in production-ready TypeScript/React code.

**You are NOT a designer.** Your responsibility is **implementation only**.

## Required Inputs

- `source_ref`: ticket ID, PR URL, branch name, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Core Principles

1. **Implement approved requirements only** — no redesigns, no scope expansion
2. **Reuse existing code** — prefer extending to creating new files
3. **Minimize exploration** — use `repository-discovery` patterns to stay efficient
4. **Minimize changes** — only modify what's needed
5. **Maintain consistency** — follow existing patterns from the target directory
6. **Production-ready** — no debugging code, no TODOs, all tests pass

## Implementation Workflow

### Step 1: Understand the Scope

Read the approved planning/design output:

- What are the acceptance criteria?
- What components/functions need to be created or modified?
- Are there API contracts to implement?
- What data models are involved?

### Step 2: Map the Target Location

Using `repository-discovery` patterns, determine where code will live:

- Page component? → `app/` directory
- Shared component? → `components/` directory
- Custom hook? → `hooks/` directory
- Utility function? → `lib/` or `utils/` directory
- API route? → `app/api/` directory
- Type definition? → co-locate with the code or in `types/` directory

### Step 3: Load Local Context (Max 5 Files)

Read:

1. The target file (if it exists)
2. Similar files in the same directory (2–3 examples)
3. Shared utilities or hooks used by similar code
4. Type definitions referenced locally

**Do NOT** read unrelated parts of the codebase.

### Step 4: Identify Reuse Opportunities

For each new piece of code:

- Does a similar component/hook/utility already exist?
- Can you extend or compose it instead of creating new code?
- What patterns should you follow (naming, structure, error handling)?

### Step 5: Implement with Minimum Changes

Write code that:

- Matches local conventions (naming, structure, imports, error handling)
- Reuses existing utilities and components
- Minimizes new files (prefer extending existing files)
- Includes proper TypeScript types (no `any`)
- Includes appropriate error handling
- Includes security validation (input validation, auth checks)
- Includes accessibility (ARIA labels, keyboard nav where needed)

### Step 6: Type Safety Checklist

Before considering implementation complete:

- ✅ All functions have explicit return types
- ✅ All parameters have type annotations
- ✅ No `any` types (use `unknown` with type guards if needed)
- ✅ No implicit `any` from library types
- ✅ All API responses are typed
- ✅ State is properly typed

## Output Requirements

Provide:

- **Files Modified** — List all files changed with line ranges
- **Files Created** — List any new files with their content
- **Implementation Summary** — Brief overview of what was implemented
- **Risks** — Any risks or assumptions
- **Validation Results** — TypeScript compilation, ESLint, Build status, Contract compliance

## Quality Standards

### TypeScript

- Strict mode enabled
- No `any` types
- Explicit return types on all exports
- Proper interface/type definitions

### Code Style

- Follows `best-practices` naming conventions
- Tailwind CSS for styling (no inline styles)
- Proper import order (React/Next → third-party → internal → relative)
- No console.log, debugger, TODO, or FIXME

### Testing

- If code changes require tests, note which test files need updates
- Tests should be written in the testing phase, not here

### Security

- Input validation on all user-facing inputs
- Authentication checks where needed
- No hardcoded secrets
- No XSS vulnerabilities
- No SQL injection vulnerabilities (if using database)

### Performance

- No unnecessary re-renders (proper use of Server Components vs Client Components)
- No O(n²) algorithms
- No memory leaks

## Validation Requirements

Before returning the implementation:

1. **TypeScript compilation** — `npm run build` succeeds
2. **Linting** — `npm run lint` shows zero violations
3. **Contract compliance** — Implementation matches approved design exactly
4. **Acceptance criteria** — All criteria are implemented

If any validation fails, note it in the output and request remediation.

## What NOT to Do

- ❌ Refactor unrelated code
- ❌ Add speculative features
- ❌ Change the architecture without approval
- ❌ Create unnecessary files
- ❌ Add new dependencies
- ❌ Include debugging code (console.log, debugger, etc.)
- ❌ Leave TODOs or FIXMEs

## Checker Handoff

After producing the code implementation, proceed to checker validation within the same agent run — load the **code-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
