import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { checkUserExistsUpdate } from '../../application/checkUserExistsUpdate';
import { getUserProfile } from "../../application/getUserProfile";
import { updateUserProfile } from "../../application/updateUserProfile";
import AvatarView from "../components/AvatarView";

const { width, height } = Dimensions.get("window");

const AVATAR_SIZE = width * 0.32;
const FONT_TITLE = width * 0.08;

export default function Account() {

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const u = await getUserProfile();
        if (u) {
          setUser(u);
          setUsername(u.username ?? "");
          setPhone(u.phone ?? "");
          setAvatarUrl(u.avatar_url ?? "");
          setEmail(u.email ?? "");
        }
      }
      catch (err: any) {
        Alert.alert("Error", "No se pudo cargar el perfil");
      }
    };
    load();
  }, []);

  const UpdateProfile = async () => {
    try {
      setLoading(true);

      await checkUserExistsUpdate(
        email.trim().toLowerCase(),
        username.trim(),
        phone.trim(),
        user.id
      );


      const updated = await updateUserProfile(user, {
        username: username.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        avatar_url: avatarUrl
      });

      setUser(updated);
      Alert.alert("Perfil actualizado");
      router.push("/catalog");

    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <Text style={{ padding: 20 }}>No hay usuario logueado</Text>;

  return (

    <View style={styles.container}>

      <View style={styles.b}>
        
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          
        <View style={styles.BR}>

          <View style={styles.row}>
            <Text style={styles.txtN}>Animaland</Text>
            <MaterialCommunityIcons name="dog" size={width * 0.075} color="white" />
          </View>
        </View>
      </View>

      <View style={styles.card}>

        <View style={styles.aB}>
          <AvatarView
            size={AVATAR_SIZE}
            url={avatarUrl}
            onUpload={(url) => setAvatarUrl(url)}
          />
        </View>

        <View style={styles.iB}>

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Tu nombre"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Número de teléfono"
            keyboardType="phone-pad"
          />

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={UpdateProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Actualizar Perfil"}
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FDF8F0",
    alignItems: "center",
  },

  BC: {
    width: "100%",
    backgroundColor: "#B7C979",
    paddingVertical: height * 0.02,
    marginBottom: 30,
  },

  BR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtN: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    marginRight: 5
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  aB: {
    marginBottom: 20,
  },
  iB: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#fff",
    elevation: 1
  },
  inputDisabled: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8E0D0",
    backgroundColor: "#E5DCCC",
    color: "#555"
  },
  button: {
    width: "100%",
    backgroundColor: "#B7C979",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    elevation: 3
  },
  backBtn: {
    position: "absolute",
    left: 15,
    top: 40
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  b: {
    width: "100%",
    height: 100,
    paddingTop: 30,
    backgroundColor: "#B7C979",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
});