
import { supabase } from "@/lib/supabase";
import { Pet } from "../domain/pet";

export async function addPet(pet: Pet): Promise<Pet | null> {
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

export async function getPets(): Promise<Pet[]> {
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

export async function getPeId(id: string): Promise<Pet | null> {
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

export async function updatePet(id: string, pet: Partial<Pet>): Promise<boolean> {
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

export async function deletePet(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("pets")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (e) {
    console.log("ERROR deletePet:", e);
    return false;
  }
}
