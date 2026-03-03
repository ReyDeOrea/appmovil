import { supabase } from "@/lib/supabase";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { useState } from "react";

import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Password() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Ingresa tu correo")
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      Alert.alert("Listo", "Te enviamos un correo para cambiar tu contraseña")
      router.back()

    } catch (err: any) {
      Alert.alert("Error", err.message)
    } finally {
      setLoading(false)
    }
  }

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
          source={require('../../../../assets/images/Cat.jpeg')}
        />

        <Text style={styles.subtitle}>Ingresa tu correo</Text>

        <View style={styles.BI}>
          <MaterialIcons name="email" size={24} color="#FFE8A3"
          />
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button}
          onPress={handleReset}
          disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.txtBtn}>Enviar enlace</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}>
          <Text style={styles.txtSI}>Volver</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DAC193",
    borderRadius: 14,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#E5DCCC",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginVertical: 10,
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  txtSI: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
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
  txtSU: {
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)'
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 999,
    alignSelf: 'center',
    marginVertical: 10,
  },
})