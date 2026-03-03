import { Pet } from "../domain/pet";
import { updatePet } from "../infraestructure/petDatasource";

export async function updatePetUseCase(id: string, pet: Partial<Pet>) {

  if (!pet.name?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!pet.type?.trim()) {
    throw new Error("El tipo es obligatorio");
  }

  if (!pet.sex?.trim()) {
    throw new Error("El sexo es obligatorio");
  }

  if (!pet.age?.trim()) {
    throw new Error("La edad es obligatoria");
  }

  if (!pet.size?.trim()) {
    throw new Error("El tamaño es obligatorio");
  }

  if (!pet.breed?.trim()) {
    throw new Error("La raza es obligatoria");
  }

  if (!pet.health_info?.trim()) {
    throw new Error("La información de salud es obligatoria");
  }

  if (!pet.description?.trim()) {
    throw new Error("La descripción es obligatoria");
  }

  if (!pet.phone?.trim() || pet.phone.length !== 10) {
    throw new Error("El teléfono debe tener 10 dígitos");
  }

  if (!pet.location?.trim()) {
    throw new Error("La ubicación es obligatoria");
  }

  if (!pet.image_url) {
    throw new Error("La imagen es obligatoria");
  }

  const validTypes = ["perro", "gato"];
  const validSex = ["macho", "hembra"];
  const validSizes = ["pequeño", "mediano", "grande"];

  if (!validTypes.includes(pet.type.toLowerCase())) {
    throw new Error("Debe escribir correctamente el tipo: perro o gato");
  }

  if (!validSex.includes(pet.sex.toLowerCase())) {
    throw new Error("Debe escribir correctamente el sexo: macho o hembra");
  }

  if (!validSizes.includes(pet.size.toLowerCase())) {
    throw new Error("Debe escribir correctamente el tamaño: pequeño, mediano o grande");
  }

  const success = await updatePet(id, pet);

  if (!success) {
    throw new Error("No se pudo actualizar la mascota");
  }

  return true;
}