import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../../application/loginUser';
import { validateLoginData } from '../../application/validateLoginData';

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true);
      validateLoginData(username, password);
      await loginUser(username, password);
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
            <Text style={styles.txtSU}>Animaland</Text>
            <MaterialCommunityIcons name="dog" size={30} color="white" />
          </View>
        </View>

        <View style={styles.avatarBox}>
          <FontAwesome name="user-circle-o" size={180} color="#FFE8A3" />
        </View>

        <Text style={styles.txt}>Accede a tu cuenta para continuar</Text>

        <View style={styles.BE}>
          <View style={styles.BI}>
            <FontAwesome name="user" size={24} color="#FFE8A3"
            />
            <TextInput
              style={styles.txtI}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.BI}>
            <MaterialIcons name="password" size={24} color="#FFE8A3" />
            <TextInput
              style={styles.txtI}
              placeholder=" Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.txtB}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rp}>
          <FontAwesome6 name="shield-dog" size={30} color="#FFE8A3" />
          <TouchableOpacity onPress={() => router.push('/password')}>
            <Text style={styles.txtRP}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => router.push('/signUp')}>
            <Text style={styles.txtSI}> Regístrate</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({

  container: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  avatarBox: {
    alignItems: "center",
    marginVertical: 10,
  },
  txtSI: {
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  txt: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  txtSU: {
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)'
  },
  BE: {
    marginHorizontal: 16,
    marginTop: 10,
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
  BI: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAC193',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 6,
  },
  txtI: {
    fontSize: 18,
    flex: 1,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#E5DCCC',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 60,
    alignSelf: 'center',
    marginVertical: 15,
  },
  txtB: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  txtRP: {
    textAlign: "center",
    color: "#2ABAFD",
    fontWeight: "bold",
    marginBottom: 10,
  },
  rp: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
})