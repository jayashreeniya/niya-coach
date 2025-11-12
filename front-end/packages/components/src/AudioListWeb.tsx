import React, { useEffect, useState} from "react";
import { Grid, makeStyles,Theme } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import AudioPlayer from "./AudioPlayer.web";
export type MediaList = Media[]

export interface Media {
  itmid: string
  type: string
  attributes: { file_info: FileInfo[] }
}

export interface FileInfo {
  title: string
  description: string
  focus_areas: string[]
  urldoc: string
  content_type: string
  text_file_to_str: string
  file_content: string
}

type Props = {
  songs: MediaList;
  pageNo: number;
  handlePagination: any;
  totalCount: number;
}

type song ={
  song_id: number,
  url:string,
  title: string
}

const AudioListWeb = (props:Props) => {
  const {songs, pageNo, handlePagination, totalCount} = props;
  const [tracks, setTracks] = useState<song[]>();
  async function handleSong(item:any){
    if(item.current.paused){
      item.current.play()
    }else{
      item.current.pause()
    }
  }

  useEffect(() => {
    let _songs = songs.map((record: any) => ({
      song_id: record.id,
      url: record?.attributes?.file_info?.[0]?.url || "",
      title: record?.attributes?.file_info?.[0]?.title || "",
    }));
    
    setTracks(_songs);

  },[songs])

  const classes = useStyles();

  return(
    <>
      <Grid container className={classes.container}>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={classes.cardList}>
          {tracks && tracks.length > 0 && tracks.map((song:any, index: number) => {
            return (
              <>
                <AudioPlayer key={index}
                  handleSong={handleSong}
                  tracks={tracks}
                  index={index}
                />
              </>
            )}) }
        </Grid>
      </Grid>
      <Pagination count={Math.floor(totalCount/7)} page={pageNo} className={classes.pagination} onChange={handlePagination} />
    </>
  );
}

const useStyles = makeStyles((theme : Theme) => ({
  container:{
    background:"#eeeeee",
    display: "flex",
    justifyContent: "center"
  },
  cardList:{
    display:"flex",
    flexFlow:"column",
    background:"#eeeeee",
  },
  pagination:{
    background:"#eeeeee",
    display: "flex",
    justifyContent: "center",
    "& ul" :{
      width: "max-content"
    }
  }
}));

export default AudioListWeb;
