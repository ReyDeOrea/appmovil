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
  adopted: boolean;
}

type ArrayFilterKey = "type" | "sex" | "size";

export function FilterModal({ visible, onClose, filters, setFilters }: FilterModalProps) {

  const toggleFilter = (key: ArrayFilterKey, value: string) => {
    const arr = filters[key] || [];
    const lowerValue = value.toLowerCase();

    if (arr.map(v => v.toLowerCase()).includes(lowerValue)) {
      setFilters({
        ...filters,
        [key]: arr.filter(v => v.toLowerCase() !== lowerValue)
      });
    }
    else {
      setFilters({
        ...filters,
        [key]: [...arr, value]
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      sex: [],
      size: [],
      adopted: false
    });
  };

  const renderButtons = (key: ArrayFilterKey, options: string[]) => (
    <View style={styles.row}>
      {options.map(v => (
        <TouchableOpacity
          key={v}
          style={[
            styles.btn,
            (filters[key] as string[])?.map(f => f.toLowerCase()).includes(v.toLowerCase()) && styles.btnActive
          ]}
          onPress={() => toggleFilter(key, v)}
        >
          <Text
            style={
              (filters[key] as string[])
                ?.map(f => f.toLowerCase())
                .includes(v.toLowerCase())
                ? styles.txtActive
                : styles.txt
            }
          >
            {v}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>Filtros</Text>

          <Text style={styles.section}>Tipo</Text>
          {renderButtons("type", ["Perro", "Gato"])}

          <Text style={styles.section}>Sexo</Text>
          {renderButtons("sex", ["Hembra", "Macho"])}

          <Text style={styles.section}>Tamaño</Text>
          {renderButtons("size", ["Pequeño", "Mediano", "Grande"])}

          <Text style={styles.section}>Animales adoptados</Text>

          <TouchableOpacity
            style={[styles.btn, filters.adopted && styles.btnActive]}
            onPress={() => setFilters({ ...filters, adopted: !filters.adopted })}
          >
            <Text style={filters.adopted ? styles.txtActive : styles.txt}>
              Mostrar animales adoptados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clear}
            onPress={clearFilters}
          >
            <Text style={styles.txtClear}>Limpiar filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.close}
            onPress={onClose}
          >
            <Text style={styles.txtClose}>Cerrar</Text>
          </TouchableOpacity>

        </View>

      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20
  },

  container: {
    backgroundColor: "#FDF8F0",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "#E8E0D0",
    elevation: 5
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#311c1c"
  },

  section: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
    color: "#311c1c"
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10
  },

  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DAC193"
  },

  btnActive: {
    backgroundColor: "#D4B37A",
    borderColor: "#D4B37A"
  },

  txt: {
    fontSize: 14,
    color: "#311c1c"
  },

  txtActive: {
    color: "#fff",
    fontWeight: "bold"
  },

  clear: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#E8B4B4",
    borderRadius: 10,
    alignItems: "center"
  },

  txtClear: {
    color: "#fff",
    fontWeight: "bold"
  },

  close: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#B7C979",
    borderRadius: 12,
    alignItems: "center"
  },

  txtClose: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  }

});