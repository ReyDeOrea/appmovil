
import { UserProfile } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(profile: UserProfile): Promise<void> {

    if (!profile.username || !profile.email || !profile.phone || !profile.password)
      throw new Error("Todos los campos son obligatorios");
    if (profile.password.length < 6) throw new Error("Contraseña debe tener mínimo 6 caracteres");

    await this.userRepository.createProfile(profile);
  }
}