---
name: code-maker
description: "Code Maker skill. Use when producing TypeScript source files and React components for the development SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Code Maker

Load this skill alongside `maker-checker-protocol` and `best-practices` when acting as the **Code Maker**.

## Role

Produce the **development** phase artifact: TypeScript source files and React components.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

- Working, compiling TypeScript/React code implementing all approved requirements
- ESLint passes; no `console.log()`, `debugger`, or `TODO` comments in production
- Tailwind CSS v4 utility classes only — no hardcoded colors/spacing or `style={{}}` props
- No magic strings — all user-facing text, routes, config keys defined as constants
- No hardcoded API URLs, feature flags, or environment-specific values — use env vars or config imports
- OWASP Top 10 mitigations implemented
- All new imports declared; no circular imports
- Named exports (except Next.js page/layout/error files)

## Quality Standards

- ✅ Compiles: No TypeScript errors
- ✅ ESLint clean: Zero lint violations
- ✅ No console output: No `console.log()`, `console.error()`, `debugger` in production code
- ✅ No TODOs: All TODO/FIXME comments removed or tracked in separate issues
- ✅ Magic strings eliminated: All user-visible strings/routes/config keys are named constants
- ✅ Config externalized: API URLs, feature flags, timeouts from env vars or config files
- ✅ OWASP Top 10 safe: Input validation, output encoding, auth checks, CSRF tokens, no secrets in logs
- ✅ Naming conventions: Follow best-practices (PascalCase components, camelCase functions, UPPER_SNAKE_CASE constants)
- ✅ Accessibility compliance: No accessibility regressions; form labels present; ARIA attributes correct
- ✅ Performance impact: Actual bundle size ≤ target; load time within budget (measure and report)
- ✅ Build passes: No warnings or errors

## Production Steps

1. Load `best-practices` skill for naming/structure conventions
2. Read approved design artifact and existing source files using Explore subagent
3. **Code step 1 — Setup:** Create necessary files in correct structure (`components/`, `lib/`, etc.)
4. **Code step 2 — Implementation:** Write TypeScript/React code following design contract and best-practices
5. **Code step 3 — No magic strings:** Extract ALL user-facing text, routes, config keys into `constants.ts`
6. **Code step 4 — No hardcoded config:** Move API URLs, feature flags, timeouts to `.env.local` or config module
7. **Code step 5 — Security implementation:** Implement OWASP mitigations (form validation, output sanitization, auth checks, CSRF tokens)
8. **Code step 6 — Cleanup:** Remove all `console.log()`, `debugger`, and TODO comments
9. **Code step 7 — Lint & build:** Run ESLint and build; fix all violations
10. Commit and request user approval before checker validation

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **code-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
