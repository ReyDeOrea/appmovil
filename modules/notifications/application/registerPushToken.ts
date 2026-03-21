import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type PushToken = string;

// Definición de la función de adaptador (Gateway) que el Caso de Uso requiere
type SendTokenToBackendAdapter = (token: PushToken) => Promise<void>;

/**
 * Caso de Uso: Solicita permisos, obtiene el token push y lo registra a través del adaptador.
 * @param sendTokenToBackendAdapter La función de infraestructura (adaptador) para comunicarse con la API.
 * @returns El token push o null si falla.
 */
export async function registerForPushNotificationsAsync(
  sendTokenToBackendAdapter: SendTokenToBackendAdapter,
): Promise<PushToken | null> {
  let token: PushToken | null = null;

  if (!Device.isDevice) {
    // console.warn('Push Notifications require a physical device.');
    return null;
  }
  
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
     // console.error('projectId is missing in app.json for EAS.');
     return null;
  }

  // Configuración de Canal (Android)
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'General Notifications',
        importance: Notifications.AndroidImportance.MAX,
        showBadge: true,
        vibrationPattern: [0, 250, 250, 250],
      });
    } catch (e) {
      // console.error('Error creando canal Android:', e);
    }
  }

  // Solicitar permiso para envío de notificaciones
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    // console.error('Permission to receive push notifications was denied!');
    return null;
  }
  
  // Obtención del token
  try {
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (e) {
    // console.error('Error obtaining ExpoPushToken:', e);
    return null;
  }

  // Envío del Token
  if (token) {
    await sendTokenToBackendAdapter(token);
  }

  return token;
}