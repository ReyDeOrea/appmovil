import { supabase } from "@/lib/supabase";
import * as Crypto from 'expo-crypto';
import { UserProfile } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class SupabaseUserRepository implements UserRepository {

  async getProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as UserProfile;
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from("clients")
        .update({ password: profile.password })
      .eq("id", profile.id);

    if (error) throw error;
  }

  async createProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from("clients")
      .insert([profile]);

    if (error) throw error;
  }

  async login(username: string, password: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;

  const passwordHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  if (passwordHash !== data.password) return null;

  const userProfile: UserProfile = {
    id: data.id,
    username: data.username,
    phone: data.phone ?? "",     
    email: data.email,
    password: data.password       
  };

  return userProfile;
}

  async verifyUserEmail(username: string, email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("username", username.trim())
    .eq("email", email.trim());

  if (error) throw error;
  if (!data || data.length === 0) {
    return null;
  }
  return data[0] as UserProfile;
}

  async checkIfProfileExists(id: string): Promise<boolean> {
    const { data } = await supabase
      .from("clients")
      .select("id")
      .eq("id", id)
      .single();

    return !!data;
  }

  async createUserProfile(id: string, username?: string, phone?: string): Promise<void> {
    const { error } = await supabase
      .from("clients")
      .insert([
        {
          id,
          username: username ?? "",
          phone: phone ?? "",
          email: "",
          password: ""
        }
      ]);

    if (error) throw error;
  }

  async resetPassword(email: string): Promise<void> {
    throw new Error("Método resetPassword no implementado sin Auth");
  }
}