import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { Pet } from "../../domain/pet";
import { getPets } from "../../infraestructure/petDatasource";

export default function FavoritesPet() {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const router = useRouter();

  const loadFavorites = async () => {
    const userData = await AsyncStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      setFavorites([]);
      return;
    }

    const data = await AsyncStorage.getItem(`favorites_${user.id}`);
    const favs: Pet[] = data ? JSON.parse(data) : [];

    const allPets = await getPets();

    const updatedFavorites = favs.map(fav => {
      const updatedPet = allPets.find(p => p.id === fav.id);
      return updatedPet ? updatedPet : fav;
    });

    setFavorites(updatedFavorites);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderItem = ({ item }: { item: Pet }) => {
    const isAdopted = item.adopted === true;

    let images: string[] = [];

    try {
      images = JSON.parse(item.image_url || "[]");
      if (!Array.isArray(images)) images = [images];
    } catch {
      images = item.image_url ? [item.image_url] : [];
    }
    return (
      <TouchableOpacity
        activeOpacity={isAdopted ? 1 : 0.7}
        disabled={isAdopted}
        onPress={() => {
          if (isAdopted) return;

          router.push({
            pathname: "/profileAnimal",
            params: { pet: JSON.stringify(item) },
          });
        }}
      >
        <View style={[styles.card, isAdopted && styles.cardDisabled]}>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: images[0] }}
              style={[styles.image, isAdopted && { opacity: 0.4 }]}
            />

            {isAdopted && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  ¡{item.name} ha sido adoptado!
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{item.name}</Text>

          {isAdopted && (
            <Text style={styles.unavailable}>No disponible</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text>No tienes favoritos aún</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff'
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  cardDisabled: {
    backgroundColor: "#F3F3F3",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  unavailable: {
    marginTop: 5,
    fontSize: 14,
    color: "#999",
    fontWeight: "bold",
  },
});