import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { WelcomePanel } from "@/components/home/welcome-panel";
import { LOGIN_ROUTE, USERNAME_LENGTH } from "@/lib/constants/auth-constants";
import { sanitizeAlphanumeric } from "@/lib/validation/auth-validation";

interface HomePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps): Promise<ReactElement> {
  const { username: usernameParam } = await params;

  const sanitizedUsername = sanitizeAlphanumeric(usernameParam);

  if (sanitizedUsername.length !== USERNAME_LENGTH) {
    redirect(LOGIN_ROUTE);
  }

  return <WelcomePanel username={sanitizedUsername} />;
}
