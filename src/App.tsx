import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { PawPrint } from "lucide-react";

// Landing is the first paint — keep it in the main chunk. Every other route is
// lazy-loaded so the initial bundle stays small (fixes the >500 kB warning).
import Index from "./pages/Index.tsx";
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const Discover = lazy(() => import("./pages/Discover.tsx"));
const PetDetail = lazy(() => import("./pages/PetDetail.tsx"));
const Matches = lazy(() => import("./pages/Matches.tsx"));
const Apply = lazy(() => import("./pages/Apply.tsx"));
const Shelters = lazy(() => import("./pages/Shelters.tsx"));
const ShelterDetail = lazy(() => import("./pages/ShelterDetail.tsx"));
const ShelterDashboard = lazy(() => import("./pages/ShelterDashboard.tsx"));
const LiveListings = lazy(() => import("./pages/LiveListings.tsx"));
const DataHealth = lazy(() => import("./pages/DataHealth.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Status = lazy(() => import("./pages/Status.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center text-muted-foreground">
      <PawPrint className="h-8 w-8 animate-pulse text-primary" aria-label="Loading" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/pets/:id" element={<PetDetail />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/apply/:petId" element={<Apply />} />
              <Route path="/shelters" element={<Shelters />} />
              <Route path="/shelters/:id" element={<ShelterDetail />} />
              <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
              <Route path="/live-listings" element={<LiveListings />} />
              <Route path="/data-health" element={<DataHealth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/status" element={<Status />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
