import { AdoptionForm } from "../domain/adoption";
import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class GetUserRequests {

  constructor(private repository: AdoptionRequestRepository) {}

  async execute(userId: string): Promise<AdoptionForm[]> {
    return await this.repository.getRequestsByUser(userId);
  }
}