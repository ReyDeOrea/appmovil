import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Clipboard from "expo-clipboard";

import { Pet } from "../../domain/pet";

export function ProfileAnimal() {
    const screenWidth = Dimensions.get("window").width;
    const router = useRouter();
    const params = useLocalSearchParams();
    const [tab, setTab] = useState<"info" | "salud" | "personalidad">("info");
    const [isFavorite, setIsFavorite] = useState(false);
    const [imagePage, setImagePage] = useState(0);
    const [hasRequested, setHasRequested] = useState(false);
    const [userLogged, setUserLogged] = useState(false);

    const verificarUsuario = async () => {
        const userSession = await AsyncStorage.getItem("user");
        if (!userSession) {
            Alert.alert(
                "Debes iniciar sesión",
                "Necesitas iniciar sesión para agregar favoritos",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Ir a Login", onPress: () => router.push("/login") }
                ]
            );
            return false;
        }
        return true;
    };

    let mascota: Pet | null = null;
    if (typeof params.pet === "string") {
        try {
            mascota = JSON.parse(params.pet);
        } catch (error) {
            console.log("Error parseando mascota:", error);
        }
    }

    useEffect(() => {
        if (mascota) {
            checkIfFavorite();
            checkUserAndRequest();
        }
    }, []);

    const checkIfFavorite = async () => {
        const userData = await AsyncStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        if (!user) return;

        const data = await AsyncStorage.getItem(`favorites_${user.id}`);
        const favorites = data ? JSON.parse(data) : [];
        const exists = favorites.some((pet: Pet) => pet.id === mascota?.id);
        setIsFavorite(exists);
    };

    const checkUserAndRequest = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (!userData) return setUserLogged(false);

        setUserLogged(true);
        const user = JSON.parse(userData);

        const data = await AsyncStorage.getItem(`adoptionRequest_${user.id}`);
        const requests = data ? JSON.parse(data) : [];

        const exists = requests.some((pet: Pet) => pet.id === mascota?.id);
        setHasRequested(exists);
    };

    const toggleFavorite = async () => {
        const autorizado = await verificarUsuario();
        if (!autorizado) return;

        const userData = await AsyncStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        if (!user) return;

        const data = await AsyncStorage.getItem(`favorites_${user.id}`);
        let favorites = data ? JSON.parse(data) : [];

        if (isFavorite) {
            favorites = favorites.filter((pet: Pet) => pet.id !== mascota?.id);
            Alert.alert("Eliminado", "Se quitó de favoritos");
        } else {
            favorites.push(mascota);
            Alert.alert("Agregado", "Se agregó a favoritos");
        }

        await AsyncStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    if (!mascota) {
        return (
            <View style={styles.center}>
                <Text>No hay datos de la mascota</Text>
            </View>
        );
    }

    const llamar = () => {
        Linking.openURL(`tel:${mascota.phone}`);
    };

    const copiarEnlace = async () => {
        const enlace = `https://app.com/animal/${mascota.id}`;
        await Clipboard.setStringAsync(enlace);
        Alert.alert("Enlace copiado", "El enlace fue copiado");
    };

    const images: string[] = (() => {
        if (Array.isArray(mascota.image_url)) {
            return mascota.image_url.filter(Boolean);
        } else if (typeof mascota.image_url === "string") {
            try {
                const parsed = JSON.parse(mascota.image_url);
                if (Array.isArray(parsed)) return parsed.filter(Boolean);
            } catch {
                return [mascota.image_url].filter(Boolean);
            }
        }
        return [];
    })();

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.b}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.txtN}>{mascota.name}</Text>

                    <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesome
                            name={isFavorite ? "star" : "star-o"}
                            size={28}
                            color={isFavorite ? "#FFD700" : "#fff"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.imageContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                        const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                        setImagePage(page);
                    }}
                    scrollEventThrottle={16}
                >
                    {images.map((uri, idx) => (
                        <Image
                            key={idx}
                            source={{ uri }}
                            style={{ width: screenWidth, height: 220 }}
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>

                <View style={styles.dotsContainer}>
                    {images.map((_, idx) => (
                        <View key={idx} style={[styles.dot, imagePage === idx && styles.dotActive]} />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.copyIconButton}
                    onPress={copiarEnlace}
                >
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
                <TouchableOpacity style={tab === "info" ? styles.IBS : styles.I} onPress={() => setTab("info")}>
                    <Text>Información</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tab === "salud" ? styles.IBS : styles.I} onPress={() => setTab("salud")}>
                    <Text>Salud</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tab === "personalidad" ? styles.IBS : styles.I} onPress={() => setTab("personalidad")}>
                    <Text>Personalidad</Text>
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
                                <FontAwesome5 name={mascota.type === "perro" ? "dog" : "cat"} size={24} />
                                <Text>{mascota.breed}</Text>
                            </View>
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
                                    (!userLogged || hasRequested) && { backgroundColor: "#ccc" }
                                ]}
                                onPress={() => {
                                    if (!userLogged) {
                                        Alert.alert("Debes iniciar sesión", "Necesitas iniciar sesión para enviar la solicitud");
                                        return;
                                    }
                                    router.push({
                                        pathname: "/adoptionRequest",
                                        params: { pet: JSON.stringify(mascota) }
                                    });
                                }}
                                disabled={!userLogged || hasRequested}
                            >
                                <Text style={styles.textoBoton}>
                                    {hasRequested ? "Solicitud enviada" : "Mandar solicitud de adopción"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </>
                )}

                {tab === "salud" && <Text>{mascota.health_info}</Text>}
                {tab === "personalidad" && <Text>{mascota.description}</Text>}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    b: {
        height: 60,
        backgroundColor: "#d4b37a",
        justifyContent: "center"
    },
    dotsContainer: {
        position: "absolute",
        bottom: 10, left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 3
    },
    dotActive: {
        backgroundColor: "#fff"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15
    },
    txtN: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff"
    },
    img: {
        width: "100%",
        height: 220
    },
    imageContainer: {
        position: "relative"

    },
    copyIconButton: {
        position: "absolute",
        top: 15,
        right: 15,
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 10,
        borderRadius: 25
    },
    txtU: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10
    },
    adoptedText: {
        textAlign: "center",
        color: "red",
        fontWeight: "bold",
        marginVertical: 5
    },
    separador: {
        borderBottomWidth: 2,
        borderBottomColor: "#E5DCCC",
        marginVertical: 20
    },
    txtC: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 10
    },
    B: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#E5DCCC",
        paddingVertical: 10,
        marginHorizontal: 10,
        borderRadius: 10
    },
    I: {
        padding: 10
    },
    IBS: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 20
    },
    RI: {
        flex: 1,
        alignItems: "center",
        margin: 5,
        borderColor: '#DAC193',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10
    },
    BRI: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    descargarContainer: {
        alignItems: "center",
        marginVertical: 15
    },
    botonDescargar: {
        backgroundColor: "#E5DCCC",
        padding: 12,
        borderRadius: 25,
        marginVertical: 8
    },
    textoBoton: {
        fontWeight: "bold"
    }
});