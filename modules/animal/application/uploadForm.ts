import { supabase } from "@/lib/supabase";

export const uploadForm = async (
  petId: number,
  fileName: string,
  file: any
): Promise<void> => {

  const { error: uploadError } = await supabase.storage
    .from("formularios")
    .upload(fileName, file, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.log("Error subiendo archivo:", uploadError);
    throw new Error("No se pudo subir el archivo");
  }

  const { error: updateError } = await supabase
    .from("pets")
    .update({
      adoption_form_url: fileName,
    })
    .eq("id", petId);

  if (updateError) {
    console.log("Error actualizando mascota:", updateError);
    throw new Error("No se pudo actualizar la mascota");
  }

};