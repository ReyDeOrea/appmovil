import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { validateAdoptionForm } from "../../application/adoptionFormValidator";
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

  try {

    validateAdoptionForm({
      nombre,
      apellido,
      edad,
      ubicacion,
      telefono,
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

    const userData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userData!);

    let pet: any = null;

    if (typeof params.pet === "string") {
      pet = JSON.parse(params.pet);
    }

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

    Alert.alert("Solicitud enviada");
    router.back();

  } catch (error: any) {
    Alert.alert(error.message);
  }
};

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Animaland</Text>
          <MaterialCommunityIcons name="dog" size={30} color="#fff" />
        </View>
      </View>

      <View style={styles.form}>

        <Text style={styles.section}>Datos personales</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} 
        
        onChangeText={setNombre} />

        <Text style={styles.label}>Apellido</Text>
        <TextInput style={styles.input}
         onChangeText={setApellido} 
         />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={setEdad}
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput style={styles.input}
         onChangeText={setUbicacion} 
         />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={setTelefono}
        />

        <Text style={styles.section}>Preguntas</Text>

        <Text style={styles.label}>¿Por qué quieres adoptar una mascota?</Text>
        <TextInput style={styles.textArea} 
        multiline
         onChangeText={setPregunta1}
          />

        <Text style={styles.label}>¿Vives en casa o departamento?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta2} 
        />

        <Text style={styles.label}>Si es rentado ¿te permiten mascotas?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta3}
         />

        <Text style={styles.label}>¿Tienes jardín o espacio exterior?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta4}
         />

        <Text style={styles.label}>¿Has tenido mascotas antes?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta5} 
        />

        <Text style={styles.label}>¿Qué pasó con esas mascotas?</Text>
        <TextInput style={styles.textArea}
         multiline 
         onChangeText={setPregunta6} 
         />

        <Text style={styles.label}>¿Actualmente tienes mascotas?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta7} 
        />

        <Text style={styles.label}>¿Qué tipo y cuántas?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta8} 
        />

        <Text style={styles.label}>¿Cuánto tiempo estará sola la mascota?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta9} 
        />

        <Text style={styles.label}>¿Quién cuidará cuando no estés?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta10} 
        />

        <Text style={styles.label}>¿Todos están de acuerdo con la adopción?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta11} 
        />

        <Text style={styles.label}>¿Presupuesto mensual para la mascota?</Text>
        <TextInput style={styles.input} 
        onChangeText={setPregunta12}
         />

        <Text style={styles.label}>
          ¿Aceptas esterilización/castración si es necesario?
        </Text>
        <TextInput style={styles.input}
         onChangeText={setPregunta13} 
         />

        <TouchableOpacity style={styles.button} 
        onPress={enviarSolicitud}>
          <Text style={styles.buttonText}>Enviar solicitud</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF8F0",
  },

  header: {
    backgroundColor: "#B7C979",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },

  form: {
    padding: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },

  label: {
    marginBottom: 4,
    color: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    height: 90,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#E5DCCC",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});