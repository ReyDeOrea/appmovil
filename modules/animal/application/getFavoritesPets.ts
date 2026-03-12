import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../domain/pet";
import { getPetsUseCase } from "./getPets";

export const getFavoritesPetsUseCase = async (): Promise<Pet[]> => {
  const userData = await AsyncStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) return [];

  const data = await AsyncStorage.getItem(`favorites_${user.id}`);
  const favs: Pet[] = data ? JSON.parse(data) : [];

  const allPets = await getPetsUseCase();

  const updatedFavorites = favs
    .map(fav => allPets.find(p => p.id === fav.id))
    .filter((pet): pet is Pet => !!pet && pet.adopted !== true);

  await AsyncStorage.setItem(
    `favorites_${user.id}`,
    JSON.stringify(updatedFavorites)
  );

  return updatedFavorites;
};