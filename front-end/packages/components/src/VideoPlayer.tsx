// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image, Modal, StyleSheet, Dimensions, ActivityIndicator, Platform } from "react-native";
import Video from "react-native-video";
//@ts-ignore
import Slider from "react-native-slider";
import Orientation from "react-native-orientation-locker";

import { back } from "../../blocks/AudioLibrary/src/assets";
import { pause, play, fullscreen, minimize } from "./images";
import { dimensions, Colors } from "./utils";

type Props = {
  visible: boolean;
  url: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<Props> = ({ visible, url, onClose }) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [full, setFull] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const playerRef = useRef(null);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => Orientation.removeOrientationListener(handleOrientation);
  }, []);

  function handleOrientation(orientation: string) {
    if ((orientation === "LANDSCAPE-LEFT") || (orientation === "LANDSCAPE-RIGHT")) {
      setFull(true);
    } else {
      setFull(false);
    }
  }

  function handleLoad(meta: any) {
    setDuration(meta.duration);
    setLoading(false);
  }

  function handleProgress(prog: any) {
    if(prog.currentTime && duration){
      setProgress((prog.currentTime / duration));
    }
  }

  function handleEnd() {
    setPaused(true);
    setProgress(0);
  }

  function toggleVideo() {
    setPaused(p => !p);
  }

  function handleSeek(val: number) {
    if(loading){
      return;
    }
    setProgress(val);
    playerRef.current?.seek?.(duration * val);
  }

  function toggleControls() {
    setShowControls(c => !c);
  }

  function handleFullScreen() {
    if (full) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToLandscapeLeft();
    }
    setFull(!full)
    setPaused(true)
  }

  function renderDuration() {
    const secs = Math.floor(duration);
    return new Date(secs * 1000).toISOString().substring(14, 19);
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
    >
      <View style={[styles.container, full ? {} : styles.center]}>
        {showControls? (
        <TouchableOpacity
          onPress={onClose}
          style={styles.backButton}
        >
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>
        ): null}
        <TouchableOpacity
          onPress={toggleControls}
          activeOpacity={1}
          style={[styles.videoContainer, full ? styles.fullscreenVideo : styles.video]}
        >
          <Video
            source={{ uri: url }}
            paused={paused}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
            ref={playerRef}
            resizeMode="contain"
            fullscreen={full}
            onFullscreenPlayerWillDismiss={()=>{
              Platform.OS=="ios"?handleFullScreen(): null
            }}
            style={full && Platform.OS=="android" ? styles.fullscreenVideo : styles.video}
          />
          {showControls ? (
            <View style={styles.controls}>
              {loading ?
                <ActivityIndicator color={Colors.white} style={{ marginRight: dimensions.wp(4) }} /> :
                <TouchableOpacity onPress={toggleVideo}>
                  <Image style={styles.toggle} source={paused ? play : pause} />
                </TouchableOpacity>}
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={progress}
                onValueChange={handleSeek}
                maximumTrackTintColor='transparent'
                minimumTrackTintColor={Colors.white}
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
                step={.1}
              />
              {/* <Typography color="white">{renderDuration()}</Typography> */}
              <TouchableOpacity onPress={handleFullScreen}>
                <Image style={styles.backIcon} source={full ? minimize : fullscreen} />
              </TouchableOpacity>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    backgroundColor: Colors.black,
    width: dimensions.wp(10),
    height: dimensions.wp(10),
    position: "absolute",
    top:Platform.OS=="ios"? dimensions.wp(10) : dimensions.wp(4),
    left: dimensions.wp(4),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    borderRadius: dimensions.wp(5)
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    tintColor: Colors.white
  },
  videoContainer: {
    position: "relative"
  },
  // video: {
  //   width: dimensions.wp(100),
  //   height: dimensions.wp(100) * .5625
  // },
  video: {
    height: Dimensions.get('window').height*0.82,
    width: Dimensions.get('window').width
  },
  fullscreenVideo: {
    // flex:1,
    // height:'100%',
    // width:'100%'
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height
  },
  toggle: {
    height: dimensions.wp(8),
    width: dimensions.wp(8),
    resizeMode: "contain",
    tintColor: Colors.white,
    marginRight: dimensions.wp(5)
  },
  controls: {
    position: "absolute",
    width: "100%",
    height: dimensions.hp(10),
    bottom: "10%",
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: dimensions.wp(3),
    backgroundColor: "rgba(0,0,0,.4)"
  },
  slider: {
    flex: 1,
    marginRight: dimensions.wp(5)
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: Colors.white,
    borderRadius: 4
  },
  track: {
    height: 3,
    backgroundColor: "rgba(255,255,255,.5)"
  }
});

export default VideoPlayer;