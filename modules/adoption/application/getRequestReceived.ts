import { AdoptionForm } from "../domain/adoption";
import { AdoptionRepository } from "../infraestructure/adoptionDataSource";

export class GetRequestsForMyPets {
  constructor(private repository: AdoptionRepository) {}

  async execute(ownerId: string): Promise<AdoptionForm[]> {
    if (!ownerId) return [];
    const data = await this.repository.getRequestsForOwner(ownerId); // <-- aquí sí usamos owner_id
    return data || [];
  }
}