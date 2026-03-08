import { Pet } from "../domain/pet";

export const chunkPets = (pets: Pet[], size: number): Pet[][] => {
  const chunks: Pet[][] = [];
  for (let i = 0; i < pets.length; i += size) {
    chunks.push(pets.slice(i, i + size));
  }
  return chunks;
};