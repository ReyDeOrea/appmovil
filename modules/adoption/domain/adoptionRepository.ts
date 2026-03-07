//repositorio del crud

import { Pet } from "@/modules/animal/domain/pet";
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

    getPetById(petId: string): Promise<Pet | null>;
    
   // deleteRequest(requestId: string): Promise<boolean>;
}