import { describe, it, expect, afterEach, vi } from "vitest";

// The provider registry imports the Supabase client, which requires env vars
// at module load — stub it so these unit tests don't need a configured .env.
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

import { getDataMode, getAdoptionProvider, listProviders } from "@/lib/providers/adoptionProvider";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getDataMode", () => {
  it("accepts mock so local dev works without API keys", () => {
    vi.stubEnv("VITE_DATA_MODE", "mock");
    expect(getDataMode()).toBe("mock");
  });

  it("accepts rescuegroups and petfinder", () => {
    vi.stubEnv("VITE_DATA_MODE", "rescuegroups");
    expect(getDataMode()).toBe("rescuegroups");
    vi.stubEnv("VITE_DATA_MODE", "petfinder");
    expect(getDataMode()).toBe("petfinder");
  });

  it("is case-insensitive", () => {
    vi.stubEnv("VITE_DATA_MODE", "MOCK");
    expect(getDataMode()).toBe("mock");
  });

  it("defaults to rescuegroups when unset or invalid", () => {
    vi.stubEnv("VITE_DATA_MODE", "");
    expect(getDataMode()).toBe("rescuegroups");
    vi.stubEnv("VITE_DATA_MODE", "not-a-provider");
    expect(getDataMode()).toBe("rescuegroups");
  });
});

describe("provider registry", () => {
  it("resolves the active provider from the data mode", () => {
    vi.stubEnv("VITE_DATA_MODE", "mock");
    expect(getAdoptionProvider().id).toBe("mock");
  });

  it("exposes all three providers", () => {
    expect(listProviders().map((p) => p.id)).toEqual(["mock", "rescuegroups", "petfinder"]);
  });
});
