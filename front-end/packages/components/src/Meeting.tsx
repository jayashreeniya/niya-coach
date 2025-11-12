import React, { useState, useEffect, useContext } from "react";
import { Modal, View, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Platform } from "react-native";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
  switchAudioDevice
  //@ts-ignore
} from "@videosdk.live/react-native-sdk";
//@ts-ignore
import InCallManager from "@videosdk.live/react-native-incallmanager";

import { AppContext } from "./context/AppContext";
import { Colors, dimensions } from "./utils";
import { call, mic as micOn, micOff, video as videoOn, videoOff } from "./images";
import Typography from "./Typography";

type ControlsProps = {
  join: () => void;
  leave: () => void;
  toggleWebcam: () => void;
  toggleMic: () => void;
  joined: boolean;
  mic: {
    micOn: boolean;
    setMicOn: (b: boolean) => void;
  };
  video: {
    videoOn: boolean;
    setVideoOn: (b: boolean) => void;
  }
}

const Controls: React.FC<ControlsProps> = ({ join, leave, toggleWebcam, toggleMic, joined, mic, video }) => {

  const [pressed, setPressed] = useState<boolean>(false);

  const onJoin = () => {
    setPressed(true);
    join();
    switchAudioDevice("SPEAKER_PHONE");
  }

  const switchWebCam = () => {
    video.setVideoOn(!video.videoOn);
    toggleWebcam();
    InCallManager.requestRecordPermission();
  }
  const switchMic = () => {
    mic.setMicOn(!mic.micOn);
    toggleMic();
  }

  return (
    <View style={styles.controls}>
      <View style={joined? styles.controlRowJoined: styles.controlRow}>
        {joined && (
          <TouchableOpacity onPress={switchMic} style={styles.leaveButton}>
            <Image source={mic.micOn? micOn: micOff} style={styles.controlIcon} />
          </TouchableOpacity>
        )}
        {joined? (
          <TouchableOpacity onPress={leave} style={styles.leaveButton}>
            <Image source={call} style={styles.controlIcon} />
          </TouchableOpacity>
        ):(
          !pressed?(<TouchableOpacity onPress={onJoin} style={[styles.leaveButton, styles.joinButton]}>
            <Image source={call} style={styles.controlIcon} />
          </TouchableOpacity>):
          <Typography color="greyText" size={15}>Joining...</Typography>
        )}
        {joined && (
          <TouchableOpacity onPress={switchWebCam} style={styles.leaveButton}>
            <Image source={!video.videoOn? videoOn: videoOff} style={styles.controlIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

type ParticipantViewProps = {
  participantId: string;
  me: string;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId, me }) => {

  const { webcamStream, webcamOn } = useParticipant(participantId);
  const myView = participantId === me;

  return (webcamOn && webcamStream)?(
    <RTCView
      streamURL={new MediaStream([webcamStream?.track])?.toURL?.()}
      objectFit={"cover"}
      style={myView? styles.myWindow: styles.guestWindow}
    />
  ) : (
    <View style={myView? styles.myWindow: [styles.guestWindow, styles.guestWindowEmpty]}>
      <Typography color="greyText">{"NO VIDEO"}</Typography>
    </View>
  );
}

type ParticipantListProps = {
  participants: string[];
  me: string;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, me }) => {
 return participants.length > 0 ? (
    <>
      
      {participants.map(item => {
        return(
          // true
          <ParticipantView
            participantId={item}
            me={me}
          />
        );
      })}
    </>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F6FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography size={15}>Press the call button when you're ready to join</Typography>
    </View>
  );
}

type MeetingViewProps = {
  onJoin: (s: boolean) => void;
  joined: boolean;
  valid: boolean;
  goBack: () => void;
  mic: {
    micOn: boolean;
    setMicOn: (b: boolean) => void;
  };
  video: {
    videoOn: boolean;
    setVideoOn: (b: boolean) => void;
  }
}

const MeetingView: React.FC<MeetingViewProps> = ({ onJoin, joined, goBack, mic, video }) => {

  const { join, leave, toggleWebcam, toggleMic, participants, getWebcams, changeWebcam, localParticipant } = useMeeting({
    onMeetingJoined,
    onMeetingLeft
  });

  function onMeetingJoined() {
    onJoin(true);
    UseFrontCamera();
  }

  function onMeetingLeft(){
    onJoin(false);
    goBack();
  }

  async function UseFrontCamera(){
    const cams = await getWebcams();
    if(cams.length){
      const frontCam = cams.find((c: any) => c.facingMode === "front");
      if(frontCam){
        changeWebcam(frontCam.deviceId);
      }
    }
  }

  const participantsArrId = [...participants.keys()];

  return (
    <View style={{ flex: 1 }}>
      <ParticipantList
        participants={participantsArrId}
        me={localParticipant?.id}
      />
      <Controls
        join={join}
        leave={joined? leave: goBack}
        toggleWebcam={toggleWebcam}
        toggleMic={toggleMic}
        joined={joined}
        mic={mic}
        video={video}
      />
    </View>
  );
}

type MeetingProps = {
  visible: boolean;
  onClose: () => void;
  meetingId: string;
  token: string;
}

const Meeting: React.FC<MeetingProps> = ({ visible, onClose, meetingId, token }) => {

  const [joined, setJoined] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [videoOn, setVideoOn] = useState<boolean>(false);
  const { state } = useContext(AppContext);

  const onJoin = (status: boolean) => {
    setJoined(status);
  }

  useEffect(() => {
    if(meetingId && token){
      setValid(true);
    }
    InCallManager.requestRecordPermission();
  }, []);

  return(
    <Modal
      visible={visible}
      animationType="fade"
    >
      {valid? (
        <View style={styles.container}>
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: false,
              webcamEnabled: false,
              name: state.name,
              notification: {
                title: "Niya",
                message: "Meet started",
              },
            }}
            token={token}
          >
            <MeetingView
              onJoin={onJoin}
              joined={joined}
              goBack={onClose}
              valid={valid}
              mic={{ micOn, setMicOn }}
              video={{ videoOn, setVideoOn }}
            />
          </MeetingProvider>
        </View>
      ):(
        <View style={[styles.container, styles.loaderContainer]}>
          <ActivityIndicator color={Colors.accent} size="large" />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.greyText
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  controls: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent"
  },
  controlButton: {
    width: "auto"
  },
  controlRow: {
    flexDirection: "row",
    backgroundColor: "#2E2E2E",
    paddingHorizontal: dimensions.wp(4),
    height: dimensions.wp(30),
    justifyContent: "center",
    alignItems: "center"
  },
  controlRowJoined: {
    flexDirection: "row",
    backgroundColor: "#2E2E2E",
    paddingHorizontal: dimensions.wp(4),
    height: dimensions.wp(30),
    width: dimensions.wp(80),
    justifyContent: "center",
    alignItems: "center",
   
  },
  leaveButton: {
    height: dimensions.hp(5),
    width: dimensions.hp(5),
    borderRadius: dimensions.hp(2.5),
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: dimensions.wp(2)
  },
  controlIcon: {
    height: dimensions.hp(3),
    width: dimensions.hp(3),
    tintColor: Colors.white
  },
  joinButton: {
    backgroundColor: Colors.green
  },
  guestWindow: {
    height: Platform.OS=="android"? (dimensions.hp(92) - dimensions.wp(30)) : dimensions.hp(87),
    zIndex: 1
  },
  guestWindowEmpty: {
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    height: dimensions.hp(92) - dimensions.wp(30),
    zIndex: 1
  },
  myWindow: {
    height: dimensions.wp(30),
    width: dimensions.wp(20),
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 0,
    
  }
});

export default Meeting;