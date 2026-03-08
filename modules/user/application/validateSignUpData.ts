export const validateSignUpData = (data: { username: string, phone: string, email: string, password: string, confirmPassword: string }) => {
  const { username, phone, email, password, confirmPassword } = data;

  if (!username || !phone || !email || !password || !confirmPassword)
    throw new Error("Todos los campos son obligatorios");

  if (password !== confirmPassword)
    throw new Error("Las contraseñas no coinciden");

  if (password.length < 6)
    throw new Error("La contraseña debe tener mínimo 6 caracteres");

if (phone.length !== 10) {
    throw new Error("El teléfono debe tener 10 dígitos");
  }

   if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Correo electrónico inválido");
  }

  return true;
};