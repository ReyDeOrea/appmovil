import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { checkAdoptionRequest } from "../../application/checkAdoptionRequest";
import { checkFavoritePet } from "../../application/checkFavoritePet";
import { checkUserSession, getUserData } from "../../application/checkUserSession";
import { toggleFavoritePet } from "../../application/toggleFavoritePet";
import { Pet } from "../../domain/pet";

export function ProfileAnimal() {
  const screenWidth = Dimensions.get("window").width;
  const router = useRouter();
  const params = useLocalSearchParams();

  const [tab, setTab] = useState<"info" | "salud">("info");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imagePage, setImagePage] = useState(0);
  const [hasRequested, setHasRequested] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  let mascota: Pet | null = null;

  if (typeof params.pet === "string") {
    try {
      mascota = JSON.parse(params.pet);
    } catch (error) {
      console.log("Error parseando mascota:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!mascota) return;
      initialize();
    }, [])
  );

  const initialize = async () => {
    const logged = await checkUserSession();
    setUserLogged(logged);

    if (!logged) return;

    const user = await getUserData();
    if (!user) return;

    const fav = await checkFavoritePet(user.id.toString(), mascota!.id.toString());
    setIsFavorite(fav);

    const requested = await checkAdoptionRequest(
      user.id.toString(),
      mascota!.id.toString()
    );
    setHasRequested(requested);
  };

  const handleToggleFavorite = async () => {
    if (!(await checkUserSession())) {
      Alert.alert(
        "Debes iniciar sesión",
        "Necesitas iniciar sesión para agregar favoritos"
      );
      return;
    }

    const user = await getUserData();
    if (!user || !mascota) return;

    const newStatus = await toggleFavoritePet(user.id.toString(), mascota);
    setIsFavorite(newStatus);

    Alert.alert(
      newStatus ? "Agregado" : "Eliminado",
      newStatus ? "Se agregó a favoritos" : "Se quitó de favoritos"
    );
  };

  const llamar = () => Linking.openURL(`tel:${mascota?.phone}`);

  const copiarEnlace = async () => {
    if (!mascota) return;
    await Clipboard.setStringAsync(`https://app.com/animal/${mascota.id}`);
    Alert.alert("Enlace copiado", "El enlace fue copiado");
  };

  const images: string[] = (() => {
    if (!mascota) return [];
    if (Array.isArray(mascota.image_url)) return mascota.image_url.filter(Boolean);
    if (typeof mascota.image_url === "string") {
      try {
        const parsed = JSON.parse(mascota.image_url);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [mascota.image_url];
      } catch {
        return [mascota.image_url];
      }
    }
    return [];
  })();

  if (!mascota) {
    return (
      <View style={styles.center}>
        <Text>No hay datos de la mascota</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} 
        onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{mascota.name}</Text>

        <TouchableOpacity style={styles.favoriteButton} 
        onPress={handleToggleFavorite}>
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) =>
            setImagePage(Math.round(e.nativeEvent.contentOffset.x / screenWidth))
          }
          scrollEventThrottle={16}
        >
          {images.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{ width: screenWidth - 30, height: 220 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {images.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, imagePage === idx && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.copyIconButton} 
        onPress={copiarEnlace}>
          <Feather name="link" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.txtU}>
        <EvilIcons name="location" size={24} color="black" />
        <Text style={{ flex: 1 }}>{mascota.location}</Text>
      </View>

      {mascota.adopted && (
        <Text style={styles.adoptedText}>Esta mascota ya fue adoptada</Text>
      )}

      <View style={styles.B}>
        <TouchableOpacity
          style={tab === "info" ? styles.IBS : styles.I}
          onPress={() => setTab("info")}
        >
          <Text>Información</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tab === "salud" ? styles.IBS : styles.I}
          onPress={() => setTab("salud")}
        >
          <Text>Salud</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        {tab === "info" && (
          <>
            <View style={styles.BRI}>
              <View style={styles.RI}>
                <FontAwesome name="intersex" size={24} />
                <Text>{mascota.sex}</Text>
              </View>
              <View style={styles.RI}>
                <Entypo name="ruler" size={24} />
                <Text>{mascota.size}</Text>
              </View>
              <View style={styles.RI}>
                <FontAwesome5 name="calendar-alt" size={24} />
                <Text>{mascota.age}</Text>
              </View>
              <View style={styles.RI}>
                <FontAwesome5
                  name={mascota.type === "perro" ? "dog" : "cat"}
                  size={24}
                />
                <Text>{mascota.breed}</Text>
              </View>
            </View>

            <View style={styles.separador} />

            <Text style={styles.txtC}>Descripción</Text>
            <View style={styles.descripcionBox}>
              <Text>{mascota.description}</Text>
            </View>

            <View style={styles.separador} />

            <Text style={styles.txtC}>Contacto</Text>
            <View style={styles.BRI}>
              <TouchableOpacity style={styles.RI} onPress={llamar}>
                <Feather name="phone" size={24} />
                <Text>{mascota.phone}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.descargarContainer}>
              <TouchableOpacity
                style={[
                  styles.botonDescargar,
                  (!userLogged || hasRequested) && { backgroundColor: "#ccc" },
                ]}
                onPress={() => {
                  if (!userLogged) {
                    Alert.alert(
                      "Debes iniciar sesión",
                      "Necesitas iniciar sesión para enviar la solicitud"
                    );
                    return;
                  }

                  router.push({
                    pathname: "/adoptionRequest",
                    params: { pet: JSON.stringify(mascota) },
                  });
                }}
                disabled={!userLogged || hasRequested}
              >
                <Text style={styles.textoBoton}>
                  {hasRequested
                    ? "Solicitud enviada"
                    : "Mandar solicitud de adopción"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {tab === "salud" && <Text>{mascota.health_info}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F2ED",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 110,
    backgroundColor: "#B8C76F",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    zIndex: 10,
  },
  favoriteButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  imageContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#000",
  },
  copyIconButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 25,
  },
  txtU: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  adoptedText: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    marginVertical: 5,
  },

  separador: {
    borderBottomWidth: 2,
    borderBottomColor: "#E5DCCC",
    marginVertical: 20,
  },
  txtC:{
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  B: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#DAD2C3",
    padding: 5,
    marginHorizontal: 20,
    borderRadius: 25,
  },
  I: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  IBS: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
  },
  RI: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5DCCC",
  },
  BRI: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  descargarContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  botonDescargar: {
    backgroundColor: "#D4B37A",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 15,
  },
  textoBoton: {
    fontWeight: "bold",
    color: "#fff",
  },
  descripcionBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5DCCC",
  },
});