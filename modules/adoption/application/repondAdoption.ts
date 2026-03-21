import { PushTokenRepository } from "@/modules/notifications/domain/tokenRepository";
import { sendPushNotification } from "@/modules/notifications/infrastructure/notificationPush";
import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class RespondAdoptionRequest {
  constructor(
    private repository: AdoptionRequestRepository,
    private pushRepo: PushTokenRepository 
  ) {}

  async execute(
    requestId: string,
    status: "aceptado" | "rechazado"
  ): Promise<void> {

    const request = await this.repository.getRequestById(requestId);

    if (!request) return;
  console.log("USER ID:", request.user_id);

    await this.repository.updateStatus(requestId, status);

    if (status === "aceptado") {
      await this.repository.updateStatusPet(request.pet_id, {
        adopted: true,
      });
    }

    const tokens = await this.pushRepo.getTokensByUser(request.user_id);
  console.log("TOKENS CASO USO:", tokens);

    for (const token of tokens) {
      await sendPushNotification(token, {
        title: "Solicitud de adopción",
        body:
          status === "aceptado"
            ? "Tu solicitud fue aceptada 🎉"
            : "Tu solicitud fue rechazada ❌",
        extra: {
          type: "ADOPTION_RESPONSE",
          requestId: request.id,
        },
      });
    }
  }
}