import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateUserProfile = async (user: any, updates: { username: string, phone: string, avatar_url: string }) => {
  const { error } = await supabase
    .from("clients")
    .update(updates)
    .eq("email", user.email);

  if (error) throw error;

  const newUser = { ...user, ...updates };
  await AsyncStorage.setItem("user", JSON.stringify(newUser));
  return newUser;
};