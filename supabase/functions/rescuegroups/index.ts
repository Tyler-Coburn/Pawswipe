// Edge function: rescuegroups
// Server-side proxy to RescueGroups.org API v2.
//
// SECURITY NOTE: The original PawSwipe HTML prototype called RescueGroups
// directly from the browser with the API key embedded in client code.
// This edge function exists so the key (RESCUEGROUPS_API_KEY) never reaches
// the client. It is read from Deno.env and never logged.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const RG_URL = "https://api.rescuegroups.org/http/v2.json";

// Verified RescueGroups v2 publicSearch fields for animals.
const FIELDS = [
  "animalID", "animalName", "animalSpecies", "animalBreed", "animalMixedBreed",
  "animalSex", "animalGeneralAge", "animalGeneralSizePotential",
  "animalDescriptionPlain", "animalPictures", "animalThumbnailUrl",
  "animalAdoptionFee", "animalColor", "animalPattern",
  "animalOKWithKids", "animalOKWithDogs", "animalOKWithCats",
  "animalHousetrained", "animalSpecialneeds", "animalDeclawed",
  "animalLocationCitystate", "animalUpdatedDate",
  "animalVaccinationsUpToDate", "animalAltered", "animalActivityLevel",
  "animalStatus", "animalOrgID", "animalLocation",
];

interface SearchFilters {
  species?: string[];
  ageGroups?: string[];
  sizes?: string[];
  goodWithKids?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  limit?: number;
}

function buildFilters(f: SearchFilters) {
  const filters: any[] = [
    { fieldName: "animalStatus", operation: "equals", criteria: "Available" },
    // Vancouver / Lower Mainland focus — match BC, WA, or "Vancouver" city.
    {
      fieldName: "animalLocationCitystate",
      operation: "contains",
      criteria: "BC",
    },
  ];
  if (f.species?.length) {
    filters.push({
      fieldName: "animalSpecies",
      operation: "equals",
      criteria: f.species.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(","),
    });
  }
  if (f.goodWithKids) filters.push({ fieldName: "animalOKWithKids", operation: "equals", criteria: "Yes" });
  if (f.goodWithDogs) filters.push({ fieldName: "animalOKWithDogs", operation: "equals", criteria: "Yes" });
  if (f.goodWithCats) filters.push({ fieldName: "animalOKWithCats", operation: "equals", criteria: "Yes" });
  return filters;
}

async function rgSearch(filters: SearchFilters, apiKey: string) {
  const body = {
    apikey: apiKey,
    objectType: "animals",
    objectAction: "publicSearch",
    search: {
      resultStart: 0,
      resultLimit: filters.limit ?? 60,
      filters: buildFilters(filters),
      fields: FIELDS,
    },
  };
  const r = await fetch(RG_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`RescueGroups HTTP ${r.status}`);
  const json = await r.json();
  const hasError = json?.messages?.generalMessages?.some?.(
    (m: any) => m.messageCriticality === "error",
  );
  const data = json.data ?? {};
  const arr = Object.values(data) as Record<string, any>[];
  if (hasError && arr.length === 0) {
    throw new Error(JSON.stringify(json.messages));
  }
  return arr;
}


async function rgGetOne(id: string, apiKey: string) {
  const body = {
    apikey: apiKey,
    objectType: "animals",
    objectAction: "publicSearch",
    search: {
      resultStart: 0,
      resultLimit: 1,
      filters: [
        { fieldName: "animalID", operation: "equals", criteria: id },
      ],
      fields: FIELDS,
    },
  };
  const r = await fetch(RG_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`RescueGroups HTTP ${r.status}`);
  const json = await r.json();
  const data = json.data ?? {};
  const arr = Object.values(data) as Record<string, any>[];
  return arr[0];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const apiKey = Deno.env.get("RESCUEGROUPS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "RESCUEGROUPS_API_KEY not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (action === "status") {
      return new Response(
        JSON.stringify({ ok: true, configured: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }


    if (action === "get") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ ok: false, error: "id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const animal = await rgGetOne(id, apiKey);
      return new Response(JSON.stringify({ ok: true, animal }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // list
    let filters: SearchFilters = {};
    if (req.method === "POST") {
      try { filters = await req.json(); } catch { /* empty body fine */ }
    } else {
      const sp = url.searchParams;
      const get = (k: string) => sp.get(k)?.split(",").filter(Boolean);
      filters = {
        species: get("species"),
        ageGroups: get("ageGroups"),
        sizes: get("sizes"),
        goodWithKids: sp.get("goodWithKids") === "true",
        goodWithDogs: sp.get("goodWithDogs") === "true",
        goodWithCats: sp.get("goodWithCats") === "true",
        limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
      };
    }

    const animals = await rgSearch(filters, apiKey);
    return new Response(
      JSON.stringify({ ok: true, animals, syncedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("rescuegroups proxy error", (e as Error)?.message);
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error)?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
