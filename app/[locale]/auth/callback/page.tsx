"use client";

import { Suspense, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

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
  }, [router, searchParams]);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={2.5} alignItems="flex-start">
          <Typography variant="h4">{t("title")}</Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {t("description")}
          </Typography>

          {errorMessage ? (
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={20} />
              <Typography color="text.secondary">{t("validating")}</Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

function AuthCallbackFallback() {
  const t = useTranslations("auth");

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={2.5} alignItems="flex-start">
          <Typography variant="h4">{t("title")}</Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {t("description")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">{t("validating")}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}