import { getPeId } from "../infraestructure/petDatasource";

export async function getPetByIdUseCase(id: string) {
  if (!id) {
    throw new Error("ID inválido");
  }
  return await getPeId(id);
}