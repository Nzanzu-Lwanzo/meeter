import { create } from "zustand";
import { User } from "../utils/@types";
import { StreamTypeType } from "../lib/@types";

export type PendingCallType = {
  caller: User;
  callData: {
    offer: RTCSessionDescriptionInit;
    streamType: StreamTypeType;
    call_id: string;
  };
};

interface State {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callState: "no_call" | "waiting" | "call";
  pendingCalls: PendingCallType[];
  currentChat: User | undefined;
  feedState: {
    muted: boolean;
    hidden: boolean;
  };
}

interface Actions {
  setLocalStream: (stream: State["localStream"]) => void;
  setRemoteStream: (stream: State["remoteStream"]) => void;
  setCallState: (callState: State["callState"]) => void;
  setPendingCall: (call: PendingCallType) => void;
  removePendingCall: (call_id: string) => void;
  setCurrentChat: (user: State["currentChat"]) => void;
  setFeedState: (
    feedState: Partial<Record<keyof State["feedState"], boolean>>
  ) => void;
}

const VideoCallStore = create<Actions & State>()((set) => ({
  localStream: null,
  remoteStream: null,
  callState: "no_call",
  pendingCalls: [],
  currentChat: undefined,
  feedState: {
    muted: false,
    hidden: false,
  },
  setLocalStream(stream) {
    set((state) => ({ ...state, localStream: stream }));
  },
  setRemoteStream(stream) {
    set((state) => ({ ...state, remoteStream: stream }));
  },
  setCallState(callState) {
    set((state) => ({ ...state, callState }));
  },
  setPendingCall(call) {
    set((state) => ({ ...state, pendingCalls: [...state.pendingCalls, call] }));
  },
  removePendingCall(call_id) {
    set((state) => ({
      ...state,
      pendingCalls: state.pendingCalls.filter(
        (call) => call.callData.call_id !== call_id
      ),
    }));
  },
  setCurrentChat(user) {
    set((state) => ({ ...state, currentChat: user }));
  },
  setFeedState(feedState) {
    set((state) => ({
      ...state,
      feedState: { ...state.feedState, ...feedState },
    }));
  },
}));

export default VideoCallStore;
