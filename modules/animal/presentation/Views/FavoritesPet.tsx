import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { getFavoritesPetsUseCase } from "../../application/getFavoritesPets";
import { Pet } from "../../domain/pet";

export default function FavoritesPet() {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const router = useRouter();

  const loadFavorites = async () => {
    const favorites = await getFavoritesPetsUseCase();
    setFavorites(favorites);
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

    <View style={styles.b}>
      <View style={styles.row}>
        <Text style={styles.txtN}>Animaland</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="dog" size={33} color="#fff" />
        </View>
      </View>
    </View>
      
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
   row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  b: {
    width: "100%",
    height: 60,
    backgroundColor: "#B7C979",
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
    backgroundColor: "#FDF8F0"
  },
  card: {
    backgroundColor: "white",
    borderColor: "#000",
    padding: 10,
    marginBottom: 15,
    borderRadius: 25,
     marginHorizontal: 25,    
    elevation: 3,
  },
  cardDisabled: {
    backgroundColor: "#F3F3F3",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign:"center",
    color: "#291110"
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