export const validateSignUpData = (data: { username: string, phone: string, email: string, password: string, confirmPassword: string }) => {
  const { username, phone, email, password, confirmPassword } = data;

  if (!username || !phone || !email || !password || !confirmPassword)
    throw new Error("Todos los campos son obligatorios");
  if (password !== confirmPassword)
    throw new Error("Las contraseñas no coinciden");
  if (password.length < 6)
    throw new Error("La contraseña debe tener mínimo 6 caracteres");
  if (!/^\d+$/.test(phone))
    throw new Error("El teléfono solo debe contener números");

  return true;
};