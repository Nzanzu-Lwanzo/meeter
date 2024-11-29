import { useEffect, useRef } from "react";
import VideoCallStore from "../../stores/VideoCallStore";
import me from "../../assets/videos/mock-2.mp4";
import them from "../../assets/videos/mock.mp4";

const Videos = () => {
  const meRef = useRef<HTMLVideoElement | null>(null);
  const themRef = useRef<HTMLVideoElement | null>(null);

  const { localStream, remoteStream } = VideoCallStore();

  useEffect(() => {
    if (themRef.current) {
      themRef.current.srcObject = remoteStream;
    }

    if (meRef.current) {
      meRef.current.srcObject = localStream;
    }
  }, [meRef, themRef]);

  return (
    <div className="videos">
      <video
        src={them}
        autoPlay={true}
        controls={false}
        id="them__video"
        ref={themRef}
        className="PEERSFEEDS"
      ></video>

      <div className="my__video">
        <video src={me} muted autoPlay={true} ref={meRef} id="MYFEED"></video>
      </div>
    </div>
  );
};

export default Videos;
