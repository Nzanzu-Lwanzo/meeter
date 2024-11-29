import CallButton from "./CallButton";
import { User } from "../../utils/@types";
import { useSocketContext } from "../../contexts/SocketContext";
import VideoCallStore from "../../stores/VideoCallStore";
import videoCall from "../../utils/meeting.setup";
import { useNavigate } from "react-router-dom";
import { debug } from "../../utils/helpers";

const UserToRespond = ({ user }: { user: User }) => {
  const { socket } = useSocketContext();
  const {
    pendingCalls,
    setRemoteStream,
    setLocalStream,
    setCallState,
    setCurrentChat,
  } = VideoCallStore();

  const navigateTo = useNavigate();

  const respondCall = () => {
    try {
      // Lookup in the pendingCalls state
      // and find the call whose user
      // correspond to this user.
      // Get their offer (or whatever data they sent)
      // and respond to that particular offer
      const call = pendingCalls.find((call) => call.caller.id === user.id);

      videoCall
        .respond(
          {
            offer: call?.callData.offer!,
            handleCandidate: (candidate) => {
              if (candidate) {
                socket?.emit("candidate", { candidate });
              }
            },
            streamType: call?.callData.streamType,
            handleRemoteStream: ({ streams }) => {
              // This is the stream of the person that calls me
              setRemoteStream(streams[0]);
              debug(streams[0]);
            },
          },
          {
            handleError(e) {
              console.log(e);
            },
          }
        )
        .then((data) => {
          if (data && !(data instanceof Error)) {
            // This stream is mine
            const { stream } = data;
            setLocalStream(stream);

            // Send the needed data to the signaling server
            socket?.emit("respond", {
              answer: data.answer,
              streamType: data.streamType,
              caller: user.id,
              call_id: call?.callData.call_id,
            });

            // While we're in communication
            // we will block stop the user from calling somebody else
            setCallState("call");

            // Store the data of the user
            // we'll be chatting with in a state
            setCurrentChat(user);

            // Redirect to the page where video feeds are being displayed
            navigateTo(`/call/${call?.callData.call_id}`);
          }
        });
    } catch (e) {}
  };

  return (
    <li className="user__elt">
      <CallButton onClick={respondCall} isCalling={true} />
      <span className="username">{user.name}</span>
    </li>
  );
};

export default UserToRespond;
