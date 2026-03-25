export interface AdoptionFormData {
  nombre: string;
  apellido: string;
  edad: string;
  ubicacion: string;
  telefono: string;
  pregunta_1: string;
  pregunta_2: string;
  pregunta_3?: string; 
  pregunta_4: string;
  pregunta_5: string;
  pregunta_6: string;
  pregunta_7: string;
  pregunta_8: string;
  pregunta_9: string;
  pregunta_10: string;
  pregunta_11: string;
  pregunta_12: string;
  pregunta_13: string;
}

export function validateAdoptionForm(data: AdoptionFormData) {

  const fields = [
    data.nombre,
    data.apellido,
    data.edad,
    data.ubicacion,
    data.telefono,
    data.pregunta_1,
    data.pregunta_2,
    data.pregunta_4,
    data.pregunta_5,
    data.pregunta_7,
    data.pregunta_9,
    data.pregunta_10,
    data.pregunta_11,
    data.pregunta_12,
    data.pregunta_13
  ];

  if (fields.some(field => !field || field.trim() === "")) {
    throw new Error("Todos los campos son obligatorios");
  }

  const edad = Number(data.edad);

  if (edad < 18) {
    throw new Error("Debes ser mayor de edad para adoptar");
  }

  if (edad > 70) {
    throw new Error("Debes tener menos de 70 años para adoptar");
  }

  if (data.telefono.length < 10) {
    throw new Error("Teléfono inválido");
  }
}