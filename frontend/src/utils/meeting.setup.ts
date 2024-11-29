import RTC from "../lib/rtc";

const videoCall = new RTC({
  constraints: {
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  },

  configurations: {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
      },
    ],
  },

  streamType: "video_user",
});

export default videoCall;