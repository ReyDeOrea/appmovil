
import { supabase } from "@/lib/supabase";
import DeletePetModal from "@/modules/animal/presentation/componets/DeletePetModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function MyPetsScreen() {
  const [pets, setPets] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => { loadPets(); }, []);

  const loadPets = async () => {
    const u = await AsyncStorage.getItem("user");
    if (!u) return;

    const user = JSON.parse(u);
    const { data, error } = await supabase.from("pets").select("*").eq("user", user.id);
    if (error) console.log("ERROR PETS:", error.message);
    setPets(data || []);
  };

  const openDeleteModal = (id: string) => {
    setSelectedPetId(id);
    setModalVisible(true);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.cardButtons}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push({ pathname: "/updatePet", params: { pet: JSON.stringify(item) } })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => openDeleteModal(item.id)}
        >
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      <FlatList
        data={pets}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No tienes mascotas registradas
          </Text>
        }
        ListHeaderComponent={
          <>
            <View style={styles.b}>
              <View style={styles.row}>
                <Text style={styles.txtN}>Animaland</Text>
                <MaterialCommunityIcons name="dog" size={33} color="#fff" />
              </View>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/addPet")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <DeletePetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        petId={selectedPetId}
        onDeleted={loadPets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  b: {
    width: "100%",
    height: 60,
    backgroundColor: "#d4b37a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  txtN: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    marginRight: 5
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10, elevation: 2
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5
  },
  fab: {
    position: "absolute",
    bottom: 20, right: 20,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  fabText: {
    color: "white",
    fontSize: 30
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  editBtn: {
    backgroundColor: "#E5DCCC",
    padding: 8, borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center"
  },
  deleteBtn: {
    backgroundColor: "#E5DCCC",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center"
  },
  btnText: {
    fontWeight: "bold"
  },
});