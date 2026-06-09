/**
 * Anonymous PawSwipe session id.
 *
 * Used as the fallback identifier when a visitor is browsing in demo mode
 * (not signed in). Authenticated users are identified by auth.uid() via the
 * `profiles` table; this id is only meaningful for anonymous saved_pets and
 * adoption_applications rows where user_id is NULL.
 */
const KEY = "pawswipe:session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let v = localStorage.getItem(KEY);
  if (!v) {
    v = (crypto?.randomUUID?.() ?? `s-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`);
    localStorage.setItem(KEY, v);
  }
  return v;
}
