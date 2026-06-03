"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  HOME_ROUTE_BASE,
  LOGIN_PAGE_TEXT,
  PASSWORD_MAX_LENGTH,
  USERNAME_LENGTH,
} from "@/lib/constants/auth-constants";
import {
  getLoginFieldErrors,
  isLoginFormValid,
  sanitizeAlphanumeric,
} from "@/lib/validation/auth-validation";

interface TouchedState {
  username: boolean;
  password: boolean;
}

export const LoginForm = (): JSX.Element => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [touched, setTouched] = useState<TouchedState>({
    username: false,
    password: false,
  });

  const errors = useMemo(
    () =>
      getLoginFieldErrors({
        username,
        password,
      }),
    [password, username],
  );

  const isSubmitEnabled =
    username.length > 0 && password.length > 0 && isLoginFormValid({ username, password });

  const usernameErrorMessage = touched.username ? errors.username : null;
  const passwordErrorMessage = touched.password ? errors.password : null;

  const handleUsernameChange = (value: string): void => {
    const filteredValue = sanitizeAlphanumeric(value).slice(0, USERNAME_LENGTH);
    setUsername(filteredValue);
  };

  const handlePasswordChange = (value: string): void => {
    const filteredValue = sanitizeAlphanumeric(value).slice(0, PASSWORD_MAX_LENGTH);
    setPassword(filteredValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setTouched({
      username: true,
      password: true,
    });

    const hasNoErrors = isLoginFormValid({ username, password });
    if (!hasNoErrors) {
      return;
    }

    const destination = `${HOME_ROUTE_BASE}/${encodeURIComponent(username)}`;
    router.push(destination);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-zinc-900">
          {LOGIN_PAGE_TEXT.title}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-600">
          {LOGIN_PAGE_TEXT.subtitle}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-zinc-800"
            >
              {LOGIN_PAGE_TEXT.usernameLabel}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              maxLength={USERNAME_LENGTH}
              inputMode="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={(event) => handleUsernameChange(event.target.value)}
              onBlur={() =>
                setTouched((current) => ({
                  ...current,
                  username: true,
                }))
              }
              aria-invalid={Boolean(usernameErrorMessage)}
              aria-describedby="username-error"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-offset-2 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
            />
            <p
              id="username-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {usernameErrorMessage ?? ""}
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-800"
            >
              {LOGIN_PAGE_TEXT.passwordLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              maxLength={PASSWORD_MAX_LENGTH}
              inputMode="text"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={(event) => handlePasswordChange(event.target.value)}
              onBlur={() =>
                setTouched((current) => ({
                  ...current,
                  password: true,
                }))
              }
              aria-invalid={Boolean(passwordErrorMessage)}
              aria-describedby="password-error"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-offset-2 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
            />
            <p
              id="password-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {passwordErrorMessage ?? ""}
            </p>
          </div>

          <button
            type="submit"
            disabled={!isSubmitEnabled}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {LOGIN_PAGE_TEXT.submitButton}
          </button>
        </form>
      </div>
    </div>
  );
};
