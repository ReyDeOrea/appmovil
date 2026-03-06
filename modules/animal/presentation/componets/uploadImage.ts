//aqui van las funciones del CRUD
import { supabase } from "@/lib/supabase";
import { Pet } from "../../domain/pet";



export async function ImgS(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .storage
      .from('IMG')
      .list('pet');
    if (error)
      throw error;
    return data.map(item => `https://hrojphcqktmijvagyrha.storage.supabase.co/storage/v1/object/public/IMG/pet/${item.name}`);
  }
  catch (e) {
    console.log(e);
    return [];
  }
}

export async function saveDB(pet: Partial<Pet>): Promise<Pet | null> {
  try {
    const { data, error } = await supabase
      .from("pets")
      .insert([{
        type: pet.type ?? "dog",      // valor por defecto si no se pasa
        name: pet.name ?? "Sin nombre",
        sex: pet.sex ?? "m",
        adopted: pet.adopted ?? false,
        user: pet.user ?? "unknown",
        image_url: pet.image_url ?? ""
      }])
      .select();

    if (error) throw error;

    return data ? data[0] : null;
  } catch (e) {
    console.log("ERROR EN saveDB:", e);
    return null;
  }
}

export async function saveS(file: { uri: string }): Promise<string | null> {
  try {
    if (!file?.uri) throw new Error('No file URI provided');

    const fileExt = file.uri.split('.').pop() ?? 'jpeg';
    const fileName = `${Date.now()}.${fileExt}`;

    const arrayBuffer = await fetch(file.uri).then(res => res.arrayBuffer());

    const { data, error } = await supabase
      .storage
      .from('IMG')
      .upload(`pet/${fileName}`, arrayBuffer, {
        contentType: 'image/jpeg',
      });

    if (error) throw error;
    return `https://hrojphcqktmijvagyrha.storage.supabase.co/storage/v1/object/public/IMG/pet/${fileName}`;
  } catch (e) {
    console.log('ERROR EN saveS:', e);
    return null;
  }
}

