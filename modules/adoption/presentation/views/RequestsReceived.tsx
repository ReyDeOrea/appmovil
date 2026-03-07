import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { GetUserRequests } from "../../application/getRequestSent";
import { AdoptionRepository } from "../../infraestructure/adoptionDataSource";


const repository = new AdoptionRepository();
const getUserRequests = new GetUserRequests(repository);

export default function RequestsReceived() {

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {

    const userData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userData!);

    const data = await getUserRequests.execute(user.id);

    setRequests(data);
  };

  return (

    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}

      renderItem={({ item }) => (

        <View style={{ padding: 20, borderBottomWidth: 1 }}>

          <Text>Mascota: {item.pet_id}</Text>

          <Text>Estado: {item.estado}</Text>

        </View>

      )}
    />

  );
}