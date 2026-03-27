import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from "expo-router";
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { checkUserExists } from "../../application/checkUserExists";
import { registerUser } from "../../application/registerUser";
import { validateSignUpData } from "../../application/validateSignUpData";

export default function SignUp() {

  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [numt, setNumT] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    try {

      setLoading(true);

      validateSignUpData({
        username: usuario,
        phone: numt,
        email,
        password,
        confirmPassword
      });

      await checkUserExists(
        email.trim().toLowerCase(),
        usuario.trim(),
        numt.trim()
      );

      await registerUser({
        email,
        username: usuario,
        password,
        phone: numt,
        avatar_url: avatarUrl
      });

      Alert.alert("Cuenta creada");
      router.replace("/catalog");
    }
    catch (err: any) {
      Alert.alert("Error", err.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (

    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.rowHeader}>
            <Text style={styles.title}>Animaland</Text>
            <MaterialCommunityIcons name="dog" size={30} color="#fff" />
          </View>

        </View>

        <Image
          style={styles.img}
          source={require('../../../../assets/images/DogAndCat.jpeg')}
        />

        <Text style={styles.txt}>
          Crea una nueva cuenta ahora
        </Text>

        <View style={styles.BE}>

          <View style={styles.BI}>
            <FontAwesome name="user" size={22} color="#D4B37A" />
            <TextInput
              style={styles.txtI}
              placeholder="Usuario"
              placeholderTextColor="#999"
              value={usuario}
              onChangeText={setUsuario}
            />
          </View>

          <View style={styles.BI}>
            <Feather name="phone" size={22} color="#D4B37A" />
            <TextInput
              style={styles.txtI}
              placeholder="Número de teléfono"
              placeholderTextColor="#999"
              value={numt}
              onChangeText={setNumT}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="email" size={22} color="#D4B37A" />
            <TextInput
              style={styles.txtI}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="password" size={22} color="#D4B37A" />
            <TextInput
              style={styles.txtI}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="password" size={22} color="#D4B37A" />
            <TextInput
              style={styles.txtI}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

        </View>

        <View style={styles.row}>

        <FontAwesome6  style={styles.imgD} name="cat" size={26} color="#B7C979" />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >

            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.txtB}>Crear cuenta</Text>
            }

          </TouchableOpacity>

        </View>

        <View style={styles.row}>

          <Text>¿Ya tienes una cuenta?</Text>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.txtSI}> Iniciar sesión</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#FDF8F0",
    paddingBottom: 40,
  },
  header: {
    width: "100%",
    height: 90,
    paddingTop: 35,
    backgroundColor: "#B7C979",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: "#fff",
    marginRight: 6,
  },
  backBtn: {
    position: "absolute",
    left: 15,
    top: 45,
  },
  img: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  txt: {
    textAlign: 'center',
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  BE: {
    marginHorizontal: 20,
  },
  BI: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAC193',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  txtI: {
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
    color: "#000"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#dee8b4',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 50,
  },
  txtB: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  imgD: {
    marginRight:8,
  },
  txtSI: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

});