import { Pet } from "./pet";

export interface PetRepository {
    getPets(): Promise<Pet[]>;
    addPet(pet: Pet): Promise<void>;
}
