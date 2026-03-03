
import { UserProfile } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class LoginUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(username: string, password: string): Promise<UserProfile> {
    if (!username)
      throw new Error("Usuario requerido");
    const user = await this.userRepository.login(username, password);
    if (!user)
      throw new Error("Usuario o contraseña incorrectos");
    return user;
  }
}