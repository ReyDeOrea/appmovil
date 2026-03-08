import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from 'expo-crypto';

export const loginUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("username", username)
    .single();
  
  if (error || !data) throw new Error("Usuario o contraseña incorrectos");

   const passwordHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  if (passwordHash !== data.password) {
    throw new Error("Usuario o contraseña incorrectos");
  }
  
  await AsyncStorage.setItem("user", JSON.stringify(data));
  return data;
};