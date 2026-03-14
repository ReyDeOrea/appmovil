import { UserProfile } from "./user";

export interface UserRepository {
  getProfile(id: string): Promise<UserProfile | null>;
  updateProfile(profile: UserProfile): Promise<void>;

  createProfile(profile: UserProfile): Promise<void>;
  login(username: string, password: string): Promise<UserProfile | null>;
  verifyUserEmail(username: string, email: string): Promise<UserProfile | null>;


   checkIfProfileExists(id: string): Promise<boolean>;

  createUserProfile(id: string, username?: string, phone?: string): Promise<void>;

   resetPassword(email: string): Promise<void>;
}