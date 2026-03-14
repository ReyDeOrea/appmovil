import { Pet } from "../domain/pet";
import { SupabasePetRepository } from "../infraestructure/petDatasource";

const repository = new SupabasePetRepository();

export async function updatePetUseCase(id: string, pet: Partial<Pet>) {

  if (!pet.name || !pet.age || !pet.breed || !pet.health_info || !pet.description || !pet.phone || !pet.location) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (!pet.phone?.trim() || pet.phone.length !== 10) {
    throw new Error("El teléfono debe tener 10 dígitos");
  }

  if (!pet.image_url) {
    throw new Error("Debes seleccionar 5 imágenes");
  }
  const images = JSON.parse(pet.image_url);
  if (!Array.isArray(images) || images.length !== 5) {
    throw new Error("Debes seleccionar exactamente 5 imágenes");
  }

  const success = await repository.updatePet(id, pet);

  if (!success) {
    throw new Error("No se pudo actualizar la mascota");
  }

  return true;
}