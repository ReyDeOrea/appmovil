import { saveS } from "@/modules/animal/presentation/componets/uploadImage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Label } from "@react-navigation/elements";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  const bannerImages = images.map((uri) => ({ image: { uri } }));

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
                <View
                  key={idx}
                  style={{ width, alignItems: "center", marginVertical: 10 }}
                >
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
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
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
        <TextInput style={styles.input} placeholder="Edad" value={age} onChangeText={setAge} />
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
        <TextInput style={styles.input} placeholder="Raza" value={breed} onChangeText={setBreed} />

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
          <Text>Actualizar</Text>
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
  BP: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 30,
    backgroundColor: '#fff',
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
  cancelButton: {
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
    marginBottom: 10
  },
  imageBtnText: {
    fontWeight: "bold"
  },
  LabelText: {
    color: '#000000'
  },
  imgD: {
    height: BANNER_HEIGHT,
    borderRadius: 20,
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


  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: "#000",
  },
});