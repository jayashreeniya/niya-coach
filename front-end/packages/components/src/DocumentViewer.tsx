import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, AppState, BackHandler, Platform } from "react-native";
import WebView from "react-native-webview";
import Orientation from "react-native-orientation-locker";

import { back } from "../../blocks/AudioLibrary/src/assets";
import { Colors, dimensions } from "../../components/src/utils";
import Typography from "./Typography";
import Tts from 'react-native-tts';
import Scale from "../../framework/src/Scale";

const DocumentViewer: React.FC<any> = ({ navigation }) => {

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const url = navigation.getParam("url");
  console.log("URL: ", url)
  const title = navigation.getParam("title");
  const textContent: string = navigation.getParam("fileContent");

  useEffect(() => {
    Tts.getInitStatus().then(initTts);
    return () => {
    };
  }, []);

  const initTts = async () => {
    const voices = await Tts.voices();
    console.log('@@@ Available Voices =========', voices)
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
      Tts.stop();
    };
  }, [backButtonHandler]);

  function backButtonHandler() {
    Tts.stop();
    return false;
  }

  useEffect(() => {
    const subscription: any = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!', appState);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);

      if (appState.current == "inactive" || appState.current == "background") {
        Tts.stop();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const readText = () => {
    Tts
      .getInitStatus()
      .then(async () => {
        Tts.speak(textContent.substring(0, 3998), {
          iosVoiceId: 'com.apple.voice.compact.en-US.Samantha',
          rate: 0.35,
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          }
        });
      })
      .catch((err) => {
        console.log(err, "::::::::");
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
        else {
          Tts.setDefaultLanguage('en-US');
          if (Platform.OS === 'android') {
            Tts.requestInstallData();
          }
        }
      });
  }

  const stopReading = () => {
    Tts.stop();
  }

  const onGoBack = () => {
    Tts.stop();
    navigation.goBack();
  }

  return (
    <>
      <StatusBar barStyle="default" />
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: Colors.accent }}>
          <View style={{ flexDirection: 'column', width: '75%' }}>
            <View style={styles.backButton}>
              <TouchableOpacity onPress={onGoBack}>
                <Image source={back} style={styles.backIcon} />
              </TouchableOpacity>
              <View style={{ width: '70%', marginLeft: '10%' }}>
                <Typography size={16} lines={1} font="MED" color="white" style={{ alignSelf: 'center', textAlign: 'center' }}>{title}</Typography>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end', alignSelf: 'center' }}>
            <TouchableOpacity onPress={readText}>
              <Typography size={14} font={"BLD"} color={"white"} >{"Listen"}</Typography>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end', alignSelf: 'center', marginLeft: Scale(10) }}>
            <TouchableOpacity onPress={stopReading}>
              <Typography size={14} font={"BLD"} color={"white"} >{"Stop"}</Typography>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={{ flex: 1, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', margin: 20 }}>
            <Text style={{ color: 'black', textAlign: 'left', textAlignVertical: 'center' }} >{textContent}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  backButton: {
    // backgroundColor: Colors.accent,
    width: "100%",
    paddingTop: dimensions.wp(7),
    paddingBottom: dimensions.wp(7),
    paddingLeft: dimensions.wp(4),
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 5
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(4),
    marginTop: Scale(3)
  }
});

export default DocumentViewer;
