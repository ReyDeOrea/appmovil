import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { registerForPushNotificationsAsync } from '../../application/registerPushToken';


type NotificationData = {
  type?: string;
};

// tipo de la suscripción que devuelve cada función 'add...Listener'
type NotificationListener = NonNullable<ReturnType<typeof Notifications.addNotificationReceivedListener>>;
type ResponseListener = NonNullable<ReturnType<typeof Notifications.addNotificationResponseReceivedListener>>;

/**
 * Hook para inicializar notificaciones push y configurar listeners.
 */
export const usePushNotifications = () => {
  const notificationListener = useRef<NotificationListener>(undefined);
  const responseListener = useRef<ResponseListener>(undefined);

  useEffect(() => {
    // verificar permisos de notificaciones
    registerForPushNotificationsAsync(async (token) => {
      console.log("Token:", token);
    });
    // Listener para notificaciones recibidas (App en primer plano)
    // La función devuelve el objeto de suscripción, tipo: NotificationListener
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // console.log('Notification received in foreground:', notification.request.content);
    });

    // Listener para interacciones (Usuario toca la notificación)
    // La función devuelve el objeto de suscripción, tipo: ResponseListener
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as unknown as NotificationData;

      handleNotificationNavigation(data);
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);
};

export function handleNotificationNavigation(data?: NotificationData) {
  if (
    data?.type === 'ADOPTION_ACCEPTED' ||
    data?.type === 'ADOPTION_REJECTED'
  ) {
    router.push('/requests');
    return;
  }

  router.push('/requests');
}
// console.log(JSON.stringify(data.payload));

