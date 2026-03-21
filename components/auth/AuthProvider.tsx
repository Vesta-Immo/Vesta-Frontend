"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useSessionReset } from "@/lib/SessionResetContext";

interface AuthContextValue {
  accessToken: string | null;
  authLoading: boolean;
  session: Session | null;
  signInWithGoogle: (returnTo?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function buildRedirectTo(returnTo?: string) {
  const configuredRedirect = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;
  const callbackUrl =
    configuredRedirect && configuredRedirect.length > 0
      ? configuredRedirect
      : `${window.location.origin}/auth/callback`;

  const url = new URL(callbackUrl);
  if (returnTo) {
    url.searchParams.set("next", returnTo);
  }

  return url.toString();
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const sessionReset = useSessionReset();
  const prevSessionRef = useRef<Session | null>(null);

  // Détecteur de déconnexion : réinitialise l'état si session passe de non-null à null
  useEffect(() => {
    if (prevSessionRef.current !== null && session === null) {
      sessionReset.clearAllState();
    }
    prevSessionRef.current = session;
  }, [session, sessionReset]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => undefined;

    async function bootstrapAuth() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(currentSession ?? null);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setAuthLoading(false);
        });

        unsubscribe = () => subscription.unsubscribe();
      } catch {
        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.access_token ?? null,
      authLoading,
      session,
      async signInWithGoogle(returnTo?: string) {
        try {
          const supabase = getSupabaseBrowserClient();
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: buildRedirectTo(returnTo),
            },
          });

          return { error: error?.message ?? null };
        } catch (error) {
          return {
            error:
              error instanceof Error
                ? error.message
                : "Connexion Google impossible pour le moment.",
          };
        }
      },
      async signOut() {
        try {
          const supabase = getSupabaseBrowserClient();
          await supabase.auth.signOut();
        } finally {
          setSession(null);
        }
      },
      user: session?.user ?? null,
    }),
    [authLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }

  return context;
}