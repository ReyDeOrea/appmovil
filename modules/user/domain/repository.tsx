
import { UserDataSource } from "../infraestructure/userDataSource";
import { UserProfile } from "./user";
import { UserRepository } from "./userRepository";

export class UserRepositoryImpl implements UserRepository {
  constructor(private dataSource: UserDataSource) {}

  async createProfile(profile: UserProfile): Promise<void> {
    await this.dataSource.createUserProfile(profile);
  }

  async login(username: string, password: string): Promise<UserProfile | null> {
    return await this.dataSource.getUserByUsernameAndPassword(username, password);
  }

  async getProfile(id: string): Promise<UserProfile | null> {
    return await this.dataSource.getProfile(id);
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    await this.dataSource.updateProfile(profile);
  }
}