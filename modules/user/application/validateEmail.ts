export const validateEmail = (email: string) => {
  if (!email) throw new Error("Ingresa tu correo");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new Error("Correo inválido");
};