export type PushNotificationData = {
  title: string;
  body: string;
  extra?: any;
};

export const sendPushNotification = async (
  token: string,
  data: PushNotificationData
) => {
  try {
      console.log("ENVIANDO A:", token);


     const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: data.title,
        body: data.body,
        data: data.extra,
      }),
    });
    const result = await response.json();
    console.log("RESPUESTA EXPO:", result);

  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};