import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../domain/pet";

export async function saveAdoptionRequest(userId: string, pet: Pet) {

  const key = `adoptionRequest_${userId}`;

  const data = await AsyncStorage.getItem(key);
  const requests: Pet[] = data ? JSON.parse(data) : [];

  const exists = requests.some(p => p.id === pet.id);

  if (!exists) {
    requests.push(pet);
  }

  await AsyncStorage.setItem(key, JSON.stringify(requests));
}