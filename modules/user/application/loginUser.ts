import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();
  
  if (error || !data) throw new Error("Usuario o contraseña incorrectos");

  await AsyncStorage.setItem("user", JSON.stringify(data));
  return data;
};