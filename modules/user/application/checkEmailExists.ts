import { supabase } from "@/lib/supabase";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.log("Error verificando email:", error);
    return false; 
  }

  return !!data; 
};