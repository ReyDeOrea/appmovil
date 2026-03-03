
export interface UserDataSource {

  checkIfProfileExists(id: string): Promise<boolean>;

  createUserProfile(id: string, username?: string, phone?: string): Promise<void>;
}