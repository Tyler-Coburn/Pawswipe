import { describe, it, expect, afterEach, vi } from "vitest";
import { getDataMode, getAdoptionProvider, listProviders } from "@/lib/providers/adoptionProvider";
// Note: @/integrations/supabase/client is mocked globally in src/test/setup.ts.

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

  it("defaults to rescuegroups when empty or invalid", () => {
    vi.stubEnv("VITE_DATA_MODE", "");
    expect(getDataMode()).toBe("rescuegroups");
    vi.stubEnv("VITE_DATA_MODE", "not-a-provider");
    expect(getDataMode()).toBe("rescuegroups");
  });

  it("defaults to rescuegroups when the env var is entirely undefined", () => {
    // Guards the optional-chain path in getDataMode: a production deploy with
    // VITE_DATA_MODE unset must not throw. stubEnv(undefined) deletes the key.
    vi.stubEnv("VITE_DATA_MODE", undefined as unknown as string);
    expect(() => getDataMode()).not.toThrow();
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
