import { UserProfile } from "./user";

export interface UserRepository {
  getProfile(id: string): Promise<UserProfile | null>;
  updateProfile(profile: UserProfile): Promise<void>;
}
