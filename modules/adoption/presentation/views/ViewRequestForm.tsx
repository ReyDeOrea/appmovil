import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ViewRequest() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    if (params.request && typeof params.request === "string") {
      try {
        setRequest(JSON.parse(params.request));
      } catch (error) {
        console.error("Error parseando la solicitud:", error);
      }
    }
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
        <Text style={styles.label}>Mascota ID:</Text>
        <Text style={styles.value}>{request.pet_id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre adoptante:</Text>
        <Text style={styles.value}>{request.adoptante_nombre} {request.adoptante_apellido}</Text>
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
        <Text style={styles.label}>Respuestas del formulario:</Text>
        <Text style={styles.value}>1. {request.pregunta_1}</Text>
        <Text style={styles.value}>2. {request.pregunta_2}</Text>
        <Text style={styles.value}>3. {request.pregunta_3}</Text>
        <Text style={styles.value}>4. {request.pregunta_4}</Text>
        <Text style={styles.value}>5. {request.pregunta_5}</Text>
        <Text style={styles.value}>6. {request.pregunta_6}</Text>
        <Text style={styles.value}>7. {request.pregunta_7}</Text>
        <Text style={styles.value}>8. {request.pregunta_8}</Text>
        <Text style={styles.value}>9. {request.pregunta_9}</Text>
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
    paddingBottom: 100
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  backButton: {
    marginBottom: 20
  },
  backText: {
    color: "#007AFF",
    fontSize: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  section: {
    marginBottom: 15
  },
  label: {
    fontWeight: "bold",
    fontSize: 16
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5
  }
});