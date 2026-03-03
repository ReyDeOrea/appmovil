import { supabase } from "@/lib/supabase";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [numt, setNumT] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!usuario || !numt || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres");
      return false;
    }
    if (!/^\d+$/.test(numt)) {
      Alert.alert("Error", "El teléfono solo debe contener números");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    try {
      setLoading(true);
      const { data: emailExist } = await supabase
        .from("clients")
        .select("id")
        .eq("email", email)
        .single();
      if (emailExist) {
        Alert.alert("Error", "Este email ya está registrado");
        return;
      }

      const { data: userExist } = await supabase
        .from("clients")
        .select("id")
        .eq("username", usuario)
        .single();
      if (userExist) {
        Alert.alert("Error", "Este nombre de usuario ya existe");
        return;
      }

      const { data: phoneExist } = await supabase
        .from("clients")
        .select("id")
        .eq("phone", numt)
        .single();
      if (phoneExist) {
        Alert.alert("Error", "Este número ya está registrado");
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .insert([
          {
            email,
            password,
            username: usuario,
            phone: numt,
            avatar_url: avatarUrl || null
          }
        ])
        .select()
        .single();

      if (error) throw error;
      await AsyncStorage.setItem("user", JSON.stringify(data));
      Alert.alert("Cuenta creada 🎉");
      router.replace("/catalog");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: "#fff" }}>
      <View>


        <View style={styles.BC}>
          <View style={styles.BR}>
            <Text style={styles.txtSU}>
              Animaland
            </Text>
            <MaterialCommunityIcons name="dog" size={30} color="white"
            />
          </View>
        </View>


        <Image style={styles.img}
          source={require('../../../../assets/images/DogAndCat.jpeg')}
        />

        <Text style={styles.txt}>
          Crea una nueva cuenta ahora
        </Text>
        <View style={styles.BE}>

          <View style={styles.BI}>
            <FontAwesome name="user" size={24} color="#FFE8A3"
            />
            <TextInput style={styles.txtI}
              placeholder=" Usuario"
              value={usuario}
              onChangeText={setUsuario}
            />
          </View>

          <View style={styles.BI}>
            <Feather name="phone" size={24} color="#FFE8A3"
            />
            <TextInput style={styles.txtI}
              placeholder=" Número de Teléfono"
              value={numt}
              onChangeText={setNumT}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="email" size={24} color="#FFE8A3"
            />
            <TextInput style={styles.txtI}
              placeholder=" Email"
              value={email}
              onChangeText={setEmail} />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="password" size={24} color="#FFE8A3"
            />
            <TextInput style={styles.txtI}
              placeholder=" Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="password" size={24} color="#FFE8A3"
            />
            <TextInput style={styles.txtI}
              placeholder=" Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.row}>
          <Image style={styles.imgD}
            source={require('../../../../assets/images/DOG.png')}
          />

          <TouchableOpacity style={styles.button}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.txtB}>
              Crear cuenta
            </Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text>
            ¿Ya tienes una cuenta?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}>
            <Text style={styles.txtSI}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  txtSU: {
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)'
  },
  img: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
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
  txt: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 6,
    color: "#6B7280",
  },
  BE: {
    marginHorizontal: 16
  },
  BI: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAC193',
    borderRadius: 14,
    paddingHorizontal: 10,
    padding: 2,
    marginVertical: 6,
  },
  II: {
    marginRight: 10,
  },
  txtI: {
    fontSize: 18,
    marginVertical: 8,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  txtC: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#E5DCCC',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginVertical: 10,
  },
  txtB: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'black'
  },
  imgD: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  txtSI: {
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  buttonSI: {
    marginHorizontal: 5
  },
})