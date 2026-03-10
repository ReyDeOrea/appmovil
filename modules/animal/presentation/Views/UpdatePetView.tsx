import { saveS } from "@/modules/animal/presentation/componets/uploadImage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Label } from "@react-navigation/elements";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { updatePetUseCase } from "../../application/updatePet";
import { PetSex, PetSize, PetType } from "../../domain/pet";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.42;

export default function UpdatePetsScreen() {

  const params = useLocalSearchParams();
  const router = useRouter();

  const petParam = useMemo(() => {
    return params.pet ? JSON.parse(params.pet as string) : null;
  }, [params.pet]);

  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [breed, setBreed] = useState("");
  const [healthInfo, setHealthInfo] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imagePage, setImagePage] = useState(0);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [adopted, setAdopted] = useState(false);

  useEffect(() => {

    if (petParam) {

      setSelectedPet(petParam);
      setType(petParam.type ?? "");
      setName(petParam.name ?? "");
      setSex(petParam.sex ?? "");
      setAge(petParam.age ?? "");
      setSize(petParam.size ?? "");
      setBreed(petParam.breed ?? "");
      setHealthInfo(petParam.health_info ?? "");
      setDescription(petParam.description ?? "");
      setPhone(petParam.phone ?? "");
      setLocation(petParam.location ?? "");

      if (Array.isArray(petParam.image_url)) {
        setImages(petParam.image_url);
      } else if (typeof petParam.image_url === "string") {
        try {
          const parsed = JSON.parse(petParam.image_url);
          if (Array.isArray(parsed)) {
            setImages(parsed);
          } else {
            setImages([petParam.image_url]);
          }
        } catch {
          setImages([petParam.image_url]);
        }
      }

      setAdopted(petParam.adopted ?? false);

    }

  }, [petParam]);

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
    setImages([]);
    setSelectedPet(null);
    setAdopted(false);

  };

  const pickImage = async () => {

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.7,
      selectionLimit: 5,
    });

    if (!result.canceled) {

      const uris = result.assets.map(asset => asset.uri);
      setImages(uris);

    }

  };

  const handleUpdatePet = async () => {

    if (!selectedPet) {
      Alert.alert("No hay mascota seleccionada");
      return;
    }

    if (images.length !== 5) {
      Alert.alert("Debes seleccionar exactamente 5 imágenes");
      return;
    }

    try {

      let imageUrl: string[] = [];

      for (const uri of images) {

        if (uri.startsWith("http")) {

          imageUrl.push(uri);

        } else {

          const uploaded = await saveS({ uri });

          if (!uploaded) {
            Alert.alert("Error al subir imagen");
            return;
          }

          imageUrl.push(uploaded);

        }

      }

      await updatePetUseCase(selectedPet.id, {

        type: type as PetType,
        name: name.trim(),
        sex: sex as PetSex,
        age: age.trim(),
        size: size as PetSize,
        breed: breed.trim(),
        health_info: healthInfo.trim(),
        description: description.trim(),
        phone: phone.replace(/[^0-9]/g, ""),
        location: location.trim(),
        image_url: JSON.stringify(imageUrl),
        adopted,

      });

      Alert.alert("Mascota actualizada ✨");

      clearFields();
      router.back();

    } catch (error: any) {

      Alert.alert("Error", error.message);

    }

  };

  return (

    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={styles.b}>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.txtN}>Animaland</Text>
              <MaterialCommunityIcons name="dog" size={33} color="#fff" />
            </View>

          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ marginRight: 10 }}>¿Adoptada?</Text>
            <Switch
              value={adopted}
              onValueChange={setAdopted}
              trackColor={{ false: "#767577", true: "#22c55e" }}
              thumbColor={adopted ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          {images.length > 0 && (

            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) =>
                  setImagePage(Math.round(e.nativeEvent.contentOffset.x / width))
                }
                scrollEventThrottle={16}
              >

                {images.map((uri, idx) => (
                  <View key={idx} style={{ width, alignItems: "center", marginVertical: 10 }}>
                    <Image
                      source={{ uri }}
                      style={[styles.imgD, { width: width * 0.9 }]}
                    />
                  </View>
                ))}

              </ScrollView>

              <View style={styles.BP}>

                {images.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, imagePage === i && styles.dotActive]}
                  />
                ))}

              </View>

            </>
          )}

          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>Insertar Imagen</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Información general</Text>

          <Label style={styles.LabelText}>Tipo de animal</Label>

          <View style={styles.selectionContainer}>

            {["perro", "gato"].map((t) => (

              <TouchableOpacity
                key={t}
                style={[
                  styles.selectionButton,
                  type === t && styles.selectionButtonActive,
                ]}
                onPress={() => setType(t)}
              >
                <Text style={styles.selectionButtonText}>{t}</Text>
              </TouchableOpacity>

            ))}

          </View>

          <Label style={styles.LabelText}>Nombre del animal</Label>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />

          <Label style={styles.LabelText}>Sexo del animal</Label>

          <View style={styles.selectionContainer}>

            {["macho", "hembra"].map((s) => (

              <TouchableOpacity
                key={s}
                style={[
                  styles.selectionButton,
                  sex === s && styles.selectionButtonActive,
                ]}
                onPress={() => setSex(s)}
              >
                <Text style={styles.selectionButtonText}>{s}</Text>
              </TouchableOpacity>

            ))}

          </View>

          <Label style={styles.LabelText}>Edad del animal</Label>

          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={age}
            onChangeText={setAge}
          />

          <Label style={styles.LabelText}>Tamaño del animal</Label>

          <View style={styles.selectionContainer}>

            {["pequeño", "mediano", "grande"].map((s) => (

              <TouchableOpacity
                key={s}
                style={[
                  styles.selectionButton,
                  size === s && styles.selectionButtonActive,
                ]}
                onPress={() => setSize(s)}
              >
                <Text style={styles.selectionButtonText}>{s}</Text>
              </TouchableOpacity>

            ))}

          </View>

          <Label style={styles.LabelText}>Raza del animal</Label>

          <TextInput
            style={styles.input}
            placeholder="Raza"
            value={breed}
            onChangeText={setBreed}
          />

          <Text style={styles.sectionTitle}>Salud</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Información de salud"
            value={healthInfo}
            onChangeText={setHealthInfo}
            multiline
          />

          <Text style={styles.sectionTitle}>Descripción</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.sectionTitle}>Contacto</Text>

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={10}
          />

          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdatePet}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Actualizar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Cancelar
            </Text>
          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>

    </>
  );

}

const styles = StyleSheet.create({

    scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FDF8F0",
    paddingBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  b: {
     backgroundColor: "#B7C979",
    paddingTop: 40,
    paddingBottom: 20,
    marginBottom: 20,
    alignItems: "center",
  },


  txtN: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 10,
  },

  backBtn: {
    position: "absolute",
    left: 15,
    top: 45,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e2e2e",
    marginVertical: 10,
    textAlign: "center",
  },

  LabelText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },

  input: {
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
    marginBottom: 12,
  },

  imgD: {
    height: BANNER_HEIGHT,
    borderRadius: 20,
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

  imageBtn: {
    backgroundColor: "#D4B37A",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },

  imageBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#B7C979",
    padding: 14,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  cancelButton: {
    backgroundColor: "#E8B4B4",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },

  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  selectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
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

});