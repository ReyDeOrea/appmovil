import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ResetPasswordUseCase } from '../../application/resetPassword';
import { VerifyUserUseCase } from '../../application/verifyUserCase';
import { UserProfile } from "../../domain/user";
import { SupabaseUserRepository } from '../../infraestructure/userDataSource';
import NewPasswordModal from './NewPasswordModal';

export default function Password() {
  const router = useRouter();
  const userRepo = new SupabaseUserRepository();
  const verifyUserUseCase = new VerifyUserUseCase(userRepo);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepo);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const user = await verifyUserUseCase.execute(username, email);
      setProfile(user);
      setModalVisible(true);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordChange = async (newPass: string, confirmPass: string) => {
    if (!profile) return;

    try {
       await resetPasswordUseCase.execute({
      user: profile,
      newPassword: newPass,
      confirmPassword: confirmPass,
      });

      Alert.alert("Listo", "Contraseña actualizada correctamente");
      setModalVisible(false);
      router.back();
    }
    catch (err: any) {
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

        <Image style={styles.img} source={require('../../../../assets/images/Cat.jpeg')} />

        <Text style={styles.subtitle}>Ingresa tu usuario y correo</Text>

        <View style={styles.BI}>
          <TextInput
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.BI}>
          <MaterialIcons name="email" size={24} color="#FFE8A3" />
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ flex: 1 }}
          />
        </View>

        <TouchableOpacity style={styles.button}
          onPress={handleVerify} 
          disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.txtBtn}>Verificar</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}>
          <Text style={styles.txtSI}>Volver</Text>
        </TouchableOpacity>

      </View>

      <NewPasswordModal
        visible={modalVisible}
        loading={loading}
        onClose={() => setModalVisible(false)}
        onSubmit={handlePasswordChange}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    flexGrow: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
});