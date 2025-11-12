// @ts-nocheck
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, ImageBackground, FlatList } from "react-native";
//@ts-ignore
import Slider from "react-native-slider";
import TrackPlayer, { useProgress, Track, State } from "react-native-track-player";

import { pause } from "../../blocks/dashboard/src/assets";
import { audioBg, audioIcon, trackFull } from "../../blocks/AudioLibrary/src/assets";
import { Song, setup, togglePlayer } from "./AudioPlayer";
import { dimensions, Colors } from "./utils";
import Typography from "./Typography";
import Scale from "../../framework/src/Scale";

type Props = {
  songs: any[];
  onPressItm: () => {};
  selectedItm: string;
  audio_pic: any;
}
type ItemData = {
 
  title: string;

};


const AudioList: React.FC<Props> = ({ songs, onPressItm, selectedItm, audio_pic }) => {

  const [current, setCurrent] = useState<string | number>("");
  const [paused, setPaused] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const progress = useProgress();
  const { position, duration } = useProgress();

  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (songs.length) {
      const track = songs.map((r: any) => ({
        id: r.id,
        url: r?.attributes?.file_info?.[0]?.url || "",
        title: r?.attributes?.file_info?.[0]?.title || "",
      }));
      getTracks(track);
    }
    return () => {
      TrackPlayer.seekTo(0);
      TrackPlayer.pause();
    }
  }, [songs.length]);

  async function getTracks(track: Song[]) {
    const queue = await setup(track);
    setTracks(queue);
  }

  async function handleSong(itm: any) {
    setStarted(true);
    if (paused && itm.id == selectedItm) {
      setPaused(false)
        TrackPlayer.play();
      }
    else if (itm.id == selectedItm) {
       setPaused(true)
      const { duration, state, State } = await togglePlayer();


    }
    else {
      const songs = [{
        id: itm.id,
        url: itm.url || "",
        title: itm.title || "",
      }];
      const track = await setup(songs);
      const { duration, state, State } = await togglePlayer();
      setPaused(state !== State.Playing);


    }


  }

  async function chekSongStatus() {
    const st = await TrackPlayer.getState();
    if (st == State.Stopped) {
      setCurrent("");
      setPaused(false);
    }
  }
  function format(seconds: number) {
    let tm: number = Number(duration - seconds);
    let mins = (parseInt(tm / 60)).toString().padStart(2, '0');
    let secs = (Math.trunc(tm) % 60).toString().padStart(2, '0');
    chekSongStatus();
    return `${mins}:${secs}`;
  }

 
  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = (item.id === selectedItm) && !paused ? pause : audioIcon;
    const color = (item.id === selectedItm) && !paused ? '#DBE013' : '#F3A020';
    const sliderval = (item.id === selectedItm) && started ? Math.floor(progress.position) : 0;
    const handletime = (item.id === selectedItm) && started ? format(progress.position) : "";
    return (
      <AudioItem
      item={item}
      aud_pic={audio_pic}
      onPress={() =>onPressItm(item)}
      bgImg={backgroundColor}
      textColor={color}
      currentItm={item.id === selectedItm ?selectedItm:""}
      pausedsong={paused}
      duration={duration}
      progress={progress}
      handleSeek={handletime}
      handleSelection={handleSong}
      sliderval={sliderval}

      />
      )

  
  }

  return (
    <View>
      <FlatList
        data={tracks}
        renderItem={renderItem}
      />

    </View>
  );
}

function AudioItem({item, onPress, bgImg, textColor,currentItm,pausedsong,handleSelection,progress,sliderval,duration,handleSeek,aud_pic}: ItemProps){
  return(
      <View  style={[styles.videoBlock, styles.audioBlock]}>
      <ImageBackground
        source={aud_pic?{uri: aud_pic}:audioBg}
        style={styles.audioBg}
      >
        <TouchableOpacity 
        onPress={()=>{onPress();handleSelection(item)}}
         style={[styles.videoPlay, styles.audioPlay]}>
         
          <Image
            source={bgImg}
            style={styles.audioIcon}
          />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.audioDetails}>
        <Typography style={styles.blockText} size={15} font="REG" mb={1}>{item.title || "No title found"}</Typography>
        <ImageBackground source={trackFull} style={styles.sliderImage} >
        <View style={styles.imgBgVw}>
        <Slider
          value={sliderval}
          minimumValue={0}
          maximumValue={Math.floor(duration)}
          thumbStyle={[styles.thumb,{backgroundColor:textColor}]}
          trackStyle={styles.track}
         
        sliderStyle={styles.sliderStyle}
         minimumTrackTintColor='#FFFFFF'
        maximumTrackTintColor='transparent'
         trackImage={trackFull}
         
          disabled
            />
        </View>
       
        </ImageBackground> 
        <View style={[styles.audioDetails,{ flexDirection: "row",alignItems:'flex-end', justifyContent: "flex-end"}]}>
         <Typography align="right" color="greyText" size={12} font="MED" mb={1}>{handleSeek}</Typography> 
       
        </View>
        
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
  videoBlock: {
    marginHorizontal: dimensions.wp(4),
    borderRadius: dimensions.wp(3),
    backgroundColor: Colors.white,
    marginBottom: dimensions.hp(1.8),
    padding: dimensions.wp(2.5),
    elevation: 5,
    height: dimensions.hp(12),

  },
  videoPlay: {
    width: dimensions.wp(12),
    height: dimensions.wp(12),
    borderRadius: dimensions.wp(7.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#867CCA",
    borderWidth: 3,
    borderColor: "#E9E2D0"
  },
  audioIcon: {
    width: dimensions.wp(5),
    height: dimensions.wp(5),
    resizeMode: "contain",
    tintColor: Colors.white
  },
  audioBlock: {
    flexDirection: "row",
    overflow: "hidden"
  },
  audioPlay: {
    width: dimensions.wp(10),
    height: dimensions.wp(10),
  },
  audioBg: {
    height: dimensions.wp(20),
    width: dimensions.wp(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: dimensions.wp(3),
    marginRight: dimensions.wp(4)
  },
  audioDetails: {
    justifyContent: "space-between"
  },
  soundIcon: {
    width: dimensions.wp(8),
    height: dimensions.wp(5)
  },
  blockText: {
    width: dimensions.wp(62)
  },
  sliderStyle: {
    width: dimensions.wp(62),

  },
  sliderImage: {
    width: dimensions.wp(62),
    height: dimensions.hp(2.5),
    resizeMode: 'contain'
  },
  thumb: {
    width: dimensions.hp(2.2),
    height: dimensions.hp(2.2),
    borderRadius: dimensions.hp(1.5),
    borderColor: '#6D69B5',
    borderWidth: .5
  },
  track: {
    height: dimensions.hp(6),
    borderRadius: dimensions.hp(1),
  },
  imgBgVw: {
    paddingBottom: Scale(10),
    justifyContent: 'center',
  }
});

export default AudioList;
