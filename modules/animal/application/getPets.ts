import { Pet } from "../domain/pet";
import { SupabasePetRepository } from "../infraestructure/petDatasource";

export async function getPetsUseCase(): Promise<Pet[]> {
  const repository = new SupabasePetRepository();
  return await repository.getPets();
}