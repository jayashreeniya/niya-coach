import React,{useState} from "react";
import {Card, CardContent, IconButton, Grid, makeStyles,Theme, Typography, Slider} from "@material-ui/core";
import {trackFull} from "../../../packages/blocks/AudioLibrary/src/assets";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { audioBg } from "../../blocks/AudioLibrary/src/assets";

const DisplayTrack = (props:any) => {

    const [paused, setPaused] = useState(true);

    const {
        currentTrack,
        audioRef,
        setDuration,
        handleNext,
        handleSong,
        duration,
      } = props;

  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
  };

  const formatTime = (time:any) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes =
        minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds =
        seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  

  const handleAudioPlayer = () => {
    if(audioRef.current.paused) {
        setPaused(false);
    }else{
        setPaused(true);
    }
    handleSong(audioRef);
  }

  const classes = useStyles();

  return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <Grid container>
                <Grid item md={2} sm={3} xs={3} lg={2} xl={2} className={classes.cardAction}>
                    <IconButton onClick={() => handleAudioPlayer()}>
                   {(paused || audioRef?.current?.ended ) ?<PlayArrowIcon/> : <PauseIcon/>}
                    </IconButton>
                </Grid>
                <Grid item md={10} sm={9} xs={9} lg={10} xl={10} className={classes.cardDetails}>
                        <Typography variant="h5">{currentTrack?.title} </Typography>
                            <audio
                            src={currentTrack?.url}
                            ref={audioRef}
                            onLoadedMetadata={onLoadedMetadata}
                            onEnded={handleNext}
                        />
                        {/* <input type="range" /> */}
                        <Slider
                        value={0} 
                        className={classes.progressBar} 
                        defaultValue={2} 
                        step={1} 
                        aria-labelledby="disabled-slider"/>
                    <Typography variant="h6">{formatTime(duration)}</Typography>
                </Grid>
                </Grid>
            </CardContent>
        </Card>
  );
};

const useStyles = makeStyles((theme : Theme) => ({
    card:{
      display:"inline-flex",
      margin:"24px",
      borderRadius: "12px"
    },
    cardAction:{
      backgroundImage: `url(${audioBg})`,
      backgroundSize:"cover",
      height:"100px",
      display : "flex",
      justifyContent:"center",
      alignItems: "center",
      backgroundColor: "#f1f1f1",
      borderRadius: "10px",
      " & button, button:hover" :{
        height: "min-content",
        background: "#a4a9d0",
        padding: "8px",
        color: "#fff"
      }
    },
    cardContent:{
      width:"100%",
      paddingBottom: "18px !important",
    },
    cardDetails:{
      "& img" :{ 
        marginLeft:"8px",
      },
      "& h6" : {
        fontSize:"12px",
        color: "#7e7d82",
        width:"min-content",
        marginLeft: "auto"
      },
      "& h5" : {
        fontSize:"16px",
        margin:"16px",
      },
    },
    progressBar:{
      marginLeft: "12px",
      backgroundImage: `url(${trackFull})`,
      backgroundRepeat: "no-repeat",
      backgroundPositionY: "center",
      pointerEvents:"none",
      "& .MuiSlider-rail, .MuiSlider-track":{
        display: "none"
      },
      "& .MuiSlider-thumb": {
        backgroundColor: "yellow",
        border: "1px solid #ccc"
      }
    }
  }));

export default DisplayTrack;
