import { CreatePet, Pet } from "./pet";
export interface PetRepository {
  getPets(): Promise<Pet[]>;
  getPetById(id: string): Promise<Pet | null>;
 addPet(pet: CreatePet): Promise<Pet | null>;
  updatePet(id: string, pet: Partial<Pet>): Promise<boolean>;
  deletePet(id: string): Promise<boolean>;
  adoptPet(id: string): Promise<boolean>;
}

