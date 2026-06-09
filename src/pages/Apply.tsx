import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, Globe, Heart, Loader2, Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_pet } from "@/lib/api/pets";
import { submitApplication } from "@/lib/api/applications";
import { PetArt } from "@/components/pet/PetArt";
import type { Pet } from "@/lib/types";

const Apply = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState<Pet | undefined>();
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    housing: "", rentOrOwn: "", landlord: false,
    currentPets: "", children: "", experience: "",
    reason: "", contact: "email", availability: "",
    consent: false,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      if (!petId) { setLoading(false); return; }
      try {
        const p = await GET_pet(petId);
        if (active) setPet(p);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [petId]);

  if (loading) {
    return (
      <AppShell>
        <div className="container max-w-3xl py-10"><Skeleton className="h-[60vh] w-full rounded-3xl" /></div>
      </AppShell>
    );
  }

  if (!pet) {
    return (
      <AppShell>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl">Pet not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This listing may have been adopted or removed by the shelter.</p>
          <Button asChild className="mt-4 rounded-full"><Link to="/discover">Back to discover</Link></Button>
        </div>
      </AppShell>
    );
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="container max-w-xl py-16 md:py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success/15 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold">Your PawSwipe interest note has been saved.</h1>
          <p className="mt-3 text-muted-foreground">
            Please confirm next steps directly with {pet.shelterName}. Most shelters reply in 3–5 business days.
          </p>
          {pet.source === "rescuegroups" && pet.sourceUrl && (
            <div className="mt-5 rounded-2xl border border-border bg-grad-card p-4 text-sm text-left">
              <p className="font-medium">This is a synced RescueGroups listing</p>
              <p className="mt-1 text-muted-foreground">
                {pet.shelterName}'s official adoption application may still be required. Open the original listing to follow their process.
              </p>
              <Button asChild variant="outline" className="mt-3 rounded-full">
                <a href={pet.sourceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-4 w-4" /> View official listing
                </a>
              </Button>
            </div>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button asChild className="rounded-full bg-grad-primary"><Link to="/matches"><Heart className="mr-1.5 h-4 w-4" /> View matches</Link></Button>
            <Button asChild variant="outline" className="rounded-full"><Link to="/discover">Keep swiping</Link></Button>
          </div>
          <p className="mt-10 text-xs text-muted-foreground">
            Submitting this form does not guarantee adoption. Shelters make final decisions based on what's best for the animal.
          </p>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet || submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    const res = await submitApplication(pet, {
      applicantName: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      housingType: form.housing,
      rentOrOwn: form.rentOrOwn,
      landlordPermission: form.landlord,
      currentPets: form.currentPets,
      childrenInHome: form.children,
      petExperience: form.experience,
      reason: form.reason,
      preferredContact: form.contact,
      availability: form.availability,
      consent: form.consent,
    });
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitError(res.error ?? "We couldn't save your interest note. Please try again.");
    }
  };

  return (
    <AppShell>
      <div className="container max-w-3xl py-6 md:py-10">
        <Button asChild variant="ghost" className="rounded-full -ml-2">
          <Link to={`/pets/${pet.id}`}><ArrowLeft className="mr-1 h-4 w-4" /> Back to {pet.name}</Link>
        </Button>

        <div className="mt-4 flex items-center gap-4 rounded-3xl border border-border bg-grad-card p-4 shadow-soft">
          <PetArt species={pet.species} name={pet.name} variant={3} className="h-20 w-20" rounded="rounded-2xl" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-primary">Adoption interest form</p>
            <h1 className="font-display text-2xl font-semibold truncate">For {pet.name}</h1>
            <p className="text-xs text-muted-foreground truncate">{pet.shelterName} · {pet.locationCity}</p>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-accent-soft p-4 text-sm">
          This is an <strong>adoption interest form</strong>, not a purchase. PawSwipe does not sell pets — the shelter reviews your interest and reaches out about next steps.
        </p>

        {pet.source === "rescuegroups" && (
          <div className="mt-3 rounded-2xl border border-info/30 bg-info/5 p-4 text-sm">
            <p className="font-medium inline-flex items-center gap-2"><Globe className="h-4 w-4 text-info" /> Synced from RescueGroups</p>
            <p className="mt-1 text-muted-foreground">
              For synced listings, the shelter's official application may still be required. We recommend opening the original listing alongside this form.
            </p>
            {pet.sourceUrl && (
              <Button asChild variant="outline" size="sm" className="mt-3 rounded-full">
                <a href={pet.sourceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View official shelter listing
                </a>
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <Section title="About you">
            <Field label="Full name" required><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Email" required><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone" required><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="City" required><Input required placeholder="Vancouver" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          </Section>

          <Section title="Your home">
            <Field label="Housing type">
              <select
                aria-label="Housing type"
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                value={form.housing}
                onChange={(e) => setForm({ ...form, housing: e.target.value })}
              >
                <option value="">Select…</option>
                <option>Apartment / Condo</option>
                <option>Townhouse</option>
                <option>House</option>
              </select>
            </Field>
            <Field label="Do you rent or own?">
              <RadioGroup value={form.rentOrOwn} onValueChange={(v) => setForm({ ...form, rentOrOwn: v })} className="flex gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm"><RadioGroupItem value="rent" /> Rent</label>
                <label className="inline-flex items-center gap-2 text-sm"><RadioGroupItem value="own" /> Own</label>
              </RadioGroup>
            </Field>
            {form.rentOrOwn === "rent" && (
              <Field label="Landlord permission" full>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.landlord} onCheckedChange={(v) => setForm({ ...form, landlord: !!v })} />
                  My landlord allows pets of this size & species.
                </label>
              </Field>
            )}
          </Section>

          <Section title="Your household">
            <Field label="Current pets" full><Input value={form.currentPets} onChange={(e) => setForm({ ...form, currentPets: e.target.value })} placeholder="e.g. 1 cat, spayed, 5 years old" /></Field>
            <Field label="Children in home" full><Input value={form.children} onChange={(e) => setForm({ ...form, children: e.target.value })} placeholder="e.g. No / 1 child, 8 years old" /></Field>
            <Field label="Experience with pets" full>
              <Textarea rows={3} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Past pets, training, lifestyle…" />
            </Field>
          </Section>

          <Section title={`Why ${pet.name}?`}>
            <Field label={`Tell the shelter why you're interested in ${pet.name}`} full required>
              <Textarea required rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Share a bit about why this pet feels like a fit." />
            </Field>
            <Field label="Preferred contact method">
              <RadioGroup value={form.contact} onValueChange={(v) => setForm({ ...form, contact: v })} className="flex gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm"><RadioGroupItem value="email" /> Email</label>
                <label className="inline-flex items-center gap-2 text-sm"><RadioGroupItem value="phone" /> Phone</label>
              </RadioGroup>
            </Field>
            <Field label="Availability for meet-and-greet"><Input placeholder="e.g. Weekends" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} /></Field>
          </Section>

          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox required checked={form.consent} onCheckedChange={(v) => setForm({ ...form, consent: !!v })} className="mt-0.5" />
              <span>
                I understand that submitting this form does not guarantee adoption. The shelter will review my information and make the final decision based on what's best for the animal.
              </span>
            </label>
          </div>

          {submitError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">We couldn't save your interest note</p>
                <p className="text-muted-foreground">{submitError}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" size="lg" disabled={submitting} className="rounded-full bg-grad-primary px-6 shadow-soft h-12">
              {submitting ? (
                <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <><Send className="mr-1.5 h-4 w-4" /> Send interest note</>
              )}
            </Button>
            <Button asChild type="button" variant="ghost" className="rounded-full">
              <Link to={`/pets/${pet.id}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="text-sm font-medium">{label}{required && <span className="text-accent"> *</span>}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default Apply;
