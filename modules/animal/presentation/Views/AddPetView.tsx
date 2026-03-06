
import { saveDB, saveS } from "@/modules/animal/presentation/componets/uploadImage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Label } from "@react-navigation/elements";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addPetUseCase } from "../../application/addPet";
import { PetSex, PetSize, PetType } from "../../domain/pet";


const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.42;

type BannerItem = {
  image: any;
};

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

    if (isSaving) return; // evita doble click
    setIsSaving(true);

    try {

      if (
        !type.trim() ||
        !name.trim() ||
        !sex.trim() ||
        !age.trim() ||
        !size.trim() ||
        !breed.trim() ||
        !healthInfo.trim() ||
        !description.trim() ||
        !phone.trim() ||
        !location.trim()
      ) {
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

        await saveDB(url);
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
        image_url: JSON.stringify(imageUrl),
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.b}>
          <View style={styles.row}>
            <Text style={styles.txtN}>Animaland</Text>
            <MaterialCommunityIcons name="dog" size={33} color="#fff" />
          </View>
        </View>

        {img.length > 0 && (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) =>
                setBannerPage(Math.round(e.nativeEvent.contentOffset.x / width))
              }
              scrollEventThrottle={16}
            >
              {bannerImages.map((item, idx) => (
                <View
                  key={idx}
                  style={{ width, alignItems: "center", marginVertical: 10 }}
                >
                  <Image
                    source={item.image}
                    style={[styles.imgD, { width: width * 0.9 }]}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.BP}>
              {bannerImages.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, bannerPage === i && styles.dotActive]}
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
        <TextInput style={styles.input}
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
        <TextInput style={styles.input}
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
        <TextInput style={styles.input}
          placeholder="Raza"
          value={breed}
          onChangeText={setBreed}
        />

        <Text style={styles.sectionTitle}>Salud</Text>

        <Label style={styles.LabelText}>Historial clinico del animal</Label>
        <TextInput
          style={styles.textArea}
          placeholder="Salud"
          value={healthInfo}
          onChangeText={setHealthInfo}
          multiline
        />
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Label style={styles.LabelText}>Da una breve descripcion sobre como es</Label>
        <TextInput
          style={styles.textArea}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.sectionTitle}>Contacto</Text>
        <Label style={styles.LabelText}>Numero de telefono</Label>
        <TextInput style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Label style={styles.LabelText}>Ubicación donde se encuentra</Label>
        <TextInput style={styles.input}
          placeholder="Ubicación"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity
          style={[styles.saveButton, isSaving && { opacity: 0.5 }]}
          onPress={savePet}
          disabled={isSaving}
        >
          <Text>
            {isSaving ? "Guardando..." : "Registrar Mascota"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton}
          onPress={() => router.back()}>
          <Text style={{ color: "white" }}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView >
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  imgD: {
    height: BANNER_HEIGHT,
    borderRadius: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
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
  scrollContainer: {
    padding: 15,
    paddingBottom: 30,
    backgroundColor: "#ffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#DAC193",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#DAC193",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    height: 80
  },
  saveButton: {
    backgroundColor: "#E5DCCC",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  closeButton: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  previewImage: {
    //width:  width - 30,
    height: 200,
    borderRadius: 10,
    marginBottom: 10
  },
  imageBtn: {
    backgroundColor: "#E5DCCC",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    marginVertical: 15,
  },
  imageBtnText: {
    fontWeight: "bold"
  },
  LabelText: {
    color: '#000000'
  },


  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
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
