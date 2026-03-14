
import { supabase } from "@/lib/supabase";
import { CreatePet, Pet } from "../domain/pet";
import { PetRepository } from "../domain/petRepository";

export class SupabasePetRepository implements PetRepository {

 async  addPet(pet: CreatePet): Promise<Pet | null> {
  try {
    const { data, error } = await supabase
      .from("pets")
      .insert([pet])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (e) {
    console.log("ERROR addPet:", e);
    return null;
  }
}

 async  getPets(): Promise<Pet[]> {
  try {
    const { data, error } = await supabase
      .from("pets")
      .select("*")


    if (error) throw error;

    return data as Pet[];
  } catch (e) {
    console.log("ERROR getPets:", e);
    return [];
  }
}

 async  getPetById(id: string): Promise<Pet | null> {
  try {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Pet;
  } catch (e) {
    console.log("ERROR getPetById:", e);
    return null;
  }
}

 async  updatePet(id: string, pet: Partial<Pet>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("pets")
      .update(pet)
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (e) {
    console.log("ERROR updatePet:", e);
    return false;
  }
}

 async  deletePet(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("pets")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  }
   catch (e) {
    console.log("ERROR deletePet:", e);
    return false;
  }
}

  async  adoptPet(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("pets")
      .update({ adopted: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return true;
  } catch (e) {
    console.log("ERROR adoptPet:", e);
    return false;
  }
}
}

