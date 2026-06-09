import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Compass, Heart, Inbox, Loader2, LogOut, MapPin, Save, ShieldCheck, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyProfile, getMyStats, updateMyProfile, type Profile as ProfileRow } from "@/lib/api/profile";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [stats, setStats] = useState<{ savedCount: number; applicationCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ display_name: "", preferred_city: "", preferred_species: "", bio: "" });

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const [p, s] = await Promise.all([getMyProfile(), getMyStats()]);
        if (!active) return;
        if (p) {
          setProfile(p);
          setForm({
            display_name: p.display_name ?? "",
            preferred_city: p.preferred_city ?? "",
            preferred_species: p.preferred_species ?? "",
            bio: p.bio ?? "",
          });
        }
        setStats(s);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  if (authLoading) {
    return (
      <AppShell>
        <div className="container max-w-3xl py-10"><Skeleton className="h-[40vh] w-full rounded-3xl" /></div>
      </AppShell>
    );
  }

  if (!user) return <Navigate to="/auth" state={{ from: "/profile" }} replace />;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      toast({ title: "Profile saved", description: "Your preferences are up to date." });
    } catch (e: any) {
      toast({ title: "Couldn't save profile", description: e?.message ?? "Try again in a moment.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.display_name || user.email?.split("@")[0] || "PawSwipe friend";
  const provider = (user.app_metadata?.provider as string | undefined) ?? "email";
  const providerLabel = provider === "google" ? "Google" : provider === "email" ? "Email & password" : provider;

  return (
    <AppShell>
      <div className="container max-w-3xl py-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Your account</p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold tracking-tight">Hi {displayName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Signed in with <span className="font-medium text-foreground">{providerLabel}</span>
            </p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => signOut()}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Heart className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Saved pets</p>
                <p className="font-display text-3xl font-semibold">
                  {loading ? <Skeleton className="inline-block h-7 w-10" /> : stats?.savedCount ?? 0}
                </p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="mt-3 rounded-full"><Link to="/matches">View matches</Link></Button>
          </div>
          <div className="rounded-3xl border border-border bg-grad-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                <Inbox className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Interest notes sent</p>
                <p className="font-display text-3xl font-semibold">
                  {loading ? <Skeleton className="inline-block h-7 w-10" /> : stats?.applicationCount ?? 0}
                </p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="mt-3 rounded-full"><Link to="/discover"><Compass className="mr-1 h-3.5 w-3.5" /> Keep swiping</Link></Button>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-border bg-card p-5 md:p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-display text-xl font-semibold">Adoption preferences</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Shelters use these as context — they don't replace your full interest note.</p>

          {loading ? (
            <Skeleton className="mt-5 h-48 w-full" />
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Display name</Label>
                <Input className="mt-1.5" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
              </div>
              <div>
                <Label className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Preferred city</Label>
                <Input className="mt-1.5" placeholder="Vancouver" value={form.preferred_city} onChange={(e) => setForm({ ...form, preferred_city: e.target.value })} />
              </div>
              <div>
                <Label>Looking for</Label>
                <select
                  aria-label="Preferred species"
                  className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.preferred_species}
                  onChange={(e) => setForm({ ...form, preferred_species: e.target.value })}
                >
                  <option value="">No preference</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="rabbit">Rabbit / small</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>About your home</Label>
                <Textarea
                  rows={3}
                  className="mt-1.5"
                  placeholder="A short note about your home, lifestyle, or other pets."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Button onClick={handleSave} disabled={saving || loading} className="rounded-full bg-grad-primary">
              {saving ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-1.5 h-4 w-4" /> Save preferences</>}
            </Button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-muted/30 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="font-medium">Your privacy</h2>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• Only you can read the interest notes you submit — they're not visible to other PawSwipe users.</li>
            <li>• Shelters only see your details for pets you applied to.</li>
            <li>• Your saved pets list is private to your account.</li>
            <li>• PawSwipe never sells pets and never shares your data with advertisers.</li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
};

export default Profile;
