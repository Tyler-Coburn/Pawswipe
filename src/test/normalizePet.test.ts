import { describe, it, expect } from "vitest";
import { normalizePet, looksLikeNonPetRecord } from "@/lib/providers/normalizePet";

const rgRecord = {
  animalID: "12345",
  animalName: "Biscuit (Bonded with Gravy) - SF",
  animalSpecies: "Dog",
  animalGeneralAge: "Young",
  animalGeneralSizePotential: "Large",
  animalSex: "Male",
  animalLocationCitystate: "Burnaby, BC",
  animalOKWithDogs: "Yes",
  animalOKWithCats: "No",
  animalVaccinationsUpToDate: "Yes",
  animalAltered: "Yes",
  animalBreed: "Shepherd",
  animalMixedBreed: "Yes",
  animalAdoptionFee: "$450.00",
  orgName: "North Shore Rescue Society",
};

describe("normalizePet (RescueGroups shape)", () => {
  const pet = normalizePet(rgRecord, "rescuegroups");

  it("namespaces the id by source", () => {
    expect(pet.id).toBe("rescuegroups-12345");
    expect(pet.source).toBe("rescuegroups");
  });

  it("cleans internal rescue codes out of the name", () => {
    expect(pet.name).toBe("Biscuit");
  });

  it("coerces Yes/No string flags to booleans", () => {
    expect(pet.goodWithDogs).toBe(true);
    expect(pet.goodWithCats).toBe(false);
    expect(pet.vaccinated).toBe(true);
    expect(pet.spayedNeutered).toBe(true);
  });

  it("normalizes species, age, size, gender, and city", () => {
    expect(pet.species).toBe("dog");
    expect(pet.ageGroup).toBe("young");
    expect(pet.size).toBe("large");
    expect(pet.gender).toBe("male");
    expect(pet.locationCity).toBe("Burnaby");
  });

  it("parses adoption fee from a currency string", () => {
    expect(pet.adoptionFee).toBe(450);
  });

  it("marks breed as a mix when flagged", () => {
    expect(pet.breed).toBe("Shepherd mix");
  });

  it("always points back to an official source URL", () => {
    expect(pet.sourceUrl).toContain("rescuegroups.org");
  });

  it("uses an honest default shelter name (no implied partnership)", () => {
    const anon = normalizePet({ animalID: "1", animalName: "Mo" }, "rescuegroups");
    expect(anon.shelterName).toBe("Local shelter");
  });
});

describe("looksLikeNonPetRecord", () => {
  it("flags application/form records that leak into feeds", () => {
    expect(looksLikeNonPetRecord({ animalName: "Pre Approval Application" })).toBe(true);
    expect(looksLikeNonPetRecord({ animalName: "Adoption Form" })).toBe(true);
  });

  it("passes real animal names", () => {
    expect(looksLikeNonPetRecord({ animalName: "Biscuit" })).toBe(false);
  });
});
