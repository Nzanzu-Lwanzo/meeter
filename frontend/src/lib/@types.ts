export type handleCandidateFnType = (candidate: RTCIceCandidate | null) => void;
export type handleRemoteStreamFnType = (
  remoteData: Pick<
    RTCTrackEvent,
    "receiver" | "streams" | "track" | "transceiver"
  >
) => void;
export type handleCandidateErrorFnType = (
  error: Pick<
    RTCPeerConnectionIceErrorEvent,
    "address" | "errorCode" | "errorText" | "url"
  >
) => void;

export type StreamTypeType = "audio" | "video_user" | "video_screen";

export type handleDataChannelMessageType = (
  data: Pick<
    MessageEvent,
    "data" | "origin" | "lastEventId" | "source" | "ports"
  >
) => void;
