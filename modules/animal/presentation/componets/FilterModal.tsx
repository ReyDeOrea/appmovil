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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 8
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  section: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8
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
    backgroundColor: "#f1f5f9",
    borderRadius: 20
  },

  btnActive: {
    backgroundColor: "#d09100"
  },

  txt: {
    fontSize: 14
  },

  txtActive: {
    color: "#fff",
    fontWeight: "bold"
  },

  close: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    alignItems: "center"
  },

  txtClose: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  }

});