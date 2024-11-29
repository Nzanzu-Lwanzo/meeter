import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { type Socket } from "socket.io-client";
import { User } from "../utils/@types";
import { lsRead } from "../lib/ls.io";
import videoCall from "../utils/meeting.setup";
import VideoCallStore, { PendingCallType } from "../stores/VideoCallStore";
import { BASE_URL } from "../utils/constants";

export interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  return useContext(SocketContext)!;
};

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setPendingCall, setCallState, setCurrentChat, removePendingCall } =
    VideoCallStore();

  useEffect(() => {
    const _socket = io(BASE_URL, {
      auth: {
        user: lsRead<User | null>("meeterAuth"),
      },
    });

    const handleCallAccepted = ({
      answer,
      call_id,
      user,
    }: {
      answer: RTCSessionDescriptionInit;
      call_id: string;
      user: User;
    }) => {
      videoCall.handleCallAccepted(answer);

      // Store the data of the user
      // we'll be chatting with in a state
      setCurrentChat(user);

      // Navigate to the page where the videos feeds
      // are to be consumed
      document.location.assign(
        new URL(`/call/${call_id}`, document.location.origin)
      );
    };

    const handleIceReceipt = ({
      candidate,
    }: {
      candidate: RTCIceCandidate;
    }) => {
      videoCall.handleIceReceipt(candidate);
    };

    const handleCallReceipt = (call: PendingCallType) => {
      setPendingCall(call);
      setCallState("waiting");
    };

    const handleCallTerminate = ({ call_id }: { call_id: string }) => {
      removePendingCall(call_id);
    };

    // I called and they responded to my call
    _socket.on("call_responded", handleCallAccepted);

    // I receive an ice candidate
    _socket.on("candidate", handleIceReceipt);

    // I receive a call from somebody
    // I will store the call data somewhere
    // soq I can respond when I want
    _socket.on("receive_call", handleCallReceipt);

    // When eithe of the users terminates or cancel the call
    _socket.on("end_call", handleCallTerminate);

    setSocket(_socket);

    return () => {
      _socket.off("call_responded", handleCallAccepted);

      _socket.off("candidate", handleIceReceipt);

      _socket.off("receive_call", handleCallReceipt);

      _socket.off("end_call", handleCallTerminate);
    };
  }, []);

  const value = {
    socket: socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
