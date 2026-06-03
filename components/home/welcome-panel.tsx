import type { ReactElement } from "react";

import { WELCOME_PAGE_TEXT } from "@/lib/constants/auth-constants";

interface WelcomePanelProps {
  username: string;
}

export const WelcomePanel = ({ username }: WelcomePanelProps): ReactElement => (
  <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8">
    <h1 className="text-center text-2xl font-semibold text-zinc-900 sm:text-3xl">
      {WELCOME_PAGE_TEXT.greetingPrefix} {username}
    </h1>
  </main>
);
