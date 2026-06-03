# Planning Artifact: Login and Home Flow

## Source
- Source Ref: User request (inline) on 2026-05-31
- Jira Link: N/A (no Jira ID or Jira URL was provided)
- Priority: Not specified
- Labels: Not specified

## Requirement Format
All criteria use Gherkin format.

## Acceptance Criteria (SMART)

### AC-1 (Linked Source: N/A - non-Jira source)
Given the login page is loaded with empty fields
When no value is entered in username and password
Then the submit button remains disabled, and no navigation occurs.

Measure:
- Disabled state is present on initial load.
- Route remains on login page after any disabled-button click attempt.

### AC-2 (Linked Source: N/A - non-Jira source)
Given a user enters a username
When the username contains exactly 12 alphanumeric characters
Then the username field is valid and no username format error is shown.

Measure:
- Length equals 12.
- Allowed characters are only A-Z, a-z, 0-9.
- Values with spaces or special characters are rejected during entry or flagged invalid.
- Any value with length not equal to 12 is invalid.

### AC-3 (Linked Source: N/A - non-Jira source)
Given a user enters a password
When the password contains 6 to 8 alphanumeric characters
Then the password field is valid and no password format error is shown.

Measure:
- Length is between 6 and 8 inclusive.
- Allowed characters are only A-Z, a-z, 0-9.
- Values with spaces or special characters are invalid.
- Any value shorter than 6 or longer than 8 is invalid.

### AC-4 (Linked Source: N/A - non-Jira source)
Given the user interacts with login fields or submits the form
When a field is empty or invalid
Then field-level validation text is shown using the exact required messages.

Measure:
- Empty username message: "Username is required".
- Invalid username message: "Username must be exactly 12 alphanumeric characters".
- Empty password message: "Password is required".
- Invalid password message: "Password must be 6 to 8 alphanumeric characters only".

### AC-5 (Linked Source: N/A - non-Jira source)
Given both username and password are valid
When the user submits the form
Then the system revalidates inputs, navigates to Home on success, and transfers the username.

Measure:
- Submit is enabled only when both fields are valid.
- A revalidation step occurs at submit time.
- Successful submission navigates to Home exactly once.
- Home receives and renders the same username value submitted from login.

### AC-6 (Linked Source: N/A - non-Jira source)
Given the user is on Home after successful login
When Home is rendered on mobile and desktop viewports
Then the welcome message including username is centered horizontally and vertically and remains readable.

Measure:
- Message text includes "Welcome, {username}".
- Content is visually centered on viewport.
- At widths 375 and 1280, content has no horizontal overflow and text remains readable.

## OUT-OF-SCOPE
- Account registration, password reset, and multi-factor authentication.
- Persistent authentication session, token lifecycle, and logout workflow.
- Backend identity verification against external user directories.
- Localization/i18n beyond the provided English validation messages.
- Custom error analytics dashboards.

## NON-FUNCTIONAL REQUIREMENTS

### Performance
- Login page interactive elements render within 2 seconds on a standard local dev environment.
- Validation feedback appears within 100 ms after field blur or submit attempt.

### Accessibility
- Inputs have programmatically associated labels.
- Validation messages are text-based and exposed to assistive technologies.
- Keyboard-only users can reach all controls in logical order.

### Security
- Username and password validation rejects non-alphanumeric input according to constraints.
- No password value is displayed in plain text in the UI.
- Navigation to Home only occurs after successful client-side revalidation.

## Dependencies
- Router/navigation capability for transitioning from login to Home.
- Mechanism to carry username payload from login to Home (query, state, or storage).
- Existing page routes for login and Home in current app structure.
- E2E framework setup for desktop and mobile viewport checks.
- Blocking issues: None identified from provided source.
- Blocked-by relationships: None identified from provided source.

## Test Mapping Table

| Criterion ID | Test Scenario | Precondition | Expected Outcome |
|---|---|---|---|
| AC-1 | Happy: Initial render with empty fields | Login page opened fresh | Submit button is disabled |
| AC-1 | Error/Boundary: Click disabled submit | Both fields empty | No navigation; remains on login page |
| AC-2 | Happy: Enter 12-char alphanumeric username | Login page open | Username marked valid; no username format error |
| AC-2 | Error/Boundary: Enter special chars or spaces in username | Login page open | Invalid chars rejected or username marked invalid with required message |
| AC-2 | Error/Boundary: Enter length 11 or 13 username | Login page open | Username marked invalid with required message |
| AC-3 | Happy: Enter 6-8 alphanumeric password | Login page open | Password marked valid; no password format error |
| AC-3 | Error/Boundary: Enter password length <6 or >8 | Login page open | Password marked invalid with required message |
| AC-3 | Error/Boundary: Enter password with space or special char | Login page open | Password marked invalid with required message |
| AC-4 | Happy: Leave fields empty and trigger validation | Form interaction or submit attempted | Exact required "is required" messages displayed |
| AC-4 | Error/Boundary: Enter invalid formats then blur/submit | Invalid username/password entered | Exact required format messages displayed under each field |
| AC-5 | Happy: Submit with both valid fields | Username and password valid | Revalidation passes; navigate to Home; username transferred |
| AC-5 | Error/Boundary: One valid field and one invalid field | Mixed validity state | Submit remains disabled or submit attempt does not navigate |
| AC-6 | Happy: Verify centered welcome text on desktop | Successful login completed | "Welcome, {username}" appears centered and readable |
| AC-6 | Error/Boundary: Verify layout on mobile width 375 | Successful login completed | Content remains centered/readable with no horizontal overflow |
