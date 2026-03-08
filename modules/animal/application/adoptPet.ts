import { adoptPet, getPeId } from "../infraestructure/petDatasource";

export async function adoptPetUseCase(id: string): Promise<boolean> {

  if (!id || id.trim() === "") {
    throw new Error("ID inválido");
  }

  const pet = await getPeId(id);

  if (!pet) {
    throw new Error("La mascota no existe");
  }

  if (pet.adopted) {
    throw new Error("Esta mascota ya fue adoptada");
  }

  const success = await adoptPet(id);

  if (!success) {
    throw new Error("No se pudo adoptar la mascota");
  }

  return true;
}