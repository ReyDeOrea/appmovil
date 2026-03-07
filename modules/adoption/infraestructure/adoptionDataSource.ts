
import { supabase } from "@/lib/supabase";
import { AdoptionForm } from "../domain/adoption";
import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class AdoptionRepository implements AdoptionRequestRepository {

  async createRequest(
    request: Omit<AdoptionForm, "id" | "estado">
  ): Promise<AdoptionForm | null> {

    const { data, error } = await supabase
      .from("adoption_requests")
      .insert({
        ...request,
        estado: "en_proceso",
         owner_id: request.owner_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando solicitud:", error);
      return null;
    }

    return data as AdoptionForm;
  }


  async getRequestsByPet(petId: string) {
    if (!petId) {
      console.error("petId es undefined");
      return [];
    }
    const { data, error } = await supabase
      .from("adoption_requests")
      .select("*")
      .eq("pet_id", petId);

    if (error) {
      console.error("Error obteniendo solicitudes:", error);
      return [];
    }

    return data as AdoptionForm[];
  }

  async getRequestsByUser(userId: string) {

    if (!userId) {
      console.error("userId es undefined");
      return [];
    }
    const { data, error } = await supabase
      .from("adoption_requests")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error obteniendo solicitudes del usuario:", error);
      return [];
    }

    return data as AdoptionForm[];
  }

  async requestExists(userId: string, petId: string): Promise<boolean> {

    const { data, error } = await supabase
      .from("adoption_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("pet_id", petId)
      .maybeSingle();

    if (error) {
      console.error("Error verificando solicitud:", error);
      return false;
    }

    return !!data;
  }

  async updateStatus(
    requestId: string,
    status: "en_proceso" | "aceptado" | "rechazado"
  ): Promise<boolean> {

    const { error } = await supabase
      .from("adoption_requests")
      .update({ estado: status })
      .eq("id", requestId);

    if (error) {
      console.error("Error actualizando estado:", error);
      return false;
    }

    return true;
  }

async getRequestsForOwner(ownerId: string) {
  const { data, error } = await supabase
    .from("adoption_requests")
    .select("*")
    .eq("owner_id", ownerId);

  if (error) {
    console.error("Error obteniendo solicitudes del dueño:", error);
    return [];
  }
  return data;
}

  async deleteRequest(requestId: string): Promise<boolean> {

    const { error } = await supabase
      .from("adoption_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Error eliminando solicitud:", error);
      return false;
    }

    return true;
  }
}