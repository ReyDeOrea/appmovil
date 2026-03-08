import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../domain/pet";

export async function checkFavoritePet(userId: string, petId: string): Promise<boolean> {
  const data = await AsyncStorage.getItem(`favorites_${userId}`);
  const favorites: Pet[] = data ? JSON.parse(data) : [];

  const exists = favorites.some((pet) => pet.id.toString() === petId);
  return exists;
}