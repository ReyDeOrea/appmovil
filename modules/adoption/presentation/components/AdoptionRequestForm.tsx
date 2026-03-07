import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { CreateAdoptionRequest } from "../../application/createAdoption";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";

const repository = new AdoptionRepository();
const createRequest = new CreateAdoptionRequest(repository);

export default function AdoptionForm() {

  const router = useRouter();
  const params = useLocalSearchParams();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [telefono, setTelefono] = useState("");

  const [pregunta_1, setPregunta1] = useState("");
  const [pregunta_2, setPregunta2] = useState("");
  const [pregunta_3, setPregunta3] = useState("");
  const [pregunta_4, setPregunta4] = useState("");
  const [pregunta_5, setPregunta5] = useState("");
  const [pregunta_6, setPregunta6] = useState("");
  const [pregunta_7, setPregunta7] = useState("");
  const [pregunta_8, setPregunta8] = useState("");
  const [pregunta_9, setPregunta9] = useState("");
  const [pregunta_10, setPregunta10] = useState("");
  const [pregunta_11, setPregunta11] = useState("");
  const [pregunta_12, setPregunta12] = useState("");
  const [pregunta_13, setPregunta13] = useState("");

  const enviarSolicitud = async () => {

    const userData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userData!);

    let pet: any = null;

    if (typeof params.pet === "string") {
      pet = JSON.parse(params.pet);
    }

    try {

      await createRequest.execute({
        pet_id: pet.id,
        user_id: user.id,
        owner_id: pet.user,
        adoptante_nombre: nombre,
        adoptante_apellido: apellido,
        adoptante_edad: Number(edad),
        adoptante_ubicacion: ubicacion,
        adoptante_telefono: telefono,
        pregunta_1,
        pregunta_2,
        pregunta_3,
        pregunta_4,
        pregunta_5,
        pregunta_6,
        pregunta_7,
        pregunta_8,
        pregunta_9,
        pregunta_10,
        pregunta_11,
        pregunta_12,
        pregunta_13,
      });

     const existing = await AsyncStorage.getItem(`adoptionRequest_${user.id}`);
    const requests = existing ? JSON.parse(existing) : [];
    requests.push({ id: pet.id, pet }); 
    await AsyncStorage.setItem(`adoptionRequest_${user.id}`, JSON.stringify(requests));

    Alert.alert("Solicitud enviada");
    router.back();

  } catch (error: any) {
    Alert.alert(error.message);
  }
};

  return (

    <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

      <Text>Nombre</Text>
      <TextInput onChangeText={setNombre}
        style={{ borderWidth: 1 }}
      />

      <Text>Apellido</Text>
      <TextInput onChangeText={setApellido}
        style={{ borderWidth: 1 }}
      />

      <Text>Edad</Text>
      <TextInput onChangeText={setEdad}
        style={{ borderWidth: 1 }}
      />

      <Text>Ubicación</Text>
      <TextInput onChangeText={setUbicacion}
        style={{ borderWidth: 1 }}
      />

      <Text>Teléfono</Text>
      <TextInput onChangeText={setTelefono}
        style={{ borderWidth: 1 }}
      />
<Text> ¿Por qué quieres adoptar una mascota?</Text>
      <TextInput onChangeText={setPregunta1}
        style={{ borderWidth: 1 }}
      />
      <Text>¿Vives en casa o departamento?</Text>
      <TextInput onChangeText={setPregunta2}
        style={{ borderWidth: 1 }}
      />

      <Text>Si es rentado ¿te permiten mascotas?</Text>
      <TextInput onChangeText={setPregunta3}
        style={{ borderWidth: 1 }}
      />

        <Text>¿Tienes jardín o espacio exterior?</Text>
      <TextInput onChangeText={setPregunta4}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Has tenido mascotas antes?</Text>
      <TextInput onChangeText={setPregunta5}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Qué pasó con esas mascotas?</Text>
      <TextInput onChangeText={setPregunta6}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Actualmente tienes mascotas?</Text>
      <TextInput onChangeText={setPregunta7}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Qué tipo y cuántas?</Text>
      <TextInput onChangeText={setPregunta8}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Cuánto tiempo estará sola la mascota?</Text>
      <TextInput onChangeText={setPregunta9}
        style={{ borderWidth: 1 }}
      />

       <Text>¿Quién cuidará de la mascota cuando no estés</Text>
      <TextInput onChangeText={setPregunta10}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Todos en casa están de acuerdo con la dopción?</Text>
      <TextInput onChangeText={setPregunta11}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Cuál es tu presupuesto mensual para la mascota?</Text>
      <TextInput onChangeText={setPregunta12}
        style={{ borderWidth: 1 }}
      />

      <Text>¿Aceptas esterilización/castración si es necesario?</Text>
      <TextInput onChangeText={setPregunta13}
        style={{ borderWidth: 1 }}
      />

      <TouchableOpacity
        onPress={enviarSolicitud}
        style={{ backgroundColor: "#E5DCCC", padding: 15, marginTop: 10 }}
      >
        <Text>Enviar solicitud</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}