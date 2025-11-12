import React from "react";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

class FCMService {
  register = (onRegister: (token: any) => Promise<void>, onNotification: (notify: any, callOpen: any) => void, onOpenNotification: (notify: any) => void) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === "ios") {
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister: (token: any) => Promise<void>) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
           //user has permissions
          this.getToken(onRegister);
        } else {
          //user dont bhav permissions
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
          });
  };

  getToken = (onRegister:any) => {
      messaging()
      .getToken()
      .then((fcmToken) => {
        console.log("---token---", fcmToken);
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log("user dontb hjave device token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  requestPermission = (onRegister:any) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
         });
  };

  deleteToken = () => {
     messaging()
      .deleteToken()
      .catch((error) => {
   
      });
  };

  createNotificationListeners = (
    onRegister:any,
    onNotification:any,
    onOpenNotification:any
  ) => {
    //when application is running but in background

    messaging().onNotificationOpenedApp((remoteMessage) => {
    
      if (remoteMessage) {
   
        onOpenNotification(remoteMessage);
      }
    });

    //when the applicstion is opened from a quite state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "when the applicstion is opened from a quite state--------",
            remoteMessage
          );
          onOpenNotification(remoteMessage);
        
        }
      });

    //foreground state message
   messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage) {
       
        onNotification(remoteMessage, false);
      }
    });

    //Trigger when have new token
    messaging().onTokenRefresh((fcmToken) => {
    
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
  console.log("unRegister listener");
  };
}

export const fcmService = new FCMService();
