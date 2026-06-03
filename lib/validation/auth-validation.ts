import {
  ALPHANUMERIC_PATTERN,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_LENGTH,
  VALIDATION_MESSAGES,
} from "@/lib/constants/auth-constants";

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginFieldErrors {
  username: string | null;
  password: string | null;
}

export const sanitizeAlphanumeric = (value: string): string =>
  value.replace(/[^A-Za-z0-9]/g, "");

export const validateUsername = (username: string): string | null => {
  if (!username) {
    return VALIDATION_MESSAGES.usernameRequired;
  }

  if (username.length !== USERNAME_LENGTH || !ALPHANUMERIC_PATTERN.test(username)) {
    return VALIDATION_MESSAGES.usernameInvalid;
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return VALIDATION_MESSAGES.passwordRequired;
  }

  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH ||
    !ALPHANUMERIC_PATTERN.test(password)
  ) {
    return VALIDATION_MESSAGES.passwordInvalid;
  }

  return null;
};

export const getLoginFieldErrors = (
  values: LoginFormValues,
): LoginFieldErrors => ({
  username: validateUsername(values.username),
  password: validatePassword(values.password),
});

export const isLoginFormValid = (values: LoginFormValues): boolean => {
  const errors = getLoginFieldErrors(values);

  return !errors.username && !errors.password;
};
