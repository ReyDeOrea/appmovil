
import { saveDB, saveS } from "@/modules/animal/presentation/componets/uploadImage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Label } from "@react-navigation/elements";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addPetUseCase } from "../../application/addPet";
import { PetSize } from "../../domain/pet";

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
  const [img, setImage] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
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
    setImage(null);
  };

  const savePet = async () => {
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
      return;
    }

    const petType = type.toLowerCase().trim();
    const petSex = sex.toLowerCase().trim();
    const petSize = size.toLowerCase().trim();

    const validTypes = ["perro", "gato"];
    const validSex = ["macho", "hembra"];
    const validSizes = ["pequeño", "mediano", "grande"];

    if (!validTypes.includes(petType)) {
      Alert.alert("Error", "Debe escribir correctamente el tipo: perro o gato");
      return;
    }

    if (!validSex.includes(petSex)) {
      Alert.alert("Error", "Debe escribir correctamente el sexo: macho o hembra");
      return;
    }

    if (!validSizes.includes(petSize)) {
      Alert.alert("Error", "Debe escribir correctamente el tamaño: pequeño, mediano o grande");
      return;
    }

    if (!img) {
      Alert.alert("Debe seleccionar una imagen");
      return;
    }
    const u = await AsyncStorage.getItem("user");
    if (!u) {
      Alert.alert("No hay sesión iniciada");
      return;
    }

    const user = JSON.parse(u);

    let imageUrl : string | null = null;

    if (img) {
      imageUrl = await saveS({ uri: img });
      if (!imageUrl) {
        Alert.alert("Error al subir imagen");
        return;
      }
      await saveDB(imageUrl);
    }

    try {
      await addPetUseCase({
        user: user.id,
        type: petType as "perro" | "gato",
        name: name.trim(),
        sex: petSex as "macho" | "hembra",
        age: age.trim(),
        size:
          petSize.toLowerCase() === "pequeño"
            ? PetSize.pequeño
            : petSize.toLowerCase() === "mediano"
            ?PetSize.mediano
            :PetSize.grande,
        breed: breed.trim(),
        health_info: healthInfo.trim(),
        description: description.trim(),
        image_url: imageUrl!,
        phone: phone.trim(),
        location: location.trim(),
      });
      Alert.alert("Mascota guardada");
      clearFields();
      router.back();
    }
    catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

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

        {img && <Image source={{ uri: img }} style={styles.previewImage} />}

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>Insertar Imagen</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Información general</Text>

        <Label style={styles.LabelText}>Tipo de animal</Label>
        <TextInput style={styles.input}
          placeholder="Tipo (gato o perro)"
          value={type}
          onChangeText={setType}
        />

        <Label style={styles.LabelText}>Nombre del animal</Label>
        <TextInput style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />

        <Label style={styles.LabelText}>Sexo del animal</Label>
        <TextInput style={styles.input}
          placeholder="Sexo (hembra o macho)"
          value={sex}
          onChangeText={setSex}
        />

        <Label style={styles.LabelText}>Edad del animal</Label>
        <TextInput style={styles.input}
          placeholder="Edad"
          value={age}
          onChangeText={setAge}
        />

        <Label style={styles.LabelText}>Tamaño del animal</Label>
        <TextInput style={styles.input}
          placeholder="Tamaño (pequeño, mediano o grande)"
          value={size}
          onChangeText={setSize}
        />

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

        <TouchableOpacity style={styles.saveButton}
          onPress={savePet}>
          <Text >Registrar Mascota</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton}
          onPress={() => router.back()}>
          <Text style={{ color: "white" }}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
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
    width: "100%",
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
    marginVertical:15,
  },
  imageBtnText: {
    fontWeight: "bold"
  },
  LabelText:{
    color: '#000000'
  }
});
