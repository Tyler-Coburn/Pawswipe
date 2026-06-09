import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth/AuthContext";
import Index from "./pages/Index.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Discover from "./pages/Discover.tsx";
import PetDetail from "./pages/PetDetail.tsx";
import Matches from "./pages/Matches.tsx";
import Apply from "./pages/Apply.tsx";
import Shelters from "./pages/Shelters.tsx";
import ShelterDetail from "./pages/ShelterDetail.tsx";
import ShelterDashboard from "./pages/ShelterDashboard.tsx";
import LiveListings from "./pages/LiveListings.tsx";
import DataHealth from "./pages/DataHealth.tsx";
import Auth from "./pages/Auth.tsx";
import Profile from "./pages/Profile.tsx";
import About from "./pages/About.tsx";
import Status from "./pages/Status.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

