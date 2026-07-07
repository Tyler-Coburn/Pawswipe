import "@testing-library/jest-dom";
import { vi } from "vitest";

// The Supabase client reads env vars at module load and throws if they're
// unset. Stub it once here (this setup file is loaded before every test via
// vitest.config.ts) so any test that transitively imports it doesn't need a
// configured .env.
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
