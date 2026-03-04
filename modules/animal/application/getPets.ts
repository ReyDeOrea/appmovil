import { Pet } from "../domain/pet";
import { getPets } from "../infraestructure/petDatasource";

export async function getPetsUseCase(): Promise<Pet[]> {
  return await getPets();
}