# Design Artifact: Login and Home Flow

## Source
- Source Ref: docs/planning/login-home-requirements.md
- Context: Login to Home flow with strict username/password validation and E2E coverage
- Previous Output Applied: N/A (first design iteration)

## 1) Component Design (Server/Client + Data Flow)

### Component Tree

```mermaid
flowchart TD
  A[app/layout.tsx\nServer] --> B[app/page.tsx\nServer Route Shell]
  B --> C[components/login/LoginForm.tsx\nClient]
  C --> D[lib/validation/authValidation.ts\nShared Validation]
  C --> E[lib/constants/authMessages.ts\nValidation Messages]
  C --> F[Next Router push to /home/:username]
  F --> G[app/home/[username]/page.tsx\nServer Route]
  G --> H[components/home/WelcomePanel.tsx\nServer]

  subgraph StorybookScope[Shared UI Components in components/]
    I[components/login/FormField.tsx]
    J[components/login/FieldError.tsx]
    K[components/ui/CardShell.tsx]
  end

  C --> I
  C --> J
  C --> K
```

### Server vs Client Boundaries
- Server Components:
  - app/page.tsx: route shell only, renders client login form.
  - app/home/[username]/page.tsx: receives route params and renders centered welcome content.
  - components/home/WelcomePanel.tsx: presentational server component.
- Client Components:
  - components/login/LoginForm.tsx: owns form state, touched flags, validation state, and submit interaction.
  - Optional tiny client input helpers if needed for input filtering behavior.

### Data Flow
1. User enters username/password in LoginForm client component.
2. Input sanitizer filters non-alphanumeric characters during typing.
3. Shared validators compute field errors and overall validity.
4. Submit stays disabled until both fields are valid.
5. On submit, LoginForm runs full revalidation and navigates to /home/{username} only when valid.
6. Home route reads username from params and renders centered welcome text.

### Storybook Requirement Notes

| Component | Shared in components/ | Requires .stories.tsx | Reason |
|---|---|---|---|
| components/login/FormField.tsx | Yes | Yes | Reusable labeled input structure with error state visuals |
| components/login/FieldError.tsx | Yes | Yes | Reusable validation message state |
| components/ui/CardShell.tsx | Yes | Yes | Reusable responsive card layout container |
| components/login/LoginForm.tsx | No (feature-specific) | Optional | Stateful feature component, low reuse outside login flow |
| components/home/WelcomePanel.tsx | No (feature-specific) | Optional | Single-purpose home presentation |

## 2) API Contract (TypeScript)

### New API Routes
- No new backend API routes are required for this scope.
- Navigation uses App Router path params: /home/[username].

### Typed Contracts for Route and Validation Payloads

```ts
export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginFieldErrors {
  username: string | null;
  password: string | null;
}

export interface HomeRouteParams {
  username: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface LoginSubmitResult {
  canNavigate: boolean;
  errors: LoginFieldErrors;
  destination: string | null;
}
```

### Error Cases
- Username empty -> Username is required
- Username invalid format -> Username must be exactly 12 alphanumeric characters
- Password empty -> Password is required
- Password invalid format -> Password must be 6 to 8 alphanumeric characters only
- Invalid submit attempt -> canNavigate = false and no route transition

## 3) Security Checklist (OWASP Top 10)

| Risk | Relevance | Mitigation |
|---|---|---|
| Injection | Low/Medium | Restrict input to alphanumeric-only and fixed length rules; do not interpolate untrusted values into executable contexts |
| Broken Access Control | Low | Home route is presentation-only for this phase; no privileged data is exposed |
| Cryptographic Failures / Data Exposure | Medium | Never render password in clear text; use masked input type=password; do not persist password |
| Insecure Design | Medium | Revalidate on submit before navigation; do not trust UI state alone |
| Security Misconfiguration | Low | Keep validation messages constant and avoid leaking internals |
| Vulnerable Components | Medium | Pin dependencies through lockfile and run standard dependency audits in CI |
| Identification and Authentication Failures | Medium | Scope explicitly excludes backend auth; no false claim of secure authentication |
| Software and Data Integrity Failures | Low | Avoid client-side dynamic code execution; static validation logic only |
| Security Logging and Monitoring Failures | Low | Out of scope for this story, to be covered by platform logging policy |
| SSRF | Low | No server-side outbound request in this flow |

## 4) Accessibility Baseline (WCAG 2.1 AA)

- Use visible labels with explicit association to each input control.
- Ensure validation messages are announced with aria-live=polite and linked via aria-describedby.
- Keep keyboard tab order logical: username -> password -> submit.
- Preserve focus indicator visibility for all interactive elements.
- Ensure color contrast for text and error states meets WCAG AA.
- Keep error messaging text-based, concise, and near the related field.

## 5) Performance Constraints

- Login route target load: First usable render under 2.0s on local baseline.
- Validation response target: under 100ms after blur/input/submit.
- Estimated client bundle delta: +6 KB to +12 KB gzip (form state + validators + small UI wrappers).
- Lazy-load strategy:
  - No lazy load required for this small flow.
  - If additional decorative UI is added later, lazy-load non-critical visual components only.

## 6) Breaking Changes Assessment

- API endpoint path changes: None.
- Request/response schema changes: None.
- Auth protocol changes: None.
- Public type export breaks: None currently.
- Env var changes: None.
- Database migration impact: None.

Mitigation Strategy:
- Since no breaking changes are introduced in this scope, no migration window is required.
- If username transport later changes from path param to query/state/storage, support both old and new reads for one release before removal.

## 7) Proposed File-Level Design Targets

- app/page.tsx: Server route shell rendering login feature.
- components/login/LoginForm.tsx: Client form logic and submit flow.
- lib/validation/authValidation.ts: Shared validation functions and regex.
- lib/constants/authMessages.ts: Shared exact error messages.
- app/home/[username]/page.tsx: Server route receiving username param.
- components/home/WelcomePanel.tsx: Centered welcome presentation.
- tests/e2e/login-home.spec.ts: Desktop/mobile E2E flow and negative cases.

## 8) Traceability to Planning Criteria

| Planning Criterion | Design Coverage |
|---|---|
| AC-1 submit disabled initially | Client state model enforces disabled default and invalid-state lock |
| AC-2 username exact 12 alphanumeric | Shared validator + input filter + max length 12 |
| AC-3 password 6-8 alphanumeric | Shared validator + max length 8 + masked input |
| AC-4 exact field errors | Constants file centralizes exact required copy |
| AC-5 revalidate then navigate | Submit contract includes revalidation gate before route transition |
| AC-6 centered responsive home view | Home server route + centered presentation component and responsive constraints |
