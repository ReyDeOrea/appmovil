import DeletePetModal from "@/modules/animal/presentation/componets/DeletePetModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUserPets } from "../../../user/application/getUserPets";
import { uploadImagesPet } from "../../application/uploadImagesPet";

export default function MyPetsScreen() {

  const [pets, setPets] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    try {
      const data = await getUserPets();
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedPetId(id);
    setModalVisible(true);
  };

  const renderItem = ({ item }: any) => {
    const images = uploadImagesPet(item.image_url);
    const isAdopted = item.adopted === true;

    return (
      <View style={[styles.card, isAdopted && styles.cardAdopted]}>
        {images.length > 0 && (
          <Image source={{ uri: images[0] }} style={[styles.image, isAdopted && styles.imageAdopted]} />
        )}

        <Text style={styles.name}>{item.name}</Text>

        {isAdopted && (
          <Text style={styles.adoptedText}>
            🐾 Esta mascota ya fue adoptada
          </Text>
        )}

        {!isAdopted && (
          <View style={styles.cardButtons}>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                router.push({
                  pathname: "/updatePet",
                  params: { pet: JSON.stringify(item) },
                })
              }
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
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

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
            <View style={styles.b}>

              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
              >
                <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
              </TouchableOpacity>

              <View style={styles.row}>
                <Text style={styles.txtN}>Animaland</Text>

                <MaterialCommunityIcons
                  name="dog"
                  size={33}
                  color="#fff"
                />
              </View>

            </View>
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
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FDF8F0"
  },
 imageAdopted: { 
    opacity: 0.5
  },
  b: {
    width: "100%",
    height: 100,
    paddingTop: 30,
    backgroundColor: "#B7C979",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
 cardAdopted: { 
    opacity: 0.5
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  txtN: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    marginRight: 5
  },
adoptedText: { 
    color: "green",
    fontWeight: "bold",
    marginTop: 5
  },
  backBtn: {
    position: "absolute",
    left: 15,
    top: 40
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2
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
    bottom: 60,
    right: 20,
    backgroundColor: "#8cb56e",
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
    backgroundColor: "#ffdfba",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center"
  },
  deleteBtn: {
    backgroundColor: "#d3a9a9",
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