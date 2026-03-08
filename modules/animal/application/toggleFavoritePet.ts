import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../domain/pet";

export async function toggleFavoritePet(userId: string, pet: Pet): Promise<boolean> {
  const data = await AsyncStorage.getItem(`favorites_${userId}`);
  let favorites: Pet[] = data ? JSON.parse(data) : [];

  let isFavorite = favorites.some((p) => p.id === pet.id);

  if (isFavorite) {
    favorites = favorites.filter((p) => p.id !== pet.id);
    isFavorite = false;
  } else {
    favorites.push(pet);
    isFavorite = true;
  }

  await AsyncStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));

  return isFavorite;
}