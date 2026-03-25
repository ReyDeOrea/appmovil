import { PushTokenRepository } from "../domain/tokenRepository";

export class SavePushToken {
  constructor(private repo: PushTokenRepository) {}

  async execute(userId: string, token: string) {
    await this.repo.saveToken(userId, token);
  }
}