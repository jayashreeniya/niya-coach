import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
  //@ts-ignore
} from "react-native-twilio-video-webrtc";
import { requestMultiple, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Colors, dimensions } from "./utils";
import { call, mic as micOnIcon, micOff, video as videoOnIcon, videoOff } from "./images";
import Typography from "./Typography";

async function requestMediaPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);
      return (
        statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED &&
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED
      );
    }
    if (Platform.OS === "ios") {
      const statuses = await requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
      ]);
      return (
        statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED &&
        statuses[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED
      );
    }
    return true;
  } catch (_e) {
    return false;
  }
}

type MeetingProps = {
  visible: boolean;
  onClose: () => void;
  meetingId: string;
  token: string;
};

const Meeting: React.FC<MeetingProps> = ({ visible, onClose, meetingId, token }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [participants, setParticipants] = useState<Map<string, { videoTrackSid: string; identity: string }>>(new Map());
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionsResolved, setPermissionsResolved] = useState(false);
  const twilioRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      setPermissionsResolved(false);
      requestMediaPermissions().then((granted) => {
        setPermissionsGranted(granted);
        setPermissionsResolved(true);
        if (!granted) {
          Alert.alert("Permissions Required", "Camera and microphone access are needed for video calls.");
        }
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible && permissionsGranted && token && meetingId && status === "disconnected") {
      connectToRoom();
    }
    if (!visible && status !== "disconnected") {
      disconnect();
    }
  }, [visible, permissionsGranted, token, meetingId]);

  const connectToRoom = useCallback(() => {
    if (!twilioRef.current) return;
    setStatus("connecting");
    twilioRef.current.connect({
      roomName: meetingId,
      accessToken: token,
      enableVideo: true,
      enableAudio: true,
      dominantSpeakerEnabled: true,
    });
  }, [meetingId, token]);

  const disconnect = useCallback(() => {
    if (twilioRef.current) {
      twilioRef.current.disconnect();
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (twilioRef.current) {
      twilioRef.current.setLocalAudioEnabled(!isAudioEnabled).then((enabled: boolean) => {
        setIsAudioEnabled(enabled);
      });
    }
  }, [isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    if (twilioRef.current) {
      twilioRef.current.setLocalVideoEnabled(!isVideoEnabled).then((enabled: boolean) => {
        setIsVideoEnabled(enabled);
      });
    }
  }, [isVideoEnabled]);

  const onRoomDidConnect = useCallback(({ roomName, participants: roomParticipants }: any) => {
    console.log("[TwilioVideo] connected to room:", roomName, "participants:", JSON.stringify(roomParticipants));
    setStatus("connected");

    const newParticipants = new Map<string, { videoTrackSid: string; identity: string }>();
    if (roomParticipants) {
      roomParticipants.forEach((p: any) => {
        if (p.videoTrackSid) {
          newParticipants.set(p.participantSid, { videoTrackSid: p.videoTrackSid, identity: p.identity });
        }
      });
    }
    setParticipants(newParticipants);
  }, []);

  const onRoomDidDisconnect = useCallback(({ error }: any) => {
    console.log("[TwilioVideo] disconnected", error);
    setStatus("disconnected");
    setParticipants(new Map());
    if (visible) {
      onClose();
    }
  }, [visible, onClose]);

  const onRoomDidFailToConnect = useCallback(({ error }: any) => {
    console.log("[TwilioVideo] failed to connect:", error);
    setStatus("disconnected");
    Alert.alert("Video Call", `Could not connect: ${error?.message || "Unknown error"}`);
  }, []);

  const onParticipantAddedVideoTrack = useCallback(({ participant, track }: any) => {
    console.log("[TwilioVideo] participant added video:", participant.identity);
    setParticipants((prev) => {
      const next = new Map(prev);
      next.set(participant.participantSid, {
        videoTrackSid: track.trackSid,
        identity: participant.identity,
      });
      return next;
    });
  }, []);

  const onParticipantRemovedVideoTrack = useCallback(({ participant }: any) => {
    console.log("[TwilioVideo] participant removed video:", participant.identity);
    setParticipants((prev) => {
      const next = new Map(prev);
      next.delete(participant.participantSid);
      return next;
    });
  }, []);

  const onParticipantDisconnected = useCallback(({ participant }: any) => {
    console.log("[TwilioVideo] participant left:", participant.identity);
    setParticipants((prev) => {
      const next = new Map(prev);
      next.delete(participant.participantSid);
      return next;
    });
  }, []);

  const renderRemoteParticipants = () => {
    const entries = Array.from(participants.entries());
    if (entries.length === 0) {
      return (
        <View style={styles.waitingContainer}>
          <Typography color="white" size={14} align="center">
            Waiting for the other person to join...
          </Typography>
        </View>
      );
    }
    return entries.map(([sid, { videoTrackSid, identity }]) => (
      <View key={sid} style={styles.remoteVideo}>
        <TwilioVideoParticipantView
          style={{ flex: 1 }}
          key={videoTrackSid}
          trackIdentifier={{ participantSid: sid, videoTrackSid }}
        />
        <View style={styles.participantLabel}>
          <Typography color="white" size={11}>{identity}</Typography>
        </View>
      </View>
    ));
  };

  const renderContent = () => {
    if (!permissionsResolved) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={Colors.accent} size="large" />
          <Typography color="white" size={14} style={{ marginTop: 12 }}>
            Preparing video call...
          </Typography>
        </View>
      );
    }

    if (!permissionsGranted) {
      return (
        <View style={styles.centerContainer}>
          <Typography color="white" size={14} align="center" style={{ marginBottom: 12, paddingHorizontal: 20 }}>
            Camera and microphone permission is required.
          </Typography>
          <TouchableOpacity onPress={onClose} style={[styles.controlButton, { backgroundColor: Colors.accent }]}>
            <Typography color="white" size={13}>Back</Typography>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {status === "connecting" && (
          <View style={styles.connectingOverlay}>
            <ActivityIndicator color="white" size="small" />
            <Typography color="white" size={12} style={{ marginLeft: 8 }}>Connecting...</Typography>
          </View>
        )}

        <View style={styles.remoteContainer}>
          {renderRemoteParticipants()}
        </View>

        <View style={styles.localVideo}>
          <TwilioVideoLocalView enabled={true} style={{ flex: 1 }} />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleAudio} style={styles.controlButton}>
            <Image source={isAudioEnabled ? micOnIcon : micOff} style={styles.controlIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { disconnect(); onClose(); }} style={[styles.controlButton, styles.endCallButton]}>
            <Image source={call} style={styles.controlIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleVideo} style={styles.controlButton}>
            <Image source={isVideoEnabled ? videoOnIcon : videoOff} style={styles.controlIcon} />
          </TouchableOpacity>
        </View>

        <TwilioVideo
          ref={twilioRef}
          onRoomDidConnect={onRoomDidConnect}
          onRoomDidDisconnect={onRoomDidDisconnect}
          onRoomDidFailToConnect={onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
          onParticipantDisconnected={onParticipantDisconnected}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        {renderContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  remoteContainer: {
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: "#2d2d44",
  },
  waitingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2d2d44",
  },
  localVideo: {
    position: "absolute",
    bottom: dimensions.wp(25),
    right: 12,
    width: dimensions.wp(28),
    height: dimensions.wp(38),
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: dimensions.wp(5),
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  controlButton: {
    height: dimensions.hp(6),
    width: dimensions.hp(6),
    borderRadius: dimensions.hp(3),
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: dimensions.wp(3),
  },
  endCallButton: {
    backgroundColor: Colors.red,
  },
  controlIcon: {
    height: dimensions.hp(3),
    width: dimensions.hp(3),
    tintColor: Colors.white,
  },
  connectingOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  participantLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
});

export default Meeting;
