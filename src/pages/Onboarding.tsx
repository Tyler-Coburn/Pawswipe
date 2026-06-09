import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePreferences, defaultPrefs } from "@/hooks/usePreferences";
import { cn } from "@/lib/utils";
import type { AdopterPreferences, LowerMainlandCity, Species, Size, AgeGroup, EnergyLevel } from "@/lib/types";
import { toast } from "sonner";

const cities: LowerMainlandCity[] = ["Vancouver", "North Vancouver", "Burnaby", "Richmond", "Surrey", "Coquitlam", "New Westminster", "Langley", "Delta", "Mission"];

type Step = {
  key: string;
  title: string;
  subtitle?: string;
  render: (p: AdopterPreferences, set: (patch: Partial<AdopterPreferences>) => void) => React.ReactNode;
};

const Onboarding = () => {
  const { prefs, save } = usePreferences();
  const [local, setLocal] = useState<AdopterPreferences>({ ...defaultPrefs, ...prefs });
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const set = (patch: Partial<AdopterPreferences>) => setLocal((p) => ({ ...p, ...patch }));

  const steps: Step[] = [
    {
      key: "city",
      title: "Where are you adopting from?",
      subtitle: "We'll prioritize shelters near you.",
      render: (p, s) => (
        <ChipGrid
          options={cities.map((c) => ({ value: c, label: c }))}
          selected={p.city ? [p.city] : []}
          onToggle={(v) => s({ city: v as LowerMainlandCity })}
          single
        />
      ),
    },
    {
      key: "species",
      title: "Which animals are you open to?",
      subtitle: "Pick one or more.",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "dog", label: "Dogs" },
            { value: "cat", label: "Cats" },
            { value: "rabbit", label: "Rabbits" },
            { value: "small", label: "Small animals" },
          ]}
          selected={p.species}
          onToggle={(v) =>
            s({
              species: p.species.includes(v as Species)
                ? p.species.filter((x) => x !== v)
                : [...p.species, v as Species],
            })
          }
        />
      ),
    },
    {
      key: "sizes",
      title: "What size pet fits your home?",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ]}
          selected={p.sizes}
          onToggle={(v) =>
            s({ sizes: p.sizes.includes(v as Size) ? p.sizes.filter((x) => x !== v) : [...p.sizes, v as Size] })
          }
        />
      ),
    },
    {
      key: "age",
      title: "Which age range are you open to?",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "puppy", label: "Puppy / Kitten" },
            { value: "young", label: "Young" },
            { value: "adult", label: "Adult" },
            { value: "senior", label: "Senior" },
          ]}
          selected={p.ageGroups}
          onToggle={(v) =>
            s({
              ageGroups: p.ageGroups.includes(v as AgeGroup)
                ? p.ageGroups.filter((x) => x !== v)
                : [...p.ageGroups, v as AgeGroup],
            })
          }
        />
      ),
    },
    {
      key: "energy",
      title: "What energy level fits your lifestyle?",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "low", label: "Low — slow walks, lots of naps" },
            { value: "medium", label: "Medium — daily walks, weekend hikes" },
            { value: "high", label: "High — runs, training, adventures" },
          ]}
          selected={p.energy}
          onToggle={(v) =>
            s({
              energy: p.energy.includes(v as EnergyLevel)
                ? p.energy.filter((x) => x !== v)
                : [...p.energy, v as EnergyLevel],
            })
          }
        />
      ),
    },
    {
      key: "housing",
      title: "What kind of home do you have?",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "apartment", label: "Apartment / Condo" },
            { value: "townhouse", label: "Townhouse" },
            { value: "house", label: "House" },
          ]}
          selected={p.housing ? [p.housing] : []}
          onToggle={(v) => s({ housing: v as AdopterPreferences["housing"] })}
          single
        />
      ),
    },
    {
      key: "household",
      title: "Tell us about your household.",
      render: (p, s) => (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">Do you have other pets?</p>
            <ChipGrid
              options={[
                { value: "no", label: "No" },
                { value: "yes-dog", label: "Dog(s)" },
                { value: "yes-cat", label: "Cat(s)" },
                { value: "yes-both", label: "Dogs & cats" },
              ]}
              selected={p.hasOtherPets ? [p.hasOtherPets] : []}
              onToggle={(v) => s({ hasOtherPets: v as AdopterPreferences["hasOtherPets"] })}
              single
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Are there children at home?</p>
            <ChipGrid
              options={[{ value: "no", label: "No kids" }, { value: "yes", label: "Yes, kids at home" }]}
              selected={[p.hasKids ? "yes" : "no"]}
              onToggle={(v) => s({ hasKids: v === "yes" })}
              single
            />
          </div>
        </div>
      ),
    },
    {
      key: "travel",
      title: "How far are you willing to travel?",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "10", label: "Within 10 km" },
            { value: "25", label: "Within 25 km" },
            { value: "50", label: "Within 50 km" },
            { value: "100", label: "Across the Lower Mainland" },
          ]}
          selected={[String(p.travelKm)]}
          onToggle={(v) => s({ travelKm: Number(v) })}
          single
        />
      ),
    },
    {
      key: "timeline",
      title: "What's your timeline?",
      render: (p, s) => (
        <ChipGrid
          options={[
            { value: "now", label: "Ready to adopt now" },
            { value: "soon", label: "Within the next few months" },
            { value: "browsing", label: "Just browsing for now" },
          ]}
          selected={p.timeline ? [p.timeline] : []}
          onToggle={(v) => s({ timeline: v as AdopterPreferences["timeline"] })}
          single
        />
      ),
    },
  ];

  const total = steps.length;
  const current = steps[step];
  const pct = ((step + 1) / total) * 100;

  const goNext = () => {
    if (step < total - 1) setStep(step + 1);
    else {
      save(local);
      toast.success("Preferences saved", { description: "Your discover feed is ready." });
      navigate("/discover");
    }
  };
  const goBack = () => (step === 0 ? navigate("/") : setStep(step - 1));

  return (
    <AppShell hideFooter>
      <div className="container max-w-2xl py-10 md:py-16">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Adoption preferences
          </span>
          <span>Step {step + 1} of {total}</span>
        </div>
        <Progress value={pct} className="mt-2 h-1.5" />

        <div className="mt-10 animate-fade-up">
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{current.title}</h1>
          {current.subtitle && <p className="mt-2 text-muted-foreground">{current.subtitle}</p>}
          <div className="mt-8">{current.render(local, set)}</div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} className="rounded-full">
            <ArrowLeft className="mr-1 h-4 w-4" /> {step === 0 ? "Home" : "Back"}
          </Button>
          <div className="flex items-center gap-3">
            <Link to="/discover" className="text-sm text-muted-foreground hover:text-foreground">Skip</Link>
            <Button onClick={goNext} className="rounded-full bg-grad-primary px-6 shadow-soft">
              {step === total - 1 ? "Save & discover" : "Continue"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

interface ChipGridProps {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  single?: boolean;
}
function ChipGrid({ options, selected, onToggle, single }: ChipGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const isOn = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={isOn}
            onClick={() => onToggle(o.value)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all",
              isOn
                ? "border-primary bg-primary-soft text-primary shadow-soft"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted",
            )}
          >
            <span className="text-sm font-medium">{o.label}</span>
            {isOn && <Check className="h-4 w-4" />}
          </button>
        );
      })}
    </div>
  );
}

export default Onboarding;
