import { supabase } from "@/lib/supabase";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AvatarView from "../components/AvatarView";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
    return
  <Text style={{ padding: 20 }}>No hay usuario logueado</Text>;

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
          <Text style={styles.txtSU}>
            Animaland
          </Text>
          <MaterialCommunityIcons name="dog" size={30} color="white"
          />
        </View>
      </View>

      <View style={styles.aB}>
        <AvatarView
          size={120}
          url={avatarUrl}
          onUpload={(url) =>
            setAvatarUrl(url)}
        />
      </View>

      <View style={styles.iB}>
        <TextInput style={styles.input}
          value={user.email}
          editable={false}
        />
        <TextInput style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />
        <TextInput style={styles.input}
          value={phone} onChangeText={setPhone}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button}
        onPress={updateProfile}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Guardando..." : "Actualizar Perfil"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DAC193',
  },
  button: {
    width: "100%",
    backgroundColor: '#E5DCCC',
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold"
  },
  txtSU: {
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)'
  },
  BC: {
    backgroundColor: "#D4B37A",
    paddingVertical: 12,
    paddingHorizontal: 100,
  },
  BR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  aB: {
    marginTop: 20,
  },
  iB: {
  marginTop: 25, 
  width: "100%",
},
});
