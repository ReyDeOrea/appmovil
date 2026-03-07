//repositorio del crud

import { AdoptionForm } from "./adoption";

export interface AdoptionRequestRepository {

    createRequest(request: Omit<AdoptionForm, "id" | "estado">): Promise<AdoptionForm | null>;

    getRequestsByPet(petId: string): Promise<AdoptionForm[]>;

    getRequestsByUser(userId: string): Promise<AdoptionForm[]>;

    requestExists(userId: string, petId: string): Promise<boolean>;

    updateStatus(
        requestId: string,
        status: "en_proceso" | "aceptado" | "rechazado"
    ): Promise<boolean>;

    /**
     * Eliminar solicitud (opcional)
     */
    deleteRequest(requestId: string): Promise<boolean>;
}