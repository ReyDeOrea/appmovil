import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";

const screenWidth = Dimensions.get("window").width;

export default function ViewRequest() {
  const params = useLocalSearchParams();
  const [request, setRequest] = useState<any>(null);
  const repository = new AdoptionRepository();

  const preguntas = [
    "1. ¿Por qué quieres adoptar una mascota?",
    "2. ¿Vives en casa o departamento?",
    "3. Si es rentado ¿te permiten mascotas?",
    "4. ¿Tienes jardín o espacio exterior?",
    "5. ¿Cuánto tiempo puedes dedicarle diariamente?",
    "6. ¿Has tenido mascotas antes?",
    "7. ¿Actualmente tienes mascotas?",
    "8. ¿Qué tipo y cuántas?",
    "9. ¿Cuánto tiempo estará sola la mascota?",
    "10. ¿Quién cuidará de la mascota cuando no estés?",
    "11. ¿Todos en casa están de acuerdo con la dopción?",
    "12. ¿Cuál es tu presupuesto mensual para la mascota?",
    "13. ¿Aceptas esterilización/castración si es necesario?"
  ];

  useEffect(() => {
    const loadRequestAndPet = async () => {
      if (params.request && typeof params.request === "string") {
        try {
          const parsedRequest = JSON.parse(params.request);
          setRequest(parsedRequest);

          const pet = await repository.getPetById(parsedRequest.pet_id);
          if (pet) {
            const images = Array.isArray(pet.image_url)
              ? pet.image_url
              : typeof pet.image_url === "string"
                ? JSON.parse(pet.image_url)
                : [pet.image_url];

            setRequest((prev: any) => ({
              ...prev,
              pet_name: pet.name,
              pet_images: images,
            }));
          }
        } catch (error) {
          console.error("Error parseando la solicitud:", error);
        }
      }
    };

    loadRequestAndPet();
  }, [params.request]);

  if (!request) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la solicitud</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Solicitud de adopción</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre de la mascota:</Text>
        <Text style={styles.value}>{request.pet_name}</Text>

        {request.pet_images && request.pet_images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {request.pet_images.map((img: string, index: number) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.petImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre adoptante:</Text>
        <Text style={styles.value}>
          {request.adoptante_nombre} {request.adoptante_apellido}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{request.adoptante_edad}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{request.adoptante_ubicacion}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{request.adoptante_telefono}</Text>
      </View>

      <View style={styles.section}>

        <Text style={styles.label}>Preguntas y respuestas del formulario:</Text>

        <View style={{ marginLeft: 10, marginTop: 5 }}>
          {preguntas.map((pregunta, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={styles.label}>
                {pregunta}
              </Text>
              <Text style={styles.value}>
                {request[`pregunta_${i + 1}`] ?? "Sin respuesta"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{request.estado}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
  },
  petImage: {
    width: screenWidth * 0.7,
    height: 250,
    borderRadius: 10,
    marginRight: 10,
  },
});