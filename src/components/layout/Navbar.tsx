import { Link, NavLink, useLocation } from "react-router-dom";
import { PawPrint, Heart, Compass, Building2, LayoutDashboard, Menu, X, Globe, Activity, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";

const links = [
  { to: "/discover", label: "Discover", Icon: Compass },
  { to: "/matches", label: "Matches", Icon: Heart },
  { to: "/shelters", label: "Shelters", Icon: Building2 },
  { to: "/live-listings", label: "Live", Icon: Globe },
  { to: "/shelter-dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/data-health", label: "Health", Icon: Activity },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const onLanding = pathname === "/";

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur",
        onLanding ? "bg-background/70" : "bg-background/85",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-grad-primary text-primary-foreground shadow-soft">
            <PawPrint className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">PawSwipe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/profile"><User className="mr-1 h-4 w-4" /> Profile</Link>
              </Button>
              <Button variant="outline" size="sm" className="rounded-full" onClick={handleSignOut}>
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/auth"><LogIn className="mr-1 h-4 w-4" /> Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-grad-primary shadow-soft hover:opacity-95">
                <Link to="/discover">Start swiping</Link>
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Open menu"
          className="md:hidden rounded-full p-2 hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95">
          <div className="container py-3 flex flex-col gap-1">
            {links.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-primary-soft text-primary" : "hover:bg-muted",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/profile" onClick={() => setOpen(false)}><User className="mr-1 h-4 w-4" /> Profile</Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1" onClick={handleSignOut}>
                    <LogOut className="mr-1 h-4 w-4" /> Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/auth" onClick={() => setOpen(false)}><LogIn className="mr-1 h-4 w-4" /> Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-grad-primary">
                    <Link to="/discover" onClick={() => setOpen(false)}>Start swiping</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

