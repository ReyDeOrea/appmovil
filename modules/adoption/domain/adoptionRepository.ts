
import { Pet } from "@/modules/animal/domain/pet";
import { AdoptionForm } from "./adoption";

export interface AdoptionRequestRepository {

    createRequest(request: Omit<AdoptionForm, "id" | "estado">): Promise<AdoptionForm | null>;

    getRequestsByPet(petId: string): Promise<AdoptionForm[]>;

    getRequestsByUser(userId: string): Promise<AdoptionForm[]>;

    getRequestsForOwner(ownerId: string): Promise<AdoptionForm[]>;

    requestExists(userId: string, petId: string): Promise<boolean>;


    updateStatus(
        requestId: string,
        status: "en_proceso" | "aceptado" | "rechazado"
    ): Promise<boolean>;

    getPetById(petId: number): Promise<Pet | null>;

    updateStatusPet(petId: number, data: Partial<Pet>): Promise<boolean>;


    getRequestById(requestId: string): Promise<AdoptionForm | null>;

    // deleteRequest(requestId: string): Promise<boolean>;
}