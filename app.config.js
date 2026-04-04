export default{
  "expo": {
    "name": "Animaland",
    "slug": "appmovil",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/Logo.jpeg",
    "scheme": "appmovil",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/Logo.jpeg",
        "backgroundImage": "./assets/images/Logo.jpeg",
        "monochromeImage": "./assets/images/Logo.jpeg"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ],
      "package": "com.animaland.appmovil",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON,
      "useNextNotificationsApi": true, 
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "1d9011b0-8f9b-404d-94d9-5e7e083109bc"
      }
    }
  }
}
