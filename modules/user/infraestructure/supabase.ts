import { supabase } from "@/lib/supabase";
import { UserDataSource } from "./userDataSource";

export class SupabaseUserDataSource implements UserDataSource {
  private tableName = "profiles";

  async checkIfProfileExists(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("id")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  }
  async createUserProfile(id: string, username?: string, phone?: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .insert([{ id, username, phone }]);

    if (error) throw error;
  }
}
