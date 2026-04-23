"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Loader2 } from "lucide-react";

const DEFAULT_REDIRECT_PATH = "/simulation/property-list";

function getSafeRedirectPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return DEFAULT_REDIRECT_PATH;
  }
  return nextPath;
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function completeLogin() {
      const nextPath = getSafeRedirectPath(searchParams.get("next"));
      const oauthError =
        searchParams.get("error_description") ?? searchParams.get("error");

      if (oauthError) {
        if (isMounted) {
          setErrorMessage(oauthError);
        }
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            throw new Error(t("errors.invalidSession"));
          }
        }

        router.replace(nextPath);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : t("errors.googleConnection")
          );
        }
      }
    }

    completeLogin();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams, t]);

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {t("title")}
          </h1>
          <p className="text-[var(--muted-foreground)] leading-[1.7]">
            {t("description")}
          </p>

          {errorMessage ? (
            <div className="w-full rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
              <span className="text-[var(--muted-foreground)]">
                {t("validating")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthCallbackFallback() {
  const t = useTranslations("auth");

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {t("title")}
          </h1>
          <p className="text-[var(--muted-foreground)] leading-[1.7]">
            {t("description")}
          </p>
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
            <span className="text-[var(--muted-foreground)]">
              {t("validating")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
