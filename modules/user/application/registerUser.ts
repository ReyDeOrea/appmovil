import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from 'expo-crypto';

export const registerUser = async (data: { email: string, username: string, password: string, phone: string, avatar_url?: string }) => {

  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data.password
  );

  const { data: user, error } = await supabase
  .from("clients")
  .insert([{
    ...data,
    password: hashedPassword
  }]).select().single();

  if (error) throw error;

  await AsyncStorage.setItem("user", JSON.stringify(user));
  return user;
};