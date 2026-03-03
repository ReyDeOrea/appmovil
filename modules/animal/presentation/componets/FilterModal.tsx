import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export interface Filters {
  type: string[];
  sex: string[];
  size: string[];
}

export function FilterModal({ visible, onClose, filters, setFilters }: FilterModalProps) {
  const toggleFilter = (key: keyof Filters, value: string) => {
    const arr = filters[key] || [];
    const lowerValue = value.toLowerCase();

    if (arr.map(v => v.toLowerCase()).includes(lowerValue)) {
      setFilters({ ...filters, [key]: arr.filter(v => v.toLowerCase() !== lowerValue) });
    } else {
      setFilters({ ...filters, [key]: [...arr, value] });
    }
  };

  const renderButtons = (key: keyof Filters, options: string[]) => (
    <View style={styles.row}>
      {options.map(v => (
        <TouchableOpacity
          key={v}
          style={[styles.btn, filters[key].map(f => f.toLowerCase()).includes(v.toLowerCase()) && styles.btnActive]}
          onPress={() => toggleFilter(key, v)}
        >
          <Text style={filters[key].map(f => f.toLowerCase()).includes(v.toLowerCase()) ? styles.txtActive : undefined}>
            {v}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Filtros</Text>

        <Text>Tipo</Text>
        {renderButtons("type", ["Perro", "Gato"])}

        <Text>Sexo</Text>
        {renderButtons("sex", ["Hembra", "Macho"])}

        <Text>Tamaño</Text>
        {renderButtons("size", ["Pequeño", "Mediano", "Grande"])}

        <TouchableOpacity style={styles.close}
          onPress={onClose} >
          <Text style={styles.txtClose}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10
  },
  btn: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 10
  },
  btnActive: {
    backgroundColor: "#d09100"

  },
  txtActive: {
    color: "#fff",
    fontWeight: "bold"
  },
  close: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#22c55e",
    borderRadius: 10,
    alignItems: "center"
  },
  txtClose: {
    color: "#fff",
    fontWeight: "bold"
  }
});