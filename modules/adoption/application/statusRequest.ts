import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class RequestStatus {

  constructor(private repository: AdoptionRequestRepository) {}

  async execute(
    requestId: string,
    status: "aceptado" | "rechazado"
  ): Promise<boolean> {

    return await this.repository.updateStatus(requestId, status);
  }
}