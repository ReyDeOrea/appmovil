export const validateLoginData = (username: string, password: string) => {
  if (!username) throw new Error("Usuario requerido");
  if (password.length < 6) throw new Error("Contraseña inválida");
};