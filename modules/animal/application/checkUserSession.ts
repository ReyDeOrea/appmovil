import AsyncStorage from "@react-native-async-storage/async-storage";

export async function checkUserSession(): Promise<boolean> {
  const userSession = await AsyncStorage.getItem("user");
  return !!userSession;
}

export async function getUserData() {
  const userData = await AsyncStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}