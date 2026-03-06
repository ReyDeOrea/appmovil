import { supabase } from "@/lib/supabase";

export const checkUserExists = async (email: string, username: string, phone: string) => {
  const { data: emailExist } = await supabase.from("clients").select("id").eq("email", email).single();
  if (emailExist) throw new Error("Este email ya está registrado");

  const { data: userExist } = await supabase.from("clients").select("id").eq("username", username).single();
  if (userExist) throw new Error("Este nombre de usuario ya existe");

  const { data: phoneExist } = await supabase.from("clients").select("id").eq("phone", phone).single();
  if (phoneExist) throw new Error("Este número ya está registrado");
};