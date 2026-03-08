import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../domain/pet";

export async function checkAdoptionRequest(userId: string, petId: string): Promise<boolean> {
  const data = await AsyncStorage.getItem(`adoptionRequest_${userId}`);
  const requests: Pet[] = data ? JSON.parse(data) : [];

  const exists = requests.some((pet) => pet.id.toString() === petId);
  return exists;
}