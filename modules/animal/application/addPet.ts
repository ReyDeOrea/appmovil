import { CreatePet, PetSize } from "../domain/pet";
import { SupabasePetRepository } from "../infraestructure/petDatasource";

const repository = new SupabasePetRepository();

export async function addPetUseCase(pet: CreatePet) {

  if (!pet.name || !pet.age || !pet.breed || !pet.health_info || !pet.description || !pet.phone || !pet.location) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (pet.type !== "perro" && pet.type !== "gato") {
    throw new Error("Tipo de animal inválido");
  }
  
  if (pet.sex !== "macho" && pet.sex !== "hembra") {
    throw new Error("Sexo inválido");
  }

if (!(Object.values(PetSize) as PetSize[]).includes(pet.size)) {
  throw new Error("Tamaño inválido");
}

  if (!pet.phone || pet.phone.length !== 10) {
    throw new Error("El teléfono debe tener 10 dígitos");
  }

  if (!pet.image_url) {
    throw new Error("Debes seleccionar 5 imágenes");
  }
  const images = JSON.parse(pet.image_url);
  if (!Array.isArray(images) || images.length !== 5) {
    throw new Error("Debes seleccionar exactamente 5 imágenes");
  }

  return await repository.addPet(pet);
}