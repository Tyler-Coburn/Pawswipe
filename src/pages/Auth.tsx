import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogIn, PawPrint, UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/AuthContext";

type Mode = "signin" | "signup";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.84h5.36c-.23 1.4-1.66 4.1-5.36 4.1-3.23 0-5.86-2.67-5.86-5.96S8.77 6.22 12 6.22c1.84 0 3.07.78 3.78 1.45l2.58-2.49C16.83 3.7 14.65 2.7 12 2.7 6.93 2.7 2.85 6.78 2.85 12s4.08 9.3 9.15 9.3c5.28 0 8.78-3.71 8.78-8.94 0-.6-.07-1.06-.16-1.52H12z" />
    </svg>
  );
}


const Auth = () => {
  const { user, loading, signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? "/profile";

  if (!loading && user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === "signin") {
      const { error: err } = await signInWithPassword(email, password);
      setBusy(false);
      if (err) setError(err);
      else navigate(from, { replace: true });
    } else {
      const { error: err, needsConfirmation } = await signUpWithPassword(email, password, displayName || undefined);
      setBusy(false);
      if (err) setError(err);
      else if (needsConfirmation) {
        setInfo("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        navigate(from, { replace: true });
      }
    }
  };
  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setGoogleBusy(true);
    const { error: err, redirected } = await signInWithGoogle(window.location.origin + from);
    if (err) {
      setError(err);
      setGoogleBusy(false);
      return;
    }
    if (!redirected) {
      // Tokens already set — go to destination.
      navigate(from, { replace: true });
    }
    // If redirected, the browser will leave the page.
  };


  return (
    <AppShell>
      <div className="container max-w-md py-10 md:py-16">
        <Button asChild variant="ghost" className="rounded-full -ml-2 mb-2">
          <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Home</Link>
        </Button>

        <div className="rounded-3xl border border-border bg-grad-card p-6 md:p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-grad-primary text-primary-foreground shadow-soft">
              <PawPrint className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your PawSwipe account"}</h1>
              <p className="text-xs text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to sync your matches and interest notes across devices."
                  : "Saves your shortlist and lets shelters reach you about the pets you love."}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="outline"
              disabled={googleBusy || busy}
              onClick={handleGoogle}
              className="w-full rounded-full h-11 font-medium"
            >
              {googleBusy ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting to Google…</>
              ) : (
                <>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Continue with Google
                </>
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-card px-2 text-muted-foreground">or with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  className="mt-1.5"
                  placeholder="What should shelters call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required autoComplete="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "signup" && (
                <p className="mt-1 text-[11px] text-muted-foreground">At least 8 characters.</p>
              )}
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
            {info && (
              <p className="rounded-xl border border-info/30 bg-info/5 px-3 py-2 text-sm">{info}</p>
            )}

            <Button type="submit" disabled={busy} className="w-full rounded-full bg-grad-primary h-11">
              {busy ? (
                <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> {mode === "signin" ? "Signing in…" : "Creating account…"}</>
              ) : mode === "signin" ? (
                <><LogIn className="mr-1.5 h-4 w-4" /> Sign in</>
              ) : (
                <><UserPlus className="mr-1.5 h-4 w-4" /> Create account</>
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm">
            {mode === "signin" ? (
              <>New to PawSwipe?{" "}
                <button type="button" className="font-medium text-primary hover:underline" onClick={() => { setMode("signup"); setError(null); setInfo(null); }}>
                  Create an account
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button type="button" className="font-medium text-primary hover:underline" onClick={() => { setMode("signin"); setError(null); setInfo(null); }}>
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            You can keep browsing PawSwipe without an account — signing in just syncs your matches and interest notes across devices.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree that PawSwipe shares your interest-note details with the relevant shelter. Shelters make the final adoption decision.
        </p>
      </div>
    </AppShell>
  );
};

export default Auth;
