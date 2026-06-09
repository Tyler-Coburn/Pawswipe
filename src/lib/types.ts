export type Species = "dog" | "cat" | "rabbit" | "small";
export type Size = "small" | "medium" | "large";

export type DataSource = "mock" | "rescuegroups" | "petfinder" | "shelter-direct";

export interface SourceMeta {
  source: DataSource;
  sourcePetId?: string;
  sourceShelterId?: string;
  sourceUrl?: string;
  lastSyncedAt: string; // ISO
  lastUpdatedAt: string; // ISO
  isAvailable: boolean;
}
export type AgeGroup = "puppy" | "young" | "adult" | "senior";
export type EnergyLevel = "low" | "medium" | "high";
export type PetStatus = "available" | "pending" | "on-hold" | "adopted";

export type LowerMainlandCity =
  | "Vancouver"
  | "North Vancouver"
  | "Burnaby"
  | "Richmond"
  | "Surrey"
  | "Coquitlam"
  | "New Westminster"
  | "Langley"
  | "Delta"
  | "Mission";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string; // e.g. "2 years"
  ageGroup: AgeGroup;
  gender: "male" | "female";
  size: Size;
  weightKg: number;
  energyLevel: EnergyLevel;
  locationCity: LowerMainlandCity;
  distanceKm: number;
  shelterId: string;
  shelterName: string;
  images: string[]; // gradient ids or urls
  bio: string;
  idealHome: string;
  personalityTags: string[];
  goodWithDogs: boolean;
  goodWithCats: boolean;
  goodWithKids: boolean;
  medicalNotes: string;
  vaccinated: boolean;
  spayedNeutered: boolean;
  meetAndGreet: string;
  adoptionFee: number;
  status: PetStatus;
  lastUpdated: string; // ISO
  createdAt: string;
  // Source metadata — see SourceMeta. Optional for legacy mock entries; the
  // mock provider fills in defaults so consumers can rely on these fields.
  source?: DataSource;
  sourcePetId?: string;
  sourceUrl?: string;
  lastSyncedAt?: string;
  lastUpdatedAt?: string;
  isAvailable?: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  city: LowerMainlandCity;
  verified: boolean;
  description: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  adoptionProcess: string[];
  animalTypes: Species[];
  responseTime: string;
  petsAvailable: number;
  accent: string; // tailwind class fragment
  createdAt: string;
  source?: DataSource;
  sourceShelterId?: string;
  sourceUrl?: string;
  lastSyncedAt?: string;
}

export interface AdopterPreferences {
  city?: LowerMainlandCity;
  species: Species[];
  sizes: Size[];
  ageGroups: AgeGroup[];
  energy: EnergyLevel[];
  hasOtherPets: "yes-dog" | "yes-cat" | "yes-both" | "no" | "";
  hasKids: boolean;
  housing: "apartment" | "townhouse" | "house" | "";
  travelKm: number;
  timeline: "now" | "soon" | "browsing" | "";
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  shelterId: string;
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  housingType: string;
  rentOrOwn: "rent" | "own" | "";
  landlordPermission: boolean;
  currentPets: string;
  childrenInHome: string;
  petExperience: string;
  reason: string;
  preferredContact: "email" | "phone" | "";
  availability: string;
  consent: boolean;
  status: "new" | "reviewing" | "contacted" | "meet-greet" | "approved" | "not-selected";
  createdAt: string;
}
