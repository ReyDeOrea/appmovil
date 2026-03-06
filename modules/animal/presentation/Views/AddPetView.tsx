
import { saveDB, saveS } from "@/modules/animal/presentation/componets/uploadImage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.txtN}>Animaland</Text>
            <FontAwesome name="paw" size={30} color='#fdfdfd' />
          </View>

        </View>

        <View style={styles.mainContainer}>
          {/* Formulario */}
          <View style={styles.leftColumn}>
            {/* Información Básica */}
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <View style={styles.rowInputs}>
            <View style={styles.inputHalfContainer}>
            <Text style={styles.inputLabel}>Tipo (Perro o Gato)</Text>
            <TextInput
              style={styles.inputHalf}
              value={type}
              onChangeText={setType}
                 />
              </View>

             <View style={styles.inputHalfContainer}>
                 <Text style={styles.inputLabel}>Edad</Text>
                 <TextInput
                  style={styles.inputHalf}
                  value={age}
                  onChangeText={setAge}
                  />
                  </View>
</View>

{/* FILA 2 */}
<View style={styles.rowInputs}>
  <View style={styles.inputHalfContainer}>
    <Text style={styles.inputLabel}>Sexo</Text>
    <TextInput
      style={styles.inputHalf}
      placeholder="M o H"
      value={sex}
      onChangeText={setSex}
    />
  </View>
                 <View style={styles.inputHalfContainer}>
    <Text style={styles.inputLabel}>Tamaño</Text>
    <TextInput
      style={styles.inputHalf}
      placeholder=""
      value={size}
      onChangeText={setSize}
    />
  </View>
</View>

           <View style={styles.inputFullContainer}>
  <Text style={styles.inputLabel}>Raza</Text>
  <TextInput
    style={styles.inputFull}
    placeholder="ej. Chihuahua"
    value={breed}
    onChangeText={setBreed}
  />
           
               <View style={styles.inputFullContainer}>
  <Text style={styles.inputLabel}>Ubicación</Text>
  <TextInput
    style={styles.inputFull}
    placeholder="Escribe tu ubicación"
    value={location}
    onChangeText={setLocation}
  />
</View>
            </View>

            <View style={styles.inputFullContainer}>
              <Text style={styles.inputLabel}>Nombre a tu mascota</Text>
              <TextInput
                style={styles.inputFull}
                placeholder="Nombre del animal"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputFullContainer}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Salud */}
            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Salud</Text>

            <TextInput
              style={styles.inputFull}
              placeholder="Alergias"
              placeholderTextColor="#999"
              value={healthInfo}
              onChangeText={setHealthInfo}
            />
            <TextInput
              style={styles.inputFull}
              placeholder="Vacunas"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.inputFull}
              placeholder="Discapacidad"
              placeholderTextColor="#999"
            />

            {/* Contacto */}
            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Contacto</Text>

            <TextInput
              style={styles.inputFull}
              placeholder="Nombres de Usuarios"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.inputFull}
              placeholder="Número de Teléfono"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>


          <View style={styles.rightColumn}>
          
            <View style={styles.imageBox}>
              {img ? (
                <Image source={{ uri: img }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons name="camera"  size={50} color="#D4B37A" />
                  <Text style={styles.imagePlaceholderText}>Sube una foto de tu mascota</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <MaterialCommunityIcons name="camera" size={20} color="#D4B37A" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Subir foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={savePet}>

              <Text style={styles.buttonText}>Guardar mascota</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
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
  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
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
  },
  sectionSpacing: {
    marginTop: 20,
  },

  rowInputs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  inputHalfContainer: {
    flex: 1,
  },
  inputFullContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  inputHalf: {
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 14,
    elevation: 2,
  },
  inputFull: {
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    elevation: 2,
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
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
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
    flexDirection: "row",
    justifyContent: "center",
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#E8B4B4",
    padding: 14,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
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
});
//añadir animal
