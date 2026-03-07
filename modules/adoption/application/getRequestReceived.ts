import { AdoptionForm } from "../domain/adoption";
import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class GetPetRequestsReceived {

  constructor(private repository: AdoptionRequestRepository) {}

  async execute(petId: string): Promise<AdoptionForm[]> {
    return await this.repository.getRequestsByPet(petId);
  }
}