"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "./AuthProvider";

interface AuthPromptProps {
  title: string;
  description: string;
  sx?: object;
}

export default function AuthPrompt({ title, description, sx = {} }: AuthPromptProps) {
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
    <Paper sx={{ p: { xs: 3, sm: 4 }, ...sx }}>
      <Stack spacing={2.5} alignItems="flex-start">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
        </Box>

        {authError && (
          <Typography color="error" variant="body2">
            {authError}
          </Typography>
        )}

        <Button variant="contained" onClick={handleSignIn} disabled={authBusy}>
          {authBusy ? "Connexion..." : "Se connecter avec Google"}
        </Button>
      </Stack>
    </Paper>
  );
}
