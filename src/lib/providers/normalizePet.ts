import type { Pet, DataSource, Species, AgeGroup, Size, EnergyLevel, LowerMainlandCity } from "@/lib/types";

/**
 * Normalize an external pet record (RescueGroups / Petfinder / mock) into the
 * PawSwipe `Pet` shape. RescueGroups returns string flags like "Yes"/"No";
 * we coerce them here so the rest of the app can rely on booleans.
 */
export function normalizePet(raw: Record<string, any>, source: DataSource): Pet {
  const now = new Date().toISOString();

  // RescueGroups vs generic field aliases
  const rgId = raw.animalID ?? raw.id;
  const rawName = raw.animalName ?? raw.name ?? "Unnamed";
  const name = cleanName(rawName);
  const speciesRaw = raw.animalSpecies ?? raw.species;
  const species = normalizeSpecies(speciesRaw);
  const ageRaw = raw.animalGeneralAge ?? raw.age;
  const ageGroup = normalizeAge(ageRaw);
  const sizeRaw = raw.animalGeneralSizePotential ?? raw.size;
  const size = normalizeSize(sizeRaw);
  const sex = String(raw.animalSex ?? raw.gender ?? "").toLowerCase();
  const cityState = String(raw.animalLocationCitystate ?? raw.locationCity ?? "");
  const locationCity = parseCity(cityState) ?? (raw.locationCity as LowerMainlandCity) ?? "Vancouver";

  const description = stripHtml(raw.animalDescriptionPlain ?? raw.animalDescription ?? raw.bio ?? raw.description ?? "");
  const images = extractImages(raw);
  const tags = buildTags(raw);

  const sourcePetId = String(rgId ?? raw.sourcePetId ?? cryptoId());
  const sourceUrl = raw.sourceUrl
    ?? raw.orgUrl
    ?? (source === "rescuegroups" ? `https://rescuegroups.org/animals/detail?animalID=${sourcePetId}` : undefined);

  const lastUpdatedIso = parseRgDate(raw.animalUpdatedDate) ?? raw.lastUpdated ?? raw.lastUpdatedAt ?? now;
  const orgId = raw.animalOrgID ?? raw.orgID ?? raw.shelterId ?? "unknown";

  return {
    id: `${source}-${sourcePetId}`,
    name,
    species,
    breed: buildBreed(raw),
    age: ageRaw ?? "Unknown",
    ageGroup,
    gender: sex.startsWith("m") ? "male" : "female",
    size,
    weightKg: Number(raw.weightKg ?? 0),
    energyLevel: normalizeEnergy(raw.animalActivityLevel) ?? (raw.energyLevel as EnergyLevel) ?? "medium",
    locationCity,
    distanceKm: Number(raw.distanceKm ?? 0),
    shelterId: `${source}-org-${orgId}`,
    shelterName: raw.orgName ?? raw.shelterName ?? "Partner shelter",
    images: images.length ? images : ["g1"],
    bio: description,
    idealHome: raw.idealHome ?? "",
    personalityTags: tags,
    goodWithDogs: yesNo(raw.animalOKWithDogs ?? raw.animalGoodWithDogs ?? raw.goodWithDogs),
    goodWithCats: yesNo(raw.animalOKWithCats ?? raw.animalGoodWithCats ?? raw.goodWithCats),
    goodWithKids: yesNo(raw.animalOKWithKids ?? raw.animalGoodWithKids ?? raw.goodWithKids),
    medicalNotes: combineNotes(raw),
    vaccinated: yesNo(raw.animalVaccinationsUpToDate ?? raw.vaccinated),
    spayedNeutered: yesNo(raw.animalAltered ?? raw.spayedNeutered),
    meetAndGreet: raw.meetAndGreet ?? "Contact the shelter to arrange a visit.",
    adoptionFee: Number(String(raw.animalAdoptionFee ?? raw.adoptionFee ?? "0").replace(/[^0-9.]/g, "")) || 0,
    status: "available",
    lastUpdated: lastUpdatedIso,
    createdAt: raw.createdAt ?? lastUpdatedIso,
    source,
    sourcePetId,
    sourceUrl,
    lastSyncedAt: now,
    lastUpdatedAt: lastUpdatedIso,
    isAvailable: true,
  };
}

// ---------- helpers ----------

function stripHtml(s: string) {
  return String(s ?? "")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    // add space when a lowercase letter is immediately followed by an uppercase letter (e.g. "RidgeHere" -> "Ridge Here")
    .replace(/([a-z])([A-Z])/g, "$1. $2")
    // add space after a colon if missing ("me:Breed" -> "me: Breed")
    .replace(/:(\S)/g, ": $1")
    // tidy whitespace
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;!?])/g, "$1")
    .trim();
}

