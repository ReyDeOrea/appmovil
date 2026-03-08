import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";

const screenWidth = Dimensions.get("window").width;

export default function ViewRequest() {
  const params = useLocalSearchParams();
  const router = useRouter();
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
    "11. ¿Todos en casa están de acuerdo con la adopción?",
    "12. ¿Cuál es tu presupuesto mensual para la mascota?",
    "13. ¿Aceptas esterilización/castración si es necesario?",
  ];

  useEffect(() => {
    const loadRequestAndPet = async () => {
      if (params.request && typeof params.request === "string") {
        let parsedRequest = null;

  
          parsedRequest = JSON.parse(params.request);
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
      }
    };

    loadRequestAndPet();
  }, [params.request]);

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return { backgroundColor: "#B7E4C7", color: "#1B4332" };
      case "rechazada":
        return { backgroundColor: "#F8C8C8", color: "#7A1C1C" };
      default:
        return { backgroundColor: "#FFF3BF", color: "#7A5C00" };
    }
  };

  if (!request) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la solicitud</Text>
      </View>
    );
  }

  const statusStyle = getStatusStyle(request.estado);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>Animaland</Text>
            <MaterialCommunityIcons name="dog" size={30} color="#fff" />
          </View>
        </View>

        <View style={styles.content}>

          {/* Mascota */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mascota</Text>

            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{request.pet_name}</Text>

            {request.pet_images && request.pet_images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {request.pet_images.map((img: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={styles.petImage}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Adoptante */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos del adoptante</Text>

            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>
              {request.adoptante_nombre} {request.adoptante_apellido}
            </Text>

            <Text style={styles.label}>Edad:</Text>
            <Text style={styles.value}>{request.adoptante_edad}</Text>

            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.value}>{request.adoptante_ubicacion}</Text>

            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{request.adoptante_telefono}</Text>
          </View>

          {/* Preguntas */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preguntas del formulario</Text>

            {preguntas.map((pregunta, i) => (
              <View key={i} style={styles.questionBox}>
                <Text style={styles.question}>{pregunta}</Text>
                <Text style={styles.answer}>
                  {request[`pregunta_${i + 1}`] ?? "Sin respuesta"}
                </Text>
              </View>

              
            ))}
          </View>
  
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Estado de la solicitud</Text>

            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
              <Text style={{ color: statusStyle.color, fontWeight: "bold" }}>
                {request.estado?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },

  content: {
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: {
    fontWeight: "bold",
    marginTop: 5,
  },

  value: {
    marginBottom: 5,
    marginLeft: 5,
  },

  questionBox: {
    marginBottom: 12,
  },

  question: {
    fontWeight: "bold",
  },

  answer: {
    marginLeft: 8,
    marginTop: 3,
  },

  petImage: {
    width: screenWidth * 0.7,
    height: 250,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 10,
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});