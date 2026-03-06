import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModalMenuProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  setUser: (u: any) => void;
  onUpdate?: () => void;
}

export function ModalMenu({ visible, onClose, user, setUser, onUpdate }: ModalMenuProps) {

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    onUpdate?.();
    onClose();
    router.replace("/catalog");
  };

  return (
    <Modal
      visible={visible}
      transparent animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Menú</Text>

          {!user && (
            <>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  onClose();
                  router.push("/login");
                }}
              >
                <Text style={styles.btnText}>Iniciar sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  onClose();
                  router.push("/signUp");
                }}
              >
                <Text style={styles.btnText}>Registrarse</Text>
              </TouchableOpacity>
            </>
          )}

          {user && (
            <>
              <Text style={{ marginBottom: 10 }}> {user.username || user.email}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  onClose();
                  router.push("/account");
                }}
              >
                <Text style={styles.btnText}>Mi cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  onClose();
                  router.push("/mypets");
                  onUpdate?.();
                }}
              >
                <Text style={styles.btnText}>Mis mascotas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  onClose();
                  router.push("/favorites");
                }}
              >
                <Text style={styles.btnText}>Mis Mascotas Favoritas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={logout}
              >
                <Text style={styles.btnText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={onClose}>
            <Text style={{ color: "gray", textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