/** Strip internal rescue codes / tags from RescueGroups names. */
function cleanName(n: string): string {
  let out = String(n ?? "").trim();
  // Remove parenthetical tags like "(Local)", "(SF)", "(Bonded with X)"
  out = out.replace(/\s*\([^)]*\)\s*/g, " ");
  // Remove trailing all-caps codes like "- SF", "- SV", " SF", " SV"
  out = out.replace(/\s+[-–]\s*[A-Z]{2,5}\b/g, "");
  out = out.replace(/\s+[A-Z]{2,5}\b\s*$/g, "");
  // Drop duplicate whitespace
  out = out.replace(/\s+/g, " ").trim();
  return out || "Unnamed";
}

/** Heuristic: a record like "Pre Approval Application" is not an animal. */
export function looksLikeNonPetRecord(raw: Record<string, any>): boolean {
  const n = String(raw.animalName ?? raw.name ?? "").toLowerCase();
  if (!n) return false;
  return /\b(application|pre[-\s]?approval|adoption form|surrender|volunteer|donation)\b/.test(n);
}

function yesNo(v: any): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").toLowerCase().trim();
  return s === "yes" || s === "true" || s === "1";
}

function normalizeSpecies(s: any): Species {
  const v = String(s ?? "").toLowerCase();
  if (v.includes("dog")) return "dog";
  if (v.includes("cat")) return "cat";
  if (v.includes("rabbit")) return "rabbit";
  return "small";
}

function normalizeAge(s: any): AgeGroup {
  const v = String(s ?? "").toLowerCase();
  if (v.includes("baby") || v.includes("pup") || v.includes("kit")) return "puppy";
  if (v.includes("young")) return "young";
  if (v.includes("senior")) return "senior";
  return "adult";
}

function normalizeSize(s: any): Size {
  const v = String(s ?? "").toLowerCase();
  if (v.includes("small")) return "small";
  if (v.includes("large") || v.includes("xl") || v.includes("extra")) return "large";
  return "medium";
}

function normalizeEnergy(s: any): EnergyLevel | undefined {
  const v = String(s ?? "").toLowerCase();
  if (!v) return undefined;
  if (v.includes("low") || v.includes("couch")) return "low";
  if (v.includes("high") || v.includes("very active")) return "high";
  return "medium";
}

function buildBreed(raw: Record<string, any>) {
  if (raw.breed) return raw.breed;
  const b = raw.animalBreed ?? "Mixed";
  const isMix = raw.animalMixedBreed === "Yes" || raw.animalMix === "Yes";
  return isMix ? `${b} mix` : b;
}

function buildTags(raw: Record<string, any>): string[] {
  const out: string[] = [];
  if (raw.animalColor) out.push(raw.animalColor);
  if (raw.animalPattern) out.push(raw.animalPattern);
  if (yesNo(raw.animalHousetrained ?? raw.animalHousebroken)) out.push("Housetrained");
  if (raw.animalActivityLevel) out.push(raw.animalActivityLevel);
  return Array.from(new Set(out)).slice(0, 5);
}

function combineNotes(raw: Record<string, any>) {
  const bits: string[] = [];
  if (raw.animalSpecialneeds && raw.animalSpecialneeds !== "No") bits.push(`Special needs: ${stripHtml(String(raw.animalSpecialneeds))}`);
  if (raw.animalDeclawed && raw.animalDeclawed !== "No" && raw.animalDeclawed !== "") bits.push(`Declawed: ${raw.animalDeclawed}`);
  if (raw.medicalNotes) bits.push(stripHtml(String(raw.medicalNotes)));
  return bits.join(" · ");
}

function extractImages(raw: Record<string, any>): string[] {
  const out: string[] = [];
  if (typeof raw.animalPrimaryPhotoUrl === "string" && raw.animalPrimaryPhotoUrl) out.push(raw.animalPrimaryPhotoUrl);
  const pics = raw.animalPictures;
  if (Array.isArray(pics)) {
    for (const p of pics) {
      const u = typeof p === "string" ? p : p?.urlSecureFullsize ?? p?.urlFullsize ?? p?.url ?? p?.urlSecure;
      if (u && !out.includes(u)) out.push(u);
    }
  }
  if (typeof raw.animalThumbnailUrl === "string" && raw.animalThumbnailUrl && !out.length) out.push(raw.animalThumbnailUrl);
  if (Array.isArray(raw.images)) for (const u of raw.images) if (u && !out.includes(u)) out.push(u);
  return out;
}

function parseCity(s: string): LowerMainlandCity | undefined {
  const lower = s.toLowerCase();
  const cities: LowerMainlandCity[] = [
    "Vancouver", "North Vancouver", "Burnaby", "Richmond", "Surrey",
    "Coquitlam", "New Westminster", "Langley", "Delta", "Mission",
  ];
  for (const c of cities) if (lower.includes(c.toLowerCase())) return c;
  return undefined;
}

function parseRgDate(s: any): string | undefined {
  if (!s) return undefined;
  const d = new Date(String(s).replace(" ", "T"));
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}
