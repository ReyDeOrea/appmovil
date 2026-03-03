import { UserProfile } from "./user";

export interface UserRepository {
  getProfile(id: string): Promise<UserProfile | null>;
  updateProfile(profile: UserProfile): Promise<void>;

  createProfile(profile: UserProfile): Promise<void>;
  login(username: string, password: string): Promise<UserProfile | null>;
  resetPassword?(email: string): Promise<void>;
}