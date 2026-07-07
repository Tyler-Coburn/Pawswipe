/**
 * Lightweight auth context for PawSwipe.
 *
 * - Subscribes to Supabase auth state on mount.
 * - Exposes { user, session, loading, signIn, signUp, signOut }.
 * - Anonymous/session fallback (see `lib/session.ts`) still works for visitors
 *   who don't sign in; this context simply reports `user === null` for them.
 */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { signInWithOAuth } from "@/lib/auth/oauthProvider";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string, displayName?: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: string | null; redirected: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener FIRST so we never miss an event during the initial getSession.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: displayName ? { display_name: displayName } : undefined,
      },
    });
    if (error) return { error: error.message, needsConfirmation: false };
    // If a session was returned, the project has auto-confirm enabled; otherwise
    // the user needs to confirm their email before signing in.
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    try {
      return await signInWithOAuth("google", redirectTo ?? window.location.origin + "/profile");
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e), redirected: false };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithPassword, signUpWithPassword, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
