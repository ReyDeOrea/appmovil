export interface AdoptionForm {
  id: string,
  pet_id: string,
  owner_id: string,
  user_id: string,

  adoptante_nombre: string,
  adoptante_apellido: string,
  adoptante_edad: number,
  adoptante_ubicacion: string,
  adoptante_telefono: string,

  pregunta_1: string,
  pregunta_2: string,
  pregunta_3: string,
  pregunta_4: string,
  pregunta_5: string,
  pregunta_6: string,
  pregunta_7: string,
  pregunta_8: string,
  pregunta_9: string,
  pregunta_10: string,
  pregunta_11: string,
  pregunta_12: string,
  pregunta_13: string,

  estado: "en_proceso" | "aceptado" | "rechazado"
}