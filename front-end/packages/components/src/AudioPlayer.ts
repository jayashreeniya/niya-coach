import TrackPlayer, { State, Track } from "react-native-track-player";

export type Song = {
  id: string;
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
}

function unique(list: Song[], track: Track[]){
  const combinedTrack = [...list, ...track];
  const hashMap: Record<string, boolean> = {};
  const uniqueTrack = combinedTrack.filter(t => {
    if(hashMap[t.id]){
      return false;
    }
    hashMap[t.id] = true;
    return true;
  });
  return uniqueTrack;
}

export const setup = async (songs: Song[]) => {
  const validSongs = songs.filter(s => (s.id && s.url));
  try {
    await TrackPlayer.setupPlayer();
  } catch(e){}
  await TrackPlayer.reset();
  const queue = await TrackPlayer.getQueue();
  const track = unique(validSongs, queue);
  
  await TrackPlayer.add(track);
  return track;
}

export const togglePlayer = async () => {
  const current = await TrackPlayer.getCurrentTrack();
  const duration = await TrackPlayer.getDuration();
  let state = 0;
  if(current !== null){
    state = await TrackPlayer.getState();
    if(state !== State.Playing){
      try {
        await TrackPlayer.play();
        state = State.Playing;
      } catch(e){
        console.log("E: ", e)
      }
    }
     else {
      await TrackPlayer.pause();
      state = State.Paused;
    }
  } else {
    await TrackPlayer.play();
    state = State.Playing;
    
  }

  return { current, state, State, duration:duration==0 ? 100:duration };
}