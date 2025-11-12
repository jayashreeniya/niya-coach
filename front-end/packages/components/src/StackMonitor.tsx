import React, { useEffect, useState } from "react";

import { useAppState } from "./context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage"
import storage from "../../framework/src/StorageProvider";
// @ts-ignore
import PushNotification from "react-native-push-notification";
import { fcmService } from "./FCMservice";

import { localNotificationService } from './LocalNotificationService'
import { Platform } from "react-native";

type Props = {
  empStack: React.ReactNode;
  guestStack: React.ReactNode;
  coachStack: React.ReactNode;
  splashScreen: React.ReactNode;
  hrStack: React.ReactNode;
  adminStack: React.ReactNode;
  newUsrStack: React.ReactNode;
  reassStack: React.ReactNode;
}

const getActiveStack=(auth:boolean,role:string,isNew:boolean,isshowReass:boolean,Props:any)=>{
  if(auth)
  {
    if((role === "" || role === "employee"))
    {
      if(isNew)
      {
        return Props.newUsrStack;
      }
      else if(isshowReass)
      {
        return Props.reassStack;
      }
      else{
        return Props.empStack;
      }
    }
    else if(role === "hr")
    {
      return Props.hrStack;
    }
    else if(role === "admin")
    {
      return Props.adminStack
    }
    else{
      return Props.coachStack;
    }
  }
  else{
    return Props.guestStack;
  }
  
}

const StackMonitor: React.FC<Props> = ({ empStack, guestStack, coachStack, splashScreen, hrStack, adminStack, newUsrStack, reassStack }) => {
  const props:Props={empStack, guestStack, coachStack, splashScreen, hrStack, adminStack, newUsrStack, reassStack};
  const { auth, role, isNew, isshowReass,token } = useAppState();
  const [showSplash, setShowSlpash] = useState<boolean>(true);
  const buildAndroidNotification = (id: any, title: string, message: string, data:any = {}, options:any = {}) => {
    return {
      channelId: options.channelId ? options.channelId : "default-channel-id",
      id: id,
      autoCancel: true,
      bigText: message || "",
      dubText: title || "",
      vibrate: true,
      vibration: 300,
      priority: "high",
      importance: "high",
      data: data,


    };
  };


  const showNotification = (id: any, title: string, message: string, data :any= {}, options:any = {}) => {
    console.log("____calling+___");
    PushNotification.localNotification({
      ...buildAndroidNotification(id, title, message, data, options),


      //ios and android properties
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      userInteraction: false
    });
  };

  function onNotification(notify: any, callOpen: any) {

    if (Platform.OS === "android" && callOpen === true) {
      console.log("Cliekd it ")
    } else {
      if (Platform.OS == "android") {
         showNotification(
          0,
          notify.notification.title,
          notify.notification.body,
          notify.notification
          // options
        );
      } else {
        showNotification(
          0,
          notify.notification.title,
          notify.notification.body,
          notify.notification
        );
      }
    }

      
  }
  async function onRegister(token: any) {
    console.log("00000sDev reg ce ",token);
    if (token) {
      await AsyncStorage.setItem("fcmToken", token);
      // await storage.set("fcmToken", token);
      console.log(token, "inside ####stack montior");
    }
  }
  function onOpenNotification (notify: any) {
    let notificationObj = null;
    if (Platform.OS === "ios") {
      if (notificationObj != null) {
        console.log(notificationObj, "os ios //");
       
      } else {
        // when app is opend from killed state
        console.log("//////////88787878787878888", notify.notification);
        if (notify?.data) {
          console.log("notifcation data");
        } else {
          console.log(notify, "no data present ");
        }
      }
    } else {
      console.log("android =======", notify);
      if (notify.userInteraction === true) {
        console.log("******** =======", notify);
        if (notificationObj != null) {
          console.log("******** =======", notificationObj, "notificationObj");


        }
        else {
          console.log("******** else part =======", notify);

          //new changes not yet tested


        }
      }
    }
  }

useEffect(() => {
  localNotificationService.createDefaultChannels();
  fcmService.registerAppWithFCM();
  fcmService.register(onRegister, onNotification, onOpenNotification);
  localNotificationService.configure(
    onOpenNotification,
  );

  setTimeout(() => {
    setShowSlpash(false);
  }, 1000);

}, [token]);

if (showSplash) {
  return <>{splashScreen}</>
}

return (
  <>
    {
      getActiveStack(auth,role,isNew,isshowReass,props)
    }
  </>
);
}

export default StackMonitor;