import VideoCallStore from "../../../stores/VideoCallStore";
import videoCall from "../../../utils/meeting.setup";

const Mute = () => {
  const { feedState, setFeedState } = VideoCallStore();

  return (
    <button
      type="button"
      onClick={() => {
        // So, by default muted is false and track.enabled is true
        // to mute we're going to pass the same false to out method
        // and we will change the value of the state to true.
        // Now, next time the user clicks the button,
        // the value of muted in the state has changed to true,
        // we pass that true to track.enabled which enables it (it goes without saying)
        // and we set the state to be false.
        // And so forth.
        const isOk = videoCall.toggleMute(feedState.muted);

        if (isOk) {
          setFeedState({ muted: !feedState.muted });
        }
      }}
    >
      {feedState.muted ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <rect width="256" height="256" fill="none" />
          <line
            x1="128"
            y1="200"
            x2="128"
            y2="240"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <line
            x1="48"
            y1="48"
            x2="208"
            y2="224"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M172.32,184.75A72,72,0,0,1,56,128"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M200,128a71.7,71.7,0,0,1-7.29,31.61"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M150.68,161A39.77,39.77,0,0,1,128,168h0a40,40,0,0,1-40-40V92"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M91.3,48.06A40,40,0,0,1,128,24h0a40,40,0,0,1,40,40v64a38.66,38.66,0,0,1-.22,4.19"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <rect width="256" height="256" fill="none" />
          <rect
            x="88"
            y="24"
            width="80"
            height="144"
            rx="40"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <line
            x1="128"
            y1="200"
            x2="128"
            y2="240"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M200,128a72,72,0,0,1-144,0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
      )}
    </button>
  );
};

export default Mute;
