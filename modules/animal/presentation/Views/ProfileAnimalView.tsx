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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { Pet } from "../../domain/pet";

export function ProfileAnimal() {
    const screenWidth = Dimensions.get("window").width;
    const router = useRouter();
    const params = useLocalSearchParams();
    const [tab, setTab] = useState<"info" | "salud" | "personalidad">("info");
    const [isFavorite, setIsFavorite] = useState(false);
    const [imagePage, setImagePage] = useState(0);



    const verificarUsuario = async () => {
        const userSession = await AsyncStorage.getItem("user");
        if (!userSession) {
            Alert.alert(
                "Debes iniciar sesión",
                "Necesitas iniciar sesión para agregar favoritos",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Ir a Login",
                        onPress: () => router.push("/login")
                    }
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

        await AsyncStorage.setItem(
            `favorites_${user.id}`,
            JSON.stringify(favorites)
        );

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


 

    const descargarFormulario = async () => {

        const enlacePerfil = `https://app.com/animal/${mascota.id}`;
        const estadoAnimal = mascota.adopted ? "Adoptado" : "No adoptado";
        const fecha = new Date().toLocaleDateString();

        const html = `
          <html>
    <body style="font-family: Arial; padding: 25px;">

        <h1 style="text-align:center;">FORMULARIO</h1>
        <h2 style="text-align:center;">Animaland</h2>
        <p style="text-align:right;">Fecha: ${fecha}</p>

        <hr/>

        <h2>Animal a Adoptar</h2>

        <img src="${mascota.image_url}" 
             style="width:250px;height:200px;object-fit:cover;margin-bottom:10px;" />

        <p><strong>Nombre del animal:</strong> ${mascota.name}</p>
        <p><strong>URL del perfil:</strong> ${enlacePerfil}</p>
        <p><strong>Estado del animal:</strong> ${estadoAnimal}</p>

        <hr/>

        <h2>Datos del adoptante</h2>

        <p>Nombre: ____________________________________________</p>
        <p>Apellido: ____________________________________________</p>
        <p>Edad: _______________________________________________</p>
        <p>Ubicación: ___________________________________________</p>
        <p>Teléfono: ____________________________________________</p>

        <hr/>

        <p>1. ¿Vives en casa o departamento?, ¿Propio o rentado?</p>
        <p>________________________________________________________________________</p>

        <p>2. En caso de que sea rentado, ¿Tienes autorizado tener mascotas?</p>
        <p>________________________________________________________________________</p>

        <p>3. ¿Anteriormente haz tenido mascotas?</p>
        <p>________________________________________________________________________</p>

        <p>4. En caso de hayas respondido que sí, ¿Qué sucedió con esas mascotas?</p>
        <p>________________________________________________________________________</p>

        <p>5. ¿Actualmente tienes mascotas?</p>
        <p>________________________________________________________________________</p>

        <p>6. En caso de hayas respondido que sí, ¿Qué tipo de mascotas y cuántas?</p>
        <p>________________________________________________________________________</p>

        <p>7. ¿Al día cuánto tiempo se quedará sola la mascota?</p>
        <p>________________________________________________________________________</p>

        <p>8. En caso de que vivas con otras personas, ¿Todos están de acuerdo con la idea de adoptar una mascota?</p>
        <p>________________________________________________________________________</p>

        <p>9. Económicamente, ¿Te sientes capaz de mantener a la mascota?, ¿Por qué?</p>
        <p>________________________________________________________________________</p>

        <br/><br/>
        <p>Firma del adoptante: ________________________________________________</p>

    </body>
    </html>
    `;

        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
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
                    <TouchableOpacity
                        onPress={() => router.back()}>
                        <AntDesign name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.txtN}>{mascota.name}</Text>

                    <TouchableOpacity
                        onPress={toggleFavorite}>
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
                        <View
                            key={idx}
                            style={[
                                styles.dot,
                                imagePage === idx && styles.dotActive,
                            ]}
                        />
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
                <Text style={styles.adoptedText}>
                    Esta mascota ya fue adoptada
                </Text>
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

                <TouchableOpacity
                    style={tab === "personalidad" ? styles.IBS : styles.I}
                    onPress={() => setTab("personalidad")}
                >
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
                                <FontAwesome5
                                    name={mascota.type === "perro" ? "dog" : "cat"}
                                    size={24}
                                />
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
                                style={styles.botonDescargar}
                                onPress={descargarFormulario}
                            >
                                <Text style={styles.textoBoton}>
                                    Descargar formulario
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
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 3,
    },
    dotActive: {
        backgroundColor: "#fff",
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
        borderRadius: 25,
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
        marginVertical: 8,
    },
    textoBoton: {
        fontWeight: "bold"
    }
});