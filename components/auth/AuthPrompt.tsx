"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface AuthPromptProps {
  title: string;
  description: string;
  className?: string;
}

export default function AuthPrompt({ title, description, className = "" }: AuthPromptProps) {
  const t = useTranslations("authComp");
  const pathname = usePathname();
  const { signInWithGoogle } = useAuth();
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError(null);

    const returnTo = typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

    const { error: signInError } = await signInWithGoogle(returnTo);
    if (signInError) {
      setAuthError(signInError);
      setAuthBusy(false);
    }
  }

  return (
    <Card className={`p-6 sm:p-8 ${className}`}>
      <div className="flex flex-col items-start gap-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--foreground)]">
            {title}
          </h2>
          <p className="text-[var(--foreground)]/60">{description}</p>
        </div>

        {authError && (
          <p className="text-sm text-red-600">
            {authError}
          </p>
        )}

        <Button variant="primary" onClick={handleSignIn} disabled={authBusy}>
          <LogIn className="w-4 h-4 mr-2" />
          {authBusy ? t("action.signingIn") : t("action.signInWithGoogle")}
        </Button>
      </div>
    </Card>
  );
}
