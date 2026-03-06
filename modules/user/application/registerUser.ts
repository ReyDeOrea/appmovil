import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (data: { email: string, username: string, password: string, phone: string, avatar_url?: string }) => {
  const { data: user, error } = await supabase.from("clients").insert([data]).select().single();
  if (error) throw error;
  await AsyncStorage.setItem("user", JSON.stringify(user));
  return user;
};