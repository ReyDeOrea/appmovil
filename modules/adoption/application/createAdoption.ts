import { AdoptionForm } from "../domain/adoption";
import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class CreateAdoptionRequest {

  constructor(private repository: AdoptionRequestRepository) {}

  async execute(
    request: Omit<AdoptionForm, "id" | "estado">
  ): Promise<AdoptionForm | null> {

    const exists = await this.repository.requestExists(
      request.user_id,
      request.pet_id
    );

    if (exists) {
      throw new Error("Ya enviaste una solicitud para esta mascota");
    }

    return this.repository.createRequest(request);
  }
}