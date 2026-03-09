import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deletePetUseCase } from "../../application/deletePet";

interface DeletePetModalProps {
  visible: boolean;
  onClose: () => void;
  petId: string | null;
  onDeleted?: () => void;
}

export default function DeletePetModal({ visible, onClose, petId, onDeleted }: DeletePetModalProps) {

  const handleDeletePet = async () => {
    if (!petId) return;

    try {
      await deletePetUseCase(petId);

      Alert.alert("Mascota eliminada");
      onClose();
      onDeleted && onDeleted();

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmDelete = () => {
    handleDeletePet();
  };

  return (
    <Modal
      visible={visible}
      transparent animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>

          <View style={styles.b}>
            <View style={styles.row}>
              <Text style={styles.modalTitle}>Eliminar Mascota</Text>
            </View>
          </View>


          <Text style={{ marginBottom: 20 }}>¿Estas seguro de querer eliminar el perfil del animal?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.txtBC}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]}
              onPress={confirmDelete}>
              <Text style={styles.buttonText}>Si</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: 'white'
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    flex: 1, padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: "#ff0000"
  },
  txtBC: {
    color: 'white'
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  b: {
    width: "100%",
    height: 60,
    backgroundColor: "#D4B37A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  deleteButton: {
    backgroundColor: "#E5DCCC"
  },
  buttonText: {
    fontWeight: "bold"

  },
});