import { supabase } from "@/lib/supabase";
import { saveDB, saveS } from "@/modules/animal/presentation/componets/uploadImage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function UpdatePetsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const petParam = params.pet ? JSON.parse(params.pet as string) : null;

  const [selectedPet, setSelectedPet] = useState<any>(null);
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
  const [adopted, setAdopted] = useState(false);

  // Cargar los datos de la mascota al abrir
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
      setImage(petParam.image_url ?? null);
      setAdopted(petParam.adopted ?? false);
    }
  }, [petParam]);

  const clearFields = () => {
    setType(""); setName(""); setSex(""); setAge(""); setSize("");
    setBreed(""); setHealthInfo(""); setDescription(""); setPhone(""); setLocation(""); setImage(null); setSelectedPet(null);  setAdopted(false);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const updatePet = async () => {
    if (!selectedPet) { Alert.alert("No hay mascota seleccionada"); return; }

    let imageUrl = selectedPet.image_url;

    if (img && img !== selectedPet.image_url) {
      const uploaded = await saveS({ uri: img });
      if (!uploaded) { Alert.alert("Error al subir imagen"); return; }
      imageUrl = uploaded;
      await saveDB(uploaded);
    }

    const { error } = await supabase
      .from("pets")
      .update({
        type: type.toLowerCase().trim(),
        name,
        sex: sex.toLowerCase().trim(),
        age,
        size: size.toLowerCase().trim(),
        breed,
        health_info: healthInfo,
        description,
        phone,
        location,
        image_url: imageUrl,
         adopted,
      })
      .eq("id", selectedPet.id);

    if (error) { Alert.alert("Error", error.message); return; }

    Alert.alert("Mascota actualizada ✨");
    clearFields();
    router.back(); // Regresa a la lista de mascotas
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

<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
  <Text style={{ marginRight: 10 }}>¿Adoptada?</Text>
  <Switch
    value={adopted}
    onValueChange={setAdopted}
    trackColor={{ false: "#767577", true: "#22c55e" }}
    thumbColor={adopted ? "#ffffff" : "#f4f3f4"}
  />
</View>

        {img && <Image source={{ uri: img }} style={styles.previewImage} />}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>Insertar Imagen</Text>
        </TouchableOpacity>
         <Text style={styles.sectionTitle}>Información general</Text>
        <TextInput style={styles.input} placeholder="Tipo" value={type} onChangeText={setType} />
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Sexo" value={sex} onChangeText={setSex} />
        <TextInput style={styles.input} placeholder="Edad" value={age} onChangeText={setAge} />
        <TextInput style={styles.input} placeholder="Tamaño" value={size} onChangeText={setSize} />
        <TextInput style={styles.input} placeholder="Raza" value={breed} onChangeText={setBreed} />
        <Text style={styles.sectionTitle}>Salud</Text>
        <TextInput style={styles.textArea} placeholder="Información de salud" value={healthInfo} onChangeText={setHealthInfo} multiline />
         <Text style={styles.sectionTitle}>Personalidad</Text>
        <TextInput style={styles.textArea} placeholder="Descripción" value={description} onChangeText={setDescription} multiline />
         <Text style={styles.sectionTitle}>Contacto</Text>
        <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Ubicación" value={location} onChangeText={setLocation} />

        <TouchableOpacity style={styles.saveButton} onPress={updatePet}>
          <Text >Actualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
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
  sectionTitle: {
  fontWeight: "bold",
  fontSize: 16,
  textAlign: "center",
  marginVertical: 8,
},
  scrollContainer: { padding: 15, paddingBottom: 30 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#DAC193", padding: 10, borderRadius: 8, marginBottom: 8 },
  textArea: { borderWidth: 1, borderColor: "#DAC193", padding: 10, borderRadius: 8, marginBottom: 8, height: 80 },
  saveButton: { backgroundColor: "#E5DCCC", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  cancelButton: { backgroundColor: "#ef4444", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  previewImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  imageBtn: { backgroundColor: "#E5DCCC", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 10},
  imageBtnText: {  fontWeight: "bold" },
});