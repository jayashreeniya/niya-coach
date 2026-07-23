import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Video from "twilio-video";
import Logo from "../../assets/images/niyalogo.png";
import "./videoCall.css";

const VideoCall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { meetingToken, meetingCode, coachId, role } = location.state || {};
  const isCoach = role === "coach";

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const roomRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasRemote, setHasRemote] = useState(false);

  useEffect(() => {
    if (!meetingToken || !meetingCode) {
      navigate(isCoach ? "/coach-appointments" : "/appointments");
      return;
    }

    let cancelled = false;

    const attachTrack = (track, container) => {
      if (!container) return;
      const el = track.attach();
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.objectFit = "cover";
      container.appendChild(el);
    };

    const detachTrack = (track) => {
      track.detach().forEach((el) => el.remove());
    };

    const handleParticipant = (participant) => {
      setHasRemote(true);
      setStatus("Connected");
      participant.tracks.forEach((publication) => {
        if (publication.track) {
          if (publication.track.kind === "video" || publication.track.kind === "audio") {
            attachTrack(publication.track, remoteVideoRef.current);
          }
        }
      });
      participant.on("trackSubscribed", (track) => {
        attachTrack(track, remoteVideoRef.current);
      });
      participant.on("trackUnsubscribed", detachTrack);
    };

    const connect = async () => {
      try {
        setStatus("Connecting...");
        const room = await Video.connect(meetingToken, {
          name: meetingCode,
          audio: true,
          video: { width: 640 },
        });
        if (cancelled) {
          room.disconnect();
          return;
        }
        roomRef.current = room;
        const waitingLabel = isCoach
          ? "Waiting for coachee to join..."
          : "Waiting for coach to join...";
        setStatus(room.participants.size > 0 ? "Connected" : waitingLabel);

        room.localParticipant.tracks.forEach((publication) => {
          if (publication.track) {
            attachTrack(publication.track, localVideoRef.current);
          }
        });

        room.participants.forEach(handleParticipant);
        room.on("participantConnected", handleParticipant);
        room.on("participantDisconnected", () => {
          setHasRemote(false);
          setStatus(waitingLabel);
          if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";
        });
        room.on("disconnected", () => {
          setStatus("Disconnected");
        });
      } catch (e) {
        console.error(e);
        setStatus("Failed to connect: " + (e.message || "Unknown error"));
      }
    };

    connect();

    return () => {
      cancelled = true;
      const room = roomRef.current;
      if (room) {
        room.localParticipant.tracks.forEach((publication) => {
          if (publication.track) {
            publication.track.stop();
            detachTrack(publication.track);
          }
        });
        room.disconnect();
        roomRef.current = null;
      }
    };
  }, [meetingToken, meetingCode, navigate, isCoach]);

  const toggleMute = () => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.audioTracks.forEach((publication) => {
      if (isMuted) publication.track.enable();
      else publication.track.disable();
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.videoTracks.forEach((publication) => {
      if (isVideoOff) publication.track.enable();
      else publication.track.disable();
    });
    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    const room = roomRef.current;
    if (room) {
      room.localParticipant.tracks.forEach((publication) => {
        if (publication.track) {
          publication.track.stop();
          publication.track.detach().forEach((el) => el.remove());
        }
      });
      room.disconnect();
      roomRef.current = null;
    }
    if (isCoach) {
      navigate("/coach-appointments");
      return;
    }
    if (coachId) {
      navigate("/feedback", { state: { coachId } });
    } else {
      navigate("/appointments");
    }
  };

  return (
    <div className="video-call-page">
      <header className="video-call-header">
        <img src={Logo} alt="Niya" />
        <span className="video-status">{status}</span>
      </header>

      <div className="video-stage">
        <div className="remote-video" ref={remoteVideoRef}>
          {!hasRemote && (
            <div className="waiting-overlay">
              {isCoach ? "Waiting for coachee to join..." : "Waiting for coach to join..."}
            </div>
          )}
        </div>
        <div className="local-video" ref={localVideoRef} />
      </div>

      <div className="video-controls">
        <button type="button" onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
        <button type="button" onClick={toggleVideo}>{isVideoOff ? "Camera On" : "Camera Off"}</button>
        <button type="button" className="end-call" onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;
