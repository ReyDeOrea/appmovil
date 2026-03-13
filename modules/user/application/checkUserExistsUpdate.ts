import { supabase } from "@/lib/supabase";

export const checkUserExistsUpdate = async (
  email: string,
  username: string,
  phone: string,
  currentUserId: string
) => {

   email = email.trim().toLowerCase();
  username = username.trim()
  phone = phone.trim();

const { data: emailData, error: emailError } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .neq("id", currentUserId);

  if (emailError) throw new Error(emailError.message);
  if (emailData && emailData.length > 0) {
    throw new Error("Este correo ya está registrado");
  }

  const { data: userData, error: userError } = await supabase
    .from("clients")
    .select("id")
    .eq("username", username)
    .neq("id", currentUserId);

  if (userError) throw new Error(userError.message);
  if (userData && userData.length > 0) {
    throw new Error("Este nombre de usuario ya existe");
  }

  const { data: phoneData, error: phoneError } = await supabase
    .from("clients")
    .select("id")
    .eq("phone", phone)
    .neq("id", currentUserId);

  if (phoneError) throw new Error(phoneError.message);
  if (phoneData && phoneData.length > 0) {
    throw new Error("Este número ya está registrado");
  }
};