import { CreatePet } from "../domain/pet";
import { addPet } from "../infraestructure/petDatasource";

export async function addPetUseCase(pet: CreatePet) {

  if (!pet.name.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!pet.type) {
    throw new Error("El tipo es obligatorio");
  }

  if (!pet.sex) {
    throw new Error("El sexo es obligatorio");
  }

  if (!pet.size) {
    throw new Error("El tamaño es obligatorio");
  }

  if (!pet.image_url) {
    throw new Error("La imagen es obligatoria");
  }

  if (!pet.phone || pet.phone.length !== 10) {
    throw new Error("El teléfono debe tener 10 dígitos");
  }

  return await addPet(pet);
}