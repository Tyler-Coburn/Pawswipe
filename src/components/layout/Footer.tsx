import { Link } from "react-router-dom";
import { PawPrint, MapPin, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-grad-primary text-primary-foreground">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">PawSwipe</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            An independent adoption discovery platform helping people across Vancouver and the Lower Mainland find pets listed by local shelters and rescues. We do not sell pets.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Built for the Lower Mainland, BC
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-semibold mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/discover" className="hover:text-foreground">Discover pets</Link></li>
            <li><Link to="/shelters" className="hover:text-foreground">Local shelters</Link></li>
            <li><Link to="/matches" className="hover:text-foreground">Your matches</Link></li>
            <li><Link to="/onboarding" className="hover:text-foreground">Adoption preferences</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-sm font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/status" className="hover:text-foreground">Platform status</Link></li>
            <li><Link to="/data-health" className="hover:text-foreground">Data health</Link></li>
            <li><Link to="/live-listings" className="hover:text-foreground">Live listings</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-sm font-semibold mb-3">For shelters</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shelter-dashboard" className="hover:text-foreground">Shelter dashboard</Link></li>
            <li><span>Adoption-first policy</span></li>
            <li><span>No pet sales, ever</span></li>
            <li><span>Shelters make the final call</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PawSwipe. Adoption decisions belong to shelters.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3 text-accent" /> Responsible adoption</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Privacy-first</span>
            <span>Made with care in Vancouver, BC.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
