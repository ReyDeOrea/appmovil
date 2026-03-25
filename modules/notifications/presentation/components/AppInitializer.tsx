import { usePushNotifications } from "@/modules/notifications/presentation/hooks/usePushNotifications";
import * as Notifications from 'expo-notifications';
/**
 * Component que inicializa la app y lanzar el hook de notificaciones
 * @param children 
 * @returns 
 */

// Configuración inicial del handler (Solo debe ejecutarse una vez al iniciar la App)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,   // Requerido por TS para iOS/Android
    shouldShowBanner: true, // Requerido por TS para iOS/Android
  }),
});

export function AppInitializer({ children }: { children: React.ReactNode }) {
  usePushNotifications();
  return <>{children}</>;
}