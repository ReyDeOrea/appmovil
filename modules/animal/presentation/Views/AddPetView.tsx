import { saveS } from "@/modules/animal/presentation/componets/uploadImage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addPetUseCase } from "../../application/addPet";
import { PetSex, PetSize, PetType } from "../../domain/pet";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.42;

export default function AddPetScreen() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [breed, setBreed] = useState("");
  const [healthInfo, setHealthInfo] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImage] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bannerPage, setBannerPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.7,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setImage([...img, ...uris]);
    }
  };

  const bannerImages = img.map((uri) => ({ image: { uri } }));

  const clearFields = () => {
    setType("");
    setName("");
    setSex("");
    setAge("");
    setSize("");
    setBreed("");
    setHealthInfo("");
    setDescription("");
    setPhone("");
    setLocation("");
    setImage([]);
  };

  const savePet = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (!type || !name || !sex || !age || !size || !breed || !healthInfo || !description || !phone || !location) {
        Alert.alert("Faltan campos", "Todos los campos son obligatorios");
        setIsSaving(false);
        return;
      }

      if (img.length < 5) {
        Alert.alert("Debe seleccionar mínimo 5 imágenes");
        setIsSaving(false);
        return;
      }

      const u = await AsyncStorage.getItem("user");
      if (!u) {
        Alert.alert("No hay sesión iniciada");
        setIsSaving(false);
        return;
      }

      const user = JSON.parse(u);
      let imageUrl: string[] = [];
      for (const uri of img) {
        const url = await saveS({ uri });
        if (!url) {
          Alert.alert("Error al subir una imagen");
          setIsSaving(false);
          return;
        }
        imageUrl.push(url);
      }

      await addPetUseCase({
        user: user.id,
        type: type as PetType,
        name: name.trim(),
        sex: sex as PetSex,
        age: age.trim(),
        size: size as PetSize,
        breed: breed.trim(),
        health_info: healthInfo.trim(),
        description: description.trim(),
        image_url: JSON.stringify(imageUrl), // todas las imágenes juntas
        phone: phone.trim(),
        location: location.trim(),
      });

      Alert.alert("Mascota guardada");
      clearFields();
      router.back();

    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.txtN}>Animaland</Text>
            <FontAwesome name="paw" size={30} color="#fff" />
          </View>
        </View>

        {img.length > 0 && (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => setBannerPage(Math.round(e.nativeEvent.contentOffset.x / width))}
              scrollEventThrottle={16}
            >
              {bannerImages.map((item, idx) => (
                <View key={idx} style={{ width, alignItems: "center", marginVertical: 10 }}>
                  <Image source={item.image} style={[styles.imgD, { width: width * 0.9 }]} />
                </View>
              ))}
            </ScrollView>

            <View style={styles.BP}>
              {bannerImages.map((_, i) => (
                <View key={i} style={[styles.dot, bannerPage === i && styles.dotActive]} />
              ))}
            </View>
          </>
        )}

        <View style={styles.mainContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <Text style={styles.inputLabel}>Tipo de animal</Text>
            <View style={styles.selectionContainer}>
              {["perro", "gato"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.selectionButton, type === t && styles.selectionButtonActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={styles.selectionButtonText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Nombre del animal</Text>
            <TextInput style={styles.inputFull} placeholder="Nombre del animal" value={name} onChangeText={setName} />

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabel}>Sexo</Text>
              <View style={styles.selectionContainer}>
                {["macho", "hembra"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.selectionButton, sex === s && styles.selectionButtonActive]}
                    onPress={() => setSex(s)}
                  >
                    <Text style={styles.selectionButtonText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Tamaño</Text>
              <View style={styles.selectionContainer}>
                {["pequeño", "mediano", "grande"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.selectionButton, size === s && styles.selectionButtonActive]}
                    onPress={() => setSize(s)}
                  >
                    <Text style={styles.selectionButtonText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.inputLabel}>Edad</Text>
            <TextInput style={styles.inputFull} placeholder="Edad" value={age} onChangeText={setAge} />

            <Text style={styles.inputLabel}>Raza</Text>
            <TextInput style={styles.inputFull} placeholder="Raza" value={breed} onChangeText={setBreed} />

            <Text style={styles.inputLabel}>Ubicación</Text>
            <TextInput style={styles.inputFull} placeholder="Ubicación" value={location} onChangeText={setLocation} />

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput style={styles.textArea} placeholder="Da una breve descripción" value={description} onChangeText={setDescription} multiline />

            <Text style={styles.sectionTitle}>Salud</Text>
            <TextInput style={styles.inputFull} placeholder="Alergias / Vacunas / Discapacidad" value={healthInfo} onChangeText={setHealthInfo} multiline />

            <Text style={styles.sectionTitle}>Contacto</Text>
            <TextInput style={styles.inputFull} placeholder="Número de teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.imageBox}>
              {img.length > 0 ? (
                <Image source={{ uri: img[0] }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons name="camera" size={50} color="#D4B37A" />
                  <Text style={styles.imagePlaceholderText}>Sube una foto de tu mascota</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <MaterialCommunityIcons name="camera" size={20} color="#D4B37A" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Subir foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, isSaving && { opacity: 0.5 }]} onPress={savePet} disabled={isSaving}>
              <Text style={styles.buttonText}>{isSaving ? "Guardando..." : "Guardar mascota"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FDF8F0",
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#B7C979",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  txtN: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    marginRight: 10,
  },
  mainContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 20,
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e2e2e",
    marginBottom: 12,
    textAlign: "center",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  inputHalfContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  inputFull: {
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
    elevation: 2,
    borderRadius: 8,
  },
  imageBox: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E8E0D0",
    overflow: "hidden",
    elevation: 3,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
  },
  imagePlaceholder: {
    alignItems: "center",
    padding: 20,
  },
  imagePlaceholderText: {
    color: "#B7C979",
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor: "#D4B37A",
    padding: 14,
    borderRadius: 15,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#B7C979",
    padding: 14,
    borderRadius: 15,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#E8B4B4",
    padding: 14,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  selectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#DAC193",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  selectionButtonActive: {
    backgroundColor: "#E5DCCC",
    borderColor: "#DAC193",
  },
  selectionButtonText: {
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  BP: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 5,
  },
  dotActive: {
    backgroundColor: "#000",
  },
  imgD: {
    height: BANNER_HEIGHT,
    borderRadius: 20,
  },
});