---
name: best-practices
description: "NextJS App Router coding conventions and naming standards. Load this skill in the code agent to enforce project-wide best practices."
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

- Use Tailwind utility classes exclusively — no inline `style={{}}` props
- Use `cn()` or `clsx()` for conditional class merging
- Extract repeated class combinations into component variants if the same pattern appears 3+ times

## Storybook

- Every shared UI component in `components/` must have a co-located `.stories.tsx` file
- Stories must cover all significant prop variants and interactive states
- Use the CSF3 format (`const Story: StoryObj<typeof Component>`)
- No business logic or API calls inside stories — use mock args only
- Storybook must build without errors before a PR is merged

## Exports

- Prefer **named exports** over default exports for all components and utilities
- Exception: Next.js page, layout, loading, and error files require default exports
