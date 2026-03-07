import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ModalMenu } from "../../../user/presentation/components/modalMenu";
import { getPetsUseCase } from "../../application/getPets";
import { Pet } from "../../domain/pet";
import { FilterModal, Filters } from "../componets/FilterModal";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.28;
const IMAGE_SIZE = width * 0.23;
const BANNER_HEIGHT = width * 0.42;

type BannerItem = {
  type: "static" | "adopted";
  image: any;
  name?: string;
};

export default function CatalogView() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: [],
    sex: [],
    size: [],
    adopted: false,
  });
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bannerPage, setBannerPage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petPages, setPetPages] = useState<{ [id: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const u = await AsyncStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchPets = async () => {
        try {
          setLoading(true);
          const data = await getPetsUseCase();
          setPets(data);
        } catch (err) {
          console.error("ERROR fetching pets:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchPets();
    }, [])
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  const adoptedPets = pets.filter((p) => p.adopted === true);

  const staticBanners: BannerItem[] = [
    { type: "static", image: require("../../../../assets/images/D.png") },
    { type: "static", image: require("../../../../assets/images/Cat.jpeg") },
    { type: "static", image: require("../../../../assets/images/DOG.png") },
  ];

  const adoptedBanners: BannerItem[] = adoptedPets.map((p) => ({
    type: "adopted",
    image: { uri: p.image_url },
    name: p.name,
  }));

  const bannerImages: BannerItem[] = [...staticBanners, ...adoptedBanners];

  const filteredPets = pets.filter((p) => {
    const term = search.toLowerCase();
    if (search) {
      if (
        !p.name?.toLowerCase().includes(term) &&
        !String(p.type ?? "").toLowerCase().includes(term) &&
        !String(p.sex ?? "").toLowerCase().includes(term) &&
        !String(p.size ?? "").toLowerCase().includes(term) &&
        !String(p.age ?? "").toLowerCase().includes(term)
      )
        return false;
    }

 if (
    filters.type.length > 0 &&
    !filters.type.map(t => t.toLowerCase()).includes(String(p.type).toLowerCase())
  ) {
    return false;
  }

  if (
    filters.sex.length > 0 &&
    !filters.sex.map(s => s.toLowerCase()).includes(String(p.sex).toLowerCase())
  ) {
    return false;
  }
  if (
    filters.size.length > 0 &&
    !filters.size.map(s => s.toLowerCase()).includes(String(p.size).toLowerCase())
  ) {
    return false;
  }
    if (filters.adopted) {
      if (p.adopted !== true) return false;
    } else {
      if (p.adopted === true) return false;
    }
    return true;
  });

  const chunks: Pet[][] = [];
  for (let i = 0; i < filteredPets.length; i += 3) {
    chunks.push(filteredPets.slice(i, i + 3));
  }

  const renderPet = (pet: Pet) => {
    const isAdopted = pet.adopted === true;

    let images: string[] = [];
    try {
      images = JSON.parse(pet.image_url || "[]");
      if (!Array.isArray(images)) images = [images];
    } catch {
      images = pet.image_url ? [pet.image_url] : [];
    }

    const currentPage = petPages[pet.id] || 0;

    return (
      <TouchableOpacity
        style={[styles.CC, isAdopted && { backgroundColor: "#F3F3F3" }]}
        key={pet.id}
        activeOpacity={isAdopted ? 1 : 0.7}
        disabled={isAdopted}
        onPress={() => {
          if (isAdopted) return;
          router.push({
            pathname: "/profileAnimal",
            params: { pet: JSON.stringify(pet) },
          });
        }}
      >

        <Image
          source={{ uri: images[0] }}
          style={[styles.img, isAdopted && { opacity: 0.4 }]}
        />

        <Text style={styles.N}>{pet.name}</Text>
        <Text style={styles.D}>{pet.sex}</Text>
        <Text style={styles.D}>{pet.size}</Text>

        {isAdopted && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>¡{pet.name} ha sido adoptado!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.b}>
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.txtN}>Animaland</Text>
              <MaterialCommunityIcons name="dog" size={33} color="#fff" />
            </View>

            <TouchableOpacity onPress={() => setModalOpen(true)}>
              <Feather name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.S}>
          <Feather name="search" size={20} color="#5B4000" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar"
            placeholderTextColor="#999"
            style={styles.TI}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.F} onPress={() => setFilterOpen(true)}>
            <Ionicons name="filter-outline" size={24} color="#D09100" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) =>
            setBannerPage(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          scrollEventThrottle={16}
        >
          {bannerImages.map((item, idx) => (
            <View
              key={idx}
              style={{ width, alignItems: "center", marginVertical: 10 }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={item.image}
                  style={[styles.imgD, { width: width * 0.9 }]}
                />
                {item.type === "adopted" && (
                  <View style={styles.successBadge}>
                    <Text style={styles.successText}>
                      ¡ {item.name} ahora tiene una familia! 🐾
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.BP}>
          {bannerImages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, bannerPage === i && styles.dotActive]}
            />
          ))}
        </View>

        <View>
          {chunks.map((row, idx) => (
            <View
              key={idx}
              style={{
                width,
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              {row.map(renderPet)}
            </View>
          ))}
        </View>
      </ScrollView>

      
      <ModalMenu
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        setUser={setUser}
        onUpdate={() => setRefresh(!refresh)}
      />

      <FilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FDF8F0" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginVertical: 10,
  },

  b: {
    width: "100%",
    height: 100,
    backgroundColor: "#B7C979",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  txtN: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    marginRight: 5,
  },

  S: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7E6950",
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 10,
    backgroundColor: "#E5DCCC",
  },

  TI: {
    flex: 1,
    height: 45,
    color: "#333",
    fontSize: 16,
  },

  F: { marginLeft: 10 },

  imgD: {
    height: BANNER_HEIGHT,
    borderRadius: 20,
  },

  BP: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 5,
  },

  dotActive: {
    backgroundColor: "#D09100",
  },

  CC: {
    width: CARD_WIDTH,
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 2,
  },

  img: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 15,
    marginBottom: 5,
  },

  N: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 2,
  },

  D: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
  },

  badge: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000",
  },

  successBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#22c55e",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },

  successText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});