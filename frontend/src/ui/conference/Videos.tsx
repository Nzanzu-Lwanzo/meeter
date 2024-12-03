import { useEffect, useRef } from "react";
import VideoCallStore from "../../stores/VideoCallStore";

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
        autoPlay={true}
        controls={false}
        id="them__video"
        ref={themRef}
        className="PEERSFEEDS"
      ></video>

      <div className="my__video">
        <video muted autoPlay={true} ref={meRef} controls={false} id="MYFEED"></video>
      </div>
    </div>
  );
};

export default Videos;
