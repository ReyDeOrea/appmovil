import { Pet } from "../domain/pet";
import { addPet } from "../infraestructure/petDatasource";

export async function addPetUseCase(pet: Pet) {

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
  const validTypes = ["perro", "gato"];
  const validSex = ["macho", "hembra"];
  const validSizes = ["pequeño", "mediano", "grande"];

  if (!validTypes.includes(pet.type)) {
    throw new Error("Tipo inválido. Debe ser perro o gato");
  }

  if (!validSex.includes(pet.sex)) {
    throw new Error("Sexo inválido. Debe ser macho o hembra");
  }

  if (!validSizes.includes(pet.size)) {
    throw new Error("Tamaño inválido. Debe ser pequeño, mediano o grande");
  }

  return await addPet(pet);
}