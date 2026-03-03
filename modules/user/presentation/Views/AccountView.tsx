import { supabase } from "@/lib/supabase";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AvatarView from "../components/AvatarView";

const { width, height } = Dimensions.get("window");

const HEADER_PADDING = width * 0.25;
const AVATAR_SIZE = width * 0.32;
const FONT_TITLE = width * 0.08;

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const u = await AsyncStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        setUsername(parsed.username ?? "");
        setPhone(parsed.phone ?? "");
        setAvatarUrl(parsed.avatar_url ?? "");
      }
    };
    loadUser();
  }, []);

  if (!user)
    return <Text style={{ padding: 20 }}>No hay usuario logueado</Text>;

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("clients")
        .update({ username, phone, avatar_url: avatarUrl })
        .eq("email", user.email);

      if (error) throw error;

      const newUser = { ...user, username, phone, avatar_url: avatarUrl };
      setUser(newUser);

      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      Alert.alert("Perfil actualizado");
      router.push("/catalog");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.BC}>
        <View style={styles.BR}>
          <Text style={styles.txtSU}>Animaland</Text>
          <MaterialCommunityIcons name="dog" size={width * 0.075} color="white" />
        </View>
      </View>

      <View style={styles.aB}>
        <AvatarView
          size={AVATAR_SIZE}
          url={avatarUrl}
          onUpload={(url) => setAvatarUrl(url)}
        />
      </View>

      <View style={styles.iB}>
        <TextInput
          style={styles.input}
          value={user.email}
          editable={false}
        />

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={updateProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Guardando..." : "Actualizar Perfil"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    alignItems: "center",
    backgroundColor: "#ffff"
  },

  input: {
    width: "100%",
    padding: width * 0.03,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DAC193',
  },

  button: {
    width: "100%",
    backgroundColor: '#E5DCCC',
    padding: width * 0.04,
    borderRadius: 10,
    marginTop: 10
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold"
  },

  txtSU: {
    fontWeight: 'bold',
    fontSize: FONT_TITLE,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)'
  },

  BC: {
    backgroundColor: "#D4B37A",
    paddingVertical: height * 0.015,
    paddingHorizontal: HEADER_PADDING,
  },

  BR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },

  aB: {
    marginTop: height * 0.03,
  },

  iB: {
    marginTop: height * 0.03,
    width: "100%",
  },
});