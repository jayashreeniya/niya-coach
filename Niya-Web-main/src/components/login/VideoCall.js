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
  const remoteAudioRef = useRef(null);
  const roomRef = useRef(null);
  const localTracksRef = useRef([]);

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
    const waitingLabel = isCoach
      ? "Waiting for coachee to join..."
      : "Waiting for coach to join...";

    const clearContainer = (el) => {
      if (!el) return;
      while (el.firstChild) el.removeChild(el.firstChild);
    };

    const attachTrack = (track, container) => {
      if (!track || !container) return;
      const existing = container.querySelector(`[data-track-sid="${track.sid}"]`);
      if (existing) return;
      const mediaEl = track.attach();
      mediaEl.dataset.trackSid = track.sid;
      if (track.kind === "video") {
        mediaEl.style.width = "100%";
        mediaEl.style.height = "100%";
        mediaEl.style.objectFit = "cover";
        mediaEl.playsInline = true;
        mediaEl.autoplay = true;
        mediaEl.muted = container === localVideoRef.current;
      } else if (track.kind === "audio") {
        mediaEl.autoplay = true;
      }
      container.appendChild(mediaEl);
      const playPromise = mediaEl.play?.();
      if (playPromise?.catch) playPromise.catch(() => {});
    };

    const detachTrack = (track) => {
      if (!track) return;
      track.detach().forEach((el) => el.remove());
    };

    const handleTrack = (track) => {
      if (track.kind === "video") {
        attachTrack(track, remoteVideoRef.current);
      } else if (track.kind === "audio") {
        attachTrack(track, remoteAudioRef.current);
      }
    };

    const handleParticipant = (participant) => {
      setHasRemote(true);
      setStatus("Connected");

      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed && publication.track) {
          handleTrack(publication.track);
        }
      });

      participant.on("trackSubscribed", (track) => {
        handleTrack(track);
        setHasRemote(true);
        setStatus("Connected");
      });

      participant.on("trackUnsubscribed", (track) => {
        detachTrack(track);
      });
    };

    const connect = async () => {
      try {
        setStatus("Connecting...");

        const localTracks = await Video.createLocalTracks({
          audio: true,
          video: { width: 640, height: 480, facingMode: "user" },
        });
        if (cancelled) {
          localTracks.forEach((t) => t.stop());
          return;
        }
        localTracksRef.current = localTracks;

        localTracks.forEach((track) => {
          if (track.kind === "video") {
            attachTrack(track, localVideoRef.current);
          }
        });

        const room = await Video.connect(meetingToken, {
          name: meetingCode,
          tracks: localTracks,
          dominantSpeaker: true,
        });
        if (cancelled) {
          room.disconnect();
          return;
        }
        roomRef.current = room;
        setStatus(room.participants.size > 0 ? "Connected" : waitingLabel);

        room.participants.forEach(handleParticipant);
        room.on("participantConnected", handleParticipant);
        room.on("participantDisconnected", (participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.track) detachTrack(publication.track);
          });
          if (room.participants.size === 0) {
            setHasRemote(false);
            setStatus(waitingLabel);
            clearContainer(remoteVideoRef.current);
            clearContainer(remoteAudioRef.current);
          }
        });
        room.on("disconnected", () => setStatus("Disconnected"));
      } catch (e) {
        console.error(e);
        setStatus("Failed to connect: " + (e.message || "Unknown error"));
      }
    };

    connect();

    return () => {
      cancelled = true;
      localTracksRef.current.forEach((track) => {
        try {
          track.stop();
          detachTrack(track);
        } catch (_) {}
      });
      localTracksRef.current = [];
      const room = roomRef.current;
      if (room) {
        room.disconnect();
        roomRef.current = null;
      }
    };
  }, [meetingToken, meetingCode, navigate, isCoach]);

  const toggleMute = () => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.audioTracks.forEach((publication) => {
      if (!publication.track) return;
      if (isMuted) publication.track.enable();
      else publication.track.disable();
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.videoTracks.forEach((publication) => {
      if (!publication.track) return;
      if (isVideoOff) publication.track.enable();
      else publication.track.disable();
    });
    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    localTracksRef.current.forEach((track) => {
      try {
        track.stop();
        track.detach().forEach((el) => el.remove());
      } catch (_) {}
    });
    localTracksRef.current = [];
    if (roomRef.current) {
      roomRef.current.disconnect();
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
        {/* Empty containers for Twilio DOM attach — do not put React children inside */}
        <div className="remote-video" ref={remoteVideoRef} />
        <div className="remote-audio" ref={remoteAudioRef} aria-hidden="true" />
        {!hasRemote && (
          <div className="waiting-overlay">
            {isCoach ? "Waiting for coachee to join..." : "Waiting for coach to join..."}
          </div>
        )}
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
