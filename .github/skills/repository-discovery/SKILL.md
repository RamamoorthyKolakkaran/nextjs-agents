---
name: repository-discovery
description: "Efficient codebase navigation and locality-first implementation patterns. Load this skill when performing code generation to minimize repository exploration cost and enforce reuse-first strategies."
---

# Repository Discovery

This skill optimizes **efficiency during code generation** by establishing structured patterns for exploring the repository and enforcing locality-first implementation strategies.

## Core Principle: Locality First

When implementing a feature or writing tests:

1. **Identify the target location** — where the new code should live (e.g., `app/page.tsx`, `components/Button.tsx`, `hooks/useCart.ts`)
2. **Read the immediate vicinity** — scan files in the same directory and parent directories for patterns, shared utilities, and examples
3. **Reuse before creating** — extend existing files or patterns before creating new ones
4. **Minimize repo exploration** — avoid reading unrelated parts of the codebase
5. **Follow existing conventions** — mirror patterns found locally, not distant parts of the repo

## File Reading Budget

To keep token costs reasonable:

- **Per feature:** Maximum 10 files read (excluding test files)
- **Per phase:** Maximum 15 files read
- **Prioritize:** Source files in the target directory, then parent directories, then core framework files

If you exceed the budget, pause and ask the user for guidance.

## Context Loading Order

When starting a new implementation task, load context in this order:

1. **Target file path** (if file exists) — read the exact location where code will be added/modified
2. **Adjacent files in the same directory** — identify local patterns (naming, structure, imports)
3. **Parent directory files** — understand the module's structure and conventions
4. **Shared utilities** (`lib/`, `utils/`, `hooks/`, `components/`) — look for reusable patterns
5. **Type definitions** (`types/`, `*.d.ts`) — understand shared types and contracts
6. **Configuration files** (`next.config.ts`, `tsconfig.json`) — verify build and type settings
7. **Test examples** — inspect existing tests in the same directory to understand testing patterns

Do not read:

- Unrelated feature directories
- Large package-lock files
- Build outputs (`.next/`, `dist/`, `build/`)
- Generated files

## Repository Reuse Rules

Before writing any new code:

### Rule 1: Check for Existing Components

- Is there an existing component that can be reused or extended?
- Example: Instead of creating a new form component, extend an existing `Form` component with new fields
- Decision: **Reuse before creating**

### Rule 2: Check for Existing Utilities

- Is there a utility function that does (or could do) what you need?
- Example: Instead of creating `formatDate()`, check if it exists in `lib/` or `utils/`
- Decision: **Extend before duplicating**

### Rule 3: Check for Existing Patterns

- How do similar features or components structure their code?
- Example: If other API routes use a consistent error handling pattern, use it too
- Decision: **Follow patterns, don't invent new ones**

### Rule 4: Check for Existing Test Patterns

- How are other tests written? What utilities do they use?
- Example: If tests use a shared test factory, use it instead of creating fixtures inline
- Decision: **Reuse test utilities and patterns**

## Scope Control

Stay focused on the immediate task:

- **Feature scope:** Only files required by the acceptance criteria
- **Test scope:** Only test cases for changed/created code, not entire modules
- **Refactoring scope:** Only changes required to implement the feature; no additional cleanup unless explicitly requested

If a task requires changes outside the immediate scope, ask the user before proceeding.

## Discovery Workflow

When starting implementation:

### Step 1: Identify Target Location

Determine where the code should live based on:

- Acceptance criteria
- Feature type (component, hook, utility, API route, etc.)
- Next.js App Router conventions
- Existing project structure

### Step 2: Read Immediate Context (Max 5 files)

Load:

1. Target file itself (if exists)
2. Similar files in the same directory (2–3 examples)
3. Shared utilities or hooks used locally
4. Type definitions (if needed)

### Step 3: Identify Patterns

Look for:

- Naming conventions (already defined in `best-practices`)
- File structure and organization
- Import styles
- Error handling patterns
- Component composition patterns

### Step 4: Check Reuse Opportunities

For each new element you're about to create:

- Does a similar element already exist?
- Can you extend or compose it instead?
- What pattern should you follow?

### Step 5: Implement with Locality

Write code that:

- Matches local conventions
- Reuses local utilities
- Follows patterns found in the target directory
- Minimizes new files (prefer extending existing files)

## Handling Missing Context

If you cannot find an answer through local exploration:

1. **Ask the user** — don't guess or invent
2. **Suggest a pattern** — "I see components in `components/` follow this pattern. Should I use it?"
3. **Check configuration** — verify settings in `tsconfig.json`, `next.config.ts`, or `package.json`

## When to Escalate

Stop and ask the user to clarify:

- **Ambiguous feature scope** — "Acceptance criteria mentions X. Should I also implement Y?"
- **Missing type definitions** — "I don't see types for this API. Should I create them?"
- **Conflicting patterns** — "I see two different patterns for this. Which should I use?"
- **Out-of-scope changes** — "Implementing this would require refactoring in module Y. Should I proceed?"

## Efficient Exploration Checklist

Before you start reading files, confirm:

- ✅ I know the **target directory** (where code will live)
- ✅ I know the **feature scope** (from acceptance criteria)
- ✅ I understand **what already exists** (from high-level scan)
- ✅ I have a **plan** (how to implement with existing patterns)

If any checkbox is unclear, ask the user before proceeding.
