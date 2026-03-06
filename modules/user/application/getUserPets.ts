import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserPets = async () => {
  const u = await AsyncStorage.getItem("user");
  if (!u) return [];

  const user = JSON.parse(u);

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("user", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};