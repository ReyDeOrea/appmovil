import { SupabasePetRepository } from "../infraestructure/petDatasource";

const repository = new SupabasePetRepository();

export async function deletePetUseCase(id: string) {
  if (!id) {
    throw new Error("ID inválido");
  }
  const success = await repository.deletePet(id);
  if (!success) {
    throw new Error("No se pudo eliminar la mascota");
  }
  return true;
}