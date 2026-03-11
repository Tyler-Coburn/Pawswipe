export interface Pet {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: 'Male' | 'Female';
  traits: string[];
  description: string;
  shelterName: string;
  shelterLocation: string;
  imageUrl: string;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  adoptionUrl: string;
}
