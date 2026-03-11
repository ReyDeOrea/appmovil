import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GetRequestsForMyPets } from "../../application/getRequestReceived";
import { RequestStatus } from "../../application/statusRequest";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";

const repository = new AdoptionRepository();
const getUserRequests = new GetRequestsForMyPets(repository);
const updateStatus = new RequestStatus(repository);

export default function RequestsReceived() {
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);

      let data = await getUserRequests.execute(user.id);

      if (!data) {
        setRequests([]);
        return;
      }

      data = await Promise.all(
        data.map(async (request: any) => {
          const pet = await repository.getPetById(request.pet_id);

          return {
            ...request,
            pet_name: pet?.name || "Desconocida"
          };
        })
      );

      setRequests(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  const aceptar = async (Rid: string, pet_id: number) => {
    try {

      await updateStatus.execute(Rid, "aceptado");

      await repository.updateStatusPet(pet_id, { adopted: true });
      loadRequests();
    }
    catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const rechazar = async (id: string) => {
     try {
    await updateStatus.execute(id, "rechazado");
    loadRequests();
   } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  const verSolicitud = (request: any) => {
    router.push({
      pathname: "/viewRequestForm",
      params: { request: JSON.stringify(request) }
    });
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => verSolicitud(item)} 
          style={styles.card}
          >

          <Text style={styles.text}>
            <Text style={styles.label}>Mascota: </Text>
            {item.pet_name}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.label}>Adoptante: </Text>
            {item.adoptante_nombre} {item.adoptante_apellido}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.label}>Estado: </Text>
            {item.estado}
          </Text>

          {item.estado === "en_proceso" && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => aceptar(item.id, item.pet_id)}
                style={[styles.button, styles.accept]}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => rechazar(item.id)}
                style={[styles.button, styles.reject]}
              >
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}

        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          No hay solicitudes
        </Text>
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff"
  },
  text: {
    fontSize: 16,
    marginBottom: 5
  },
  label: {
    fontWeight: "bold"
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  button: {
    padding: 10,
    borderRadius: 5
  },
  accept: {
    backgroundColor: "#A4D4AE",
    marginRight: 10
  },
  reject: {
    backgroundColor: "#F2A7A7"
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center"
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555"
  }
});