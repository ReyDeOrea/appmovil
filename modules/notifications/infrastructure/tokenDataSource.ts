import { supabase } from "@/lib/supabase";
import { PushTokenRepository } from "../domain/tokenRepository";

export class PushTokenRepositorySupabase implements PushTokenRepository {

  async saveToken(userId: string, push_token: string): Promise<void> {
  console.log("GUARDANDO TOKEN:", userId, push_token);

  const { error } = await supabase
    .from("tokens")
    .upsert({
      user_id: userId,
      push_token: push_token
       },
      {
        onConflict: "push_token" 
      });

  if (error) {
    console.error("Error guardando token:", error);
  } else {
    console.log("TOKEN GUARDADO");
  }
}
  async getTokensByUser(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("tokens")
      .select("push_token")
      .eq("user_id", userId);

    if (error) {
      console.error("Error obteniendo tokens:", error);
      return [];
    }

    return data.map(t => t.push_token);
  }
}