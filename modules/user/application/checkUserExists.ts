import { supabase } from "@/lib/supabase";

export const checkUserExists = async (
  email: string, username: string, phone: string) => {

  email = email.trim().toLowerCase();
  username = username.trim()
  phone = phone.trim();


  const { data: emailData, error: emailError } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email);

  if (emailError) throw new Error(emailError.message);
  if (emailData && emailData.length > 0) throw new Error("Este email ya está registrado");

  const { data: userData, error: userError } = await supabase
    .from("clients")
    .select("id")
    .eq("username", username);

  if (userError) throw new Error(userError.message);
  if (userData && userData.length > 0) throw new Error("Este nombre de usuario ya existe");

  const { data: phoneData, error: phoneError } = await supabase
    .from("clients")
    .select("id")
    .eq("phone", phone);

  if (phoneError) throw new Error(phoneError.message);
  if (phoneData && phoneData.length > 0) throw new Error("Este número ya está registrado");
};