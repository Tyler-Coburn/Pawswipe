import { describe, it, expect, afterEach, vi } from "vitest";

// The Lovable integration initializes its client at import time; stub it so the
// adapter can be imported in a test environment. (Supabase client is stubbed
// globally in src/test/setup.ts.)
vi.mock("@/integrations/lovable", () => ({
  lovable: { auth: { signInWithOAuth: vi.fn() } },
}));

import { oauthMode } from "@/lib/auth/oauthProvider";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("oauthMode", () => {
  it("defaults to lovable when unset or empty", () => {
    vi.stubEnv("VITE_OAUTH_PROVIDER", "");
    expect(oauthMode()).toBe("lovable");
  });

  it("selects supabase when explicitly set", () => {
    vi.stubEnv("VITE_OAUTH_PROVIDER", "supabase");
    expect(oauthMode()).toBe("supabase");
  });

  it("is case-insensitive and falls back to lovable for unknown values", () => {
    vi.stubEnv("VITE_OAUTH_PROVIDER", "SUPABASE");
    expect(oauthMode()).toBe("supabase");
    vi.stubEnv("VITE_OAUTH_PROVIDER", "not-a-provider");
    expect(oauthMode()).toBe("lovable");
  });
});
