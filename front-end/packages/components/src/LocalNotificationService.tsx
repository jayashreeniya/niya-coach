import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";


class LocaNotificationService {
  configure = (onOpenNotification:any) => {
    PushNotification.configure({
      onRegister: function (token:any) {
        console.log(token,"88888fcm ");
       },
    
      onNotification: notification => {
        if (!notification?.data) {
          return;
        }
        onOpenNotification(
          Platform.OS === "ios" ? notification.data : notification
        );
    },
      //IOS ONLY (optional) default :all _permission to resgister.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // popInitialNotification: false,
      popInitialNotification: true,

      requestPermissions: true,
    });
  };

  setPermissions = () => {
   
  };

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (required)
        channelName: `Default channel`, // (required)
        channelDescription: "A default channel", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created:any) =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: "sound-channel-id", // (required)
        channelName: `Sound channel`, // (required)
        channelDescription: "A sound channel", // (optional) default: undefined.
        soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created:any) =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  unregister = () => {
    PushNotification.unregister();
  };

  checkInitialNotification = () => {
    PushNotification.popInitialNotification((notification:any) => {
      console.log(notification);
    });
  };

  showNotification = (id:any, title:string, message:string, data = {}, options = {}) => {
 
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),
      message:message,

    });
  };

  buildAndroidNotification= (id:any, title:string, message:string, data:any = {}, options:any = {}) => {
    return {
      channelId: options.soundName ? "sound-channel-id" : "default-channel-id",
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "ic_launcher",
      smallIcon: options.smallIcon || "ic_launcher",
      bigText: message || "",
      dubText: title || "",
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data,
    };
  };

 

  cancelAllLocalNotifications = () => {
   
      PushNotification.cancelAllLocalNotifications();
 
  };

  removeAllDeliveredNotificationByID = (notificationId:any) => {
   
    PushNotification.cancelAllLocalNotifications();
  };
}

export const localNotificationService = new LocaNotificationService();
