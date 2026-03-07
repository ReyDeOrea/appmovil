//repositorio implementadoimport { supabase } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { AdoptionForm } from "../domain/adoption";
import { AdoptionRequestRepository } from "../domain/adoptionRepository";

export class AdoptionRepository implements AdoptionRequestRepository {

  /**
   * Crear solicitud de adopción
   */
  async createRequest(
    request: Omit<AdoptionForm, "id" | "estado">
  ): Promise<AdoptionForm | null> {

    const { data, error } = await supabase
      .from("adoption_requests")
      .insert({
        ...request,
        estado: "en_proceso"
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando solicitud:", error);
      return null;
    }

    return data as AdoptionForm;
  }

  /**
   * Obtener solicitudes de una mascota
   */
  async getRequestsByPet(petId: string): Promise<AdoptionForm[]> {

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

  /**
   * Obtener solicitudes enviadas por un usuario
   */
  async getRequestsByUser(userId: string): Promise<AdoptionForm[]> {

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