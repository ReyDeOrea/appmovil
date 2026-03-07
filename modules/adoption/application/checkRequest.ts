import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class CheckRequestExists {

  constructor(private repository: AdoptionRequestRepository) {}

  async execute(userId: string, petId: string): Promise<boolean> {
    return await this.repository.requestExists(userId, petId);
  }
}