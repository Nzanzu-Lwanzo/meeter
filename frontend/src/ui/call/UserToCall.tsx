import CallButton from "./CallButton";
import { User } from "../../utils/@types";
import { useRef, useState } from "react";
import { useSocketContext } from "../../contexts/SocketContext";
import videoCall from "../../utils/meeting.setup";
import VideoCallStore from "../../stores/VideoCallStore";

const UserToCall = ({ user }: { user: User }) => {
  const [calling, setCalling] = useState(false);
  const { setLocalStream, setRemoteStream, callState, setCallState } =
    VideoCallStore();

  const callId = useRef("");

  const { socket } = useSocketContext();

  const endCall = () => {
    videoCall.terminate({
      handleSuccess() {
        setCallState("no_call");
        setCalling(false);
        socket?.emit("end_call", { call_id: callId.current, partner: user.id });
      },
    });
  };

  const initiateCall = () => {
    if (callState !== "no_call") {
      alert("You can't call until the current one is terminated !");
      return;
    }

    try {
      setCalling(true);

      // Call this user
      videoCall
        .call(
          {
            handleCandidate: (candidate) => {
              if (candidate) {
                socket?.emit("candidate", { candidate, callee: user.id });
              }
            },
            handleRemoteStream: ({ streams }) => {
              // This is the stream of the person I'm calling
              setRemoteStream(streams[0]);
            },
          },
          {
            handleError(e) {
              console.log(e);
              setCalling(false);
              setCallState("no_call");
            },
          }
        )
        .then((data) => {
          if (data && !(data instanceof Error)) {
            // This stream is mine
            const { stream } = data;
            setLocalStream(stream);

            // Keep for later use (terminating the call)
            callId.current = data.call_id;

            // Send the needed data to the signaling server
            socket?.emit("call", {
              offer: data.offer,
              streamType: data.streamType,
              call_id: data.call_id,
              callee: user.id,
            });

            // While we're waiting for the other person to answer the call
            // we will block stop the user from calling somebody else
            setCallState("waiting");
          }
        });
    } catch (e) {
      setCalling(false);
    }
  };

  return (
    <li className="user__elt">
      <CallButton
        onClick={!calling ? initiateCall : endCall}
        isCalling={calling}
      />
      <span className="username">{user.name}</span>
    </li>
  );
};

export default UserToCall;
