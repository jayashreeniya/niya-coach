import React, {useState, useRef} from "react";

import DisplayTrack from "./DisplayTrack.web";

const AudioPlayer = (props:any) => {
    const {tracks, handleSong, index} = props;
   
    const [trackIndex, setTrackIndex] = useState(index);
    const [currentTrack, setCurrentTrack] = useState(
        tracks[trackIndex]
    );
    const [duration, setDuration] = useState(0);
    
    const audioRef = useRef();

    const handleNext = () => {
        if (trackIndex >= tracks.length - 1) {
          setTrackIndex(0);
          setCurrentTrack(tracks[0]);
        } else {
          setTrackIndex((prev:any) => prev + 1);
          setCurrentTrack(tracks[trackIndex + 1]);
        }
      };
      
    return (
            <DisplayTrack 
            currentTrack={tracks[trackIndex]}
                {...{
                    audioRef,
                    setDuration,
                    handleNext,
                    handleSong, 
                    duration,
                  }}
            />
    )

}

export default AudioPlayer;