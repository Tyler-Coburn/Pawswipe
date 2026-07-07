/**
 * OAuth sign-in adapter.
 *
 * PawSwipe was scaffolded on Lovable Cloud, whose auth wrapper
 * (`@lovable.dev/cloud-auth-js`) brokers the Google OAuth app and sets the
 * Supabase session for us. This adapter isolates that dependency behind one
 * seam so the rest of the app never imports Lovable directly, and so the
 * project can migrate to native Supabase OAuth without touching UI code.
 *
 * Switch providers with `VITE_OAUTH_PROVIDER`:
 *   - unset / "lovable"  → Lovable Cloud OAuth (default; current live behaviour)
 *   - "supabase"         → native `supabase.auth.signInWithOAuth`
 *
 * Native mode requires the Supabase project to have the Google provider
 * configured (client id/secret + redirect URLs). Until that's done, keep the
 * default so sign-in on the live beta keeps working.
 */
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export type OAuthProviderId = "google";
export type OAuthResult = { error: string | null; redirected: boolean };

function mode(): "lovable" | "supabase" {
  const raw = (import.meta.env.VITE_OAUTH_PROVIDER as string | undefined)?.toLowerCase();
  return raw === "supabase" ? "supabase" : "lovable";
}

export function oauthMode(): "lovable" | "supabase" {
  return mode();
}

export async function signInWithOAuth(provider: OAuthProviderId, redirectTo: string): Promise<OAuthResult> {
  if (mode() === "supabase") {
    // Native Supabase OAuth redirects the browser to the provider; on success
    // there is no error and the navigation is already in flight.
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    return { error: error?.message ?? null, redirected: !error };
  }

  // Default: Lovable Cloud OAuth wrapper (sets the Supabase session internally).
  const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: redirectTo });
  if ("error" in result && result.error) {
    const msg = result.error instanceof Error ? result.error.message : String(result.error);
    return { error: msg, redirected: false };
  }
  return { error: null, redirected: Boolean((result as { redirected?: boolean }).redirected) };
}
