import { UserProfile } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

interface ResetPassword {
  user: UserProfile;
  newPassword: string;
  confirmPassword: string;
}

export class ResetPasswordUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute({ user, newPassword, confirmPassword }: ResetPassword) {
    // Campos vacíos
    if (!newPassword || !confirmPassword) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Coinciden las contraseñas
    if (newPassword !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    // Nueva diferente a la anterior
    if (newPassword === user.password) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    // Longitud mínima
    if (newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Actualizar en el repositorio
    await this.userRepo.updateProfile({ ...user, password: newPassword });
  }
}