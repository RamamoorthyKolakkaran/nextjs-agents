---
name: best-practices
description: "NextJS coding conventions and naming standards. Load this skill in the code agent to enforce project-wide best practices."
---

# NextJS Best Practices

This skill defines the coding conventions and naming standards for all TypeScript/React source code produced in this project.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|-------|
| React components | PascalCase | `ProductCard`, `CheckoutForm` |
| Custom hooks | camelCase prefixed with `use` | `useCartItems`, `useAuth` |
| Utility functions | camelCase | `formatPrice`, `buildApiUrl` |
| TypeScript types/interfaces | PascalCase | `CartItem`, `ApiResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| File names | kebab-case | `product-card.tsx`, `use-cart.ts` |
| Test files | same name + `.test` or `.spec` suffix | `product-card.test.tsx` |

## File Structure

- Co-locate component files with their test files in the same directory
- One component per file — no multiple component exports per file
- Page components live in `app/` following Next.js App Router conventions
- Shared UI components live in `components/`
- Custom hooks live in `hooks/`
- Utility functions live in `lib/` or `utils/`

## Server vs Client Components

- Default to **Server Components** — add `"use client"` only when the component requires:
  - Browser APIs (`window`, `document`, `localStorage`)
  - React hooks (`useState`, `useEffect`, `useContext`, `useRef`)
  - Event handlers (`onClick`, `onChange`, `onSubmit`)
- Never add `"use client"` to layout or page components unless strictly necessary
- Keep data fetching in Server Components; pass data down as props to Client Components

## TypeScript Standards

- No `any` types — use `unknown` with type guards if the type is genuinely unknown
- Explicit return types on all exported functions and components
- Use `interface` for object shapes; use `type` for unions, intersections, and aliases
- All `tsconfig.json` strict flags must remain enabled

## Import Order

1. React and Next.js imports
2. Third-party library imports
3. Internal absolute imports (`@/components/...`, `@/lib/...`)
4. Relative imports (`./`, `../`)
5. Type-only imports (`import type { ... }`) — always last

## Styling — Tailwind CSS v4

- Use Tailwind utility classes exclusively — no `style={{}}` inline props
- Use `cn()` or `clsx()` for conditional class merging
- Extract repeated class combinations into component variants if the same pattern appears 3+ times

## Exports

- Prefer **named exports** over default exports for all components and utilities
- Exception: Next.js page, layout, loading, and error files require default exports

## Component Selection

Prefer:

- Server Components by default
- Server Actions for mutations
- Existing data-fetching patterns
- Existing authentication patterns

Use Client Components only when:

- User interaction is required
- Browser APIs are required
- Local state is required

Avoid unnecessary `"use client"` directives.

## API Integration Rules

### Required Contract Information

Verify:

- Endpoint
- HTTP method
- Authentication requirements
- Request contract
- Response contract
- Error contract

If any contract information is missing: **STOP and request clarification.** Do not invent API behavior.

### Type Safety

Generate strongly typed contracts:

```typescript
RequestDto
ResponseDto
ApiError
```

Requirements:

- No `any`
- No untyped API responses
- No implicit contracts

### API Layer

Follow existing repository conventions:

```
services/
api/
lib/api/
```

Do not place API calls directly inside UI components unless existing code already follows that pattern.

## State Management

Reuse the project's existing state management solution: **Zustand v4.5.5**.

Do not introduce new state management libraries.

## Security Requirements

Follow secure coding practices.

**Required:**

- Input validation
- Authentication enforcement
- Authorization checks
- CSRF protection where applicable
- Secure error handling
- Output sanitization where applicable

**Never:**

- Log tokens
- Log passwords
- Log secrets
- Log PII
- Expose internal system errors

## Constants and Configuration

### No Magic Strings

Extract into existing constants/config modules:

- User-facing text
- Routes
- Config keys
- Feature flags

### No Hardcoded Configuration

Never hardcode:

- API URLs
- Environment URLs
- Secrets
- Feature flags
- Timeouts

Use:

- Environment variables
- Existing config modules

## Accessibility Requirements

Do not introduce accessibility regressions.

**Required:**

- Form labels
- Keyboard accessibility
- Correct ARIA attributes
- Accessible interactive controls

## File Creation Rules

Before creating a new file, ask:

```
Can an existing file be extended?
```

If yes: Modify the existing file.

If no: Create the minimum number of new files necessary.

Avoid unnecessary file creation.

## Code Cleanliness

Remove before completion:

- `console.log`
- `console.error`
- `debugger`
- TODO comments
- FIXME comments

Production code must not contain temporary debugging artifacts.

## Validation Gates

All gates must pass.

### Build

- TypeScript compiles successfully
- No build errors
- No build warnings

### Lint

- Zero ESLint violations

### Type Safety

- No `any`
- No untyped API responses
- No unsafe contracts

### Security

- Validation implemented
- Authentication enforced
- Authorization enforced

### Accessibility

- No accessibility regressions

### Contract Compliance

- All acceptance criteria implemented
- No undocumented behavior added
- API implementation matches specification exactly
- Tailwind CSS v4 utility classes only — no inline styles

## Pre-Commit Checklist

Verify:

- Approved requirements implemented
- Acceptance criteria satisfied
- Existing patterns reused
- Minimal file changes made
- No unnecessary files created
- API contracts respected
- Tests updated when required
- Build passes
- Lint passes
