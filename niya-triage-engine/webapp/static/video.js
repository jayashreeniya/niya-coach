/* The call surface, on top of Twilio Programmable Video.
 *
 * Configuration arrives as data attributes rather than inline script, so the
 * page carries no generated JavaScript and the token is never concatenated into
 * markup.
 *
 * Joining is behind a button on purpose. Turning somebody's camera and
 * microphone on the instant a page loads is startling, and browsers block the
 * permission prompt without a gesture anyway. The button says what will happen
 * before it happens.
 */
(function () {
  "use strict";

  var mount = document.querySelector("[data-video-room]");
  if (!mount) {
    return;
  }

  var config = {
    token: mount.getAttribute("data-video-token"),
    room: mount.getAttribute("data-video-room"),
    endsAt: parseInt(mount.getAttribute("data-video-ends"), 10) || 0,
    otherParty: mount.getAttribute("data-video-other") || "the other person"
  };

  var els = {
    join: document.getElementById("video-join"),
    stage: document.getElementById("video-stage"),
    remote: document.getElementById("video-remote"),
    local: document.getElementById("video-local"),
    status: document.getElementById("video-status"),
    controls: document.getElementById("video-controls"),
    mic: document.getElementById("video-mic"),
    cam: document.getElementById("video-cam"),
    waiting: document.getElementById("video-waiting")
  };

  var room = null;
  var localTracks = [];
  var endTimer = null;

  function say(message, tone) {
    if (!els.status) {
      return;
    }
    els.status.textContent = message;
    els.status.className = "notice " + (tone || "info");
    els.status.hidden = false;
  }

  function attach(track, container) {
    if (track.kind !== "audio" && track.kind !== "video") {
      return;
    }
    var element = track.attach();
    element.setAttribute("playsinline", "");
    container.appendChild(element);
  }

  function detach(track) {
    if (typeof track.detach !== "function") {
      return;
    }
    track.detach().forEach(function (element) {
      element.remove();
    });
  }

  function participantJoined(participant) {
    if (els.waiting) {
      els.waiting.hidden = true;
    }
    say(config.otherParty + " has joined.", "ok");

    participant.tracks.forEach(function (publication) {
      if (publication.isSubscribed) {
        attach(publication.track, els.remote);
      }
    });
    participant.on("trackSubscribed", function (track) {
      attach(track, els.remote);
    });
    participant.on("trackUnsubscribed", detach);
  }

  function participantLeft(participant) {
    participant.tracks.forEach(function (publication) {
      if (publication.track) {
        detach(publication.track);
      }
    });
    if (els.waiting) {
      els.waiting.hidden = false;
    }
    say(
      config.otherParty + " has left the call. They may be reconnecting.",
      "info"
    );
  }

  function describeMediaError(error) {
    switch (error && error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return (
          "Your browser blocked access to the camera and microphone. Allow " +
          "them in the address bar, then try again."
        );
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No camera or microphone was found on this device.";
      case "NotReadableError":
      case "TrackStartError":
        return (
          "Your camera or microphone is already in use by another " +
          "application. Close it and try again."
        );
      default:
        return null;
    }
  }

  function describeConnectError(error) {
    // 20101 is an invalid token, which here means the joining window closed
    // while the page was open rather than anything the person did wrong.
    if (error && (error.code === 20101 || error.code === 20104)) {
      return "This session's joining window has closed. Please reload the page.";
    }
    if (error && error.code === 53105) {
      return "The room is full. Only two people can join a session.";
    }
    return "Could not connect to the call: " + ((error && error.message) || error);
  }

  function scheduleEnd() {
    if (!config.endsAt) {
      return;
    }
    var remaining = config.endsAt * 1000 - Date.now();
    if (remaining <= 0) {
      return;
    }
    endTimer = window.setTimeout(function () {
      say("The session time has ended. The call is closing.", "info");
      leave();
    }, remaining);
  }

  function toggle(kind, button, onLabel, offLabel) {
    var enabled = true;
    button.addEventListener("click", function () {
      enabled = !enabled;
      localTracks.forEach(function (track) {
        if (track.kind === kind && typeof track.enable === "function") {
          if (enabled) {
            track.enable();
          } else {
            track.disable();
          }
        }
      });
      button.textContent = enabled ? onLabel : offLabel;
      button.setAttribute("aria-pressed", enabled ? "false" : "true");
      button.classList.toggle("muted-control", !enabled);
    });
  }

  function leave() {
    if (room) {
      room.disconnect();
      room = null;
    }
    localTracks.forEach(function (track) {
      if (typeof track.stop === "function") {
        track.stop();
      }
      detach(track);
    });
    localTracks = [];
    if (endTimer) {
      window.clearTimeout(endTimer);
    }
    if (els.controls) {
      els.controls.hidden = true;
    }
    if (els.stage) {
      els.stage.hidden = true;
    }
    if (els.join) {
      els.join.hidden = false;
      els.join.disabled = false;
      els.join.textContent = "Rejoin the call";
    }
  }

  async function join() {
    if (typeof Twilio === "undefined" || !Twilio.Video) {
      say(
        "The video library could not be loaded. Check your connection and " +
          "reload the page.",
        "error"
      );
      return;
    }

    els.join.disabled = true;
    els.join.textContent = "Connecting\u2026";
    say("Asking for permission to use your camera and microphone\u2026", "info");

    try {
      localTracks = await Twilio.Video.createLocalTracks({
        audio: true,
        video: { width: 640 }
      });
    } catch (error) {
      var media = describeMediaError(error);
      say(media || "Could not start your camera or microphone: " + error.message, "error");
      els.join.disabled = false;
      els.join.textContent = "Try again";
      return;
    }

    localTracks.forEach(function (track) {
      if (track.kind === "video") {
        attach(track, els.local);
      }
    });

    say("Connecting to the session\u2026", "info");

    try {
      room = await Twilio.Video.connect(config.token, {
        name: config.room,
        tracks: localTracks
      });
    } catch (error) {
      say(describeConnectError(error), "error");
      leave();
      els.join.textContent = "Try again";
      return;
    }

    els.join.hidden = true;
    if (els.stage) {
      els.stage.hidden = false;
    }
    if (els.controls) {
      els.controls.hidden = false;
    }

    if (room.participants.size === 0) {
      say("You are in. Waiting for " + config.otherParty + " to join.", "info");
    } else {
      room.participants.forEach(participantJoined);
    }

    room.on("participantConnected", participantJoined);
    room.on("participantDisconnected", participantLeft);
    room.on("reconnecting", function () {
      say("Connection lost. Reconnecting\u2026", "warn");
    });
    room.on("reconnected", function () {
      say("Reconnected.", "ok");
    });
    room.on("disconnected", function (_room, error) {
      if (error) {
        say(describeConnectError(error), "error");
      }
      leave();
    });

    scheduleEnd();
  }

  if (els.join) {
    els.join.addEventListener("click", join);
  }

  if (els.mic) {
    toggle("audio", els.mic, "Mute microphone", "Unmute microphone");
  }
  if (els.cam) {
    toggle("video", els.cam, "Turn off camera", "Turn on camera");
  }

  // Leaving the page should release the camera rather than leave the light on.
  window.addEventListener("pagehide", function () {
    if (room) {
      room.disconnect();
    }
    localTracks.forEach(function (track) {
      if (typeof track.stop === "function") {
        track.stop();
      }
    });
  });
})();
