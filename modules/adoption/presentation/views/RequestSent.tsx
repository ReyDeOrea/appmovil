import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { GetPetRequestsReceived } from "../../application/getRequestReceived";
import { RequestStatus } from "../../application/statusRequest";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";


const repository = new AdoptionRepository();

const getPetRequests = new GetPetRequestsReceived(repository);
const updateStatus = new RequestStatus(repository);

export default function RequestsSent() {

  const params = useLocalSearchParams();
  const petId = params.petId as string;

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {

    const data = await getPetRequests.execute(petId);

    setRequests(data);
  };

  const aceptar = async (id: string) => {

    await updateStatus.execute(id, "aceptado");
    loadRequests();
  };

  const rechazar = async (id: string) => {

    await updateStatus.execute(id, "rechazado");
    loadRequests();
  };

  return (

    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}

      renderItem={({ item }) => (

        <View style={{ padding: 20, borderBottomWidth: 1 }}>

          <Text>
            {item.nombre} {item.apellido}
          </Text>

          <Text>Edad: {item.edad}</Text>

          <Text>Estado: {item.estado}</Text>

          {item.estado === "en_proceso" && (

            <View style={{ flexDirection: "row" }}>

              <TouchableOpacity
                onPress={() => aceptar(item.id)}
                style={{ marginRight: 20 }}
              >
                <Text>Aceptar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => rechazar(item.id)}
              >
                <Text>Rechazar</Text>
              </TouchableOpacity>

            </View>

          )}

        </View>

      )}
    />
  );
}