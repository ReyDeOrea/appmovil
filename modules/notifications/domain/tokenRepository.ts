export interface PushTokenRepository {
  saveToken(userId: string, token: string): Promise<void>;
  getTokensByUser(userId: string): Promise<string[]>;
}
