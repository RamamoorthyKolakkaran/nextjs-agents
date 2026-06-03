export const USERNAME_LENGTH = 12;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 8;

export const ALPHANUMERIC_PATTERN = /^[A-Za-z0-9]+$/;

export const LOGIN_ROUTE = "/";
export const HOME_ROUTE_BASE = "/home";

export const LOGIN_PAGE_TEXT = {
  title: "Sign in",
  subtitle: "Enter your credentials to continue",
  usernameLabel: "Username",
  passwordLabel: "Password",
  submitButton: "Login",
};

export const WELCOME_PAGE_TEXT = {
  greetingPrefix: "Welcome,",
};

export const VALIDATION_MESSAGES = {
  usernameRequired: "Username is required",
  usernameInvalid:
    "Username must be exactly 12 alphanumeric characters",
  passwordRequired: "Password is required",
  passwordInvalid: "Password must be 6 to 8 alphanumeric characters only",
};
